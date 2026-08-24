import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import {
  ArrowLeft,
  Truck,
  MapPin,
  Calendar,
  Phone,
  UserCheck,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Navigation,
} from 'lucide-react';

export const BuyerPickupManagement: React.FC = () => {
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

  const transportStages = [
    'Pickup Scheduled',
    'Driver Assigned',
    'On the Way',
    'Picked Up',
  ];

  const handleUpdateTransportStatus = (stage: 'Pickup Scheduled' | 'Driver Assigned' | 'On the Way' | 'Picked Up') => {
    if (stage === 'Picked Up') {
      advanceOrderStatus(order.id, 'crop_picked_up');
    } else {
      advanceOrderStatus(order.id, 'pickup_scheduled');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 text-white py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(`/buyer/orders/${order.id}`)}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-200 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Order Details</span>
          </button>
          <div className="text-xs font-bold bg-white/15 px-3 py-1 rounded-full">
            Logistics #{order.id}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        {/* Main Pickup Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2">
                <Truck className="w-3.5 h-3.5" />
                <span>Farm-Gate Logistics Dispatch</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Pickup Management
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Dispatch vehicle, track driver arrival, and verify weight slips at farm gate.
              </p>
            </div>

            <div className="bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200 text-emerald-950 text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-700">
                Current Status
              </span>
              <span className="text-sm font-black">{order.pickupDetails.transportStatus}</span>
            </div>
          </div>

          {/* Transport Stages Tracker */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Transport Dispatch Flow
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {transportStages.map((stage, idx) => {
                const isCurrent = order.pickupDetails.transportStatus === stage;
                return (
                  <button
                    key={stage}
                    type="button"
                    onClick={() => handleUpdateTransportStatus(stage as any)}
                    className={`p-3 rounded-2xl border-2 text-left transition-all ${
                      isCurrent
                        ? 'border-blue-600 bg-blue-50 text-blue-950 font-black shadow-xs ring-2 ring-blue-500/20'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs'
                    }`}
                  >
                    <span className="text-[10px] text-slate-400 block mb-0.5">0{idx + 1}</span>
                    <span className="text-xs block leading-tight">{stage}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Farm Gate Collection Address</span>
              </h4>
              <p className="text-slate-700 leading-relaxed font-medium">
                {order.pickupDetails.pickupAddress}
              </p>
              <div className="pt-2 flex items-center justify-between text-slate-500 border-t border-slate-200/60">
                <span>Farmer Contact:</span>
                <span className="font-bold text-slate-900">{order.farmerName} ({order.farmerPhone})</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-blue-600" />
                <span>Assigned Vehicle & Driver</span>
              </h4>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver Name:</span>
                  <span className="font-bold text-slate-900">{order.pickupDetails.driverName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver Phone:</span>
                  <span className="font-bold text-slate-900">{order.pickupDetails.driverPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Vehicle:</span>
                  <span className="font-bold text-slate-900">{order.pickupDetails.vehicleNumber}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 flex flex-wrap gap-3">
            <button
              onClick={() => handleUpdateTransportStatus('Picked Up')}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Confirm Farm-Gate Weighment & Collection</span>
            </button>

            <Link
              to={`/buyer/payment/${order.id}`}
              className="py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-colors"
            >
              <span>Proceed to Payment Settlement</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
