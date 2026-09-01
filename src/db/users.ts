import { db } from './index.ts';
import { users, password_reset_tokens } from './schema.ts';
import { eq, and, gt } from 'drizzle-orm';

export async function getUser(uid: string) {
  const found = await db.select().from(users).where(eq(users.uid, uid));
  if (found && found.length > 0) {
    return found[0];
  }
  return null;
}

export async function getAllUsers() {
  return await db.select().from(users);
}

export async function getUserByEmail(email: string) {
  const found = await db.select().from(users).where(eq(users.email, email));
  if (found && found.length > 0) {
    return found[0];
  }
  return null;
}

export async function getUserByPhone(phone: string) {
  const found = await db.select().from(users).where(eq(users.phone, phone));
  if (found && found.length > 0) {
    return found[0];
  }
  return null;
}

export async function getUserByIdentifier(identifier: string) {
  const all = await getAllUsers();
  return all.find(
    (u) =>
      u.phone === identifier ||
      u.email === identifier ||
      u.uid === identifier ||
      (u as any).loginId === identifier ||
      u.id?.toString() === identifier ||
      (identifier === 'admin' && (u.uid === 'admin_1' || u.email === 'admin@rupaykg.org'))
  ) || null;
}

export async function getOrCreateUser(uid: string, email: string, name: string) {
  const existing = await getUser(uid);
  if (existing) {
    return existing;
  }

  const result = await db.insert(users)
    .values({
      uid,
      email,
      name,
      role: null, // No default role auto-assigned
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: {
        email,
        name,
      },
    })
    .returning();

  return result[0];
}

export async function registerStakeholderUser(data: {
  uid: string;
  email: string;
  name: string;
  role: string;
  passwordHash?: string;
  phone?: string;
  state?: string;
  district?: string;
  subdistrict?: string;
  local_area?: string;
  village?: string;
  organization_name?: string;
}) {
  const result = await db.insert(users)
    .values({
      uid: data.uid,
      email: data.email,
      name: data.name,
      role: data.role,
      passwordHash: data.passwordHash,
      phone: data.phone,
      state: data.state,
      district: data.district,
      subdistrict: data.subdistrict,
      local_area: data.local_area,
      village: data.village || data.local_area,
      organization_name: data.organization_name,
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: {
        name: data.name,
        role: data.role,
        passwordHash: data.passwordHash,
        phone: data.phone,
        state: data.state,
        district: data.district,
        subdistrict: data.subdistrict,
        local_area: data.local_area,
        village: data.village || data.local_area,
        organization_name: data.organization_name,
      },
    })
    .returning();

  return result[0];
}

export async function updateUserPassword(identifier: string, passwordHash: string) {
  const user = await getUserByIdentifier(identifier);
  if (!user) return null;
  const updated = await db.update(users)
    .set({ passwordHash })
    .where(eq(users.uid, user.uid))
    .returning();
  return updated[0] || null;
}

export async function createPasswordResetToken(identifier: string, tokenHash: string, expiresAt: Date) {
  const res = await db.insert(password_reset_tokens)
    .values({
      identifier,
      tokenHash,
      expiresAt,
      used: false,
      attempts: 0
    })
    .returning();
  return res[0];
}

export async function findValidPasswordResetToken(identifier: string, tokenHash: string) {
  const now = new Date();
  const rows = await db.select()
    .from(password_reset_tokens)
    .where(
      and(
        eq(password_reset_tokens.identifier, identifier),
        eq(password_reset_tokens.tokenHash, tokenHash),
        eq(password_reset_tokens.used, false),
        gt(password_reset_tokens.expiresAt, now)
      )
    );
  return rows[0] || null;
}

export async function markPasswordResetTokenUsed(id: number) {
  await db.update(password_reset_tokens)
    .set({ used: true })
    .where(eq(password_reset_tokens.id, id));
}

export async function updateUserRole(uid: string, role: string) {
  const updated = await db.update(users)
    .set({ role })
    .where(eq(users.uid, uid))
    .returning();
  return updated[0] || null;
}

export async function incrementPasswordResetTokenAttempts(id: number) {
  const rows = await db.select().from(password_reset_tokens).where(eq(password_reset_tokens.id, id));
  if (rows[0]) {
    await db.update(users)
      .set({})
      .where(eq(users.uid, rows[0].identifier));
    await db.update(password_reset_tokens)
      .set({ attempts: (rows[0].attempts || 0) + 1 })
      .where(eq(password_reset_tokens.id, id));
  }
}
