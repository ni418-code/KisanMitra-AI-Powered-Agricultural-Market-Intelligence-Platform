export type Language = 'en' | 'te' | 'hi' | 'ta' | 'mr';

export type UserRole = 'farmer' | 'buyer';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  phone: string;
  email?: string;
  villageOrBusinessName: string;
  location: string;
  state: string;
  language: Language;
  isVerified: boolean;
  rating?: number;
  completedOrdersCount: number;
  avatarUrl?: string;
  cropsGrownOrPurchased?: string[];
  businessType?: string;
}

export interface CropMaster {
  id: string;
  name: string;
  localNames: {
    en: string;
    te: string;
    hi: string;
    ta: string;
    mr: string;
  };
  category: 'Vegetables' | 'Grains' | 'Spices' | 'Pulses' | 'Fruits';
  image: string;
  defaultUnit: 'kg' | 'quintal';
  mspPrice: number | null; // null if no official statutory MSP
  marketPrice: number;
  pricePerQuintal: number;
  lastUpdated: string;
  nearbyMarkets: {
    name: string;
    price: number;
  }[];
  description: string;
}

export interface FarmerListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerVillage: string;
  farmerState: string;
  farmerPhone: string;
  farmerRating: number;
  cropId: string;
  cropName: string;
  cropImage: string;
  quantity: number;
  unit: 'kg' | 'quintal';
  location: string;
  distanceKm?: number;
  availableDate: string;
  listedAt: string;
  status: 'Available' | 'Reserved' | 'Sold';
  notes?: string;
}

export interface BuyerRequirement {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerLocation: string;
  buyerPhone: string;
  buyerRating: number;
  verifiedPurchases: number;
  cropId: string;
  cropName: string;
  cropImage: string;
  quantity: number;
  unit: 'kg' | 'quintal';
  offerPrice: number; // in ₹/kg
  totalEstimatedValue: number;
  requiredDate: string;
  pickupRadiusKm: number;
  distanceKm?: number;
  status: 'Looking for farmers' | 'Farmer Matched' | 'Accepted' | 'Completed' | 'Cancelled';
  matchedFarmerIds: string[];
  createdAt: string;
  notes?: string;
}

export type OrderStatus =
  | 'posted'
  | 'matched'
  | 'accepted'
  | 'pickup_scheduled'
  | 'crop_picked_up'
  | 'payment_completed';

export interface PickupDetails {
  scheduledDate: string;
  scheduledTimeWindow: string;
  driverName: string;
  driverPhone: string;
  vehicleNumber: string;
  transportStatus: 'Pickup Scheduled' | 'Driver Assigned' | 'On the Way' | 'Picked Up';
  pickupAddress: string;
}

export interface PaymentDetails {
  status: 'Pending' | 'Payment Completed';
  method: string;
  amount: number;
  transactionId?: string;
  completedAt?: string;
  breakdown: {
    quantity: number;
    unit: string;
    ratePerKg: number;
    totalAmount: number;
    platformFee: number;
    netPayoutToFarmer: number;
  };
}

export interface OrderTimelineItem {
  status: OrderStatus;
  label: string;
  description: string;
  timestamp: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  requirementId: string;
  cropId: string;
  cropName: string;
  cropImage: string;
  quantity: number;
  unit: 'kg' | 'quintal';
  agreedPricePerKg: number;
  totalAmount: number;
  farmerId: string;
  farmerName: string;
  farmerVillage: string;
  farmerPhone: string;
  farmerLocation: string;
  buyerId: string;
  buyerName: string;
  buyerPhone: string;
  buyerLocation: string;
  buyerRating: number;
  distanceKm: number;
  status: OrderStatus;
  createdAt: string;
  pickupDetails: PickupDetails;
  paymentDetails: PaymentDetails;
  timeline: OrderTimelineItem[];
}

export interface AppNotification {
  id: string;
  recipientRole: 'farmer' | 'buyer' | 'all';
  recipientId?: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'requirement' | 'order' | 'pickup' | 'payment' | 'system';
  actionUrl?: string;
  relatedId?: string;
}
