import { apiFetch } from './api';
import { FarmerListing } from '../types';

export async function getFarmerListings(): Promise<FarmerListing[]> {
  const data = await apiFetch('/listings');

  if (Array.isArray(data)) {
    return data;
  }

  return data.listings || data.data || [];
}

export async function getFarmerListing(
  id: string
): Promise<FarmerListing> {
  const data = await apiFetch(`/listings/${id}`);

  return data.listing || data.data || data;
}

export async function createFarmerListing(
  listing: Partial<FarmerListing>
): Promise<FarmerListing> {
  const data = await apiFetch('/listings', {
    method: 'POST',
    body: JSON.stringify(listing),
  });

  return data.listing || data.data || data;
}

export async function updateFarmerListing(
  id: string,
  listing: Partial<FarmerListing>
): Promise<FarmerListing> {
  const data = await apiFetch(`/listings/${id}`, {
    method: 'PUT',
    body: JSON.stringify(listing),
  });

  return data.listing || data.data || data;
}

export async function deleteFarmerListing(
  id: string
): Promise<void> {
  await apiFetch(`/listings/${id}`, {
    method: 'DELETE',
  });
}