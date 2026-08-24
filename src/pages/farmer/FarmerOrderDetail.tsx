import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { useLanguage } from '../../context/LanguageContext';
import { StatusTimeline } from '../../components/common/StatusTimeline';
import { VerifiedBadge } from '../../components/common/VerifiedBadge';
import {
  ArrowLeft,
  CheckCircle2,
  Truck,
  CreditCard,
  Phone,
  MapPin,
  Calendar,
  Building2,
  Download,
  Clock,
  Check,
  ShieldCheck,
} from 'lucide-react';

export const FarmerOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const isJustConfirmed = searchParams.get('confirmed') === 'true';

  const { orders, advanceOrderStatus } = useAppState();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === id) || orders[0];

  if (!order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
          <button
            onClick={() => navigate('/farmer/orders')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const handleSimulateNext = () => {
    advanceOrderStatus(order.id);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-28 md:pb-16">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/farmer/orders')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-200 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </button>
          <div className="text-xs font-bold bg-white/15 px-3 py-1 rounded-full">
            Order #{order.id}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        {/* Just Confirmed Success Flash Banner */}
        {isJustConfirmed && (
          <div className="bg-emerald-600 text-white rounded-3xl p-5 shadow-lg flex items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white text-emerald-700 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black">{t.orderConfirmed}</h3>
                <p className="text-xs text-emerald-100 font-medium">
                  FreshMart Traders has been notified. Farm-gate pickup is scheduled.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Order Summary Overview Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <img
                src={order.cropImage}
                alt={order.cropName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    {order.cropName}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">#{order.id}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900">
                  {order.quantity} {order.unit} @ ₹{order.agreedPricePerKg}/kg
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Buyer: <strong>{order.buyerName}</strong> • {order.farmerLocation}
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-emerald-50/70 p-4 rounded-2xl border border-emerald-100">
              <span className="text-xs font-bold text-slate-400 block uppercase">
                Guaranteed Farm-Gate Payout
              </span>
              <span className="text-3xl font-black text-emerald-800">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-emerald-700 block font-semibold mt-0.5">
                Payment Status: {order.paymentDetails.status}
              </span>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-semibold text-[11px]">Agreed Price</span>
              <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                ₹{order.agreedPricePerKg}/kg
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-semibold text-[11px]">Pickup Date</span>
              <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                {order.pickupDetails.scheduledDate}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-semibold text-[11px]">Pickup Window</span>
              <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                {order.pickupDetails.scheduledTimeWindow}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-slate-400 block font-semibold text-[11px]">Commission</span>
              <span className="text-base font-extrabold text-emerald-600 mt-0.5 block">
                ₹0 (Zero Fee)
              </span>
            </div>
          </div>
        </div>

        {/* 6-Stage Status Timeline with Simulation Button */}
        <StatusTimeline
          timeline={order.timeline}
          currentStatus={order.status}
          onAdvanceStatus={handleSimulateNext}
          canAdvance={true}
        />

        {/* Logistics & Pickup Vehicle Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Farm-Gate Pickup & Transport Logistics</span>
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              {order.pickupDetails.transportStatus}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-slate-400 font-semibold block text-[11px]">Assigned Driver</span>
              <p className="text-sm font-extrabold text-slate-900">{order.pickupDetails.driverName}</p>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-1">
                <Phone className="w-3.5 h-3.5 text-emerald-600" />
                <span>{order.pickupDetails.driverPhone}</span>
              </p>
            </div>

            <div className="space-y-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <span className="text-slate-400 font-semibold block text-[11px]">Vehicle Number & Type</span>
              <p className="text-sm font-extrabold text-slate-900">{order.pickupDetails.vehicleNumber}</p>
              <p className="text-xs text-slate-500 mt-1">
                Equipped with certified digital weighing scale at farm gate.
              </p>
            </div>
          </div>
        </div>

        {/* Payment & Transparent Calculation Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Direct Bank / UPI Settlement Calculation</span>
            </h3>
            <div className="flex items-center gap-1 text-xs font-bold text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Escrow Protected</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-600">Crop Quantity:</span>
              <span className="font-bold text-slate-900">{order.quantity} {order.unit}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Agreed Price per Unit:</span>
              <span className="font-bold text-slate-900">₹{order.agreedPricePerKg}/kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">Gross Total ({order.quantity} × ₹{order.agreedPricePerKg}):</span>
              <span className="font-bold text-slate-900">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Platform Commission:</span>
              <span className="font-bold">₹0.00 (Free for Farmers)</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black text-emerald-800">
              <span>Net Direct Payment to Farmer:</span>
              <span className="text-xl">₹{order.totalAmount.toLocaleString('en-IN')}</span>
            </div>

            {order.paymentDetails.transactionId && (
              <div className="mt-3 pt-3 border-t border-slate-200 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Transaction ID: </span>
                <span className="font-mono">{order.paymentDetails.transactionId}</span>
                <span className="block mt-0.5">Settled at: {order.paymentDetails.completedAt}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
