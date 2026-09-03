import assert from 'node:assert/strict';
import { STAKEHOLDER_ROLES, ROLE_PERMISSIONS, getPermissionsForRole, hasPermission, isKnownRole } from '../src/middleware/rbac.ts';

const roles = [...STAKEHOLDER_ROLES];

assert.equal(new Set(roles).size, roles.length, 'stakeholder roles must be unique');
for (const role of roles) {
  assert.ok(isKnownRole(role), `${role} must have an explicit RBAC policy`);
  assert.ok(getPermissionsForRole(role).includes('dashboard:read'), `${role} must be able to read its dashboard`);
}

assert.deepEqual(getPermissionsForRole('not-a-role'), [], 'unknown roles must fail closed');
assert.equal(hasPermission('not-a-role', 'admin:system'), false, 'unknown roles must never gain privileges');

// Separation of duties: project owners and ACVAs cannot issue registry credits.
assert.equal(hasPermission('PROJECT_OWNER', 'credits:issue'), false);
assert.equal(hasPermission('ACVA_USER', 'credits:issue'), false);
assert.equal(hasPermission('PROJECT_OWNER', 'projects:verify'), false);

// Buyers may buy/retire credits but cannot verify or issue them.
assert.equal(hasPermission('ccc_buyer', 'credits:buy'), true);
assert.equal(hasPermission('ccc_buyer', 'credits:retire'), true);
assert.equal(hasPermission('ccc_buyer', 'credits:issue'), false);
assert.equal(hasPermission('ccc_buyer', 'projects:verify'), false);

// Operational stakeholders cannot administer the platform.
for (const role of ['citizen', 'farmer', 'safai_mitra', 'fpo', 'aggregator', 'processor', 'industry_generator', 'commercial_generator', 'institution_generator']) {
  assert.equal(hasPermission(role, 'admin:roles'), false, `${role} must not manage roles`);
  assert.equal(hasPermission(role, 'admin:system'), false, `${role} must not manage system security`);
}

// Only the central super administrator receives unrestricted registry write / system permissions.
assert.equal(hasPermission('super_admin', 'registry:write'), true);
assert.equal(hasPermission('super_admin', 'admin:system'), true);
for (const role of roles.filter((r) => r !== 'super_admin')) {
  assert.equal(hasPermission(role, 'admin:system'), false, `${role} must not have platform system administration`);
}

// Verification is separated from project ownership.
assert.equal(hasPermission('ACVA_USER', 'projects:verify'), true);
assert.equal(hasPermission('regulator', 'projects:verify'), true);
assert.equal(hasPermission('PROJECT_OWNER', 'projects:manage'), true);

console.log(`RBAC contract passed for ${roles.length} stakeholder roles.`);
