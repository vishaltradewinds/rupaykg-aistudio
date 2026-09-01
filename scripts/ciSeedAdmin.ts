import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../src/db/index.ts';
import { users } from '../src/db/schema.ts';

const password = process.env.CI_ADMIN_PASSWORD;
if (!password || password.length < 16) {
  throw new Error('CI_ADMIN_PASSWORD must be an ephemeral password of at least 16 characters');
}

const existing = await db.select({ uid: users.uid }).from(users).where(eq(users.uid, 'admin_1'));
if (existing.length > 0) {
  throw new Error('CI admin seed refused: admin_1 already exists; test must prove a pre-start database record');
}

const passwordHash = await bcrypt.hash(password, 10);
await db.insert(users).values({
  uid: 'admin_1',
  email: 'admin@rupaykg.org',
  name: 'System Administrator',
  role: 'super_admin',
  passwordHash,
  phone: '9999999999',
  state: 'Delhi',
  district: 'Delhi',
  organization_name: 'RupayKg Central Directorate',
});

const seeded = await db.select({
  uid: users.uid,
  email: users.email,
  role: users.role,
  passwordHash: users.passwordHash,
}).from(users).where(eq(users.uid, 'admin_1'));

if (seeded.length !== 1 || seeded[0].role !== 'super_admin' || !seeded[0].passwordHash) {
  throw new Error('CI admin seed verification failed');
}

console.log('CI ADMIN PRE-SEED PASSED: admin_1 / super_admin persisted before server start');
