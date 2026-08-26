import { AppNotification } from '../types';
import { apiFetch } from './api';

export const getNotifications = async (): Promise<AppNotification[]> => {
  const data = await apiFetch('/notifications');
  return Array.isArray(data) ? data : data.notifications || [];
};

export const markNotificationRead = async (notificationId: string): Promise<AppNotification> => {
  const data = await apiFetch(`/notifications/${notificationId}/read`, { method: 'PUT' });
  return data.notification || data;
};

export const markAllNotificationsRead = async (): Promise<AppNotification[]> => {
  const data = await apiFetch('/notifications/read-all', { method: 'PUT' });
  return data.notifications || [];
};
