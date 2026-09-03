import type { NextFunction, Request, Response } from 'express';

export const STAKEHOLDER_ROLES = [
  'citizen', 'farmer', 'safai_mitra', 'fpo', 'municipal_admin', 'municipal_generator',
  'state_admin', 'super_admin', 'aggregator', 'processor', 'industry_generator',
  'commercial_generator', 'institution_generator', 'PROJECT_OWNER', 'ACVA_USER',
  'ccc_buyer', 'regulator', 'epr_partner', 'csr_partner',
] as const;

export type StakeholderRole = (typeof STAKEHOLDER_ROLES)[number];

export type Permission =
  | 'dashboard:read'
  | 'profile:read'
  | 'profile:update'
  | 'waste:read'
  | 'waste:record'
  | 'evidence:upload'
  | 'evidence:review'
  | 'reports:read'
  | 'reports:export'
  | 'swm:read'
  | 'swm:manage'
  | 'projects:read'
  | 'projects:create'
  | 'projects:manage'
  | 'projects:review'
  | 'projects:verify'
  | 'acva:manage'
  | 'registry:read'
  | 'registry:write'
  | 'credits:read'
  | 'credits:issue'
  | 'credits:buy'
  | 'credits:retire'
  | 'credits:transfer'
  | 'epr:read'
  | 'epr:manage'
  | 'csr:read'
  | 'csr:manage'
  | 'guardian:read'
  | 'guardian:operate'
  | 'audit:read'
  | 'audit:execute'
  | 'admin:users'
  | 'admin:roles'
  | 'admin:security'
  | 'admin:system';

const ALL_READ: Permission[] = ['dashboard:read', 'profile:read', 'reports:read'];
const OPERATIONAL: Permission[] = [...ALL_READ, 'profile:update', 'waste:read', 'waste:record', 'evidence:upload'];

/**
 * PostgreSQL is authoritative for role. This table is deliberately explicit:
 * an unknown/new role receives no permissions until it is reviewed and added.
 */
export const ROLE_PERMISSIONS: Record<StakeholderRole, readonly Permission[]> = {
  citizen: [...OPERATIONAL],
  farmer: [...OPERATIONAL],
  safai_mitra: [...OPERATIONAL],
  fpo: [...OPERATIONAL, 'swm:read', 'reports:export'],
  municipal_admin: [...ALL_READ, 'profile:update', 'waste:read', 'evidence:upload', 'evidence:review', 'reports:export', 'swm:read', 'swm:manage', 'projects:read', 'registry:read', 'credits:read', 'epr:read', 'audit:read'],
  municipal_generator: [...OPERATIONAL, 'swm:read', 'reports:export'],
  state_admin: [...ALL_READ, 'profile:update', 'waste:read', 'evidence:upload', 'evidence:review', 'reports:export', 'swm:read', 'swm:manage', 'projects:read', 'projects:review', 'registry:read', 'credits:read', 'epr:read', 'csr:read', 'audit:read', 'audit:execute', 'admin:users'],
  super_admin: [...ALL_READ, 'profile:update', 'waste:read', 'waste:record', 'evidence:upload', 'evidence:review', 'reports:export', 'swm:read', 'swm:manage', 'projects:read', 'projects:create', 'projects:manage', 'projects:review', 'projects:verify', 'acva:manage', 'registry:read', 'registry:write', 'credits:read', 'credits:issue', 'credits:buy', 'credits:retire', 'credits:transfer', 'epr:read', 'epr:manage', 'csr:read', 'csr:manage', 'guardian:read', 'guardian:operate', 'audit:read', 'audit:execute', 'admin:users', 'admin:roles', 'admin:security', 'admin:system'],
  aggregator: [...OPERATIONAL, 'reports:export'],
  processor: [...OPERATIONAL, 'reports:export'],
  industry_generator: [...OPERATIONAL, 'reports:export', 'epr:read'],
  commercial_generator: [...OPERATIONAL, 'reports:export', 'epr:read'],
  institution_generator: [...OPERATIONAL, 'reports:export', 'epr:read'],
  PROJECT_OWNER: [...ALL_READ, 'profile:update', 'waste:read', 'evidence:upload', 'reports:export', 'projects:read', 'projects:create', 'projects:manage', 'registry:read', 'credits:read'],
  ACVA_USER: [...ALL_READ, 'profile:update', 'evidence:review', 'reports:export', 'projects:read', 'projects:review', 'projects:verify', 'registry:read', 'credits:read', 'audit:read', 'audit:execute'],
  ccc_buyer: [...ALL_READ, 'profile:update', 'reports:export', 'projects:read', 'registry:read', 'credits:read', 'credits:buy', 'credits:retire'],
  regulator: [...ALL_READ, 'profile:update', 'waste:read', 'evidence:review', 'reports:export', 'swm:read', 'swm:manage', 'projects:read', 'projects:review', 'projects:verify', 'acva:manage', 'registry:read', 'credits:read', 'epr:read', 'epr:manage', 'csr:read', 'csr:manage', 'guardian:read', 'guardian:operate', 'audit:read', 'audit:execute'],
  epr_partner: [...ALL_READ, 'profile:update', 'waste:read', 'reports:export', 'epr:read', 'epr:manage', 'registry:read', 'credits:read'],
  csr_partner: [...ALL_READ, 'profile:update', 'waste:read', 'reports:export', 'csr:read', 'csr:manage', 'registry:read', 'credits:read'],
};

export function isKnownRole(role: unknown): role is StakeholderRole {
  return typeof role === 'string' && Object.prototype.hasOwnProperty.call(ROLE_PERMISSIONS, role);
}

export function getPermissionsForRole(role: unknown): Permission[] {
  if (!isKnownRole(role)) return [];
  return [...ROLE_PERMISSIONS[role]];
}

export function hasPermission(role: unknown, permission: Permission): boolean {
  return getPermissionsForRole(role).includes(permission);
}

export function authorize(...permissions: Permission[]) {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!isKnownRole(role)) {
      return res.status(403).json({ error: 'Forbidden: registered stakeholder role required' });
    }
    if (permissions.length > 0 && !permissions.every((permission) => hasPermission(role, permission))) {
      return res.status(403).json({ error: 'Forbidden: insufficient stakeholder permissions' });
    }
    next();
  };
}

export function authorizeAny(...permissions: Permission[]) {
  return (req: Request & { user?: any }, res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!isKnownRole(role)) {
      return res.status(403).json({ error: 'Forbidden: registered stakeholder role required' });
    }
    if (permissions.length > 0 && !permissions.some((permission) => hasPermission(role, permission))) {
      return res.status(403).json({ error: 'Forbidden: insufficient stakeholder permissions' });
    }
    next();
  };
}

/**
 * High-risk API policy guard. Existing endpoint-level auth remains in place;
 * this guard closes gaps where a sensitive endpoint previously had no auth.
 */
export function sensitiveApiPolicy(req: Request & { user?: any }, res: Response, next: NextFunction) {
  const path = req.path;
  const method = req.method.toUpperCase();

  if (path.startsWith('/api/carbon/public/')) return next();

  if (path.startsWith('/api/carbon/')) {
    const permission = method === 'GET' ? 'projects:read' : 'projects:manage';
    if (path.includes('/guardian/')) {
      return req.user ? authorize('guardian:read')(req, res, next) : res.status(401).json({ error: 'Unauthorized: authentication required' });
    }
    if (path.includes('/acva')) {
      return req.user ? authorizeAny('acva:manage', 'projects:review', 'projects:verify')(req, res, next) : res.status(401).json({ error: 'Unauthorized: authentication required' });
    }
    return req.user ? authorize(permission)(req, res, next) : res.status(401).json({ error: 'Unauthorized: authentication required' });
  }

  if (path.startsWith('/api/admin/') || path === '/api/admin/dashboard') {
    return req.user ? authorize('admin:users')(req, res, next) : res.status(401).json({ error: 'Unauthorized: authentication required' });
  }

  if (path.startsWith('/api/registry/')) {
    const permission = method === 'GET' ? 'registry:read' : 'registry:write';
    return req.user ? authorize(permission)(req, res, next) : res.status(401).json({ error: 'Unauthorized: authentication required' });
  }

  if (path.startsWith('/api/market/')) {
    const permission = method === 'GET' ? 'credits:read' : 'credits:buy';
    return req.user ? authorize(permission)(req, res, next) : res.status(401).json({ error: 'Unauthorized: authentication required' });
  }

  if (path.startsWith('/api/audit-logs')) {
    return req.user ? authorize('audit:read')(req, res, next) : res.status(401).json({ error: 'Unauthorized: authentication required' });
  }

  next();
}
