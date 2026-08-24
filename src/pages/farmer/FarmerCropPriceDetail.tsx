import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  ArrowLeft,
  Calendar,
  TrendingUp,
  MapPin,
  ShieldCheck,
  PlusCircle,
  BarChart2,
  CheckCircle2,
} from 'lucide-react';

export const FarmerCropPriceDetail: React.FC = () => {
  const { crop: cropParam } = useParams<{ crop: string }>();
  const { crops } = useAppState();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  const currentCrop = crops.find(
    (c) => c.id.toLowerCase() === cropParam?.toLowerCase() || c.name.toLowerCase() === cropParam?.toLowerCase()
  ) || crops[0];

  const localTitle = currentCrop.localNames[language] || currentCrop.name;

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Top Breadcrumb */}
      <div className="bg-emerald-800 text-white py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-200 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Market Prices</span>
          </button>
          <span className="text-xs text-emerald-200">{currentCrop.category}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Main Crop Header Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-950">
            <img
              src={currentCrop.image}
              alt={currentCrop.name}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            
            <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="inline-block bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full mb-2">
                  {currentCrop.category}
                </span>
                <h1 className="text-3xl sm:text-4xl font-black">{localTitle}</h1>
                <p className="text-sm text-slate-200 font-medium">
                  {currentCrop.name} • Last updated: {currentCrop.lastUpdated}
                </p>
              </div>

              <Link
                to={`/farmer/crops/add?crop=${currentCrop.id}`}
                className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Sell {currentCrop.name}</span>
              </Link>
            </div>
          </div>

          {/* Pricing Metrics Grid */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4 border-b border-slate-100 bg-slate-50/50">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Today's Benchmark Rate
              </span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-700">
                ₹{currentCrop.marketPrice}
                <span className="text-sm font-semibold text-slate-500">/kg</span>
              </span>
              <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                Farm-gate weighted average
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Price Per Quintal
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-800">
                ₹{currentCrop.pricePerQuintal.toLocaleString('en-IN')}
                <span className="text-sm font-semibold text-slate-500">/q</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium block mt-1">
                (100 kg standard trade unit)
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                Applicable MSP
              </span>
              {currentCrop.mspPrice ? (
                <>
                  <span className="text-2xl sm:text-3xl font-black text-amber-600">
                    ₹{currentCrop.mspPrice}
                    <span className="text-sm font-semibold text-slate-500">/kg</span>
                  </span>
                  <span className="text-[11px] text-amber-700 font-semibold block mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Statutory Government MSP
                  </span>
                </>
              ) : (
                <>
                  <span className="text-lg font-bold text-slate-500">
                    Market-Driven
                  </span>
                  <span className="text-[11px] text-slate-400 font-medium block mt-1">
                    Non-MSP Perishable Produce
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Simple Visual Comparison (Nearby APMC Mandi Markets) */}
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Nearby APMC Market Yard Rates Comparison
                </h3>
                <p className="text-xs text-slate-500">
                  Direct farm-gate pickup saves you 8-12% transport and commission expenses.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {currentCrop.nearbyMarkets.map((yard, idx) => {
                const maxPrice = Math.max(...currentCrop.nearbyMarkets.map((m) => m.price), 35);
                const widthPercent = Math.round((yard.price / maxPrice) * 100);

                return (
                  <div key={idx} className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                    <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                      <span className="text-slate-800 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        {yard.name}
                      </span>
                      <span className="text-emerald-700 text-sm font-black">
                        ₹{yard.price}/kg
                      </span>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full"
                        style={{ width: `${widthPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Quality and Harvest Advisory Card */}
        <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h4 className="text-base font-bold text-emerald-950">
              Have a harvest of {currentCrop.name} ready?
            </h4>
            <p className="text-xs text-emerald-800 leading-relaxed max-w-xl">
              Post your available quantity on KisanMitra in under 60 seconds. We'll automatically notify verified buyers looking for this crop in your radius.
            </p>
          </div>
          <Link
            to={`/farmer/crops/add?crop=${currentCrop.id}`}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shrink-0 transition-colors"
          >
            List My Crop for Sale
          </Link>
        </div>
      </div>
    </div>
  );
};
