import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAppState } from '../../context/AppStateContext';
import { useLanguage } from '../../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import {
  Sprout,
  Bell,
  User as UserIcon,
  MapPin,
  PlusCircle,
  Menu,
  X,
  PhoneCall,
  ShoppingBag,
  TrendingUp,
  PackageCheck,
  Search,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentUser, isFarmer, isBuyer, logout } = useAuth();
  const { unreadFarmerNotifCount, unreadBuyerNotifCount, notifications } = useAppState();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadCount = isFarmer ? unreadFarmerNotifCount : unreadBuyerNotifCount;

  const getRoleTheme = () => {
    if (isFarmer) {
      return {
        bg: 'bg-white border-b border-emerald-100',
        brandColor: 'text-emerald-700',
        activeLink: 'text-emerald-700 font-bold bg-emerald-50',
        btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      };
    }
    if (isBuyer) {
      return {
        bg: 'bg-white border-b border-blue-100',
        brandColor: 'text-blue-700',
        activeLink: 'text-blue-700 font-bold bg-blue-50',
        btnPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
        badge: 'bg-blue-100 text-blue-800 border-blue-200',
      };
    }
    return {
      bg: 'bg-white border-b border-slate-200',
      brandColor: 'text-emerald-700',
      activeLink: 'text-emerald-700 font-bold bg-emerald-50',
      btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-white',
      badge: 'bg-slate-100 text-slate-800 border-slate-200',
    };
  };

  const theme = getRoleTheme();

  return (
    <header className={`${theme.bg} sticky top-[33px] z-40 shadow-xs transition-colors`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to={isFarmer ? '/farmer/dashboard' : isBuyer ? '/buyer/dashboard' : '/'} className="flex items-center gap-2.5 group">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md transition-transform group-hover:scale-105 ${isBuyer ? 'bg-gradient-to-tr from-blue-700 to-blue-500' : 'bg-gradient-to-tr from-emerald-700 to-emerald-500'}`}>
                <Sprout className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 leading-none">
                  Kisan<span className={isBuyer ? 'text-blue-600' : 'text-emerald-600'}>Mitra</span>
                </span>
                <span className="text-[10px] text-slate-500 font-medium tracking-wide">
                  From Farm Gate to Buyer
                </span>
              </div>
            </Link>

            {/* User Location Badge */}
            {currentUser && (
              <div className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${theme.badge}`}>
                <MapPin className="w-3.5 h-3.5" />
                <span className="truncate max-w-[180px]">{currentUser.location}</span>
              </div>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {isFarmer ? (
              <>
                <Link
                  to="/farmer/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === '/farmer/dashboard' ? theme.activeLink : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.home}
                </Link>
                <Link
                  to="/farmer/crops"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/farmer/crops') ? theme.activeLink : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.myCrops}
                </Link>
                <Link
                  to="/farmer/market-prices"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/farmer/market-prices') ? theme.activeLink : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Mandi Prices
                </Link>
                <Link
                  to="/farmer/requirements"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/farmer/requirements') ? theme.activeLink : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Buyer Requests
                </Link>
                <Link
                  to="/farmer/orders"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/farmer/orders') ? theme.activeLink : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Orders
                </Link>
                <Link
                  to="/farmer/help"
                  className="px-3 py-2 rounded-lg text-sm font-medium text-emerald-800 bg-emerald-50 hover:bg-emerald-100 flex items-center gap-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Help Desk</span>
                </Link>
              </>
            ) : isBuyer ? (
              <>
                <Link
                  to="/buyer/dashboard"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === '/buyer/dashboard' ? theme.activeLink : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/buyer/find-crops"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === '/buyer/find-crops' ? theme.activeLink : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Find Crops
                </Link>
                <Link
                  to="/buyer/requirements"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/buyer/requirements') ? theme.activeLink : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  My Requirements
                </Link>
                <Link
                  to="/buyer/orders"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname.startsWith('/buyer/orders') ? theme.activeLink : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Orders
                </Link>
                <Link
                  to="/buyer/requirements/create"
                  className="ml-2 px-3.5 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-xs flex items-center gap-1.5 transition-all hover:shadow-md"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Post Requirement</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="/" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Home
                </Link>
                <Link to="/farmer/market-prices" className="px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Market Prices
                </Link>
                <Link to="/farmer/login" className="px-3 py-2 rounded-lg text-sm font-bold text-emerald-700 hover:bg-emerald-50">
                  🌾 Farmer Login
                </Link>
                <Link to="/buyer/login" className="px-3 py-2 rounded-lg text-sm font-bold text-blue-700 hover:bg-blue-50">
                  🏪 Buyer Login
                </Link>
              </>
            )}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Selector */}
            <LanguageSelector variant="light" />

            {/* Notification Bell */}
            {currentUser && (
              <Link
                to={isFarmer ? '/farmer/notifications' : '/buyer/notifications'}
                className="relative p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {/* Profile Avatar / Login CTA */}
            {currentUser ? (
              <Link
                to={isFarmer ? '/farmer/profile' : '/buyer/profile'}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-emerald-500/30"
                />
                <span className="text-xs font-bold text-slate-800 hidden sm:inline max-w-[100px] truncate">
                  {currentUser.name}
                </span>
              </Link>
            ) : (
              <Link
                to="/user-select"
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              >
                Login / Register
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top duration-150">
          {currentUser && (
            <div className="flex items-center gap-2 p-2 bg-slate-50 rounded-xl mb-3">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-slate-700">{currentUser.location}</span>
            </div>
          )}

          {isFarmer ? (
            <>
              <Link
                to="/farmer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800"
              >
                🌾 {t.home}
              </Link>
              <Link
                to="/farmer/crops"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800"
              >
                🌱 {t.myCrops}
              </Link>
              <Link
                to="/farmer/crops/add"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-bold text-emerald-700 bg-emerald-50"
              >
                ➕ {t.sellMyCrop}
              </Link>
              <Link
                to="/farmer/market-prices"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800"
              >
                📈 {t.todaysMarketPrice}
              </Link>
              <Link
                to="/farmer/requirements"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800"
              >
                📋 {t.buyerRequirements}
              </Link>
              <Link
                to="/farmer/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800"
              >
                📦 {t.myOrders}
              </Link>
              <Link
                to="/farmer/help"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-800"
              >
                ☎️ {t.help}
              </Link>
            </>
          ) : isBuyer ? (
            <>
              <Link
                to="/buyer/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-800"
              >
                📊 Dashboard
              </Link>
              <Link
                to="/buyer/find-crops"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-800"
              >
                🔍 Find Farmer Crops
              </Link>
              <Link
                to="/buyer/requirements"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-800"
              >
                📋 My Requirements
              </Link>
              <Link
                to="/buyer/requirements/create"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-bold text-white bg-blue-600 text-center"
              >
                ➕ Post New Requirement
              </Link>
              <Link
                to="/buyer/orders"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-800"
              >
                📦 My Orders
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl font-semibold text-slate-800 hover:bg-slate-50"
              >
                Home
              </Link>
              <Link
                to="/farmer/market-prices"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl font-semibold text-slate-800 hover:bg-slate-50"
              >
                Market Prices
              </Link>
              <Link
                to="/user-select"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl font-bold text-center bg-emerald-600 text-white"
              >
                Get Started (Farmer / Buyer)
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};
