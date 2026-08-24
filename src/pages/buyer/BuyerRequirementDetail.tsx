import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { VerifiedBadge } from '../../components/common/VerifiedBadge';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Sparkles,
  Search,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Phone,
  AlertCircle,
} from 'lucide-react';

export const BuyerRequirementDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { buyerRequirements, farmerListings } = useAppState();
  const navigate = useNavigate();

  const requirement = buyerRequirements.find((r) => r.id === id) || buyerRequirements[0];

  if (!requirement) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Requirement Not Found</h2>
          <button
            onClick={() => navigate('/buyer/requirements')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Back to Requirements
          </button>
        </div>
      </div>
    );
  }

  // Find matching farmers from farmer listings
  const matchingListings = farmerListings.filter(
    (l) => l.cropId.toLowerCase() === requirement.cropId.toLowerCase() && l.status === 'Available'
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 text-white py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/buyer/requirements')}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-200 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Requirements</span>
          </button>
          <div className="text-xs font-bold bg-white/15 px-3 py-1 rounded-full">
            Requirement #{requirement.id.slice(-6)}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        {/* Requirement Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <img
                src={requirement.cropImage}
                alt={requirement.cropName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                    {requirement.cropName}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    Status: {requirement.status}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {requirement.quantity} {requirement.unit} @ ₹{requirement.offerPrice}/kg
                </h1>
                <p className="text-xs text-slate-500 mt-1">
                  Pickup Radius: <strong>Within {requirement.pickupRadiusKm} km</strong> • Needed: <strong>{requirement.requiredDate}</strong>
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <span className="text-xs font-bold text-slate-400 block uppercase">
                Estimated Valuation
              </span>
              <span className="text-3xl font-black text-blue-900">
                ₹{(requirement.quantity * requirement.offerPrice).toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-blue-700 block font-semibold mt-0.5">
                MSP Validated ✓
              </span>
            </div>
          </div>

          <div className="pt-4 text-xs text-slate-600">
            <span className="font-bold text-slate-900">Procurement Notes: </span>
            {requirement.notes}
          </div>
        </div>

        {/* Matching Farmers Section */}
        {matchingListings.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <h3 className="text-lg font-black text-slate-900">
                  {matchingListings.length} Matching Farmer(s) Discovered
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Ranked by proximity & available quantity
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchingListings.map((farmerListing) => (
                <div
                  key={farmerListing.id}
                  className="bg-white rounded-3xl p-5 border-2 border-emerald-500/30 hover:border-emerald-600 shadow-card transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-extrabold text-base text-slate-900">
                            {farmerListing.farmerName}
                          </h4>
                          <VerifiedBadge size="sm" showIconOnly />
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{farmerListing.location}</span>
                          <span>•</span>
                          <span className="font-bold text-emerald-700">{farmerListing.distanceKm || 15} km away</span>
                        </p>
                      </div>

                      <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-xl">
                        {farmerListing.quantity} {farmerListing.unit} Available
                      </span>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1 border border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Available Date:</span>
                        <span className="font-bold text-slate-800">{farmerListing.availableDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Farmer Rating:</span>
                        <span className="font-bold text-amber-600">★ {farmerListing.farmerRating}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Your Offer:</span>
                        <span className="font-black text-emerald-700">₹{requirement.offerPrice}/kg</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Notification sent to farmer</span>
                    <Link
                      to="/buyer/orders"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                    >
                      Track Order
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* SECTION 26: NO MATCHING FARMER STATE */
          <div className="bg-white rounded-3xl p-8 sm:p-12 text-center border border-slate-200 shadow-card space-y-4">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <Clock className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">
                No Matching Farmers Right Now
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Your requirement has been saved. We will notify you automatically the moment a matching farmer lists {requirement.cropName} in your radius.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Status: Looking for farmers...</span>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={() => navigate('/buyer/dashboard')}
                className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition-colors"
              >
                KEEP REQUIREMENT ACTIVE
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
