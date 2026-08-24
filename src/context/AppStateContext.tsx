import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CropMaster,
  FarmerListing,
  BuyerRequirement,
  Order,
  AppNotification,
  OrderStatus,
} from '../types';
import { MOCK_CROPS } from '../data/mockCrops';
import { INITIAL_FARMER_LISTINGS } from '../data/mockFarmerListings';
import { INITIAL_BUYER_REQUIREMENTS } from '../data/mockRequirements';
import { INITIAL_ORDERS } from '../data/mockOrders';
import { INITIAL_NOTIFICATIONS } from '../data/mockNotifications';
import { findMatchingFarmers } from '../services/matchingEngine';
import { DEMO_FARMER_RAMESH, DEMO_BUYER_FRESHMART } from '../data/mockUsers';

interface AppStateContextType {
  crops: CropMaster[];
  farmerListings: FarmerListing[];
  buyerRequirements: BuyerRequirement[];
  orders: Order[];
  notifications: AppNotification[];
  unreadFarmerNotifCount: number;
  unreadBuyerNotifCount: number;
  addBuyerRequirement: (data: {
    cropId: string;
    quantity: number;
    unit: 'kg' | 'quintal';
    offerPrice: number;
    requiredDate: string;
    pickupRadiusKm: number;
    notes?: string;
  }) => { success: boolean; requirement: BuyerRequirement; matchCount: number };
  addFarmerListing: (data: {
    cropId: string;
    quantity: number;
    unit: 'kg' | 'quintal';
    location: string;
    availableDate: string;
    notes?: string;
  }) => FarmerListing;
  acceptRequirement: (requirementId: string, farmerId?: string) => Order | null;
  declineRequirement: (requirementId: string) => void;
  advanceOrderStatus: (orderId: string, nextStatus?: OrderStatus) => Order | null;
  completeOrderPayment: (orderId: string) => Order | null;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: (role: 'farmer' | 'buyer') => void;
  resetDemoData: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [crops] = useState<CropMaster[]>(MOCK_CROPS);

  const [farmerListings, setFarmerListings] = useState<FarmerListing[]>(() => {
    const saved = localStorage.getItem('km_farmer_listings');
    return saved ? JSON.parse(saved) : INITIAL_FARMER_LISTINGS;
  });

  const [buyerRequirements, setBuyerRequirements] = useState<BuyerRequirement[]>(() => {
    const saved = localStorage.getItem('km_buyer_requirements');
    return saved ? JSON.parse(saved) : INITIAL_BUYER_REQUIREMENTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('km_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('km_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('km_farmer_listings', JSON.stringify(farmerListings));
  }, [farmerListings]);

  useEffect(() => {
    localStorage.setItem('km_buyer_requirements', JSON.stringify(buyerRequirements));
  }, [buyerRequirements]);

  useEffect(() => {
    localStorage.setItem('km_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('km_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadFarmerNotifCount = notifications.filter(
    (n) => (n.recipientRole === 'farmer' || n.recipientRole === 'all') && !n.isRead
  ).length;

  const unreadBuyerNotifCount = notifications.filter(
    (n) => (n.recipientRole === 'buyer' || n.recipientRole === 'all') && !n.isRead
  ).length;

  // 1. Post a new Buyer Requirement
  const addBuyerRequirement = (data: {
    cropId: string;
    quantity: number;
    unit: 'kg' | 'quintal';
    offerPrice: number;
    requiredDate: string;
    pickupRadiusKm: number;
    notes?: string;
  }) => {
    const crop = crops.find((c) => c.id === data.cropId) || crops[0];
    const totalEst = data.quantity * data.offerPrice;

    // Run matching engine
    const matchResult = findMatchingFarmers(
      {
        cropId: data.cropId,
        quantity: data.quantity,
        pickupRadiusKm: data.pickupRadiusKm,
        requiredDate: data.requiredDate,
      },
      farmerListings
    );

    const matchedFarmerIds = matchResult.matches.map((m) => m.farmerId);

    const newReqId = `req-buyer-${Date.now().toString().slice(-6)}`;
    const newRequirement: BuyerRequirement = {
      id: newReqId,
      buyerId: DEMO_BUYER_FRESHMART.id,
      buyerName: DEMO_BUYER_FRESHMART.name,
      buyerLocation: DEMO_BUYER_FRESHMART.location,
      buyerPhone: DEMO_BUYER_FRESHMART.phone,
      buyerRating: DEMO_BUYER_FRESHMART.rating || 4.8,
      verifiedPurchases: DEMO_BUYER_FRESHMART.completedOrdersCount,
      cropId: crop.id,
      cropName: crop.name,
      cropImage: crop.image,
      quantity: data.quantity,
      unit: data.unit,
      offerPrice: data.offerPrice,
      totalEstimatedValue: totalEst,
      requiredDate: data.requiredDate,
      pickupRadiusKm: data.pickupRadiusKm,
      distanceKm: matchResult.bestMatch?.distanceKm || 15,
      status: matchResult.count > 0 ? 'Farmer Matched' : 'Looking for farmers',
      matchedFarmerIds,
      createdAt: 'Just now',
      notes: data.notes || 'Farm-gate pickup arranged directly by buyer.',
    };

    setBuyerRequirements((prev) => [newRequirement, ...prev]);

    // Send notifications to matched farmers
    if (matchResult.count > 0) {
      const newFarmerNotif: AppNotification = {
        id: `notif-${Date.now()}-farmer`,
        recipientRole: 'farmer',
        recipientId: 'farmer-ramesh-1',
        title: `🔔 New Buyer Requirement: ${crop.name}`,
        message: `${DEMO_BUYER_FRESHMART.name} needs ${data.quantity} ${data.unit} of ${crop.name} at ₹${data.offerPrice}/kg. Tap to accept.`,
        timestamp: 'Just now',
        isRead: false,
        type: 'requirement',
        actionUrl: `/farmer/requirements/${newReqId}`,
        relatedId: newReqId,
      };

      const newBuyerNotif: AppNotification = {
        id: `notif-${Date.now()}-buyer`,
        recipientRole: 'buyer',
        recipientId: DEMO_BUYER_FRESHMART.id,
        title: `🌾 ${matchResult.count} Matching Farmer(s) Found`,
        message: `Your requirement for ${data.quantity} ${data.unit} ${crop.name} matched nearby farmers. Notifications sent!`,
        timestamp: 'Just now',
        isRead: false,
        type: 'requirement',
        actionUrl: `/buyer/requirements/${newReqId}`,
        relatedId: newReqId,
      };

      setNotifications((prev) => [newFarmerNotif, newBuyerNotif, ...prev]);
    } else {
      const newBuyerNotif: AppNotification = {
        id: `notif-${Date.now()}-buyer-active`,
        recipientRole: 'buyer',
        recipientId: DEMO_BUYER_FRESHMART.id,
        title: `📋 Requirement Kept Active`,
        message: `Looking for farmers for ${crop.name}. We will notify you instantly when a matching farmer lists crop.`,
        timestamp: 'Just now',
        isRead: false,
        type: 'requirement',
        actionUrl: `/buyer/requirements/${newReqId}`,
        relatedId: newReqId,
      };
      setNotifications((prev) => [newBuyerNotif, ...prev]);
    }

    return {
      success: true,
      requirement: newRequirement,
      matchCount: matchResult.count,
    };
  };

  // 2. Add a new Farmer Crop Listing
  const addFarmerListing = (data: {
    cropId: string;
    quantity: number;
    unit: 'kg' | 'quintal';
    location: string;
    availableDate: string;
    notes?: string;
  }) => {
    const crop = crops.find((c) => c.id === data.cropId) || crops[0];
    const newListingId = `listing-${Date.now().toString().slice(-6)}`;

    const newListing: FarmerListing = {
      id: newListingId,
      farmerId: DEMO_FARMER_RAMESH.id,
      farmerName: DEMO_FARMER_RAMESH.name,
      farmerVillage: DEMO_FARMER_RAMESH.villageOrBusinessName,
      farmerState: DEMO_FARMER_RAMESH.state,
      farmerPhone: DEMO_FARMER_RAMESH.phone,
      farmerRating: DEMO_FARMER_RAMESH.rating || 4.9,
      cropId: crop.id,
      cropName: crop.name,
      cropImage: crop.image,
      quantity: data.quantity,
      unit: data.unit,
      location: data.location || DEMO_FARMER_RAMESH.location,
      distanceKm: 15,
      availableDate: data.availableDate,
      listedAt: 'Just now',
      status: 'Available',
      notes: data.notes,
    };

    setFarmerListings((prev) => [newListing, ...prev]);

    // Check if any active buyer requirements match this newly listed crop
    const matchingReq = buyerRequirements.find(
      (r) => r.cropId.toLowerCase() === crop.id.toLowerCase() && r.status !== 'Completed'
    );

    if (matchingReq) {
      const notif: AppNotification = {
        id: `notif-${Date.now()}-farmer-matched`,
        recipientRole: 'farmer',
        recipientId: DEMO_FARMER_RAMESH.id,
        title: `✨ Instant Buyer Match for ${crop.name}!`,
        message: `${matchingReq.buyerName} has an active requirement for ${matchingReq.quantity} kg ${crop.name} at ₹${matchingReq.offerPrice}/kg.`,
        timestamp: 'Just now',
        isRead: false,
        type: 'requirement',
        actionUrl: `/farmer/requirements/${matchingReq.id}`,
        relatedId: matchingReq.id,
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    return newListing;
  };

  // 3. Farmer Accepts Requirement -> Generates Order
  const acceptRequirement = (requirementId: string) => {
    const req = buyerRequirements.find((r) => r.id === requirementId);
    if (!req) return null;

    // Update requirement status
    setBuyerRequirements((prev) =>
      prev.map((r) => (r.id === requirementId ? { ...r, status: 'Accepted' } : r))
    );

    const totalAmt = req.quantity * req.offerPrice;
    const orderId = `ORD-2025-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      requirementId: req.id,
      cropId: req.cropId,
      cropName: req.cropName,
      cropImage: req.cropImage,
      quantity: req.quantity,
      unit: req.unit,
      agreedPricePerKg: req.offerPrice,
      totalAmount: totalAmt,
      farmerId: DEMO_FARMER_RAMESH.id,
      farmerName: DEMO_FARMER_RAMESH.name,
      farmerVillage: DEMO_FARMER_RAMESH.villageOrBusinessName,
      farmerPhone: DEMO_FARMER_RAMESH.phone,
      farmerLocation: DEMO_FARMER_RAMESH.location,
      buyerId: req.buyerId,
      buyerName: req.buyerName,
      buyerPhone: req.buyerPhone,
      buyerLocation: req.buyerLocation,
      buyerRating: req.buyerRating,
      distanceKm: req.distanceKm || 15,
      status: 'accepted',
      createdAt: 'Just now',
      pickupDetails: {
        scheduledDate: '21 May 2025',
        scheduledTimeWindow: '10:00 AM - 12:00 PM',
        driverName: 'Somanna Gowda',
        driverPhone: '+91 98440 12345',
        vehicleNumber: 'KA-06-B-4412 (Tata 407)',
        transportStatus: 'Pickup Scheduled',
        pickupAddress: `${DEMO_FARMER_RAMESH.name} Farm, ${DEMO_FARMER_RAMESH.location}`,
      },
      paymentDetails: {
        status: 'Pending',
        method: 'Direct Farm-Gate UPI / Bank Transfer',
        amount: totalAmt,
        breakdown: {
          quantity: req.quantity,
          unit: req.unit,
          ratePerKg: req.offerPrice,
          totalAmount: totalAmt,
          platformFee: 0,
          netPayoutToFarmer: totalAmt,
        },
      },
      timeline: [
        {
          status: 'posted',
          label: 'Requirement Posted',
          description: `${req.buyerName} posted requirement for ${req.quantity} ${req.unit} at ₹${req.offerPrice}/kg`,
          timestamp: req.createdAt,
          completed: true,
          current: false,
        },
        {
          status: 'matched',
          label: 'Farmer Matched',
          description: `System matched ${DEMO_FARMER_RAMESH.name} (${req.distanceKm || 15} km away)`,
          timestamp: 'Matched',
          completed: true,
          current: false,
        },
        {
          status: 'accepted',
          label: 'Farmer Accepted',
          description: `${DEMO_FARMER_RAMESH.name} accepted the requirement. Order Confirmed!`,
          timestamp: 'Just now',
          completed: true,
          current: true,
        },
        {
          status: 'pickup_scheduled',
          label: 'Pickup Scheduled',
          description: 'Vehicle KA-06-B-4412 assigned. Pickup window 10:00 AM - 12:00 PM',
          timestamp: 'Pending dispatch',
          completed: false,
          current: false,
        },
        {
          status: 'crop_picked_up',
          label: 'Crop Picked Up',
          description: 'Farm-gate weighing and quality handover',
          timestamp: 'Pending pickup',
          completed: false,
          current: false,
        },
        {
          status: 'payment_completed',
          label: 'Payment Completed',
          description: `₹${totalAmt.toLocaleString('en-IN')} instant bank settlement to farmer`,
          timestamp: 'Pending collection',
          completed: false,
          current: false,
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Send notifications to both
    const farmerNotif: AppNotification = {
      id: `notif-order-farmer-${Date.now()}`,
      recipientRole: 'farmer',
      recipientId: DEMO_FARMER_RAMESH.id,
      title: '🎉 Order Confirmed ✓',
      message: `Order #${orderId} for ${req.quantity} ${req.unit} ${req.cropName} is confirmed! Pickup scheduled for 21 May 2025.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'order',
      actionUrl: `/farmer/orders/${orderId}`,
      relatedId: orderId,
    };

    const buyerNotif: AppNotification = {
      id: `notif-order-buyer-${Date.now()}`,
      recipientRole: 'buyer',
      recipientId: req.buyerId,
      title: '✅ Farmer Accepted Your Requirement!',
      message: `${DEMO_FARMER_RAMESH.name} accepted your requirement for ${req.quantity} ${req.unit} ${req.cropName}. Order #${orderId} created.`,
      timestamp: 'Just now',
      isRead: false,
      type: 'order',
      actionUrl: `/buyer/orders/${orderId}`,
      relatedId: orderId,
    };

    setNotifications((prev) => [farmerNotif, buyerNotif, ...prev]);
    return newOrder;
  };

  // 4. Decline Requirement
  const declineRequirement = (requirementId: string) => {
    setBuyerRequirements((prev) =>
      prev.map((r) =>
        r.id === requirementId
          ? {
              ...r,
              matchedFarmerIds: r.matchedFarmerIds.filter((id) => id !== DEMO_FARMER_RAMESH.id),
            }
          : r
      )
    );
  };

  // 5. Advance Order Lifecycle (6-stage timeline)
  const advanceOrderStatus = (orderId: string, nextStatus?: OrderStatus) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order) return null;

    const stages: OrderStatus[] = [
      'posted',
      'matched',
      'accepted',
      'pickup_scheduled',
      'crop_picked_up',
      'payment_completed',
    ];

    let targetStatus: OrderStatus = nextStatus || 'pickup_scheduled';
    if (!nextStatus) {
      const currentIndex = stages.indexOf(order.status);
      if (currentIndex < stages.length - 1) {
        targetStatus = stages[currentIndex + 1];
      }
    }

    const updatedTimeline = order.timeline.map((item) => {
      const itemIndex = stages.indexOf(item.status);
      const targetIndex = stages.indexOf(targetStatus);
      return {
        ...item,
        completed: itemIndex <= targetIndex,
        current: itemIndex === targetIndex,
        timestamp: itemIndex === targetIndex ? 'Just now' : item.timestamp,
      };
    });

    let updatedPickup = { ...order.pickupDetails };
    let updatedPayment = { ...order.paymentDetails };

    if (targetStatus === 'pickup_scheduled') {
      updatedPickup.transportStatus = 'Driver Assigned';
    } else if (targetStatus === 'crop_picked_up') {
      updatedPickup.transportStatus = 'Picked Up';
    } else if (targetStatus === 'payment_completed') {
      updatedPayment.status = 'Payment Completed';
      updatedPayment.transactionId = `UPI-KM-${Date.now().toString().slice(-8)}`;
      updatedPayment.completedAt = 'Today, Just now';
    }

    const updatedOrder: Order = {
      ...order,
      status: targetStatus,
      pickupDetails: updatedPickup,
      paymentDetails: updatedPayment,
      timeline: updatedTimeline,
    };

    setOrders((prev) => prev.map((o) => (o.id === orderId ? updatedOrder : o)));

    // Send notifications based on step
    let notifTitle = '';
    let notifMsg = '';

    if (targetStatus === 'pickup_scheduled') {
      notifTitle = '🚚 Pickup Vehicle Dispatched';
      notifMsg = `Driver ${updatedOrder.pickupDetails.driverName} (${updatedOrder.pickupDetails.vehicleNumber}) is scheduled to arrive at farm gate.`;
    } else if (targetStatus === 'crop_picked_up') {
      notifTitle = '⚖️ Crop Weighed & Picked Up';
      notifMsg = `${updatedOrder.quantity} ${updatedOrder.unit} ${updatedOrder.cropName} verified and loaded at farm gate.`;
    } else if (targetStatus === 'payment_completed') {
      notifTitle = '💰 Direct Payment Settled ✓';
      notifMsg = `₹${updatedOrder.totalAmount.toLocaleString('en-IN')} credited directly to Ramesh Patil's bank account via UPI.`;
    }

    if (notifTitle) {
      const notif: AppNotification = {
        id: `notif-status-${Date.now()}`,
        recipientRole: 'all',
        title: notifTitle,
        message: notifMsg,
        timestamp: 'Just now',
        isRead: false,
        type: targetStatus === 'payment_completed' ? 'payment' : 'pickup',
        actionUrl: `/farmer/orders/${orderId}`,
        relatedId: orderId,
      };
      setNotifications((prev) => [notif, ...prev]);
    }

    return updatedOrder;
  };

  // 6. Complete Order Payment directly
  const completeOrderPayment = (orderId: string) => {
    return advanceOrderStatus(orderId, 'payment_completed');
  };

  // 7. Notification actions
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = (role: 'farmer' | 'buyer') => {
    setNotifications((prev) =>
      prev.map((n) => (n.recipientRole === role || n.recipientRole === 'all' ? { ...n, isRead: true } : n))
    );
  };

  // 8. Reset Demo Data
  const resetDemoData = () => {
    setFarmerListings(INITIAL_FARMER_LISTINGS);
    setBuyerRequirements(INITIAL_BUYER_REQUIREMENTS);
    setOrders(INITIAL_ORDERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.removeItem('km_farmer_listings');
    localStorage.removeItem('km_buyer_requirements');
    localStorage.removeItem('km_orders');
    localStorage.removeItem('km_notifications');
  };

  const value = {
    crops,
    farmerListings,
    buyerRequirements,
    orders,
    notifications,
    unreadFarmerNotifCount,
    unreadBuyerNotifCount,
    addBuyerRequirement,
    addFarmerListing,
    acceptRequirement,
    declineRequirement,
    advanceOrderStatus,
    completeOrderPayment,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    resetDemoData,
  };

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = (): AppStateContextType => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
