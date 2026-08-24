import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { FarmerLoginPage } from './farmer/FarmerLoginPage';
import { BuyerLoginPage } from './buyer/BuyerLoginPage';
import { Sprout, Building2 } from 'lucide-react';

export const UnifiedAuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'buyer' ? 'buyer' : 'farmer';
  const [role, setRole] = useState<'farmer' | 'buyer'>(initialRole);

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Top Role Switcher Header */}
      <div className="bg-white border-b border-slate-200 py-3 px-4 shadow-xs">
        <div className="max-w-lg mx-auto flex items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => setRole('farmer')}
            className={`flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              role === 'farmer'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-2 ring-emerald-400/40'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🌾</span>
            <span>Farmer Account</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('buyer')}
            className={`flex-1 py-2.5 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all ${
              role === 'buyer'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-2 ring-blue-400/40'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>🏪</span>
            <span>Buyer Account</span>
          </button>
        </div>
      </div>

      {/* Render Role-Specific Interactive Auth Portal */}
      {role === 'farmer' ? <FarmerLoginPage /> : <BuyerLoginPage />}
    </div>
  );
};
