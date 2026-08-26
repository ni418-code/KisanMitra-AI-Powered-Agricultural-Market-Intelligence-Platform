import { apiFetch } from './api';
import { BuyerRequirement, Order } from '../types';

export async function getBuyerRequirements(): Promise<BuyerRequirement[]> {
  const data = await apiFetch('/requirements');
  return data.requirements || [];
}

export async function getBuyerRequirement(requirementId: string): Promise<BuyerRequirement> {
  const data = await apiFetch(`/requirements/${requirementId}`);
  return data.requirement || data;
}

export async function createBuyerRequirement(requirement: Partial<BuyerRequirement>): Promise<BuyerRequirement> {
  const data = await apiFetch('/requirements', { method: 'POST', body: JSON.stringify(requirement) });
  return data.requirement || data;
}

export async function acceptBuyerRequirement(requirementId: string): Promise<{ requirement: BuyerRequirement; order: Order }> {
  return apiFetch(`/requirements/${requirementId}/accept`, { method: 'POST' });
}

export async function declineBuyerRequirement(requirementId: string): Promise<BuyerRequirement> {
  const data = await apiFetch(`/requirements/${requirementId}/decline`, { method: 'POST' });
  return data.requirement || data;
}
