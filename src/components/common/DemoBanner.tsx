import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { UserCheck, RefreshCw, Sparkles } from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const { currentRole, loginAsDemoFarmer, loginAsDemoBuyer, logout } = useAuth();
  const { resetDemoData } = useAppState();
  const navigate = useNavigate();
  const location = useLocation();

  const handleFarmerSwitch = () => {
    loginAsDemoFarmer();
    if (!location.pathname.startsWith('/farmer')) {
      navigate('/farmer/dashboard');
    }
  };

  const handleBuyerSwitch = () => {
    loginAsDemoBuyer();
    if (!location.pathname.startsWith('/buyer')) {
      navigate('/buyer/dashboard');
    }
  };

  const handleLandingSwitch = () => {
    logout();
    navigate('/');
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo listings, requirements, and orders to initial demo state?')) {
      resetDemoData();
      loginAsDemoFarmer();
      navigate('/farmer/dashboard');
    }
  };

  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-4 sticky top-0 z-50 shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Interactive Demo Mode
          </span>
          <span className="hidden sm:inline text-slate-400">
            Active view: <strong className="text-white capitalize">{currentRole === 'guest' ? 'Public Landing' : currentRole}</strong>
          </span>
        </div>

        <div className="flex items-center flex-wrap gap-1.5">
          <span className="text-slate-400 hidden md:inline text-[11px] mr-1">Switch Persona:</span>
          
          <button
            onClick={handleFarmerSwitch}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
              currentRole === 'farmer'
                ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <span>🌾</span>
            <span>Farmer Ramesh</span>
          </button>

          <button
            onClick={handleBuyerSwitch}
            className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
              currentRole === 'buyer'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <span>🏪</span>
            <span>Buyer FreshMart</span>
          </button>

          <button
            onClick={handleLandingSwitch}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              currentRole === 'guest'
                ? 'bg-slate-700 text-white ring-1 ring-slate-400'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <span>🌐 Landing</span>
          </button>

          <button
            onClick={handleReset}
            title="Reset to fresh demo data"
            className="p-1 hover:bg-slate-700 text-slate-400 hover:text-white rounded ml-1 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
