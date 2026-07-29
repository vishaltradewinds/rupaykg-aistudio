import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getUser(uid: string) {
  try {
    const found = await db.select().from(users).where(eq(users.uid, uid));
    if (found && found.length > 0) {
      return found[0];
    }
  } catch (err) {
    console.error('Error fetching user from DB:', err);
  }
  return null;
}

export async function getOrCreateUser(uid: string, email: string, name: string) {
  const existing = await getUser(uid);
  if (existing) {
    return existing;
  }

  try {
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
  } catch (err) {
    console.error('Error creating base user in DB:', err);
    return {
      id: 0,
      uid,
      email,
      name,
      role: null,
      wallet_balance: 0
    };
  }
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
  try {
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
  } catch (err) {
    console.error('Error registering stakeholder in DB:', err);
    return {
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
      wallet_balance: 0
    };
  }
}

