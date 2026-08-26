import { apiFetch } from './api';
import { BuyerRequirement, Order } from '../types';
const normalizeRequirement = (item: any): BuyerRequirement => ({ ...item, id: item.id || item._id, buyerId: item.buyerId?.toString?.() || item.buyerId, matchedFarmerIds: (item.matchedFarmerIds || []).map((id: any) => id?.toString?.() || id), createdAt: item.createdAt || item.updatedAt });
const normalizeOrder = (item: any): Order => ({ ...item, id: item.id || item._id, farmerId: item.farmerId?.toString?.() || item.farmerId, buyerId: item.buyerId?.toString?.() || item.buyerId });
export async function getBuyerRequirements(): Promise<BuyerRequirement[]> { const data = await apiFetch('/requirements'); return (data.requirements || []).map(normalizeRequirement); }
export async function getBuyerRequirement(requirementId: string): Promise<BuyerRequirement> { const data = await apiFetch(`/requirements/${requirementId}`); return normalizeRequirement(data.requirement || data); }
export async function createBuyerRequirement(requirement: Partial<BuyerRequirement>): Promise<BuyerRequirement> { const data = await apiFetch('/requirements', { method: 'POST', body: JSON.stringify(requirement) }); return normalizeRequirement(data.requirement || data); }
export async function acceptBuyerRequirement(requirementId: string): Promise<{ requirement: BuyerRequirement; order: Order }> { const data = await apiFetch(`/requirements/${requirementId}/accept`, { method: 'POST' }); return { requirement: normalizeRequirement(data.requirement), order: normalizeOrder(data.order) }; }
export async function declineBuyerRequirement(requirementId: string): Promise<BuyerRequirement> { const data = await apiFetch(`/requirements/${requirementId}/decline`, { method: 'POST' }); return normalizeRequirement(data.requirement); }
