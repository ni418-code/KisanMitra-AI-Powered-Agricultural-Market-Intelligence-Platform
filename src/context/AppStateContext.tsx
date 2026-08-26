import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { CropMaster, FarmerListing, BuyerRequirement, Order, AppNotification, OrderStatus } from '../types';
import { MOCK_CROPS } from '../data/mockCrops';
import { getFarmerListings, createFarmerListing } from '../services/farmerListings';
import { getBuyerRequirements, createBuyerRequirement, acceptBuyerRequirement, declineBuyerRequirement } from '../services/buyerRequirements';
import { getOrders, updateOrderStatus, payOrder } from '../services/orders';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/notifications';
import { useAuth } from './AuthContext';

interface AppStateContextType {
  crops: CropMaster[]; farmerListings: FarmerListing[]; buyerRequirements: BuyerRequirement[]; orders: Order[]; notifications: AppNotification[];
  unreadFarmerNotifCount: number; unreadBuyerNotifCount: number;
  addBuyerRequirement: (data: { cropId: string; quantity: number; unit: 'kg' | 'quintal'; offerPrice: number; requiredDate: string; pickupRadiusKm: number; notes?: string }) => Promise<{ success: boolean; requirement: BuyerRequirement; matchCount: number }>;
  addFarmerListing: (data: { cropId: string; quantity: number; unit: 'kg' | 'quintal'; location: string; availableDate: string; notes?: string }) => Promise<FarmerListing>;
  acceptRequirement: (requirementId: string, farmerId?: string) => Promise<Order | null>;
  declineRequirement: (requirementId: string, farmerId?: string) => Promise<void>;
  advanceOrderStatus: (orderId: string, nextStatus?: OrderStatus) => Promise<Order | null>;
  completeOrderPayment: (orderId: string) => Promise<Order | null>;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: (role: 'farmer' | 'buyer') => void;
  resetDemoData: () => void;
}

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [farmerListings, setFarmerListings] = useState<FarmerListing[]>([]);
  const [buyerRequirements, setBuyerRequirements] = useState<BuyerRequirement[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const crops = MOCK_CROPS;

  const refresh = async () => {
    if (!currentUser) { setFarmerListings([]); setBuyerRequirements([]); setOrders([]); setNotifications([]); return; }
    try { setFarmerListings(await getFarmerListings()); } catch { setFarmerListings([]); }
    try { setBuyerRequirements(await getBuyerRequirements()); } catch { setBuyerRequirements([]); }
    try { setOrders(await getOrders()); } catch { setOrders([]); }
    try { setNotifications(await getNotifications()); } catch { setNotifications([]); }
  };
  useEffect(() => { refresh(); }, [currentUser?.id]);

  const addBuyerRequirement = async (data: { cropId: string; quantity: number; unit: 'kg' | 'quintal'; offerPrice: number; requiredDate: string; pickupRadiusKm: number; notes?: string }) => {
    const crop = crops.find(c => c.id === data.cropId); if (!crop) throw new Error('Crop not found.');
    const response = await createBuyerRequirement({ cropId: crop.id, cropName: crop.name, cropImage: crop.image, ...data }); await refresh();
    return { success: true, requirement: response, matchCount: response.matchedFarmerIds?.length || 0 };
  };
  const addFarmerListing = async (data: { cropId: string; quantity: number; unit: 'kg' | 'quintal'; location: string; availableDate: string; notes?: string }) => {
    const crop = crops.find(c => c.id === data.cropId); if (!crop) throw new Error('Crop not found.');
    const listing = await createFarmerListing({ cropId: crop.id, cropName: crop.name, cropImage: crop.image, ...data }); setFarmerListings(prev => [listing, ...prev]); return listing;
  };
  const acceptRequirement = async (requirementId: string) => { try { const response = await acceptBuyerRequirement(requirementId); setBuyerRequirements(prev => prev.map(r => r.id === requirementId ? response.requirement : r)); setOrders(prev => [response.order, ...prev]); return response.order; } catch (error) { console.error(error); return null; } };
  const declineRequirement = async (requirementId: string) => { try { const updated = await declineBuyerRequirement(requirementId); setBuyerRequirements(prev => prev.map(r => r.id === requirementId ? updated : r)); } catch (error) { console.error(error); } };
  const advanceOrderStatus = async (orderId: string, nextStatus?: OrderStatus) => {
    const order = orders.find(o => o.id === orderId); if (!order) return null;
    const stages: OrderStatus[] = ['posted', 'matched', 'accepted', 'pickup_scheduled', 'crop_picked_up', 'payment_completed']; const current = stages.indexOf(order.status); const target = nextStatus || stages[Math.min(current + 1, stages.length - 1)];
    try { const updated = await updateOrderStatus(orderId, target); setOrders(prev => prev.map(o => o.id === orderId ? updated : o)); return updated; } catch (error) { console.error(error); return null; }
  };
  const completeOrderPayment = async (orderId: string) => { try { const updated = await payOrder(orderId); setOrders(prev => prev.map(o => o.id === orderId ? updated : o)); return updated; } catch (error) { console.error(error); return null; } };
  const markNotificationAsRead = (notificationId: string) => { markNotificationRead(notificationId).then(updated => setNotifications(prev => prev.map(n => n.id === notificationId ? updated : n))).catch(console.error); };
  const markAllNotificationsAsRead = (_role: 'farmer' | 'buyer') => { markAllNotificationsRead().then(setNotifications).catch(console.error); };
  const resetDemoData = () => { refresh(); };
  const unreadFarmerNotifCount = useMemo(() => notifications.filter(n => !n.isRead && (n.recipientRole === 'farmer' || n.recipientRole === 'all')).length, [notifications]);
  const unreadBuyerNotifCount = useMemo(() => notifications.filter(n => !n.isRead && (n.recipientRole === 'buyer' || n.recipientRole === 'all')).length, [notifications]);
  const value: AppStateContextType = { crops, farmerListings, buyerRequirements, orders, notifications, unreadFarmerNotifCount, unreadBuyerNotifCount, addBuyerRequirement, addFarmerListing, acceptRequirement, declineRequirement, advanceOrderStatus, completeOrderPayment, markNotificationAsRead, markAllNotificationsAsRead, resetDemoData };
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};
export const useAppState = (): AppStateContextType => { const context = useContext(AppStateContext); if (!context) throw new Error('useAppState must be used within an AppStateProvider'); return context; };
