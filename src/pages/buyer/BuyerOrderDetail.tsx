import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { StatusTimeline } from '../../components/common/StatusTimeline';
import { VerifiedBadge } from '../../components/common/VerifiedBadge';
import {
  ArrowLeft,
  Truck,
  CreditCard,
  Phone,
  MapPin,
  Calendar,
  ShieldCheck,
  Download,
  CheckCircle2,
} from 'lucide-react';

export const BuyerOrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, advanceOrderStatus } = useAppState();
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === id) || orders[0];

  if (!order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
          <button
            onClick={() => navigate('/buyer/orders')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const handleAdvance = () => {
    advanceOrderStatus(order.id);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 text-white py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/buyer/orders')}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-200 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Orders</span>
          </button>
          <div className="text-xs font-bold bg-white/15 px-3 py-1 rounded-full">
            Purchase Contract #{order.id}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        {/* Order Header Card */}
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
                  <span className="text-xs font-black text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full">
                    {order.cropName}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">#{order.id}</span>
                </div>
                <h1 className="text-2xl font-black text-slate-900">
                  {order.quantity} {order.unit} @ ₹{order.agreedPricePerKg}/kg
                </h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-600" />
                  <span>Farmer: <strong>{order.farmerName}</strong> ({order.farmerVillage})</span>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-blue-50/70 p-4 rounded-2xl border border-blue-100">
              <span className="text-xs font-bold text-slate-400 block uppercase">
                Purchase Total
              </span>
              <span className="text-3xl font-black text-blue-900">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-blue-700 block font-semibold mt-0.5">
                Payment: {order.paymentDetails.status}
              </span>
            </div>
          </div>

          <div className="pt-6 flex flex-wrap gap-3">
            <Link
              to={`/buyer/pickup/${order.id}`}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Truck className="w-4 h-4" />
              <span>Manage Pickup & Transport</span>
            </Link>

            <Link
              to={`/buyer/payment/${order.id}`}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              <span>View Settlement Breakdown</span>
            </Link>
          </div>
        </div>

        {/* 6-Stage Timeline */}
        <StatusTimeline
          timeline={order.timeline}
          currentStatus={order.status}
          onAdvanceStatus={handleAdvance}
          canAdvance={true}
        />
      </div>
    </div>
  );
};
