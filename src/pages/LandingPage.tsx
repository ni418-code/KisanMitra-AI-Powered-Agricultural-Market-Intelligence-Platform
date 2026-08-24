import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_CROPS } from '../data/mockCrops';
import {
  Sprout,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Scale,
  PhoneCall,
  UserPlus,
  LogIn,
  MapPin,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { loginAsDemoFarmer, loginAsDemoBuyer } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32">
        {/* Background decorative glow */}
        <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-xs font-bold tracking-wide backdrop-blur-xs">
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>Direct Farm-Gate Agricultural Marketplace</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              From Farm Gate <br />
              <span className="bg-gradient-to-r from-emerald-300 via-green-200 to-teal-200 bg-clip-text text-transparent">
                to Verified Buyer
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
              Connect farmers directly with verified wholesale buyers through simple, transparent crop requirements. No middlemen, no auction bidding.
            </p>

            {/* Primary Action Buttons: Farmer Login & Buyer Login */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
              <Link
                to="/farmer/login"
                className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-base shadow-lg shadow-emerald-500/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Farmer Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/buyer/login"
                className="w-full sm:w-auto flex-1 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-base shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Buyer Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Secondary Registration & Market Price Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold pt-1">
              <Link
                to="/farmer/login?mode=register"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-emerald-300" />
                <span>Register as Farmer</span>
              </Link>

              <Link
                to="/buyer/login?mode=register"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5 text-blue-300" />
                <span>Register as Buyer</span>
              </Link>

              <Link
                to="/farmer/market-prices"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-200 hover:text-white border border-white/20 transition-all flex items-center gap-1.5"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                <span>View Market Prices</span>
              </Link>
            </div>
          </div>

          {/* Workflow Chain Visualizer */}
          <div className="mt-14 max-w-5xl mx-auto bg-slate-900/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl">
            <div className="text-center mb-6">
              <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-400">
                The Non-Auction Direct Workflow
              </span>
              <h3 className="text-lg font-bold text-white mt-0.5">
                How Fresh Crops Move From Farm Gate To Destination
              </h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 relative">
              {/* Step 1 */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-2 font-bold text-sm">
                  1
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Buyer Demand</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Buyer specifies crop, qty & price offer (≥ MSP)
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 font-bold text-sm">
                  2
                </div>
                <h4 className="text-xs font-bold text-white mb-1">System Matching</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Auto-matches local farmers by radius & quantity
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-2 font-bold text-sm">
                  3
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Farmer Accepts</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Farmer reviews buyer rating & accepts the requirement
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700 text-center relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mb-2 font-bold text-sm">
                  4
                </div>
                <h4 className="text-xs font-bold text-white mb-1">Farm-Gate Pickup</h4>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Buyer vehicle arrives, weighs & collects at farm
                </p>
              </div>

              {/* Step 5 */}
              <div className="col-span-2 md:col-span-1 bg-emerald-950/60 p-4 rounded-2xl border border-emerald-500/40 text-center relative flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mb-2 font-bold text-sm">
                  5
                </div>
                <h4 className="text-xs font-bold text-emerald-300 mb-1">Direct Payment</h4>
                <p className="text-[11px] text-emerald-100/80 leading-tight">
                  Instant UPI/Bank transfer with ₹0 commission
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How KisanMitra Works (3 Large Cards) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-100/80 px-3 py-1 rounded-full">
            Transparent Agritech
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
            How KisanMitra Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            A direct, non-bidding marketplace built for Indian agricultural efficiency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-card hover:shadow-float transition-all group">
            <div className="text-xs font-black text-blue-600 bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-base border border-blue-100">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Buyer Posts Requirement
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Verified buyers enter exact crop needs with fixed price offer, quantity, required date, and pickup radius.
            </p>
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 space-y-1 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Crop:</span>
                <span className="font-bold">Tomato</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Quantity:</span>
                <span className="font-bold">500 kg</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Price/kg:</span>
                <span className="font-bold text-emerald-600">₹32/kg (Validated ≥ MSP)</span>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-card hover:shadow-float transition-all group">
            <div className="text-xs font-black text-emerald-600 bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-base border border-emerald-100">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Farmers Get Notified
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              KisanMitra automatically finds matching farmers within the radius and alerts them with clear payout estimates.
            </p>
            <div className="bg-emerald-50 rounded-xl p-3 text-xs text-emerald-950 space-y-1 border border-emerald-100">
              <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                <span className="animate-ping w-2 h-2 rounded-full bg-emerald-500" />
                <span>Instant Push & SMS Alert</span>
              </div>
              <p className="text-emerald-800 text-[11px]">
                "FreshMart Traders offers ₹16,000 for 500 kg Tomatoes (15 km away)."
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-card hover:shadow-float transition-all group">
            <div className="text-xs font-black text-teal-600 bg-teal-50 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 text-base border border-teal-100">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Order Gets Confirmed
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              Farmer accepts the offer. Farm-gate pickup is dispatched and direct payment is settled upon weighment.
            </p>
            <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-700 space-y-1 border border-slate-100">
              <div className="flex items-center gap-1 text-emerald-600 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Binding Transaction Confirmed</span>
              </div>
              <p className="text-slate-500 text-[11px]">
                Farm-gate vehicle scheduled • 100% digital bank receipt
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why KisanMitra */}
      <section className="py-16 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Why Farmers & Buyers Choose KisanMitra
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Eliminating exploitation, auction anxiety, and delayed payments across the supply chain.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <Sprout className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Direct Farm-Gate Selling</h4>
              <p className="text-xs text-slate-600">
                No need to haul crops to distant mandi yards or pay unloading and middleman commissions.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Scale className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Transparent Prices & MSP Protection</h4>
              <p className="text-xs text-slate-600">
                Fixed agreed price before loading. System strictly enforces statutory MSP validation.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Verified Buyers Only</h4>
              <p className="text-xs text-slate-600">
                All retail chains, food processors, and wholesalers undergo strict business KYC verification.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Local Farmer Discovery</h4>
              <p className="text-xs text-slate-600">
                Smart radius engine matches requirements with farmers within 15km - 50km for quick fresh pickup.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Simple Voice-Friendly Interface</h4>
              <p className="text-xs text-slate-600">
                Large buttons, regional language support (Telugu, Hindi, Tamil, Marathi) & tap-to-speak input.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm mb-1">Instant Payment Payouts</h4>
              <p className="text-xs text-slate-600">
                Zero delayed payment credit loops. Direct settlement to farmer's UPI or bank upon weighment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Price Preview Section */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Live Mandi Updates
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Today's Mandi Market Rates
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Real-time daily prices updated from major APMC market yards across Karnataka & India.
            </p>
          </div>

          <Link
            to="/farmer/market-prices"
            className="mt-4 md:mt-0 inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <span>View All Mandi Rates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {MOCK_CROPS.slice(0, 4).map((crop) => (
            <Link
              key={crop.id}
              to={`/farmer/market-prices/${crop.id}`}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-card transition-all group flex flex-col"
            >
              <div className="relative h-36 overflow-hidden bg-slate-100">
                <img
                  src={crop.image}
                  alt={crop.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 right-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  {crop.category}
                </span>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                    {crop.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Updated: {crop.lastUpdated}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">Market Price</span>
                    <span className="text-lg font-black text-emerald-700">
                      ₹{crop.marketPrice}/kg
                    </span>
                  </div>
                  {crop.mspPrice ? (
                    <div className="text-right">
                      <span className="text-[10px] text-amber-600 block font-bold">MSP</span>
                      <span className="text-xs font-bold text-slate-700">
                        ₹{crop.mspPrice}/kg
                      </span>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-400 font-medium">
                      ₹{crop.pricePerQuintal}/q
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/farmer/market-prices"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:bg-slate-50 shadow-xs transition-all"
          >
            <span>View All Market Prices</span>
            <ArrowRight className="w-4 h-4 text-emerald-600" />
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="bg-emerald-800 text-white py-14">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-3xl font-extrabold">
            Ready to experience transparent farm-gate trade?
          </h2>
          <p className="text-emerald-100 text-sm max-w-xl mx-auto">
            Log in or register your account to get started on KisanMitra today.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/farmer/login"
              className="px-6 py-3 rounded-xl bg-white text-emerald-900 font-bold text-sm shadow-md hover:bg-emerald-50 transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4 text-emerald-700" />
              <span>Farmer Login / Register</span>
            </Link>
            <Link
              to="/buyer/login"
              className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm shadow-md hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <LogIn className="w-4 h-4 text-blue-400" />
              <span>Buyer Login / Register</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
