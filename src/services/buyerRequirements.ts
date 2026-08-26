import { apiFetch } from './api';
import { BuyerRequirement } from '../types';

/**
 * Get buyer requirements from the backend.
 */
export async function getBuyerRequirements(): Promise<BuyerRequirement[]> {
  const data = await apiFetch('/requirements');

  return Array.isArray(data)
    ? data
    : data.requirements || [];
}

/**
 * Get one buyer requirement.
 */
export async function getBuyerRequirement(
  requirementId: string
): Promise<BuyerRequirement> {
  const data = await apiFetch(`/requirements/${requirementId}`);

  return data.requirement || data;
}

/**
 * Create a new buyer requirement.
 */
export async function createBuyerRequirement(
  requirement: Partial<BuyerRequirement>
): Promise<BuyerRequirement> {
  const data = await apiFetch('/requirements', {
    method: 'POST',
    body: JSON.stringify(requirement),
  });

  return data.requirement || data;
}

/**
 * Accept a buyer requirement.
 */
export async function acceptBuyerRequirement(
  requirementId: string,
  farmerId?: string
): Promise<BuyerRequirement> {
  const data = await apiFetch(
    `/requirements/${requirementId}/accept`,
    {
      method: 'POST',
      body: JSON.stringify({
        farmerId,
      }),
    }
  );

  return data.requirement || data;
}

/**
 * Decline a buyer requirement.
 */
export async function declineBuyerRequirement(
  requirementId: string
): Promise<BuyerRequirement> {
  const data = await apiFetch(
    `/requirements/${requirementId}/decline`,
    {
      method: 'POST',
    }
  );

  return data.requirement || data;
}