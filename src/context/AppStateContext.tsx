import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from 'react';

import {
  CropMaster,
  FarmerListing,
  BuyerRequirement,
  Order,
  AppNotification,
  OrderStatus,
} from '../types';

import { MOCK_CROPS } from '../data/mockCrops';
import { INITIAL_NOTIFICATIONS } from '../data/mockNotifications';

import {
  getFarmerListings,
  createFarmerListing,
} from '../services/farmerListings';

import {
  getBuyerRequirements,
  createBuyerRequirement,
  acceptBuyerRequirement,
  declineBuyerRequirement,
} from '../services/buyerRequirements';

import {
  getOrders,
  createOrder,
  updateOrderStatus,
  payOrder,
} from '../services/orders';
import {
  getNotifications,
  createNotification,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/notifications';

import { findMatchingFarmers } from '../services/matchingEngine';

import {
  DEMO_FARMER_RAMESH,
  DEMO_BUYER_FRESHMART,
} from '../data/mockUsers';


/*
 * ============================================================
 * APP STATE CONTEXT TYPE
 * ============================================================
 */

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
  }) => Promise<{
    success: boolean;
    requirement: BuyerRequirement;
    matchCount: number;
  }>;

  addFarmerListing: (data: {
    cropId: string;
    quantity: number;
    unit: 'kg' | 'quintal';
    location: string;
    availableDate: string;
    notes?: string;
  }) => Promise<FarmerListing>;

  acceptRequirement: (
    requirementId: string,
    farmerId?: string
  ) => Promise<Order | null>;

  declineRequirement: (
    requirementId: string,
    farmerId?: string
  ) => Promise<void>;

  advanceOrderStatus: (
    orderId: string,
    nextStatus?: OrderStatus
  ) => Promise<Order | null>;

  completeOrderPayment: (
    orderId: string
  ) => Promise<Order | null>;

  markNotificationAsRead: (
    notificationId: string
  ) => void;

  markAllNotificationsAsRead: (
    role: 'farmer' | 'buyer'
  ) => void;

  resetDemoData: () => void;
}


/*
 * ============================================================
 * CREATE CONTEXT
 * ============================================================
 */

const AppStateContext =
  createContext<AppStateContextType | undefined>(undefined);


/*
 * ============================================================
 * APP STATE PROVIDER
 * ============================================================
 */

export const AppStateProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {


  /*
   * ============================================================
   * 1. CROPS
   * ============================================================
   *
   * Crop master data is still using mockCrops.ts.
   *
   * We can migrate crops to MongoDB later.
   */

  const [crops] =
    useState<CropMaster[]>(MOCK_CROPS);


  /*
   * ============================================================
   * 2. FARMER LISTINGS
   * ============================================================
   *
   * Farmer listings come from MongoDB.
   */

  const [farmerListings, setFarmerListings] =
    useState<FarmerListing[]>([]);

  const [listingsLoading, setListingsLoading] =
    useState(true);

  const [listingsError, setListingsError] =
    useState<string | null>(null);


  /*
   * Load farmer listings from backend
   */

  useEffect(() => {

    const loadFarmerListings = async () => {

      try {

        setListingsLoading(true);

        setListingsError(null);

        const listings =
          await getFarmerListings();

        setFarmerListings(listings);

      } catch (error) {

        console.error(
          'Failed to load farmer listings:',
          error
        );

        setListingsError(
          error instanceof Error
            ? error.message
            : 'Failed to load farmer listings'
        );

      } finally {

        setListingsLoading(false);

      }

    };

    loadFarmerListings();

  }, []);


  /*
   * ============================================================
   * 3. BUYER REQUIREMENTS
   * ============================================================
   *
   * Buyer requirements come from MongoDB.
   *
   * IMPORTANT:
   *
   * There is NO:
   *
   * INITIAL_BUYER_REQUIREMENTS
   *
   * and NO localStorage initialization.
   */

  const [buyerRequirements, setBuyerRequirements] =
    useState<BuyerRequirement[]>([]);

  const [requirementsLoading, setRequirementsLoading] =
    useState(true);

  const [requirementsError, setRequirementsError] =
    useState<string | null>(null);


  /*
   * Load buyer requirements from backend
   */

  useEffect(() => {

    const loadBuyerRequirements = async () => {

      try {

        setRequirementsLoading(true);

        setRequirementsError(null);

        const requirements =
          await getBuyerRequirements();

        setBuyerRequirements(requirements);

      } catch (error) {

        console.error(
          'Failed to load buyer requirements:',
          error
        );

        setRequirementsError(
          error instanceof Error
            ? error.message
            : 'Failed to load buyer requirements'
        );

      } finally {

        setRequirementsLoading(false);

      }

    };

    loadBuyerRequirements();

  }, []);


  /*
   * ============================================================
   * 4. ORDERS
   * ============================================================
   *
   * Orders now come from MongoDB.
   */

  const [orders, setOrders] =
    useState<Order[]>([]);

  const [ordersLoading, setOrdersLoading] =
    useState(true);

  const [ordersError, setOrdersError] =
    useState<string | null>(null);


  /*
   * Load orders from backend
   */

  useEffect(() => {

    const loadOrders = async () => {

      try {

        setOrdersLoading(true);

        setOrdersError(null);

        const backendOrders =
          await getOrders();

        setOrders(backendOrders);

      } catch (error) {

        console.error(
          'Failed to load orders:',
          error
        );

        setOrdersError(
          error instanceof Error
            ? error.message
            : 'Failed to load orders'
        );

      } finally {

        setOrdersLoading(false);

      }

    };

    loadOrders();

  }, []);


  /*
   * ============================================================
   * 5. NOTIFICATIONS
   * ============================================================
   *
   * Notifications are still local for now.
   */

const [notifications, setNotifications] =
  useState<AppNotification[]>([]);

const [notificationsLoading, setNotificationsLoading] =
  useState(true);

const [notificationsError, setNotificationsError] =
  useState<string | null>(null);

  /*
 * ============================================================
 * LOAD NOTIFICATIONS FROM BACKEND
 * ============================================================
 */

useEffect(() => {

  const loadNotifications = async () => {

    try {

      setNotificationsLoading(true);

      setNotificationsError(null);

      const backendNotifications =
        await getNotifications();

      setNotifications(
        backendNotifications
      );

    } catch (error) {

      console.error(
        'Failed to load notifications:',
        error
      );

      setNotificationsError(
        error instanceof Error
          ? error.message
          : 'Failed to load notifications'
      );

    } finally {

      setNotificationsLoading(false);

    }

  };

  loadNotifications();

}, []);

  /*
   * ============================================================
   * 7. NOTIFICATION COUNTERS
   * ============================================================
   */

  const unreadFarmerNotifCount =
    notifications.filter(
      (n) =>
        (
          n.recipientRole === 'farmer' ||
          n.recipientRole === 'all'
        ) &&
        !n.isRead
    ).length;


  const unreadBuyerNotifCount =
    notifications.filter(
      (n) =>
        (
          n.recipientRole === 'buyer' ||
          n.recipientRole === 'all'
        ) &&
        !n.isRead
    ).length;


  /*
   * ============================================================
   * 8. ADD BUYER REQUIREMENT
   * ============================================================
   *
   * React
   *   ↓
   * buyerRequirements service
   *   ↓
   * Express API
   *   ↓
   * MongoDB
   */

  const addBuyerRequirement = async (data: {
    cropId: string;
    quantity: number;
    unit: 'kg' | 'quintal';
    offerPrice: number;
    requiredDate: string;
    pickupRadiusKm: number;
    notes?: string;
  }) => {

    const crop =
      crops.find(
        (c) => c.id === data.cropId
      ) || crops[0];


    const totalEst =
      data.quantity *
      data.offerPrice;


    /*
     * Match requirement with farmer listings
     */

    const matchResult =
      findMatchingFarmers(
        {
          cropId: data.cropId,

          quantity:
            data.quantity,

          pickupRadiusKm:
            data.pickupRadiusKm,

          requiredDate:
            data.requiredDate,
        },

        farmerListings
      );


    const matchedFarmerIds =
      matchResult.matches.map(
        (m) => m.farmerId
      );


    /*
     * Temporary frontend ID.
     */

    const newReqId =
      `req-buyer-${Date.now()
        .toString()
        .slice(-6)}`;


    /*
     * Build requirement
     */

    const requirementData: BuyerRequirement = {

      id:
        newReqId,

      buyerId:
        DEMO_BUYER_FRESHMART.id,

      buyerName:
        DEMO_BUYER_FRESHMART.name,

      buyerLocation:
        DEMO_BUYER_FRESHMART.location,

      buyerPhone:
        DEMO_BUYER_FRESHMART.phone,

      buyerRating:
        DEMO_BUYER_FRESHMART.rating || 4.8,

      verifiedPurchases:
        DEMO_BUYER_FRESHMART.completedOrdersCount,

      cropId:
        crop.id,

      cropName:
        crop.name,

      cropImage:
        crop.image,

      quantity:
        data.quantity,

      unit:
        data.unit,

      offerPrice:
        data.offerPrice,

      totalEstimatedValue:
        totalEst,

      requiredDate:
        data.requiredDate,

      pickupRadiusKm:
        data.pickupRadiusKm,

      distanceKm:
        matchResult.bestMatch?.distanceKm || 15,

      status:
        matchResult.count > 0
          ? 'Farmer Matched'
          : 'Looking for farmers',

      matchedFarmerIds,

      createdAt:
        'Just now',

      notes:
        data.notes ||
        'Farm-gate pickup arranged directly by buyer.',
    };


    /*
     * SAVE REQUIREMENT TO MONGODB
     */

    try {

      const savedRequirement =
        await createBuyerRequirement(
          requirementData
        );


      /*
       * Update React state
       * using backend response.
       */

      setBuyerRequirements(
        (prev) => [
          savedRequirement,
          ...prev,
        ]
      );


      /*
       * ========================================================
       * NOTIFICATIONS
       * ========================================================
       */

      if (matchResult.count > 0) {

        const newFarmerNotif:
          AppNotification = {

          id:
            `notif-${Date.now()}-farmer`,

          recipientRole:
            'farmer',

          recipientId:
            matchedFarmerIds[0] ||
            DEMO_FARMER_RAMESH.id,

          title:
            `🔔 New Buyer Requirement: ${crop.name}`,

          message:
            `${DEMO_BUYER_FRESHMART.name} needs ${data.quantity} ${data.unit} of ${crop.name} at ₹${data.offerPrice}/kg. Tap to accept.`,

          timestamp:
            'Just now',

          isRead:
            false,

          type:
            'requirement',

          actionUrl:
            `/farmer/requirements/${savedRequirement.id}`,

          relatedId:
            savedRequirement.id,
        };


        const newBuyerNotif:
          AppNotification = {

          id:
            `notif-${Date.now()}-buyer`,

          recipientRole:
            'buyer',

          recipientId:
            DEMO_BUYER_FRESHMART.id,

          title:
            `🌾 ${matchResult.count} Matching Farmer(s) Found`,

          message:
            `Your requirement for ${data.quantity} ${data.unit} ${crop.name} matched nearby farmers. Notifications sent!`,

          timestamp:
            'Just now',

          isRead:
            false,

          type:
            'requirement',

          actionUrl:
            `/buyer/requirements/${savedRequirement.id}`,

          relatedId:
            savedRequirement.id,
        };


        setNotifications(
          (prev) => [
            newFarmerNotif,
            newBuyerNotif,
            ...prev,
          ]
        );


      } else {

        const newBuyerNotif:
          AppNotification = {

          id:
            `notif-${Date.now()}-buyer-active`,

          recipientRole:
            'buyer',

          recipientId:
            DEMO_BUYER_FRESHMART.id,

          title:
            `📋 Requirement Kept Active`,

          message:
            `Looking for farmers for ${crop.name}. We will notify you instantly when a matching farmer lists crop.`,

          timestamp:
            'Just now',

          isRead:
            false,

          type:
            'requirement',

          actionUrl:
            `/buyer/requirements/${savedRequirement.id}`,

          relatedId:
            savedRequirement.id,
        };


        setNotifications(
          (prev) => [
            newBuyerNotif,
            ...prev,
          ]
        );

      }


      return {

        success:
          true,

        requirement:
          savedRequirement,

        matchCount:
          matchResult.count,

      };

    } catch (error) {

      console.error(
        'Failed to create buyer requirement:',
        error
      );

      throw error;

    }

  };


  /*
   * ============================================================
   * 9. ADD FARMER LISTING
   * ============================================================
   */

  const addFarmerListing = async (data: {
    cropId: string;
    quantity: number;
    unit: 'kg' | 'quintal';
    location: string;
    availableDate: string;
    notes?: string;
  }): Promise<FarmerListing> => {

    const crop =
      crops.find(
        (c) => c.id === data.cropId
      ) || crops[0];


    /*
     * Create listing in MongoDB
     */

    const newListing =
      await createFarmerListing({

        cropId:
          crop.id,

        cropName:
          crop.name,

        cropImage:
          crop.image,

        quantity:
          data.quantity,

        unit:
          data.unit,

        location:
          data.location,

        availableDate:
          data.availableDate,

        notes:
          data.notes,

      });


    /*
     * Add backend response to React state
     */

    setFarmerListings(
      (prev) => [
        newListing,
        ...prev,
      ]
    );


    /*
     * Check active buyer requirements
     */

    const matchingReq =
      buyerRequirements.find(
        (r) =>
          r.cropId.toLowerCase() ===
            crop.id.toLowerCase() &&
          r.status !== 'Completed'
      );


    if (matchingReq) {

      const notif:
        AppNotification = {

        id:
          `notif-${Date.now()}-farmer-matched`,

        recipientRole:
          'farmer',

        recipientId:
          DEMO_FARMER_RAMESH.id,

        title:
          `✨ Instant Buyer Match for ${crop.name}!`,

        message:
          `${matchingReq.buyerName} has an active requirement for ${matchingReq.quantity} kg ${crop.name} at ₹${matchingReq.offerPrice}/kg.`,

        timestamp:
          'Just now',

        isRead:
          false,

        type:
          'requirement',

        actionUrl:
          `/farmer/requirements/${matchingReq.id}`,

        relatedId:
          matchingReq.id,
      };


      setNotifications(
        (prev) => [
          notif,
          ...prev,
        ]
      );

    }


    return newListing;

  };


  /*
   * ============================================================
   * 10. FARMER ACCEPTS REQUIREMENT
   * ============================================================
   *
   * NOW CONNECTED TO BACKEND.
   *
   * React
   *   ↓
   * acceptBuyerRequirement()
   *   ↓
   * Express
   *   ↓
   * MongoDB
   *
   * Then:
   *
   * React
   *   ↓
   * createOrder()
   *   ↓
   * Express
   *   ↓
   * MongoDB
   */

  const acceptRequirement = async (
    requirementId: string,
    farmerId: string = DEMO_FARMER_RAMESH.id
  ): Promise<Order | null> => {

    const req =
      buyerRequirements.find(
        (r) => r.id === requirementId
      );


    if (!req) {

      console.error(
        'Requirement not found:',
        requirementId
      );

      return null;

    }


    try {

      /*
       * --------------------------------------------------------
       * STEP 1: ACCEPT REQUIREMENT IN BACKEND
       * --------------------------------------------------------
       */

      const updatedRequirement =
        await acceptBuyerRequirement(
          requirementId,
          farmerId
        );


      /*
       * Update requirement state
       */

      setBuyerRequirements(
        (prev) =>
          prev.map(
            (r) =>
              r.id === requirementId
                ? updatedRequirement
                : r
          )
      );


      /*
       * --------------------------------------------------------
       * STEP 2: CALCULATE ORDER
       * --------------------------------------------------------
       */

      const totalAmt =
        req.quantity *
        req.offerPrice;


      /*
       * Temporary frontend order ID.
       * Backend may return its own ID.
       */

      const orderId =
        `ORD-${Date.now()}`;


      /*
       * --------------------------------------------------------
       * STEP 3: BUILD ORDER
       * --------------------------------------------------------
       */

      const newOrder: Order = {

        id:
          orderId,

        requirementId:
          req.id,

        cropId:
          req.cropId,

        cropName:
          req.cropName,

        cropImage:
          req.cropImage,

        quantity:
          req.quantity,

        unit:
          req.unit,

        agreedPricePerKg:
          req.offerPrice,

        totalAmount:
          totalAmt,

        farmerId:
          farmerId,

        farmerName:
          DEMO_FARMER_RAMESH.name,

        farmerVillage:
          DEMO_FARMER_RAMESH.villageOrBusinessName,

        farmerPhone:
          DEMO_FARMER_RAMESH.phone,

        farmerLocation:
          DEMO_FARMER_RAMESH.location,

        buyerId:
          req.buyerId,

        buyerName:
          req.buyerName,

        buyerPhone:
          req.buyerPhone,

        buyerLocation:
          req.buyerLocation,

        buyerRating:
          req.buyerRating,

        distanceKm:
          req.distanceKm || 15,

        status:
          'accepted',

        createdAt:
          'Just now',

        pickupDetails: {

          scheduledDate:
            '21 May 2025',

          scheduledTimeWindow:
            '10:00 AM - 12:00 PM',

          driverName:
            'Somanna Gowda',

          driverPhone:
            '+91 98440 12345',

          vehicleNumber:
            'KA-06-B-4412 (Tata 407)',

          transportStatus:
            'Pickup Scheduled',

          pickupAddress:
            `${DEMO_FARMER_RAMESH.name} Farm, ${DEMO_FARMER_RAMESH.location}`,

        },

        paymentDetails: {

          status:
            'Pending',

          method:
            'Direct Farm-Gate UPI / Bank Transfer',

          amount:
            totalAmt,

          breakdown: {

            quantity:
              req.quantity,

            unit:
              req.unit,

            ratePerKg:
              req.offerPrice,

            totalAmount:
              totalAmt,

            platformFee:
              0,

            netPayoutToFarmer:
              totalAmt,

          },

        },

        timeline: [

          {

            status:
              'posted',

            label:
              'Requirement Posted',

            description:
              `${req.buyerName} posted requirement for ${req.quantity} ${req.unit} at ₹${req.offerPrice}/kg`,

            timestamp:
              req.createdAt,

            completed:
              true,

            current:
              false,

          },

          {

            status:
              'matched',

            label:
              'Farmer Matched',

            description:
              `System matched ${DEMO_FARMER_RAMESH.name} (${req.distanceKm || 15} km away)`,

            timestamp:
              'Matched',

            completed:
              true,

            current:
              false,

          },

          {

            status:
              'accepted',

            label:
              'Farmer Accepted',

            description:
              `${DEMO_FARMER_RAMESH.name} accepted the requirement. Order Confirmed!`,

            timestamp:
              'Just now',

            completed:
              true,

            current:
              true,

          },

          {

            status:
              'pickup_scheduled',

            label:
              'Pickup Scheduled',

            description:
              'Vehicle KA-06-B-4412 assigned. Pickup window 10:00 AM - 12:00 PM',

            timestamp:
              'Pending dispatch',

            completed:
              false,

            current:
              false,

          },

          {

            status:
              'crop_picked_up',

            label:
              'Crop Picked Up',

            description:
              'Farm-gate weighing and quality handover',

            timestamp:
              'Pending pickup',

            completed:
              false,

            current:
              false,

          },

          {

            status:
              'payment_completed',

            label:
              'Payment Completed',

            description:
              `₹${totalAmt.toLocaleString('en-IN')} instant bank settlement to farmer`,

            timestamp:
              'Pending collection',

            completed:
              false,

            current:
              false,

          },

        ],

      };


      /*
       * --------------------------------------------------------
       * STEP 4: SAVE ORDER TO MONGODB
       * --------------------------------------------------------
       */

      const savedOrder =
        await createOrder(newOrder);


      /*
       * Add BACKEND order to React state.
       */

      setOrders(
        (prev) => [
          savedOrder,
          ...prev,
        ]
      );


      /*
       * --------------------------------------------------------
       * STEP 5: NOTIFICATIONS
       * --------------------------------------------------------
       */

      const farmerNotif:
        AppNotification = {

        id:
          `notif-order-farmer-${Date.now()}`,

        recipientRole:
          'farmer',

        recipientId:
          farmerId,

        title:
          '🎉 Order Confirmed ✓',

        message:
          `Order #${savedOrder.id} for ${req.quantity} ${req.unit} ${req.cropName} is confirmed! Pickup scheduled for 21 May 2025.`,

        timestamp:
          'Just now',

        isRead:
          false,

        type:
          'order',

        actionUrl:
          `/farmer/orders/${savedOrder.id}`,

        relatedId:
          savedOrder.id,

      };


      const buyerNotif:
        AppNotification = {

        id:
          `notif-order-buyer-${Date.now()}`,

        recipientRole:
          'buyer',

        recipientId:
          req.buyerId,

        title:
          '✅ Farmer Accepted Your Requirement!',

        message:
          `${DEMO_FARMER_RAMESH.name} accepted your requirement for ${req.quantity} ${req.unit} ${req.cropName}. Order #${savedOrder.id} created.`,

        timestamp:
          'Just now',

        isRead:
          false,

        type:
          'order',

        actionUrl:
          `/buyer/orders/${savedOrder.id}`,

        relatedId:
          savedOrder.id,

      };


      setNotifications(
        (prev) => [
          farmerNotif,
          buyerNotif,
          ...prev,
        ]
      );


      return savedOrder;


    } catch (error) {

      console.error(
        'Failed to accept requirement:',
        error
      );

      /*
       * Do not create a fake local order
       * when the backend operation fails.
       */

      return null;

    }

  };


  /*
   * ============================================================
   * 11. DECLINE REQUIREMENT
   * ============================================================
   *
   * NOW CONNECTED TO BACKEND.
   */

  const declineRequirement = async (
    requirementId: string,
    farmerId: string = DEMO_FARMER_RAMESH.id
  ): Promise<void> => {

    try {

      const updatedRequirement =
        await declineBuyerRequirement(
          requirementId,
          farmerId
        );


      /*
       * Update React state with backend response.
       */

      setBuyerRequirements(
        (prev) =>
          prev.map(
            (r) =>
              r.id === requirementId
                ? updatedRequirement
                : r
          )
      );


    } catch (error) {

      console.error(
        'Failed to decline requirement:',
        error
      );

    }

  };


  /*
   * ============================================================
   * 12. ADVANCE ORDER STATUS
   * ============================================================
   *
   * Order status is now persisted in MongoDB.
   */

  const advanceOrderStatus = async (
    orderId: string,
    nextStatus?: OrderStatus
  ): Promise<Order | null> => {

    const order =
      orders.find(
        (o) => o.id === orderId
      );


    if (!order) {

      console.error(
        'Order not found:',
        orderId
      );

      return null;

    }


    const stages: OrderStatus[] = [

      'posted',

      'matched',

      'accepted',

      'pickup_scheduled',

      'crop_picked_up',

      'payment_completed',

    ];


    let targetStatus:
      OrderStatus =
        nextStatus ||
        'pickup_scheduled';


    /*
     * Automatically move to next stage
     */

    if (!nextStatus) {

      const currentIndex =
        stages.indexOf(
          order.status
        );


      if (
        currentIndex >= 0 &&
        currentIndex <
          stages.length - 1
      ) {

        targetStatus =
          stages[
            currentIndex + 1
          ];

      }

    }


    /*
     * Update timeline locally
     */

    const updatedTimeline =
      order.timeline.map(
        (item) => {

          const itemIndex =
            stages.indexOf(
              item.status
            );

          const targetIndex =
            stages.indexOf(
              targetStatus
            );


          return {

            ...item,

            completed:
              itemIndex <=
              targetIndex,

            current:
              itemIndex ===
              targetIndex,

            timestamp:
              itemIndex ===
              targetIndex
                ? 'Just now'
                : item.timestamp,

          };

        }
      );


    /*
     * Update pickup information
     */

    let updatedPickup = {
      ...order.pickupDetails,
    };


    /*
     * Update payment information
     */

    let updatedPayment = {
      ...order.paymentDetails,
    };


    if (
      targetStatus ===
      'pickup_scheduled'
    ) {

      updatedPickup.transportStatus =
        'Driver Assigned';

    }


    else if (
      targetStatus ===
      'crop_picked_up'
    ) {

      updatedPickup.transportStatus =
        'Picked Up';

    }


    else if (
      targetStatus ===
      'payment_completed'
    ) {

      updatedPayment.status =
        'Payment Completed';

      updatedPayment.transactionId =
        `UPI-KM-${Date.now()
          .toString()
          .slice(-8)}`;

      updatedPayment.completedAt =
        'Today, Just now';

    }


    /*
     * Build updated order for UI.
     */

    const updatedOrder: Order = {

      ...order,

      status:
        targetStatus,

      pickupDetails:
        updatedPickup,

      paymentDetails:
        updatedPayment,

      timeline:
        updatedTimeline,

    };


    try {

      /*
       * --------------------------------------------------------
       * SAVE STATUS TO MONGODB
       * --------------------------------------------------------
       */

      const savedOrder =
        await updateOrderStatus(
          orderId,
          targetStatus
        );


      /*
       * Update React state with
       * backend response.
       */

      setOrders(
        (prev) =>
          prev.map(
            (o) =>
              o.id === orderId
                ? savedOrder
                : o
          )
      );


      /*
       * --------------------------------------------------------
       * NOTIFICATION
       * --------------------------------------------------------
       */

      let notifTitle = '';

      let notifMsg = '';


      if (
        targetStatus ===
        'pickup_scheduled'
      ) {

        notifTitle =
          '🚚 Pickup Vehicle Dispatched';

        notifMsg =
          `Driver ${updatedOrder.pickupDetails.driverName} (${updatedOrder.pickupDetails.vehicleNumber}) is scheduled to arrive at farm gate.`;

      }


      else if (
        targetStatus ===
        'crop_picked_up'
      ) {

        notifTitle =
          '⚖️ Crop Weighed & Picked Up';

        notifMsg =
          `${updatedOrder.quantity} ${updatedOrder.unit} ${updatedOrder.cropName} verified and loaded at farm gate.`;

      }


      else if (
        targetStatus ===
        'payment_completed'
      ) {

        notifTitle =
          '💰 Direct Payment Settled ✓';

        notifMsg =
          `₹${updatedOrder.totalAmount.toLocaleString('en-IN')} credited directly to the farmer's bank account via UPI.`;

      }


      if (notifTitle) {

        const notif:
          AppNotification = {

          id:
            `notif-status-${Date.now()}`,

          recipientRole:
            'all',

          title:
            notifTitle,

          message:
            notifMsg,

          timestamp:
            'Just now',

          isRead:
            false,

          type:
            targetStatus ===
            'payment_completed'
              ? 'payment'
              : 'pickup',

          actionUrl:
            `/farmer/orders/${orderId}`,

          relatedId:
            orderId,

        };


        setNotifications(
          (prev) => [
            notif,
            ...prev,
          ]
        );

      }


      return savedOrder;


    } catch (error) {

      console.error(
        'Failed to update order status:',
        error
      );

      return null;

    }

  };


  /*
   * ============================================================
   * 13. COMPLETE ORDER PAYMENT
   * ============================================================
   *
   * Payment is persisted through the backend.
   */

  const completeOrderPayment = async (
    orderId: string
  ): Promise<Order | null> => {

    try {

      const updatedOrder =
        await payOrder(orderId);


      /*
       * Update React state
       * with backend response.
       */

      setOrders(
        (prev) =>
          prev.map(
            (order) =>
              order.id === orderId
                ? updatedOrder
                : order
          )
      );


      /*
       * Payment notification
       */

      const notif:
        AppNotification = {

        id:
          `notif-payment-${Date.now()}`,

        recipientRole:
          'all',

        title:
          '💰 Payment Completed ✓',

        message:
          `₹${updatedOrder.totalAmount.toLocaleString('en-IN')} payment completed successfully.`,

        timestamp:
          'Just now',

        isRead:
          false,

        type:
          'payment',

        actionUrl:
          `/farmer/orders/${orderId}`,

        relatedId:
          orderId,

      };


      setNotifications(
        (prev) => [
          notif,
          ...prev,
        ]
      );


      return updatedOrder;


    } catch (error) {

      console.error(
        'Payment failed:',
        error
      );

      return null;

    }

  };


  /*
   * ============================================================
   * 14. NOTIFICATION ACTIONS
   * ============================================================
   */

  const markNotificationAsRead = (
    notificationId: string
  ) => {

    setNotifications(
      (prev) =>
        prev.map(
          (n) =>
            n.id === notificationId
              ? {
                  ...n,
                  isRead: true,
                }
              : n
        )
    );

  };


  const markAllNotificationsAsRead = (
    role: 'farmer' | 'buyer'
  ) => {

    setNotifications(
      (prev) =>
        prev.map(
          (n) =>
            n.recipientRole === role ||
            n.recipientRole === 'all'
              ? {
                  ...n,
                  isRead: true,
                }
              : n
        )
    );

  };


  /*
   * ============================================================
   * 15. RESET DEMO DATA
   * ============================================================
   *
   * IMPORTANT:
   *
   * Buyer requirements and orders are now
   * backend data.
   *
   * Therefore we DO NOT reset them using
   * mock arrays or localStorage.
   *
   * Notifications are still local.
   */

  const resetDemoData = () => {

    setNotifications(
      INITIAL_NOTIFICATIONS
    );

    localStorage.removeItem(
      'km_notifications'
    );

  };


  /*
   * ============================================================
   * 16. CONTEXT VALUE
   * ============================================================
   */

  const value:
    AppStateContextType = {

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


  /*
   * ============================================================
   * 17. PROVIDER
   * ============================================================
   */

  return (

    <AppStateContext.Provider
      value={value}
    >

      {children}

    </AppStateContext.Provider>

  );

};


/*
 * ============================================================
 * 18. useAppState HOOK
 * ============================================================
 */

export const useAppState =
  (): AppStateContextType => {

    const context =
      useContext(
        AppStateContext
      );


    if (!context) {

      throw new Error(
        'useAppState must be used within an AppStateProvider'
      );

    }


    return context;

  };