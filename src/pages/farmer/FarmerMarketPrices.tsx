import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Search,
  MapPin,
  Filter,
  TrendingUp,
  ArrowRight,
  ShieldAlert,
  Calendar,
  Sparkles,
} from 'lucide-react';

export const FarmerMarketPrices: React.FC = () => {
  const { crops } = useAppState();
  const { language, t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedMarket, setSelectedMarket] = useState<string>('All APMC Markets');

  const categories = ['All', 'Vegetables', 'Grains', 'Spices'];
  const markets = ['All APMC Markets', 'Kolār Market', 'Bengaluru APMC', 'Vijayapura Market', 'Tumakuru Yard'];

  const filteredCrops = crops.filter((crop) => {
    const localName = crop.localNames[language] || crop.name;
    const matchesSearch =
      crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      localName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || crop.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider">
                Mandi & APMC Rates
              </span>
              <h1 className="text-2xl sm:text-3xl font-black mt-1">
                {t.todaysMarketPrice}
              </h1>
              <p className="text-emerald-100 text-xs mt-1">
                Daily farm-gate and APMC benchmark rates with statutory MSP protection.
              </p>
            </div>

            <div className="bg-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/20 text-xs font-semibold flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-300" />
              <span>Updated: Today, 10:30 AM</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        {/* Filter and Search Controls */}
        <div className="bg-white rounded-2xl p-4 shadow-card border border-slate-200/80 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="sm:col-span-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search crop (e.g. Tomato, Paddy, Onion)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50"
              />
            </div>

            {/* Market / Location Selector */}
            <div className="sm:col-span-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4 h-4 text-emerald-600" />
              </div>
              <select
                value={selectedMarket}
                onChange={(e) => setSelectedMarket(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-slate-50/50 font-medium"
              >
                {markets.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-0.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Crop Price Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filteredCrops.map((crop) => {
            const localTitle = crop.localNames[language] || crop.name;
            return (
              <Link
                key={crop.id}
                to={`/farmer/market-prices/${crop.id}`}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-card transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-xl">
                      {crop.category}
                    </div>
                    {crop.mspPrice && (
                      <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-black px-2.5 py-1 rounded-xl shadow-xs flex items-center gap-1">
                        <span>MSP: ₹{crop.mspPrice}/kg</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-emerald-700 transition-colors">
                      {localTitle}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      {crop.name} • {crop.lastUpdated}
                    </p>

                    <div className="mt-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Today's Rate
                        </span>
                        <span className="text-xl font-black text-emerald-700">
                          ₹{crop.marketPrice}
                          <span className="text-xs font-semibold text-slate-500">/kg</span>
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Per Quintal
                        </span>
                        <span className="text-sm font-bold text-slate-700">
                          ₹{crop.pricePerQuintal.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-0">
                  <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1 transition-colors">
                    <span>View Market Details & Yard Comparison</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filteredCrops.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200">
            <p className="text-slate-500 font-medium text-sm">
              No crops found matching "{searchTerm}".
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
