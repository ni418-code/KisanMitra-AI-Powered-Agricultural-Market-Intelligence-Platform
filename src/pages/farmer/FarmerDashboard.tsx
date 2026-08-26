import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { useLanguage } from '../../context/LanguageContext';
import { VoiceInputModal } from '../../components/common/VoiceInputModal';
import {
  MapPin,
  Mic,
  ArrowRight,
  ChevronRight,
} from 'lucide-react';

export const FarmerDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  const { buyerRequirements, unreadFarmerNotifCount } = useAppState();
  const { t } = useLanguage();
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  const topRequirement = buyerRequirements.find(
    (r) => r.status !== 'Completed' && r.status !== 'Accepted'
  ) || buyerRequirements[0];

  const farmerName = currentUser?.name?.trim().split(/\s+/)[0] || 'Farmer';
  const requirementQuantityKg = topRequirement
    ? topRequirement.unit === 'quintal'
      ? topRequirement.quantity * 100
      : topRequirement.quantity
    : 0;
  const requirementTotal = topRequirement
    ? requirementQuantityKg * topRequirement.offerPrice
    : 0;

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      <div className="bg-gradient-to-b from-emerald-800 to-emerald-700 text-white pt-6 pb-12 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">👋</span>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                  {t.hello}, {farmerName}
                </h1>
              </div>
              <p className="text-emerald-100 font-medium text-sm">
                {t.goodMorning} Welcome to your direct farm-gate marketplace.
              </p>
            </div>

            <button
              onClick={() => setVoiceModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white font-bold text-xs border border-white/20 flex items-center gap-2 transition-all hover:scale-105 shadow-sm"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                <Mic className="w-3.5 h-3.5 text-white animate-pulse" />
              </div>
              <span>{t.tapToSpeak}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 space-y-6">
        {topRequirement && (
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 text-white shadow-lg border border-amber-300/40 relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-28 h-28 bg-white/10 rounded-full blur-lg pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/25 backdrop-blur-xs text-white font-black text-[11px] uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  {t.newBuyerRequirement}
                </div>

                <div className="flex items-baseline gap-3 pt-1 flex-wrap">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                    {topRequirement.cropName}
                  </h3>
                  <span className="text-base font-bold text-amber-100">
                    {topRequirement.quantity} {topRequirement.unit}
                  </span>
                  <span className="text-xl font-black bg-white text-orange-600 px-2.5 py-0.5 rounded-xl shadow-xs">
                    ₹{topRequirement.offerPrice}/kg
                  </span>
                </div>

                <p className="text-xs text-amber-100 font-medium flex items-center gap-1.5 flex-wrap">
                  {topRequirement.distanceKm != null && (
                    <>
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{topRequirement.distanceKm} km {t.distanceAway}</span>
                      <span>•</span>
                    </>
                  )}
                  <span>Buyer: <strong>{topRequirement.buyerName}</strong></span>
                  <span>•</span>
                  <span>Total: <strong>₹{requirementTotal.toLocaleString('en-IN')}</strong></span>
                </p>
              </div>

              <Link
                to={`/farmer/requirements/${topRequirement.id}`}
                className="px-5 py-3 rounded-2xl bg-white text-orange-600 hover:bg-amber-50 font-black text-sm shadow-md transition-all text-center flex items-center justify-center gap-1.5 hover:scale-105 shrink-0"
              >
                <span>{t.viewNow}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-900">Farmer Action Center</h2>
            <span className="text-xs text-slate-500 font-medium">Tap any option to proceed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <Link to="/farmer/crops/add" className="bg-white rounded-3xl p-6 border-2 border-emerald-500/30 hover:border-emerald-600 shadow-card hover:shadow-float transition-all group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="text-3xl">🌾</span></div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{t.sellMyCrop}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{t.sellMyCropDesc}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700"><span>Add Crop Now</span><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>
            </Link>

            <Link to="/farmer/market-prices" className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-400 shadow-card hover:shadow-float transition-all group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="text-3xl">📈</span></div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-700 transition-colors">{t.todaysMarketPrice}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{t.todaysMarketPriceDesc}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-700"><span>Check Mandi Rates</span><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>
            </Link>

            <Link to="/farmer/requirements" className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-400 shadow-card hover:shadow-float transition-all group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="text-3xl">📋</span></div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-amber-700 transition-colors">{t.buyerRequirements}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{t.buyerRequirementsDesc}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700"><span>See {buyerRequirements.length} Buyer Needs</span><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>
            </Link>

            <Link to="/farmer/orders" className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-400 shadow-card hover:shadow-float transition-all group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="text-3xl">📦</span></div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-700 transition-colors">{t.myOrders}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{t.myOrdersDesc}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-teal-700"><span>Track Pickups & Payouts</span><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>
            </Link>

            <Link to="/farmer/notifications" className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-400 shadow-card hover:shadow-float transition-all group flex flex-col justify-between">
              <div>
                <div className="relative w-14 h-14 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="text-3xl">🔔</span>{unreadFarmerNotifCount > 0 && <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center">{unreadFarmerNotifCount}</span>}</div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-purple-700 transition-colors">{t.notifications}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{t.notificationsDesc}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700"><span>{unreadFarmerNotifCount} New Alerts</span><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>
            </Link>

            <Link to="/farmer/help" className="bg-white rounded-3xl p-6 border border-slate-200/80 hover:border-emerald-400 shadow-card hover:shadow-float transition-all group flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><span className="text-3xl">☎️</span></div>
                <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">{t.help}</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium leading-relaxed">{t.helpDesc}</p>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700"><span>Support</span><ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></div>
            </Link>
          </div>
        </div>
      </div>

      <VoiceInputModal isOpen={voiceModalOpen} onClose={() => setVoiceModalOpen(false)} />
    </div>
  );
};
