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

    try {
      await db.insert(system_notifications).values(mapped).onConflictDoNothing();
    } catch (err) {
      console.warn('DB write warning in NotificationService.addNotification:', err);
    }
    return mapped;
  }

  static async getUserNotifications(userId: string) {
    try {
      return await db.select().from(system_notifications).where(eq(system_notifications.userId, userId)).orderBy(desc(system_notifications.createdAt));
    } catch (err) {
      console.warn('DB read warning in NotificationService.getUserNotifications:', err);
      return [];
    }
  }

  static async getAllNotifications() {
    try {
      return await db.select().from(system_notifications).orderBy(desc(system_notifications.createdAt));
    } catch (err) {
      console.warn('DB read warning in NotificationService.getAllNotifications:', err);
      return [];
    }
  }

  static async markAsRead(id: string) {
    try {
      await db.update(system_notifications).set({ read: true }).where(eq(system_notifications.id, id));
      return true;
    } catch (err) {
      console.warn('DB update warning in NotificationService.markAsRead:', err);
      return false;
    }
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

