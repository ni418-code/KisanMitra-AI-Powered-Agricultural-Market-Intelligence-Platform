import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { VerifiedBadge } from '../../components/common/VerifiedBadge';
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Star,
  PackageCheck,
  LogOut,
  Sparkles,
} from 'lucide-react';

export const BuyerProfile: React.FC = () => {
  const { currentUser, logout, loginAsDemoFarmer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSwitchToFarmer = () => {
    loginAsDemoFarmer();
    navigate('/farmer/dashboard');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <span className="text-blue-300 text-xs font-bold uppercase tracking-wider">
            Buyer Account
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">Enterprise Profile</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-slate-100 text-center sm:text-left">
            <img
              src={currentUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser?.name || 'Buyer'}
              className="w-24 h-24 rounded-3xl object-cover ring-4 ring-blue-500/20 shadow-md"
            />

            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black text-slate-900">
                  {currentUser?.name || 'FreshMart Traders'}
                </h2>
                <VerifiedBadge text="Enterprise Verified ✓" size="sm" />
              </div>

              <p className="text-xs text-slate-500 font-medium flex items-center justify-center sm:justify-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{currentUser?.location || 'Bengaluru Wholesale Hub, Karnataka'}</span>
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-3 text-xs">
                <div className="flex items-center gap-1 font-bold text-slate-800">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{currentUser?.rating || 4.8} Rating</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-blue-700">
                  <PackageCheck className="w-4 h-4" />
                  <span>{currentUser?.completedOrdersCount || 124} Procurements Fulfilled</span>
                </div>
              </div>
            </div>
          </div>

          {/* Details List */}
          <div className="py-6 space-y-4 text-xs border-b border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-slate-400" />
                Business Type:
              </span>
              <span className="font-extrabold text-slate-900">
                {currentUser?.businessType || 'Wholesale & Retail Chain'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400" />
                Procurement Desk Phone:
              </span>
              <span className="font-extrabold text-slate-900">{currentUser?.phone || '+91 98765 43210'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400" />
                Email:
              </span>
              <span className="font-extrabold text-slate-900">{currentUser?.email || 'procurements@freshmarttraders.com'}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                GST / FSSAI License:
              </span>
              <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                GSTIN: 29AABCF1234F1Z5 (Active ✓)
              </span>
            </div>
          </div>

          {/* Crops Typically Procured */}
          <div className="pt-6">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Commodities Usually Procured
            </h3>
            <div className="flex flex-wrap gap-2">
              {['Tomato', 'Red Onion', 'Potato', 'Green Chilli', 'Paddy (Rice)', 'Maize'].map((crop) => (
                <span
                  key={crop}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200"
                >
                  🌾 {crop}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Switch Persona / Logout */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Portal Navigation
          </h3>

          <button
            onClick={handleSwitchToFarmer}
            className="w-full p-3.5 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-between transition-colors"
          >
            <span>Switch to Farmer Portal (Ramesh Patil)</span>
            <span className="text-emerald-700">Switch ➔</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full p-3.5 rounded-2xl bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-700 font-bold text-xs flex items-center justify-between transition-colors"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-4 h-4" />
              <span>Log Out of Buyer Account</span>
            </span>
            <span>➔</span>
          </button>
        </div>
      </div>
    </div>
  );
};
