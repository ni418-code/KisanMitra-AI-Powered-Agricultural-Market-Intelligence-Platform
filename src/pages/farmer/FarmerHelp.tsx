import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { VoiceInputModal } from '../../components/common/VoiceInputModal';
import {
  PhoneCall,
  Mic,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Truck,
  CreditCard,
  Sprout,
  Volume2,
} from 'lucide-react';

export const FarmerHelp: React.FC = () => {
  const { t } = useLanguage();
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: '❓ How do I sell my crop directly?',
      a: 'Tap on "SELL MY CROP" from your dashboard. Choose your crop (e.g. Tomato), enter your quantity (e.g. 500 kg), confirm your farm location, and select when it is ready. KisanMitra will instantly notify verified buyers.',
    },
    {
      q: '💰 How do I check current Mandi & APMC prices?',
      a: 'Tap "TODAY\'S MARKET PRICE". You can view daily rates from nearby APMC yards (Kolār, Bengaluru, Vijayapura) and check whether your crop has a statutory Government MSP.',
    },
    {
      q: '📦 How do I accept a buyer requirement?',
      a: 'Go to "BUYER REQUIREMENTS". Review the buyer’s offer price (₹/kg), quantity, distance, and buyer rating. Click the large green "ACCEPT ORDER" button to confirm.',
    },
    {
      q: '🚚 How does farm-gate pickup work?',
      a: 'Once you accept, the buyer dispatches an assigned vehicle (e.g. Tata 407) directly to your farm. The crop is weighed using a certified scale and loaded at your farm gate.',
    },
    {
      q: '💳 When and how do I receive my payment?',
      a: 'Payment is transferred immediately upon farm-gate weighing via direct UPI or Bank Transfer. There is zero middleman deduction or commission.',
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white py-8 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-3xl mx-auto">
          <span className="text-emerald-200 text-xs font-bold uppercase tracking-wider">
            Farmer Support Desk
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">Help & Guidance</h1>
          <p className="text-emerald-100 text-xs mt-1">
            24/7 dedicated assistance in Telugu, Hindi, Tamil, Kannada & Marathi.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        {/* Large Primary Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Call Help */}
          <a
            href="tel:18005472664"
            className="p-6 rounded-3xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 flex items-center gap-4 transition-all hover:scale-[1.02]"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-emerald-200 block">
                Toll-Free Call Assistance
              </span>
              <h3 className="text-xl font-black">1800-KISAN-MITRA</h3>
              <p className="text-xs text-emerald-100 mt-0.5">Free regional call support</p>
            </div>
          </a>

          {/* Voice Help */}
          <button
            onClick={() => setVoiceModalOpen(true)}
            className="p-6 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/30 flex items-center gap-4 transition-all hover:scale-[1.02] text-left"
          >
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Mic className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold text-blue-200 block">
                Interactive Voice Assistant
              </span>
              <h3 className="text-xl font-black">Tap to Speak</h3>
              <p className="text-xs text-blue-100 mt-0.5">Ask anything in your language</p>
            </div>
          </button>
        </div>

        {/* FAQs Accordion */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-4">
          <h2 className="text-lg font-black text-slate-900 mb-2">
            Frequently Asked Questions
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 bg-slate-50 hover:bg-emerald-50/50 transition-colors"
                  >
                    <span className="font-extrabold text-sm text-slate-900">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <VoiceInputModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
      />
    </div>
  );
};
