import { BuyerRequirement, FarmerListing } from '../types';

export interface MatchResult {
  matches: FarmerListing[];
  count: number;
  bestMatch: FarmerListing | null;
  hasSufficientSupply: boolean;
  totalSupply: number;
}

export function findMatchingFarmers(
  requirement: {
    cropId: string;
    quantity: number;
    pickupRadiusKm: number;
    requiredDate?: string;
  },
  allListings: FarmerListing[]
): MatchResult {
  // Filter by same crop and available status
  const matched = allListings.filter((listing) => {
    if (listing.status !== 'Available') return false;
    if (listing.cropId.toLowerCase() !== requirement.cropId.toLowerCase()) return false;
    
    // Check radius if distance is provided
    if (listing.distanceKm !== undefined && requirement.pickupRadiusKm) {
      if (listing.distanceKm > requirement.pickupRadiusKm) return false;
    }

    return true;
  });

  // Sort by distance (nearest first), then by quantity available
  matched.sort((a, b) => {
    const distA = a.distanceKm ?? 999;
    const distB = b.distanceKm ?? 999;
    if (distA !== distB) return distA - distB;
    return b.quantity - a.quantity;
  });

  const totalSupply = matched.reduce((acc, curr) => acc + curr.quantity, 0);
  const bestMatch = matched.length > 0 ? matched[0] : null;
  const hasSufficientSupply = totalSupply >= requirement.quantity;

  return {
    matches: matched,
    count: matched.length,
    bestMatch,
    hasSufficientSupply,
    totalSupply,
  };
}
