import { Order, OrderStatus } from '../types';
import { apiFetch } from './api';
const normalize = (item: any): Order => ({ ...item, id: item.id || item._id, requirementId: item.requirementId?.toString?.() || item.requirementId, farmerId: item.farmerId?.toString?.() || item.farmerId, buyerId: item.buyerId?.toString?.() || item.buyerId, createdAt: item.createdAt || item.updatedAt });
export const getOrders = async (): Promise<Order[]> => { const data = await apiFetch('/orders'); return (data.orders || []).map(normalize); };
export const createOrder = async (order: Partial<Order>): Promise<Order> => { const data = await apiFetch('/orders', { method: 'POST', body: JSON.stringify(order) }); return normalize(data.order || data); };
export const getOrder = async (orderId: string): Promise<Order> => { const data = await apiFetch(`/orders/${orderId}`); return normalize(data.order || data); };
export const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<Order> => { const data = await apiFetch(`/orders/${orderId}/status`, { method: 'PUT', body: JSON.stringify({ status }) }); return normalize(data.order || data); };
export const payOrder = async (orderId: string): Promise<Order> => { const data = await apiFetch(`/orders/${orderId}/pay`, { method: 'POST', body: JSON.stringify({ method: 'UPI (simulated)' }) }); return normalize(data.order || data); };
