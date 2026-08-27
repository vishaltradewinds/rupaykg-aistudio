const fs = require('fs');

let authCode = `
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { adminAuth } from '../lib/firebase-admin.ts';
import { getOrCreateUser, getUser } from '../db/users.ts';
import { getRedisClient, isRedisConnected } from '../lib/redis.ts';

export interface AuthRequest extends Request {
  user?: any;
}

export function getPublicKey(): string | null {
  try {
    if (process.env.RUPAYKG_JWT_PUBLIC_KEY && process.env.RUPAYKG_JWT_PUBLIC_KEY.includes('KEY-----')) {
      return process.env.RUPAYKG_JWT_PUBLIC_KEY;
    }
    const pubPath = path.resolve(process.cwd(), 'public.pem');
    if (fs.existsSync(pubPath)) {
      const content = fs.readFileSync(pubPath, 'utf8');
      if (content && content.includes('KEY-----')) {
        return content;
      }
    }
  } catch (err) {
  }
  return null;
}

export const auth = (roles: string[] = []) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Empty token' });
    }

    let decodedPayload: any = null;

    const publicKey = getPublicKey();
    if (publicKey) {
      try {
        decodedPayload = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      } catch (err) {
      }
    }

    if (!decodedPayload) {
      try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        decodedPayload = { ...decodedToken, id: decodedToken.uid };
      } catch (err) {
      }
    }

    if (!decodedPayload) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }

    // CHECK REVOCATION IN REDIS
    try {
      const redis = await getRedisClient();
      if (!isRedisConnected()) {
         return res.status(503).json({ error: 'Service Unavailable: Token revocation service is offline. Failing closed.' });
      }
      if (decodedPayload.jti) {
         const isRevoked = await redis.get(\`bl_\${decodedPayload.jti}\`);
         if (isRevoked) {
           return res.status(401).json({ error: 'Unauthorized: Token has been revoked' });
         }
      }
    } catch(err) {
      return res.status(503).json({ error: 'Service Unavailable: Token revocation check failed. Failing closed.' });
    }

    // LOAD AUTHORITATIVE USER FROM POSTGRESQL
    const uid = decodedPayload.id || decodedPayload.uid;
    const dbUser = await getUser(uid);

    if (!dbUser && !decodedPayload.email) {
       return res.status(401).json({ error: 'Unauthorized: User not found' });
    }
    
    // Create if missing, just for migration compatibility from Firebase
    const activeUser = dbUser || await getOrCreateUser(uid, decodedPayload.email, decodedPayload.name || 'User');

    // JWT Claims DO NOT override PostgreSQL authoritative role, org, or jurisdiction!
    req.user = {
      id: activeUser.uid,
      uid: activeUser.uid,
      email: activeUser.email,
      role: activeUser.role, // strictly from DB!
      name: activeUser.name,
      phone: activeUser.phone,
      state: activeUser.state,
      district: activeUser.district,
      subdistrict: activeUser.subdistrict,
      local_area: activeUser.local_area || activeUser.village,
      village: activeUser.village,
      organization_name: activeUser.organization_name,
      is_registered: !!activeUser.role,
      jti: decodedPayload.jti,
      exp: decodedPayload.exp
    };

    if (roles.length > 0 && (!req.user.role || !roles.includes(req.user.role))) {
      return res.status(403).json({
        error: "Insufficient permissions or stakeholder registration required",
        requiresRegistration: !req.user.role
      });
    }

    next();
  };
};
`;

fs.writeFileSync('src/middleware/auth.ts', authCode);
console.log("Auth middleware updated.");
