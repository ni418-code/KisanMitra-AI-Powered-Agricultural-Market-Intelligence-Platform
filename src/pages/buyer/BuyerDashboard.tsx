import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { VerifiedBadge } from '../../components/common/VerifiedBadge';
import {
  Building2,
  PlusCircle,
  Search,
  FileText,
  Package,
  CreditCard,
  Truck,
  ArrowRight,
  TrendingUp,
  MapPin,
  CheckCircle2,
  Users,
  Clock,
  Sparkles,
} from 'lucide-react';

export const BuyerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { buyerRequirements, farmerListings, orders } = useAppState();
  const navigate = useNavigate();

  const activeRequirements = buyerRequirements.filter((r) => r.status !== 'Completed');
  const activeOrders = orders.filter((o) => o.status !== 'payment_completed');
  const completedOrders = orders.filter((o) => o.status === 'payment_completed');

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header Greeting */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white pt-8 pb-14 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {currentUser?.name || 'FreshMart Traders'}
              </h1>
              <VerifiedBadge text="Verified Buyer ✓" size="sm" />
            </div>
            <p className="text-blue-200 text-xs sm:text-sm font-medium">
              Enterprise Farm-Gate Procurement Dashboard • {currentUser?.location || 'Bengaluru Wholesale Hub'}
            </p>
          </div>

          <Link
            to="/buyer/requirements/create"
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs sm:text-sm shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition-all hover:scale-105 self-start md:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Crop Requirement</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 space-y-6">
        {/* Metric Summary Strip (4 Cards) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Active Requirements
            </span>
            <span className="text-3xl font-black text-blue-700 mt-1 block">
              {activeRequirements.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Actively matching local farmers
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Matching Farmers
            </span>
            <span className="text-3xl font-black text-emerald-600 mt-1 block">
              {farmerListings.length * 3}
            </span>
            <span className="text-[11px] text-emerald-700 font-semibold">
              Within 30 km radius
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Active Orders
            </span>
            <span className="text-3xl font-black text-amber-600 mt-1 block">
              {activeOrders.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              In pickup / weighing pipeline
            </span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
            <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">
              Completed Purchases
            </span>
            <span className="text-3xl font-black text-slate-800 mt-1 block">
              {completedOrders.length + 46}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              100% digital bank settlements
            </span>
          </div>
        </div>

        {/* Main 4 Action Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Post Requirement */}
          <Link
            to="/buyer/requirements/create"
            className="bg-white rounded-3xl p-5 border-2 border-blue-500/30 hover:border-blue-600 shadow-card hover:shadow-float transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-colors">
                Post Requirement
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Enter crop, qty, offer (≥ MSP) & radius.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
              <span>Create Need</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Find Crops */}
          <Link
            to="/buyer/find-crops"
            className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-blue-400 shadow-card hover:shadow-float transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                Find Available Crops
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Browse nearby farmer listings by village & crop.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Browse Farmers</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: My Requirements */}
          <Link
            to="/buyer/requirements"
            className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-blue-400 shadow-card hover:shadow-float transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-amber-700 transition-colors">
                My Requirements
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Track active demands and matched farmer supply.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>{activeRequirements.length} Active</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Orders & Logistics */}
          <Link
            to="/buyer/orders"
            className="bg-white rounded-3xl p-5 border border-slate-200/80 hover:border-blue-400 shadow-card hover:shadow-float transition-all group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Package className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                Orders & Logistics
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Manage vehicle dispatches, pickups & payments.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700">
              <span>Track Orders</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Live Active Requirements Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900">
                Active Crop Procurement Demands
              </h3>
              <p className="text-xs text-slate-500">
                Current requirements posted to farmers within your selected radius.
              </p>
            </div>

            <Link
              to="/buyer/requirements"
              className="text-xs font-bold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeRequirements.slice(0, 2).map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-blue-300 bg-slate-50/50 flex flex-col justify-between gap-3 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.cropImage}
                      alt={req.cropName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                    <div>
                      <span className="text-[10px] font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                        {req.cropName}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">
                        {req.quantity} {req.unit} @ ₹{req.offerPrice}/kg
                      </h4>
                    </div>
                  </div>

                  <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-1 rounded-xl">
                    ₹{(req.quantity * req.offerPrice).toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
                  <span className="text-slate-500 font-medium flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-600" />
                    Within {req.pickupRadiusKm} km
                  </span>
                  <Link
                    to={`/buyer/requirements/${req.id}`}
                    className="font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span>View Matched Farmers ({req.matchedFarmerIds.length})</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
