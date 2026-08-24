import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { useLanguage } from '../../context/LanguageContext';
import { VerifiedBadge } from '../../components/common/VerifiedBadge';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ShieldCheck,
  Star,
  CheckCircle2,
  XCircle,
  Truck,
  Phone,
  Building2,
  Check,
  Info,
} from 'lucide-react';

export const FarmerRequirementDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { buyerRequirements, acceptRequirement, declineRequirement } = useAppState();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const requirement = buyerRequirements.find((r) => r.id === id) || buyerRequirements[0];

  if (!requirement) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Requirement Not Found</h2>
          <button
            onClick={() => navigate('/farmer/requirements')}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
          >
            Back to Requirements
          </button>
        </div>
      </div>
    );
  }

  const estimatedValue = requirement.quantity * requirement.offerPrice;

  const handleAccept = () => {
    setIsAccepting(true);

    // Fire celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#16a34a', '#22c55e', '#4ade80', '#fbbf24'],
      });
    } catch (e) {
      // safe fallback
    }

    setTimeout(() => {
      const order = acceptRequirement(requirement.id);
      setIsAccepting(false);
      if (order) {
        navigate(`/farmer/orders/${order.id}?confirmed=true`);
      } else {
        navigate('/farmer/orders');
      }
    }, 700);
  };

  const handleDecline = () => {
    if (window.confirm('Are you sure you want to decline this buyer requirement?')) {
      setIsDeclining(true);
      declineRequirement(requirement.id);
      navigate('/farmer/requirements');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-28 md:pb-16">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/farmer/requirements')}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-200 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Requirements</span>
          </button>
          <div className="text-xs font-bold bg-white/15 px-3 py-1 rounded-full">
            Requirement #{requirement.id.slice(-6)}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        {/* Main Crop & Price Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card">
          <div className="relative h-56 sm:h-64 w-full bg-slate-900">
            <img
              src={requirement.cropImage}
              alt={requirement.cropName}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 text-white flex justify-between items-end">
              <div>
                <span className="bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1 inline-block">
                  {requirement.cropName}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black">
                  {requirement.quantity} {requirement.unit} Required
                </h1>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-300 block uppercase font-bold">Offer Rate</span>
                <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                  ₹{requirement.offerPrice}/kg
                </span>
              </div>
            </div>
          </div>

          {/* Key Details Grid */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Big Value Payout Box */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-2xl p-5 border border-emerald-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                  Total Estimated Payout to You
                </span>
                <p className="text-3xl sm:text-4xl font-black text-emerald-800 mt-0.5">
                  ₹{estimatedValue.toLocaleString('en-IN')}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold block mt-1">
                  ({requirement.quantity} kg × ₹{requirement.offerPrice}/kg) • Zero Commission
                </span>
              </div>

              <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-xs border border-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Guaranteed Payment</span>
              </div>
            </div>

            {/* Logistics & Location Specifications */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs font-semibold block">Pickup Location & Radius</span>
                <p className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{requirement.distanceKm || 15} km away (Farm Gate Pickup)</span>
                </p>
                <p className="text-xs text-slate-500">
                  Buyer vehicle will come directly to your farm gate in Koratagere.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                <span className="text-slate-400 text-xs font-semibold block">Required Date</span>
                <p className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{requirement.requiredDate}</span>
                </p>
                <p className="text-xs text-slate-500">
                  Scheduled time window will be shared upon acceptance.
                </p>
              </div>
            </div>

            {/* Buyer Profile & Trust Metrics */}
            <div className="bg-white rounded-2xl p-5 border-2 border-slate-100 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-slate-500" />
                  <span>Buyer Information & Verification</span>
                </h3>
                <VerifiedBadge text="Verified Buyer ✓" size="sm" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="text-lg font-black text-slate-900">
                    {requirement.buyerName}
                  </h4>
                  <p className="text-xs text-slate-500">
                    {requirement.buyerLocation}
                  </p>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold">Buyer Rating</span>
                    <div className="flex items-center gap-1 font-black text-slate-900 text-base">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span>{requirement.buyerRating} / 5.0</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold">Successful Purchases</span>
                    <span className="font-black text-slate-900 text-base">
                      {requirement.verifiedPurchases} orders
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons: ACCEPT / DECLINE */}
            <div className="pt-4 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleDecline}
                disabled={isDeclining || isAccepting}
                className="py-4 px-6 rounded-2xl border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-700 hover:text-red-700 font-bold text-sm transition-colors order-2 sm:order-1"
              >
                {t.decline}
              </button>

              <button
                type="button"
                onClick={handleAccept}
                disabled={isAccepting || isDeclining}
                className="flex-1 py-4 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-black text-lg shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all order-1 sm:order-2"
              >
                {isAccepting ? (
                  <span>Confirming Order...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    <span>{t.acceptOrder}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
