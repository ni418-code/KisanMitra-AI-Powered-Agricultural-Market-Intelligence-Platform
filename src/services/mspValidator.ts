import { MOCK_CROPS } from '../data/mockCrops';

export interface MspValidationResult {
  hasMsp: boolean;
  mspPrice: number | null;
  offerPrice: number;
  isValid: boolean;
  message: string;
  badgeType: 'success' | 'warning' | 'info';
  cropName: string;
}

export function validateMspPrice(cropId: string, offerPrice: number): MspValidationResult {
  const crop = MOCK_CROPS.find((c) => c.id === cropId);
  const cropName = crop?.name || 'Crop';
  const msp = crop?.mspPrice ?? null;

  if (msp === null || msp === undefined) {
    return {
      hasMsp: false,
      mspPrice: null,
      offerPrice,
      isValid: offerPrice > 0,
      message: `No statutory MSP for fresh ${cropName}. Current Mandi rate is ₹${crop?.marketPrice ?? 0}/kg.`,
      badgeType: 'info',
      cropName,
    };
  }

  if (offerPrice < msp) {
    return {
      hasMsp: true,
      mspPrice: msp,
      offerPrice,
      isValid: false,
      message: `Offer price (₹${offerPrice}/kg) is below the statutory MSP (₹${msp.toFixed(2)}/kg). Minimum offer must be ₹${msp.toFixed(2)}/kg.`,
      badgeType: 'warning',
      cropName,
    };
  }

  return {
    hasMsp: true,
    mspPrice: msp,
    offerPrice,
    isValid: true,
    message: `Price requirement satisfied. Offer (₹${offerPrice}/kg) meets or exceeds official MSP (₹${msp.toFixed(2)}/kg).`,
    badgeType: 'success',
    cropName,
  };
}
