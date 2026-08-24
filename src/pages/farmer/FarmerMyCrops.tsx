import React from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  PlusCircle,
  MapPin,
  Calendar,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export const FarmerMyCrops: React.FC = () => {
  const { farmerListings, buyerRequirements } = useAppState();
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();

  const currentFarmerId = currentUser?.id || 'farmer-ramesh-1';
  const myListings = farmerListings.filter((l) => l.farmerId === currentFarmerId || l.farmerName.includes('Ramesh'));

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider">
              Farm-Gate Inventory
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">{t.myCrops}</h1>
            <p className="text-emerald-100 text-xs mt-1">
              Manage your active crop listings and view instant buyer matches.
            </p>
          </div>

          <Link
            to="/farmer/crops/add"
            className="px-5 py-3 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-black text-xs shadow-md flex items-center gap-2 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4 text-emerald-700" />
            <span>{t.sellMyCrop}</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {myListings.map((listing) => {
            // Count matching buyer requirements
            const matchingCount = buyerRequirements.filter(
              (r) => r.cropId.toLowerCase() === listing.cropId.toLowerCase() && r.status !== 'Completed'
            ).length;

            return (
              <div
                key={listing.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-card hover:shadow-float transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={listing.cropImage}
                      alt={listing.cropName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl shadow-xs">
                      {listing.status}
                    </div>
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-1 rounded-xl flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-emerald-400" />
                      <span>Avail: {listing.availableDate}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-black text-slate-900">
                          {listing.cropName}
                        </h3>
                        <p className="text-xs text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{listing.location}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-black text-emerald-700">
                          {listing.quantity}
                        </span>
                        <span className="text-xs font-bold text-slate-500 ml-1">
                          {listing.unit}
                        </span>
                      </div>
                    </div>

                    {/* Match Alert Box */}
                    <div className="mt-4 p-3 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                        <div>
                          <span className="text-xs font-bold text-emerald-950 block">
                            {matchingCount} Matching Buyer Requirement(s)
                          </span>
                          <span className="text-[10px] text-emerald-700">
                            Verified buyers ready for farm pickup
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                  <Link
                    to={`/farmer/requirements?crop=${listing.cropId}`}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View Requirements for {listing.cropName}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {myListings.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-sm space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-2xl">
              🌾
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Crops Listed Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Add your harvest so our matching engine can connect you with nearby verified buyers.
            </p>
            <Link
              to="/farmer/crops/add"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
            >
              <PlusCircle className="w-4 h-4" />
              <span>List Your First Crop</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
