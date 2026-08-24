import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import {
  Package,
  Truck,
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  MapPin,
  Calendar,
} from 'lucide-react';

export const BuyerOrders: React.FC = () => {
  const { orders } = useAppState();
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filtered = orders.filter((order) => {
    if (filter === 'active') return order.status !== 'payment_completed';
    if (filter === 'completed') return order.status === 'payment_completed';
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-blue-300 text-xs font-bold uppercase tracking-wider">
              Procurement Orders
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">My Orders & Pickups</h1>
            <p className="text-blue-100 text-xs mt-1">
              Manage farm-gate vehicle dispatch, weighment verification, and digital settlements.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs font-bold">
            {orders.length} Total Purchases
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        {/* Filter */}
        <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-200/80 flex gap-2">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filter === f ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f} Orders
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-float transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
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
                    <span className="text-xs font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                      {order.pickupDetails.transportStatus}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900">
                    {order.quantity} {order.unit} {order.cropName}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>Farmer: <strong>{order.farmerName}</strong> ({order.farmerVillage})</span>
                    <span>•</span>
                    <span>Agreed: <strong>₹{order.agreedPricePerKg}/kg</strong></span>
                    <span>•</span>
                    <span>Scheduled: <strong>{order.pickupDetails.scheduledDate}</strong></span>
                  </p>
                </div>
              </div>

              {/* Price & Action */}
              <div className="flex sm:flex-row md:flex-col items-center sm:items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">
                    Order Value
                  </span>
                  <span className="text-2xl font-black text-blue-900">
                    ₹{order.totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    to={`/buyer/pickup/${order.id}`}
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 transition-colors"
                  >
                    <Truck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Pickup</span>
                  </Link>

                  <Link
                    to={`/buyer/orders/${order.id}`}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <span>View Timeline</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
