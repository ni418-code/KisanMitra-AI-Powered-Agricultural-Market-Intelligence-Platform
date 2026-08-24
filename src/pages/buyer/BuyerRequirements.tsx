import React from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import {
  FileText,
  PlusCircle,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Clock,
  Users,
} from 'lucide-react';

export const BuyerRequirements: React.FC = () => {
  const { buyerRequirements } = useAppState();

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-blue-300 text-xs font-bold uppercase tracking-wider">
              Procurement Demands
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">My Crop Requirements</h1>
            <p className="text-blue-100 text-xs mt-1">
              Active requirements broadcast to local farmers with MSP compliance.
            </p>
          </div>

          <Link
            to="/buyer/requirements/create"
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Requirement</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        <div className="space-y-4">
          {buyerRequirements.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-card hover:shadow-float transition-all flex flex-col md:flex-row md:items-center justify-between gap-5"
            >
              <div className="flex items-start sm:items-center gap-4">
                <img
                  src={req.cropImage}
                  alt={req.cropName}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                />

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black text-slate-500">#{req.id.slice(-6)}</span>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        req.status === 'Accepted'
                          ? 'bg-emerald-100 text-emerald-800'
                          : req.status === 'Farmer Matched'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-slate-900">
                    {req.quantity} {req.unit} of {req.cropName}
                  </h3>

                  <p className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span>Offer: <strong>₹{req.offerPrice}/kg</strong></span>
                    <span>•</span>
                    <span>Radius: <strong>Within {req.pickupRadiusKm} km</strong></span>
                    <span>•</span>
                    <span>Date: <strong>{req.requiredDate}</strong></span>
                  </p>
                </div>
              </div>

              {/* Status and Action */}
              <div className="flex sm:flex-row md:flex-col items-center sm:items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                <div className="text-left md:text-right">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">
                    Estimated Budget
                  </span>
                  <span className="text-2xl font-black text-slate-900">
                    ₹{(req.quantity * req.offerPrice).toLocaleString('en-IN')}
                  </span>
                </div>

                <Link
                  to={`/buyer/requirements/${req.id}`}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 flex items-center gap-1.5 transition-colors"
                >
                  <span>View Matches ({req.matchedFarmerIds.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
