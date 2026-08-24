import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Package,
  MapPin,
  Calendar,
  Truck,
  CheckCircle2,
  ArrowRight,
  Clock,
  CreditCard,
} from 'lucide-react';

export const FarmerOrders: React.FC = () => {
  const { orders } = useAppState();
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');

  const farmerOrders = orders.filter((o) => o.farmerId === currentUser?.id || o.farmerName.includes('Ramesh'));

  const filtered = farmerOrders.filter((order) => {
    if (activeFilter === 'active') return order.status !== 'payment_completed';
    if (activeFilter === 'completed') return order.status === 'payment_completed';
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'payment_completed':
        return (
          <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Payment Completed ✓</span>
          </span>
        );
      case 'crop_picked_up':
        return (
          <span className="bg-teal-100 text-teal-800 text-xs font-bold px-2.5 py-1 rounded-full border border-teal-200 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            <span>Crop Picked Up</span>
          </span>
        );
      case 'pickup_scheduled':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>Pickup Scheduled</span>
          </span>
        );
      case 'accepted':
      default:
        return (
          <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Order Confirmed ✓</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider">
              Confirmed Orders
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">{t.myOrders}</h1>
            <p className="text-emerald-100 text-xs mt-1">
              Track farm-gate pickups, weighing slips, and direct UPI bank payments.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs font-bold">
            {farmerOrders.length} Total Orders
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-200/80 flex gap-2">
          {(['all', 'active', 'completed'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                activeFilter === filter
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {filter} Orders
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-card hover:shadow-float transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="flex items-start sm:items-center gap-4">
                <img
                  src={order.cropImage}
                  alt={order.cropName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-slate-500">#{order.id}</span>
                    {getStatusBadge(order.status)}
                  </div>

                  <h3 className="text-xl font-black text-slate-900">
                    {order.cropName} ({order.quantity} {order.unit})
                  </h3>

                  <p className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>Buyer: <strong>{order.buyerName}</strong></span>
                    <span>•</span>
                    <span>Rate: <strong>₹{order.agreedPricePerKg}/kg</strong></span>
                    <span>•</span>
                    <span>Pickup: <strong>{order.pickupDetails.scheduledDate}</strong></span>
                  </p>
                </div>
              </div>

              {/* Price and CTA */}
              <div className="flex sm:flex-row md:flex-col items-center sm:items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">
                    Order Total
                  </span>
                  <span className="text-2xl font-black text-emerald-700">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <Link
                  to={`/farmer/orders/${order.id}`}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-colors"
                >
                  <span>{t.viewOrderStatus}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <Package className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No Orders Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Accept active buyer requirements from the requests page to confirm orders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
