import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useNavigate } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onResult?: (text: string) => void;
  initialPrompt?: string;
}

export const VoiceInputModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onResult,
  initialPrompt = 'Listening... Speak your crop name, quantity, or requirement.',
}) => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [isListening, setIsListening] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('Listening to your voice in your preferred language...');

  const quickCommands = [
    { label: '🍅 Tomato 500 kg (Koratagere)', action: () => navigate('/farmer/crops/add') },
    { label: '📈 Check Mandi prices for Paddy', action: () => navigate('/farmer/market-prices/paddy') },
    { label: '📋 View Buyer Requirements', action: () => navigate('/farmer/requirements') },
    { label: '☎️ Call KisanMitra Help Desk', action: () => navigate('/farmer/help') },
  ];

  useEffect(() => {
    if (isOpen) {
      setIsListening(true);
      setTranscript('');
      setFeedback('Listening... (Simulated voice recognition ready)');

      // Simulate a quick speech recognition animation or hook into webkitSpeechRecognition
      const timer = setTimeout(() => {
        setTranscript('Tomato 500 kg Koratagere');
        setFeedback('Recognized: "Tomato 500 kg Koratagere"');
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApply = () => {
    if (onResult && transcript) {
      onResult(transcript);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center pt-2 pb-4">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
              <Mic className="w-10 h-10 animate-pulse" />
            </div>
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-1">{t.tapToSpeak}</h3>
          <p className="text-sm text-slate-500">{feedback}</p>
        </div>

        {/* Live Recognized Box */}
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 mb-4 text-center">
          <p className="text-xs uppercase tracking-wider font-semibold text-emerald-800 mb-1">
            Voice Transcript
          </p>
          <p className="text-base font-bold text-slate-900 min-h-[28px]">
            {transcript ? `"${transcript}"` : <span className="text-slate-400 italic">Listening...</span>}
          </p>
        </div>

        {/* Quick Voice Commands */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
            Quick Voice Shortcuts:
          </p>
          <div className="space-y-1.5">
            {quickCommands.map((cmd, idx) => (
              <button
                key={idx}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                className="w-full text-left px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:text-emerald-900 text-slate-700 text-xs font-medium border border-slate-100 flex items-center justify-between transition-colors"
              >
                <span>{cmd.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Action button */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Check className="w-4 h-4" />
            Use Spoken Input
          </button>
        </div>
      </div>
    </div>
  );
};
