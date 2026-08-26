import { apiFetch } from './api';
import { FarmerListing } from '../types';
const normalize = (item: any): FarmerListing => ({ ...item, id: item.id || item._id, farmerId: item.farmerId?.toString?.() || item.farmerId, listedAt: item.listedAt || item.createdAt });
export async function getFarmerListings(): Promise<FarmerListing[]> { const data = await apiFetch('/listings'); return (data.listings || []).map(normalize); }
export async function getFarmerListing(id: string): Promise<FarmerListing> { return normalize(await apiFetch(`/listings/${id}`).then((d: any) => d.listing || d)); }
export async function createFarmerListing(listing: Partial<FarmerListing>): Promise<FarmerListing> { return normalize(await apiFetch('/listings', { method: 'POST', body: JSON.stringify(listing) }).then((d: any) => d.listing || d)); }
export async function updateFarmerListing(id: string, listing: Partial<FarmerListing>): Promise<FarmerListing> { return normalize(await apiFetch(`/listings/${id}`, { method: 'PUT', body: JSON.stringify(listing) }).then((d: any) => d.listing || d)); }
export async function deleteFarmerListing(id: string): Promise<void> { await apiFetch(`/listings/${id}`, { method: 'DELETE' }); }
