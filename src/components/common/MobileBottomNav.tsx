import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import {
  Home,
  Sprout,
  FileText,
  Package,
  User,
  Search,
  PlusCircle,
  TrendingUp,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { isFarmer, isBuyer, currentUser } = useAuth();
  const { unreadFarmerNotifCount, unreadBuyerNotifCount } = useAppState();

  if (!currentUser) return null;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-float py-2 px-3">
      <div className="flex items-center justify-around">
        {isFarmer ? (
          <>
            <NavLink
              to="/farmer/dashboard"
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                  isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Home</span>
            </NavLink>

            <NavLink
              to="/farmer/crops"
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                  isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Sprout className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">My Crops</span>
            </NavLink>

            {/* Central Big Sell CTA */}
            <NavLink
              to="/farmer/crops/add"
              className="flex flex-col items-center -mt-6 group"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-600 group-hover:bg-emerald-700 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 border-2 border-white transition-transform active:scale-95">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-emerald-800 mt-0.5">Sell Crop</span>
            </NavLink>

            <NavLink
              to="/farmer/requirements"
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                  isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <FileText className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Requests</span>
            </NavLink>

            <NavLink
              to="/farmer/orders"
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                  isActive ? 'text-emerald-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Package className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Orders</span>
            </NavLink>
          </>
        ) : isBuyer ? (
          <>
            <NavLink
              to="/buyer/dashboard"
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                  isActive ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Home className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Home</span>
            </NavLink>

            <NavLink
              to="/buyer/find-crops"
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                  isActive ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Search className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Find Crops</span>
            </NavLink>

            {/* Central Post Requirement CTA */}
            <NavLink
              to="/buyer/requirements/create"
              className="flex flex-col items-center -mt-6 group"
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 group-hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 border-2 border-white transition-transform active:scale-95">
                <PlusCircle className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold text-blue-800 mt-0.5">Post Need</span>
            </NavLink>

            <NavLink
              to="/buyer/requirements"
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                  isActive ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <FileText className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">My Needs</span>
            </NavLink>

            <NavLink
              to="/buyer/orders"
              className={({ isActive }) =>
                `flex flex-col items-center py-1 px-2 rounded-xl transition-all ${
                  isActive ? 'text-blue-700 font-bold' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              <Package className="w-5 h-5 mb-0.5" />
              <span className="text-[10px]">Orders</span>
            </NavLink>
          </>
        ) : null}
      </div>
    </div>
  );
};
