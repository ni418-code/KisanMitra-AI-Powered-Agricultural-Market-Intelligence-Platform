import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Sprout, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const UserSelectionPage: React.FC = () => {
  const { loginAsDemoFarmer, loginAsDemoBuyer } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleFarmerChoice = () => {
    loginAsDemoFarmer();
    navigate('/farmer/dashboard');
  };

  const handleBuyerChoice = () => {
    loginAsDemoBuyer();
    navigate('/buyer/dashboard');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-slate-50">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white mb-3 shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            How will you use KisanMitra?
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Choose your account role to experience tailored interfaces for farm-gate agricultural trade.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Farmer Card */}
          <div className="bg-white rounded-3xl p-7 border-2 border-emerald-500/40 hover:border-emerald-600 shadow-card hover:shadow-float transition-all flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-emerald-50 rounded-bl-full pointer-events-none -z-0" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🌾</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                I'm a Farmer
              </h2>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Sell your crops directly to verified buyers at transparent prices. Get farm-gate pickup & instant UPI payout.
              </p>

              <div className="space-y-2 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Simple visual interface with Voice input</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>View daily Mandi and MSP rates</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Zero middleman commission</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              <button
                onClick={handleFarmerChoice}
                className="w-full py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:gap-3"
              >
                <span>Continue as Farmer</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex justify-between text-xs font-semibold text-slate-500 pt-1 px-1">
                <Link to="/farmer/login" className="hover:text-emerald-700">
                  Farmer Login
                </Link>
                <Link to="/farmer/register" className="hover:text-emerald-700">
                  Register as Farmer
                </Link>
              </div>
            </div>
          </div>

          {/* Buyer Card */}
          <div className="bg-white rounded-3xl p-7 border-2 border-blue-500/40 hover:border-blue-600 shadow-card hover:shadow-float transition-all flex flex-col justify-between group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-28 h-28 bg-blue-50 rounded-bl-full pointer-events-none -z-0" />
            
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <span className="text-3xl">🏪</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                I'm a Buyer
              </h2>
              <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                Find local farmers and source crops directly from farm gates. Post requirements with MSP validation.
              </p>

              <div className="space-y-2 mb-6 text-xs text-slate-700">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Instant algorithm matching with local farmers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Track farm-gate pickup & vehicle dispatch</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Verified quality and direct bank transfers</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 relative z-10">
              <button
                onClick={handleBuyerChoice}
                className="w-full py-4 px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:gap-3"
              >
                <span>Continue as Buyer</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <div className="flex justify-between text-xs font-semibold text-slate-500 pt-1 px-1">
                <Link to="/buyer/login" className="hover:text-blue-700">
                  Buyer Login
                </Link>
                <Link to="/buyer/register" className="hover:text-blue-700">
                  Register as Buyer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
