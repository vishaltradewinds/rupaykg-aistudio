import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { z } from 'zod';

export const securityMiddlewares = [
  helmet(),
  cors({
    origin: '*', // Restrict this in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
];

export const requireValidToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  // Token verification is handed out to the auth-service logic
  next();
};

export const ZodSchemas = {
  registration: z.object({
    phone: z.string().min(10, 'Phone must be at least 10 characters').max(15, 'Phone must be at most 15 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    role: z.enum(['ADMIN', 'GENERATOR', 'AGGREGATOR', 'RECYCLER', 'VERIFIER', 'REGULATOR']),
    name: z.string().optional(),
  }),
};
