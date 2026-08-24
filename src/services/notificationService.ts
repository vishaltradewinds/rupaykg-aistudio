import { db } from '../db/index.ts';
import { system_notifications } from '../db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import crypto from 'crypto';

export class NotificationService {
  static async addNotification(data: any) {
    const id = data.id || `notif_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const mapped = {
      id,
      userId: data.user_id || data.userId || 'system',
      title: data.title || 'Notification',
      message: data.message || '',
      type: data.type || 'INFO',
      read: !!data.read,
      createdAt: new Date(data.createdAt || data.created_at || Date.now()),
    };

    await db.insert(system_notifications).values(mapped).onConflictDoNothing();
    return mapped;
  }

  static async getUserNotifications(userId: string) {
    return await db.select().from(system_notifications).where(eq(system_notifications.userId, userId)).orderBy(desc(system_notifications.createdAt));
  }

  static async getAllNotifications() {
    return await db.select().from(system_notifications).orderBy(desc(system_notifications.createdAt));
  }

  static async markAsRead(id: string) {
    await db.update(system_notifications).set({ read: true }).where(eq(system_notifications.id, id));
    return true;
  }

  static async broadcast(message: string, targetRole: string = 'all', type: string = 'BROADCAST') {
    return await this.addNotification({
      userId: targetRole,
      title: `Broadcast to ${targetRole}`,
      message,
      type,
      read: false,
    });
  }
}

