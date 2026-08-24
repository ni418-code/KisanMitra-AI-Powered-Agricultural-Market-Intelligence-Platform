import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { Language } from '../../types';

interface Props {
  variant?: 'light' | 'dark' | 'minimal';
}

export const LanguageSelector: React.FC<Props> = ({ variant = 'light' }) => {
  const { language, setLanguage, languagesList } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = languagesList.find((l) => l.code === language) || languagesList[0];

  const getButtonStyles = () => {
    if (variant === 'dark') {
      return 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700';
    }
    if (variant === 'minimal') {
      return 'bg-transparent text-slate-700 hover:bg-slate-100 border-none shadow-none';
    }
    return 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50 shadow-sm';
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${getButtonStyles()}`}
        aria-expanded={isOpen}
      >
        <Globe className="w-4 h-4 text-emerald-600" />
        <span className="font-semibold">{currentLang.native}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-xl ring-1 ring-black/5 z-50 py-1.5 border border-slate-100 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
            Select Language
          </div>
          {languagesList.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code as Language);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-between px-3.5 py-2 text-sm text-left transition-colors ${
                language === lang.code
                  ? 'bg-emerald-50 text-emerald-800 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <div className="flex flex-col">
                <span className="font-medium">{lang.native}</span>
                <span className="text-[11px] text-slate-400">{lang.label}</span>
              </div>
              {language === lang.code && <Check className="w-4 h-4 text-emerald-600" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
