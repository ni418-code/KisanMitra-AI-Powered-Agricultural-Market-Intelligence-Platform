import { Order, OrderStatus } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

/*
 * ============================================================
 * GET ALL ORDERS
 * ============================================================
 */

export const getOrders = async (): Promise<Order[]> => {
  const response = await fetch(`${API_BASE_URL}/orders`);

  if (!response.ok) {
    throw new Error('Failed to fetch orders');
  }

  const data = await response.json();

  return data;
};


/*
 * ============================================================
 * CREATE ORDER
 * ============================================================
 */

export const createOrder = async (
  order: Order
): Promise<Order> => {

  const response = await fetch(
    `${API_BASE_URL}/orders`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(order),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
      'Failed to create order'
    );
  }

  const data = await response.json();

  return data;
};


/*
 * ============================================================
 * UPDATE ORDER STATUS
 * ============================================================
 */

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus
): Promise<Order> => {

  const response = await fetch(
    `${API_BASE_URL}/orders/${orderId}/status`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        status,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
      'Failed to update order status'
    );
  }

  const data = await response.json();

  return data;
};


/*
 * ============================================================
 * COMPLETE PAYMENT
 * ============================================================
 */

export const payOrder = async (
  orderId: string
): Promise<Order> => {

  const response = await fetch(
    `${API_BASE_URL}/orders/${orderId}/payment`,
    {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.message ||
      'Failed to complete payment'
    );
  }

  const data = await response.json();

  return data;
};