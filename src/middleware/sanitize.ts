import { Request, Response, NextFunction } from 'express';
import { auth as requireAuth } from './auth.ts';

/**
 * Recursively sanitizes a value by:
 * 1. Stripping null bytes (\0)
 * 2. Neutralizing script tags and direct HTML injection attempts
 * 3. Removing prototype pollution keys (__proto__, constructor, prototype)
 */
export function sanitizeValue(val: any): any {
  if (val === null || val === undefined) {
    return val;
  }

  if (typeof val === 'string') {
    return val
      .replace(/\0/g, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .trim();
  }

  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }

  if (typeof val === 'object') {
    const cleanObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(val)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      cleanObj[key] = sanitizeValue(value);
    }
    return cleanObj;
  }

  return val;
}

/**
 * Registration must never accept the legacy UI fallback password.
 * The frontend is expected to require an explicit user-supplied password;
 * this server-side boundary prevents older clients or direct API callers from
 * silently creating accounts with the retired default credential.
 */
function rejectInsecureRegistrationPassword(req: Request, res: Response): boolean {
  const pathName = req.originalUrl.split('?')[0];

  if (req.method !== 'POST' || pathName !== '/api/auth/register') {
    return false;
  }

  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (password === 'password123') {
    res.status(400).json({
      success: false,
      error: 'A unique password is required. The default registration password is not allowed.'
    });
    return true;
  }

  return false;
}

/**
 * Sensitive routers that historically contained endpoints without route-level
 * auth. They are protected here as a defense-in-depth boundary. Existing
 * route-level auth remains authoritative and is intentionally allowed to run
 * again for routes that already declare it.
 */
function requiresCentralAuth(req: Request): boolean {
  const pathName = req.originalUrl.split('?')[0];

  if (pathName.startsWith('/api/carbon/public/')) return false;
  if (pathName === '/api/health' || pathName === '/api/readiness' || pathName === '/api/login') return false;
  if (pathName.startsWith('/api/auth/register')) return false;
  if (pathName.startsWith('/api/carbon/')) return true;
  if (pathName.startsWith('/api/depository/')) return true;
  if (pathName.startsWith('/api/cpcb/')) return true;
  if (pathName.startsWith('/api/swm/')) return true;
  if (pathName.startsWith('/api/v1/guardian/')) return true;
  if (pathName.startsWith('/api/v1/policies/')) return true;
  if (pathName.startsWith('/api/blockchain/')) return true;
  return false;
}

/**
 * Express middleware to sanitize request input and enforce centralized auth
 * on sensitive legacy routers that do not consistently declare auth locally.
 */
export function sanitizeMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }

  if (rejectInsecureRegistrationPassword(req, res)) {
    return;
  }

  if (requiresCentralAuth(req)) {
    return requireAuth()(req as any, res, next);
  }

  next();
}
