import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Phone,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Briefcase,
} from 'lucide-react';

export const BuyerLoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const { loginAsDemoBuyer, loginWithCredentials, registerBuyer } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [mobileOrEmail, setMobileOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Register Form State
  const [registerData, setRegisterData] = useState({
    businessName: '',
    phone: '',
    email: '',
    businessType: 'Wholesale & Retail Chain',
    location: '',
    state: 'Karnataka',
    password: '',
    confirmPassword: '',
  });

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!mobileOrEmail.trim()) {
      setError('Please enter your mobile number or registered email.');
      return;
    }

    const res = loginWithCredentials(mobileOrEmail, password, 'buyer');
    if (res.success) {
      navigate('/buyer/dashboard');
    } else {
      setError(res.error || 'Invalid buyer credentials. Please verify or register your business.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!registerData.businessName.trim()) {
      setError('Please enter your company or business name.');
      return;
    }
    if (!registerData.phone || registerData.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!registerData.location.trim()) {
      setError('Please enter your procurement location or city.');
      return;
    }
    if (registerData.password && registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = registerBuyer({
      businessName: registerData.businessName,
      phone: registerData.phone,
      email: registerData.email || 'procurements@trade.com',
      businessType: registerData.businessType,
      location: registerData.location,
      state: registerData.state,
      password: registerData.password || 'password123',
    });

    if (res.success) {
      navigate('/buyer/dashboard');
    } else {
      setError(res.error || 'Failed to create buyer account.');
    }
  };

  const handle1ClickDemo = () => {
    loginAsDemoBuyer();
    navigate('/buyer/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-blue-100 shadow-card my-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white mb-3 shadow-md">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {mode === 'login' ? 'Buyer Portal Login' : 'Create Buyer Account'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Enterprise Agricultural Procurement • Direct Farm-Gate Supply
          </p>
        </div>

        {/* Tab Toggle: Login vs Register */}
        <div className="bg-slate-100 p-1 rounded-2xl flex mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Buyer Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* 1-Click Demo Shortcut */}
        <button
          type="button"
          onClick={handle1ClickDemo}
          className="w-full mb-6 p-3 rounded-2xl bg-blue-50 hover:bg-blue-100/80 border border-blue-200 text-blue-900 flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
              🏪
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">1-Click Fast Login as FreshMart Traders</p>
              <p className="text-[11px] text-blue-700">Bengaluru Wholesale Hub • 124 Verified Orders</p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-700 group-hover:translate-x-0.5 transition-transform flex items-center">
            Login <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </button>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* MODE 1: BUYER LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number or Business Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={mobileOrEmail}
                  onChange={(e) => setMobileOrEmail(e.target.value)}
                  placeholder="e.g. 9876543210 or procurements@freshmart.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={handle1ClickDemo}
                  className="text-xs font-semibold text-blue-700 hover:underline"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-colors"
            >
              Sign In as Buyer
            </button>
          </form>
        ) : (
          /* MODE 2: CREATE BUYER ACCOUNT FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Company / Business Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Building2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={registerData.businessName}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, businessName: e.target.value })
                  }
                  placeholder="e.g. FreshMart Agri Supply Pvt Ltd"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={registerData.phone}
                    onChange={(e) =>
                      setRegisterData({
                        ...registerData,
                        phone: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    placeholder="9876543210"
                    maxLength={10}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Business Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={registerData.email}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, email: e.target.value })
                    }
                    placeholder="procurement@freshmart.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Business Type
                </label>
                <select
                  value={registerData.businessType}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, businessType: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white font-medium"
                >
                  <option value="Wholesale & Retail Chain">Wholesale & Retail Chain</option>
                  <option value="Food Processing Mill">Food Processing Mill</option>
                  <option value="Supermarket / Hypermarket">Supermarket / Hypermarket</option>
                  <option value="Agri-Exporter">Agri-Exporter</option>
                  <option value="APMC Commission Trader">APMC Licensed Trader</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Procurement Hub Location *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={registerData.location}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, location: e.target.value })
                    }
                    placeholder="e.g. Bengaluru Wholesale Hub"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, password: e.target.value })
                  }
                  placeholder="4+ characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, confirmPassword: e.target.value })
                  }
                  placeholder="Confirm password"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-colors"
            >
              Create Account & Start Sourcing
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
