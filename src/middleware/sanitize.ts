import { Request, Response, NextFunction } from 'express';

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
      .replace(/\0/g, '') // remove null bytes
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // strip script blocks
      .trim();
  }

  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }

  if (typeof val === 'object') {
    const cleanObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(val)) {
      // Prevent prototype pollution attacks
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
 * Express middleware to sanitize req.body, req.query, and req.params.
 */
export function sanitizeMiddleware(req: Request, _res: Response, next: NextFunction) {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }
  next();
}
