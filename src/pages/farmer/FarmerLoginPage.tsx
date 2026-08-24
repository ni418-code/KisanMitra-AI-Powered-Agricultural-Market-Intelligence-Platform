import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { VoiceInputModal } from '../../components/common/VoiceInputModal';
import { Language } from '../../types';
import {
  Sprout,
  Phone,
  Lock,
  Mic,
  ArrowRight,
  ShieldCheck,
  User,
  MapPin,
  Globe,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const FarmerLoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';

  const { loginAsDemoFarmer, loginWithCredentials, registerFarmer } = useAuth();
  const { t, setLanguage } = useLanguage();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);

  // Registration Form State
  const [registerData, setRegisterData] = useState({
    name: '',
    phone: '',
    village: '',
    location: '',
    state: 'Karnataka',
    language: 'en' as Language,
    password: '',
    confirmPassword: '',
  });

  const languagesList = [
    { code: 'en', label: 'English' },
    { code: 'te', label: 'తెలుగు (Telugu)' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'ta', label: 'தமிழ் (Tamil)' },
    { code: 'mr', label: 'मराठी (Marathi)' },
  ];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!mobile.trim()) {
      setError('Please enter your 10-digit mobile number.');
      return;
    }

    const res = loginWithCredentials(mobile, password, 'farmer');
    if (res.success) {
      navigate('/farmer/dashboard');
    } else {
      setError(res.error || 'Invalid credentials. Please try again or create an account.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!registerData.name.trim()) {
      setError('Please enter your full name.');
      return;
    }
    if (!registerData.phone || registerData.phone.replace(/\D/g, '').length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!registerData.village.trim() || !registerData.location.trim()) {
      setError('Please enter your village and district.');
      return;
    }
    if (registerData.password && registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const res = registerFarmer({
      name: registerData.name,
      phone: registerData.phone,
      village: registerData.village,
      location: registerData.location,
      state: registerData.state,
      language: registerData.language,
      password: registerData.password || 'pass123',
    });

    if (res.success) {
      setLanguage(registerData.language);
      navigate('/farmer/dashboard');
    } else {
      setError(res.error || 'Registration failed. Please check inputs.');
    }
  };

  const handle1ClickDemo = () => {
    loginAsDemoFarmer();
    navigate('/farmer/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-emerald-100 shadow-card my-6">
        {/* Top Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600 text-white mb-3 shadow-md">
            <span className="text-3xl">🌾</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {mode === 'login' ? t.farmerLogin : 'Create Farmer Account'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Direct Farm-Gate Marketplace • Transparent Prices & Zero Commission
          </p>
        </div>

        {/* Tab Selector: Login vs Register */}
        <div className="bg-slate-100 p-1 rounded-2xl flex mb-6 border border-slate-200">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'login'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Farmer Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError('');
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'register'
                ? 'bg-emerald-600 text-white shadow-xs'
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
          className="w-full mb-6 p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-900 flex items-center justify-between transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
              🌾
            </div>
            <div className="text-left">
              <p className="text-xs font-bold">1-Click Fast Login as Ramesh Patil</p>
              <p className="text-[11px] text-emerald-700">Koratagere • 500 kg Tomato Harvest Ready</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center">
            Login <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </button>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {/* MODE 1: LOGIN FORM */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 9845123456"
                  maxLength={10}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="text-xs font-semibold text-emerald-700 hover:underline"
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
                  placeholder="Enter password (or leave blank for demo)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-colors"
            >
              Sign In to Farmer Account
            </button>
          </form>
        ) : (
          /* MODE 2: CREATE FARMER ACCOUNT FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                  placeholder="e.g. Ramesh Patil"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

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
                  placeholder="e.g. 9845123456"
                  maxLength={10}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Village / Town *
                </label>
                <input
                  type="text"
                  required
                  value={registerData.village}
                  onChange={(e) => setRegisterData({ ...registerData, village: e.target.value })}
                  placeholder="e.g. Koratagere"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  District *
                </label>
                <input
                  type="text"
                  required
                  value={registerData.location}
                  onChange={(e) => setRegisterData({ ...registerData, location: e.target.value })}
                  placeholder="e.g. Tumakuru"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  State
                </label>
                <select
                  value={registerData.state}
                  onChange={(e) => setRegisterData({ ...registerData, state: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                >
                  <option value="Karnataka">Karnataka</option>
                  <option value="Andhra Pradesh">Andhra Pradesh</option>
                  <option value="Telangana">Telangana</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Maharashtra">Maharashtra</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Preferred Language
                </label>
                <select
                  value={registerData.language}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, language: e.target.value as Language })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                >
                  {languagesList.map((l) => (
                    <option key={l.code} value={l.code}>
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Create Password *
                </label>
                <input
                  type="password"
                  required
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                  placeholder="4+ characters"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-colors"
            >
              Create Account & Login
            </button>
          </form>
        )}

        {/* Tap to speak */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-center">
          <button
            type="button"
            onClick={() => setVoiceModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 text-xs font-bold transition-colors border border-slate-200"
          >
            <Mic className="w-4 h-4 text-emerald-600 animate-pulse" />
            <span>{t.tapToSpeak}</span>
          </button>
        </div>
      </div>

      <VoiceInputModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onResult={() => {
          loginAsDemoFarmer();
          navigate('/farmer/dashboard');
        }}
      />
    </div>
  );
};
