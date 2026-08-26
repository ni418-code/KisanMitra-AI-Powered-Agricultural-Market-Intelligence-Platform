import { Order, OrderStatus } from '../types';
import { apiFetch } from './api';

export const getOrders = async (): Promise<Order[]> => {
  const data = await apiFetch('/orders');
  return Array.isArray(data) ? data : data.orders || [];
};

export const createOrder = async (order: Partial<Order>): Promise<Order> => {
  const data = await apiFetch('/orders', { method: 'POST', body: JSON.stringify(order) });
  return data.order || data;
};

export const getOrder = async (orderId: string): Promise<Order> => {
  const data = await apiFetch(`/orders/${orderId}`);
  return data.order || data;
};

export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => {
  const data = await apiFetch(`/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
  return data.order || data;
};

export const payOrder = async (orderId: string): Promise<Order> => {
  const data = await apiFetch(`/orders/${orderId}/pay`, { method: 'POST', body: JSON.stringify({ method: 'UPI (simulated)' }) });
  return data.order || data;
};
