import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';

function getPublicKey(): string | null {
  try {
    if (process.env.RUPAYKG_JWT_PUBLIC_KEY) {
      return process.env.RUPAYKG_JWT_PUBLIC_KEY;
    }
    const pubPath = path.resolve(process.cwd(), 'public.pem');
    if (fs.existsSync(pubPath)) {
      const content = fs.readFileSync(pubPath, 'utf8');
      if (content && content.includes('KEY-----')) return content;
    }
  } catch (err) {
    // ignore
  }
  return null;
}

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : ['http://localhost:3000', 'https://ais-dev-ufb2w37wtcw26kbtvi6fqr-134790079851.asia-southeast1.run.app', 'https://ais-pre-ufb2w37wtcw26kbtvi6fqr-134790079851.asia-southeast1.run.app'];

export const securityMiddlewares = [
  helmet({
    contentSecurityPolicy: false, // Handled dynamically for Vite
  }),
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error('CORS origin denied'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
];

export const requireValidToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token header' });
  }
  const token = authHeader.split('Bearer ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized: Empty token' });

  const pubKey = getPublicKey();
  if (!pubKey) {
    return res.status(500).json({ error: 'Cryptographic public key unavailable for token verification' });
  }

  try {
    const decoded = jwt.verify(token, pubKey, { algorithms: ['RS256'] });
    (req as any).user = decoded;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Unauthorized: Token signature invalid or expired' });
  }
};

export const ZodSchemas = {
  registration: z.object({
    phone: z.string().min(10, 'Phone must be at least 10 characters').max(15, 'Phone must be at most 15 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['citizen', 'farmer', 'safai_mitra', 'vle', 'fpo', 'commercial', 'industry', 'institution', 'municipality']),
    name: z.string().optional(),
  }),
};
