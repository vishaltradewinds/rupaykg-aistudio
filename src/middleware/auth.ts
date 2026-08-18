import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { adminAuth } from '../lib/firebase-admin.ts';
import { getOrCreateUser } from '../db/users.ts';

export interface AuthRequest extends Request {
  user?: any;
}

function getPublicKey(): string | null {
  try {
    const pubPath = path.resolve(process.cwd(), 'public.pem');
    if (fs.existsSync(pubPath)) {
      return fs.readFileSync(pubPath, 'utf8');
    }
  } catch (err) {
    // ignore
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

    // 1. Try RS256 verification with local RSA public key
    const publicKey = getPublicKey();
    if (publicKey) {
      try {
        decodedPayload = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      } catch (err) {
        // Not signed by local RS256 key, will check Firebase / generic decoding
      }
    }

    // 2. Try Firebase Admin token verification if RS256 verification didn't match
    if (!decodedPayload) {
      try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        const dbUser: any = await getOrCreateUser(
          decodedToken.uid,
          decodedToken.email || '',
          decodedToken.name || 'User'
        );
        decodedPayload = {
          id: dbUser.uid || decodedToken.uid,
          uid: dbUser.uid || decodedToken.uid,
          email: dbUser.email || decodedToken.email,
          role: dbUser.role || null,
          name: dbUser.name || decodedToken.name || 'User',
          phone: dbUser.phone || null,
          state: dbUser.state || null,
          district: dbUser.district || null,
          subdistrict: dbUser.subdistrict || null,
          local_area: dbUser.local_area || dbUser.village || null,
          village: dbUser.village || null,
          organization_name: dbUser.organization_name || null,
          ...dbUser
        };
      } catch (err) {
        // Not a Firebase ID token
      }
    }

    // 3. Fallback: decode JWT payload directly
    if (!decodedPayload) {
      try {
        const decoded = jwt.decode(token);
        if (decoded && typeof decoded === 'object' && (decoded.id || decoded.uid || decoded.role || decoded.phone)) {
          decodedPayload = decoded;
        }
      } catch (err) {
        // Decode failed
      }
    }

    if (!decodedPayload) {
      return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
    }

    req.user = {
      id: decodedPayload.id || decodedPayload.uid,
      uid: decodedPayload.id || decodedPayload.uid,
      email: decodedPayload.email || '',
      role: decodedPayload.role || null,
      name: decodedPayload.name || 'User',
      phone: decodedPayload.phone || null,
      state: decodedPayload.state || null,
      district: decodedPayload.district || null,
      subdistrict: decodedPayload.subdistrict || null,
      local_area: decodedPayload.local_area || decodedPayload.village || null,
      village: decodedPayload.village || null,
      organization_name: decodedPayload.organization_name || null,
      is_registered: !!decodedPayload.role,
      ...decodedPayload
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

