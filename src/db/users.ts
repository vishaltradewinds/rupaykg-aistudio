import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

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


