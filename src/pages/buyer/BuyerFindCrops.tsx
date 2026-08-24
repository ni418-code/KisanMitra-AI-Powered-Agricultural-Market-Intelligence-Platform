import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { VerifiedBadge } from '../../components/common/VerifiedBadge';
import {
  Search,
  MapPin,
  Calendar,
  Filter,
  PlusCircle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
} from 'lucide-react';

export const BuyerFindCrops: React.FC = () => {
  const { farmerListings, crops } = useAppState();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCropFilter, setSelectedCropFilter] = useState('All');
  const [maxRadius, setMaxRadius] = useState<number>(50);

  const availableListings = farmerListings.filter((l) => l.status === 'Available');

  const filtered = availableListings.filter((listing) => {
    const matchesSearch =
      listing.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.farmerVillage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.farmerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCrop =
      selectedCropFilter === 'All' ||
      listing.cropId.toLowerCase() === selectedCropFilter.toLowerCase();

    const matchesRadius = (listing.distanceKm || 15) <= maxRadius;

    return matchesSearch && matchesCrop && matchesRadius;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-blue-300 text-xs font-bold uppercase tracking-wider">
              Farm-Gate Supply Catalog
            </span>
            <h1 className="text-2xl sm:text-3xl font-black mt-1">
              Find Available Farmer Crops
            </h1>
            <p className="text-blue-100 text-xs mt-1">
              Direct farmer harvest listings ready for farm-gate dispatch & pickup.
            </p>
          </div>

          <Link
            to="/buyer/requirements/create"
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs shadow-lg shadow-blue-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Requirement Instead</span>
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-card space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by crop, farmer name, or village..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedCropFilter}
                onChange={(e) => setSelectedCropFilter(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-medium"
              >
                <option value="All">All Crops</option>
                {crops.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={maxRadius}
                onChange={(e) => setMaxRadius(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50 font-medium"
              >
                <option value={15}>Within 15 km</option>
                <option value={30}>Within 30 km</option>
                <option value={50}>Within 50 km</option>
                <option value={100}>Within 100 km</option>
              </select>
            </div>
          </div>
        </div>

        {/* Available Crops Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((listing) => {
            const cropMaster = crops.find((c) => c.id === listing.cropId);
            const marketRate = cropMaster?.marketPrice || 30;

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
                      {listing.quantity} {listing.unit} Available
                    </div>
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-1 rounded-xl">
                      📍 {listing.distanceKm || 15} km away
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-xl font-black text-slate-900">
                        {listing.cropName}
                      </h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>Village: <strong>{listing.farmerVillage}</strong></span>
                      </p>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Farmer:</span>
                        <span className="font-bold text-slate-900 flex items-center gap-1">
                          {listing.farmerName}
                          <VerifiedBadge size="sm" showIconOnly />
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Available Date:</span>
                        <span className="font-bold text-slate-900">{listing.availableDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Benchmark Rate:</span>
                        <span className="font-black text-emerald-700">₹{marketRate}/kg</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                  <Link
                    to={`/buyer/requirements/create?crop=${listing.cropId}`}
                    className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all hover:scale-[1.01]"
                  >
                    <span>Post Matching Requirement</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-3">
            <Search className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No Listings Found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search query or radius filter.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
