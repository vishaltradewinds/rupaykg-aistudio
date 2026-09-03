import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { adminAuth } from '../lib/firebase-admin.ts';
import { getUser } from '../db/users.ts';
import { getRedisClient, isRedisConnected } from '../lib/redis.ts';
import { getPermissionsForRole, isKnownRole } from './rbac.ts';

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

    try {
      const redis = await getRedisClient();
      if (!isRedisConnected()) {
        return res.status(503).json({ error: 'Service Unavailable: Token revocation service is offline. Failing closed.' });
      }
      if (decodedPayload.jti) {
        const isRevoked = await redis.get(`bl_${decodedPayload.jti}`);
        if (isRevoked) {
          return res.status(401).json({ error: 'Unauthorized: Token has been revoked' });
        }
      }
    } catch (err) {
      return res.status(503).json({ error: 'Service Unavailable: Token revocation check failed. Failing closed.' });
    }

    const uid = decodedPayload.id || decodedPayload.uid;
    const dbUser = await getUser(uid);
    if (!dbUser) {
      return res.status(401).json({ error: 'Unauthorized: User not found in authoritative database' });
    }

    const activeUser = dbUser;
    const role = activeUser.role;
    const permissions = getPermissionsForRole(role);

    // The database is authoritative. JWT role/org/jurisdiction claims are ignored.
    // Unknown roles fail closed instead of silently becoming a low-privilege role.
    if (!isKnownRole(role)) {
      return res.status(403).json({ error: 'Forbidden: stakeholder role is not registered in the RBAC policy' });
    }

    req.user = {
      id: activeUser.uid,
      uid: activeUser.uid,
      email: activeUser.email,
      role,
      permissions,
      name: activeUser.name,
      phone: activeUser.phone,
      state: activeUser.state,
      district: activeUser.district,
      subdistrict: activeUser.subdistrict,
      local_area: activeUser.local_area || activeUser.village,
      village: activeUser.village,
      organization_name: activeUser.organization_name,
      is_registered: true,
      jti: decodedPayload.jti,
      exp: decodedPayload.exp
    };

    if (roles.length > 0 && !roles.includes(role)) {
      return res.status(403).json({
        error: 'Insufficient permissions for this stakeholder role',
        requiresRegistration: false
      });
    }

    next();
  };
};
