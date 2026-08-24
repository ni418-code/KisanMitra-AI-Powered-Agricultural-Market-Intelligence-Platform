import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, Phone, Mail, MapPin, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export const BuyerRegisterPage: React.FC = () => {
  const { loginCustom } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    email: '',
    businessType: 'Wholesale & Retail Chain',
    location: '',
    state: 'Karnataka',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName.trim()) {
      setError('Please enter your business or company name.');
      return;
    }
    if (!formData.phone || formData.phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.location.trim()) {
      setError('Please enter your primary procurement location.');
      return;
    }
    if (formData.password.length < 4) {
      setError('Password must be at least 4 characters.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const newBuyer = {
      id: `buyer-${Date.now().toString().slice(-5)}`,
      name: formData.businessName,
      role: 'buyer' as const,
      phone: `+91 ${formData.phone}`,
      email: formData.email || 'buyer@trade.com',
      villageOrBusinessName: formData.businessName,
      location: formData.location,
      state: formData.state,
      language: 'en' as const,
      isVerified: true,
      rating: 5.0,
      completedOrdersCount: 0,
      businessType: formData.businessType,
      cropsGrownOrPurchased: ['Tomato', 'Red Onion', 'Potato'],
    };

    loginCustom(newBuyer);
    navigate('/buyer/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 bg-slate-50">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-blue-100 shadow-card my-8">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white mb-3 shadow-md">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Create Buyer Account</h1>
          <p className="text-xs text-slate-500 mt-1">
            Verified procurement portal for wholesalers, retailers, and food processors
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
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
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
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
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="procurement@corp.com"
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
                value={formData.businessType}
                onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
                Procurement Hub / Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bengaluru Wholesale Hub"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Confirm password"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-colors"
          >
            Create Buyer Account
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-slate-500">
          Already registered?{' '}
          <Link to="/buyer/login" className="font-bold text-blue-700 hover:underline">
            Buyer Login
          </Link>
        </div>
      </div>
    </div>
  );
};
