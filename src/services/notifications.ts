import { AppNotification } from '../types';
import { apiFetch } from './api';
const normalize = (item: any): AppNotification => ({ ...item, id: item.id || item._id, recipientId: item.recipientId?.toString?.() || item.recipientId, timestamp: item.timestamp || item.createdAt });
export const getNotifications = async (): Promise<AppNotification[]> => { const data = await apiFetch('/notifications'); return (data.notifications || []).map(normalize); };
export const markNotificationRead = async (notificationId: string): Promise<AppNotification> => { const data = await apiFetch(`/notifications/${notificationId}/read`, { method: 'PUT' }); return normalize(data.notification || data); };
export const markAllNotificationsRead = async (): Promise<AppNotification[]> => { const data = await apiFetch('/notifications/read-all', { method: 'PUT' }); return (data.notifications || []).map(normalize); };
