import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { useLanguage } from '../../context/LanguageContext';
import { VerifiedBadge } from '../../components/common/VerifiedBadge';
import {
  FileText,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  CheckCircle2,
} from 'lucide-react';

export const FarmerRequirements: React.FC = () => {
  const { buyerRequirements } = useAppState();
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const cropFilter = searchParams.get('crop');

  const [activeTab, setActiveTab] = useState<'New' | 'Interested' | 'All'>('New');

  const filteredRequirements = buyerRequirements.filter((req) => {
    if (cropFilter && req.cropId.toLowerCase() !== cropFilter.toLowerCase()) {
      return false;
    }
    if (activeTab === 'New') {
      return req.status !== 'Completed' && req.status !== 'Accepted';
    }
    if (activeTab === 'Interested') {
      return req.status === 'Farmer Matched';
    }
    return true;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider">
              Verified Buyer Demands
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              {t.buyerRequirements}
            </h1>
            <p className="text-emerald-100 text-xs mt-1">
              Direct procurement offers from verified wholesalers, mills, and supermarkets.
            </p>
          </div>

          <div className="bg-white/15 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 text-xs font-bold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-300" />
            <span>{buyerRequirements.length} Active Buyer Demands</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        {/* Tabs */}
        <div className="bg-white rounded-2xl p-2 shadow-xs border border-slate-200/80 flex items-center gap-2">
          {(['New', 'Interested', 'All'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab} Requests
            </button>
          ))}
        </div>

        {/* Requirements List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRequirements.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl overflow-hidden border-2 border-slate-200/80 hover:border-emerald-400 shadow-card hover:shadow-float transition-all flex flex-col justify-between"
            >
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={req.cropImage}
                      alt={req.cropName}
                      className="w-14 h-14 rounded-2xl object-cover ring-1 ring-slate-200"
                    />
                    <div>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {req.cropName}
                      </span>
                      <h3 className="text-xl font-black text-slate-900 mt-1">
                        {req.quantity} {req.unit}
                      </h3>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-400 block uppercase">
                      Offered Price
                    </span>
                    <span className="text-2xl font-black text-emerald-700">
                      ₹{req.offerPrice}
                      <span className="text-xs font-semibold text-slate-500">/kg</span>
                    </span>
                  </div>
                </div>

                {/* Key Metrics Pill Grid */}
                <div className="bg-slate-50 rounded-2xl p-3 border border-slate-100 grid grid-cols-2 gap-2 text-xs mb-4">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Pickup Distance</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                      {req.distanceKm || 15} km away
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 block text-[11px]">Required Pickup</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                      {req.requiredDate}
                    </span>
                  </div>

                  <div className="col-span-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Estimated Payout:</span>
                    <span className="font-black text-emerald-700 text-sm">
                      ₹{(req.quantity * req.offerPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Buyer Info */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{req.buyerName}</span>
                    <VerifiedBadge size="sm" />
                  </div>
                  <div className="flex items-center gap-1 text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{req.buyerRating}</span>
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="px-5 pb-5 pt-0">
                <Link
                  to={`/farmer/requirements/${req.id}`}
                  className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.01]"
                >
                  <span>View Details & Accept</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {filteredRequirements.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto text-2xl">
              📋
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Requirements in this Tab</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Check other tabs or list new crops to receive automated notifications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
