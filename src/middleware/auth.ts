import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { adminAuth } from '../lib/firebase-admin.ts';
import { getUser } from '../db/users.ts';
import { getRedisClient, isRedisConnected } from '../lib/redis.ts';
import { getPermissionsForRole, hasPermission, isKnownRole, Permission } from './rbac.ts';

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
      if (content && content.includes('KEY-----')) return content;
    }
  } catch (err) {
  }
  return null;
}

function requiredPermissionForRequest(req: Request): Permission | null {
  const pathName = req.path;
  const method = req.method.toUpperCase();

  if (pathName.startsWith('/api/carbon/public/')) return null;
  if (pathName.startsWith('/api/carbon/guardian/')) {
    return method === 'GET' ? 'guardian:read' : 'guardian:operate';
  }
  if (pathName.startsWith('/api/carbon/acva') || pathName.includes('/appoint-acva')) {
    return method === 'GET' ? 'projects:read' : 'projects:review';
  }
  if (pathName.startsWith('/api/carbon/projects')) {
    if (method === 'GET') return 'projects:read';
    if (pathName.includes('/real-eligibility') || pathName.includes('/monitoring-report') || pathName.includes('/audit-package')) return 'projects:manage';
    if (pathName.includes('/ccts-submit')) return 'projects:review';
    return 'projects:manage';
  }
  if (pathName.startsWith('/api/carbon/certificates')) return method === 'GET' ? 'credits:read' : 'credits:issue';
  if (pathName.startsWith('/api/carbon/cqe')) return method === 'GET' ? 'reports:read' : 'projects:manage';
  if (pathName.startsWith('/api/registry/')) return method === 'GET' ? 'registry:read' : 'registry:write';
  if (pathName.startsWith('/api/market/')) return method === 'GET' ? 'credits:read' : 'credits:buy';
  if (pathName.startsWith('/api/audit-logs')) return 'audit:read';
  if (pathName.startsWith('/api/admin/')) return 'admin:users';
  if (pathName.startsWith('/api/lgd/sync')) return 'swm:manage';
  if (pathName.startsWith('/api/ccc/')) return method === 'GET' ? 'credits:read' : 'credits:issue';
  if (pathName.startsWith('/api/epr/')) return method === 'GET' ? 'epr:read' : 'epr:manage';
  if (pathName.startsWith('/api/csr/')) return method === 'GET' ? 'csr:read' : 'csr:manage';
  if (pathName.startsWith('/api/cpcb/')) return method === 'GET' ? 'swm:read' : 'swm:manage';
  if (pathName.startsWith('/api/swm/')) return method === 'GET' ? 'swm:read' : 'swm:manage';
  return null;
}

function enforceRequestPermission(req: AuthRequest, res: Response): boolean {
  const required = requiredPermissionForRequest(req);
  if (!required) return true;
  if (!hasPermission(req.user?.role, required)) {
    res.status(403).json({
      error: 'Forbidden: stakeholder role is not authorized for this operation',
      requiredPermission: required,
    });
    return false;
  }
  return true;
}

export const auth = (roles: string[] = []) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: Missing token' });
    }

    const token = authHeader.split('Bearer ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized: Empty token' });

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

    if (!decodedPayload) return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });

    try {
      const redis = await getRedisClient();
      if (!isRedisConnected()) {
        return res.status(503).json({ error: 'Service Unavailable: Token revocation service is offline. Failing closed.' });
      }
      if (decodedPayload.jti) {
        const isRevoked = await redis.get(`bl_${decodedPayload.jti}`);
        if (isRevoked) return res.status(401).json({ error: 'Unauthorized: Token has been revoked' });
      }
    } catch (err) {
      return res.status(503).json({ error: 'Service Unavailable: Token revocation check failed. Failing closed.' });
    }

    const uid = decodedPayload.id || decodedPayload.uid;
    const dbUser = await getUser(uid);
    if (!dbUser) return res.status(401).json({ error: 'Unauthorized: User not found in authoritative database' });

    const activeUser = dbUser;
    const role = activeUser.role;
    const permissions = getPermissionsForRole(role);
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
      return res.status(403).json({ error: 'Insufficient permissions for this stakeholder role', requiresRegistration: false });
    }

    if (!enforceRequestPermission(req, res)) return;
    next();
  };
};
