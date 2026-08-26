import { AppNotification } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api';

/*
 * ============================================================
 * GET ALL NOTIFICATIONS
 * ============================================================
 */

export const getNotifications = async (): Promise<AppNotification[]> => {
  const response = await fetch(
    `${API_BASE_URL}/notifications`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }

  const data = await response.json();

  return data;
};


/*
 * ============================================================
 * CREATE NOTIFICATION
 * ============================================================
 */

export const createNotification = async (
  notification: AppNotification
): Promise<AppNotification> => {

  const response = await fetch(
    `${API_BASE_URL}/notifications`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(notification),
    }
  );

  if (!response.ok) {
    const errorData =
      await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
      'Failed to create notification'
    );
  }

  const data = await response.json();

  return data;
};


/*
 * ============================================================
 * MARK NOTIFICATION AS READ
 * ============================================================
 */

export const markNotificationRead = async (
  notificationId: string
): Promise<AppNotification> => {

  const response = await fetch(
    `${API_BASE_URL}/notifications/${notificationId}/read`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData =
      await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
      'Failed to mark notification as read'
    );
  }

  const data = await response.json();

  return data;
};


/*
 * ============================================================
 * MARK ALL NOTIFICATIONS AS READ
 * ============================================================
 */

export const markAllNotificationsRead = async (
  role: 'farmer' | 'buyer'
): Promise<AppNotification[]> => {

  const response = await fetch(
    `${API_BASE_URL}/notifications/read-all`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        role,
      }),
    }
  );

  if (!response.ok) {
    const errorData =
      await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
      'Failed to mark notifications as read'
    );
  }

  const data = await response.json();

  return data;
};