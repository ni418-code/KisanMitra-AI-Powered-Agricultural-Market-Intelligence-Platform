import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Phone, ShieldCheck, HelpCircle, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-sm border-t border-slate-800 pb-20 md:pb-8 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">
                Kisan<span className="text-emerald-400">Mitra</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              From Farm Gate to Buyer. Connecting Indian farmers directly with verified wholesale, retail, and institutional buyers at transparent prices.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Direct Farm-Gate Procurement</span>
            </div>
          </div>

          {/* Col 2: For Farmers */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">For Farmers</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/farmer/crops/add" className="hover:text-white transition-colors">
                  Sell My Crop (Direct Listing)
                </Link>
              </li>
              <li>
                <Link to="/farmer/market-prices" className="hover:text-white transition-colors">
                  Today's Mandi & APMC Rates
                </Link>
              </li>
              <li>
                <Link to="/farmer/requirements" className="hover:text-white transition-colors">
                  Browse Buyer Requirements
                </Link>
              </li>
              <li>
                <Link to="/farmer/help" className="hover:text-white transition-colors">
                  Toll-Free Voice Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: For Buyers */}
          <div>
            <h4 className="text-white font-bold text-sm mb-3">For Buyers</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/buyer/requirements/create" className="hover:text-white transition-colors">
                  Post Crop Requirement (with MSP Validation)
                </Link>
              </li>
              <li>
                <Link to="/buyer/find-crops" className="hover:text-white transition-colors">
                  Explore Farmer Harvests
                </Link>
              </li>
              <li>
                <Link to="/buyer/orders" className="hover:text-white transition-colors">
                  Farm-Gate Pickup & Logistics
                </Link>
              </li>
              <li>
                <Link to="/buyer/login" className="hover:text-white transition-colors">
                  Buyer Verification Program
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Toll Free */}
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              Farmer Help Desk
            </h4>
            <p className="text-lg font-bold text-emerald-400">1800-KISAN-MITRA</p>
            <p className="text-[11px] text-slate-400 mt-1">
              (1800-547-2664) • Available in Telugu, Hindi, Tamil, Kannada & Marathi.
            </p>
            <div className="mt-3 pt-3 border-t border-slate-700 text-[11px] text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" />
              <span>National Agri-Tech Hub, India</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© 2025 KisanMitra Agritech Technologies. Direct Farm-Gate Marketplace.</p>
          <div className="flex gap-4">
            <span>Non-Auction Guaranteed Pricing</span>
            <span>•</span>
            <span>Direct Bank UPI Settlement</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
