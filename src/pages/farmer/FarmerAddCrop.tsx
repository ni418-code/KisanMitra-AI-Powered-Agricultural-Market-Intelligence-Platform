import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { VoiceInputModal } from '../../components/common/VoiceInputModal';
import {
  Sprout,
  Mic,
  MapPin,
  Calendar,
  Check,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Navigation,
} from 'lucide-react';

export const FarmerAddCrop: React.FC = () => {
  const { crops, addFarmerListing } = useAppState();
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const preselectedCrop = searchParams.get('crop') || 'tomato';

  const [step, setStep] = useState(1);
  const [selectedCropId, setSelectedCropId] = useState(preselectedCrop);
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState<'kg' | 'quintal'>('kg');
  const [locationType, setLocationType] = useState<'gps' | 'manual'>('gps');
  const [customLocation, setCustomLocation] = useState('Koratagere, Tumakuru');
  const [availableDate, setAvailableDate] = useState('Today');
  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (preselectedCrop) {
      setSelectedCropId(preselectedCrop);
    }
  }, [preselectedCrop]);

  const selectedCrop = crops.find((c) => c.id === selectedCropId) || crops[0];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/farmer/crops');
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    const loc = locationType === 'gps' ? (currentUser?.location || 'Koratagere, Tumakuru') : customLocation;

    setTimeout(() => {
      addFarmerListing({
        cropId: selectedCrop.id,
        quantity: Number(quantity),
        unit,
        location: loc,
        availableDate,
      });
      setIsSubmitting(false);
      setShowSuccess(true);
    }, 600);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-200 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Cancel' : 'Back'}</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs font-black bg-white/15 px-3 py-1 rounded-full">
            <span>Step {step} of 4</span>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Step Progress Bar */}
        <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200/80 mb-6">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
          {/* STEP 1: SELECT CROP */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-150">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Step 1
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  What crop do you have?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Select from popular regional crops or tap your harvested produce.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {crops.map((crop) => {
                  const isSelected = selectedCropId === crop.id;
                  const localName = crop.localNames[language] || crop.name;
                  return (
                    <button
                      key={crop.id}
                      type="button"
                      onClick={() => setSelectedCropId(crop.id)}
                      className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center group ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                          : 'border-slate-200 hover:border-emerald-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden mb-2 bg-slate-100 shadow-xs">
                        <img
                          src={crop.image}
                          alt={crop.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                        {localName}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-bold mt-1">
                        Mandi: ₹{crop.marketPrice}/kg
                      </span>
                      {isSelected && (
                        <div className="mt-2 w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 2: QUANTITY */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Step 2
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  How much {selectedCrop.name} do you have?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Enter available harvest quantity ready for farm-gate collection.
                </p>
              </div>

              {/* Crop Summary pill */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 max-w-sm mx-auto">
                <img
                  src={selectedCrop.image}
                  alt={selectedCrop.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{selectedCrop.name}</h4>
                  <span className="text-xs text-emerald-700 font-semibold">
                    Current Mandi rate: ₹{selectedCrop.marketPrice}/kg
                  </span>
                </div>
              </div>

              {/* Quantity Input */}
              <div className="max-w-sm mx-auto space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Enter Quantity
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={10}
                      step={10}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="flex-1 px-4 py-3.5 rounded-2xl border-2 border-slate-200 text-2xl font-black text-slate-900 focus:outline-none focus:border-emerald-600 text-center"
                    />
                    <div className="flex rounded-2xl border-2 border-slate-200 p-1 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => setUnit('kg')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                          unit === 'kg' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        kg
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnit('quintal')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                          unit === 'quintal' ? 'bg-emerald-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        quintal
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center justify-between gap-2">
                  {[200, 500, 1000, 2000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setQuantity(preset)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        quantity === preset
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {preset} {unit}
                    </button>
                  ))}
                </div>

                {/* Microphone trigger */}
                <div className="text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setVoiceModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-full border border-emerald-200 transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5 animate-pulse" />
                    <span>Or Speak Quantity into Microphone</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: LOCATION */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Step 3
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  Where is your crop located?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Buyers arrange transport vehicles directly to your farm location.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <button
                  type="button"
                  onClick={() => setLocationType('gps')}
                  className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                    locationType === 'gps'
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                    <Navigation className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-extrabold text-sm text-slate-900 block">
                      Use Current Farm GPS Location
                    </span>
                    <p className="text-xs text-emerald-800 font-medium mt-0.5">
                      📍 {currentUser?.location || 'Koratagere, Tumakuru District, Karnataka'}
                    </p>
                  </div>
                  {locationType === 'gps' && <Check className="w-5 h-5 text-emerald-600 shrink-0" />}
                </button>

                <button
                  type="button"
                  onClick={() => setLocationType('manual')}
                  className={`w-full p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all ${
                    locationType === 'manual'
                      ? 'border-emerald-600 bg-emerald-50/60 shadow-md ring-2 ring-emerald-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <span className="font-extrabold text-sm text-slate-900 block">
                      Enter Location Manually
                    </span>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Specify village or taluk name
                    </p>
                  </div>
                  {locationType === 'manual' && <Check className="w-5 h-5 text-emerald-600 shrink-0" />}
                </button>

                {locationType === 'manual' && (
                  <div className="pt-2 animate-in fade-in duration-150">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Enter Village & District
                    </label>
                    <input
                      type="text"
                      value={customLocation}
                      onChange={(e) => setCustomLocation(e.target.value)}
                      placeholder="e.g. Kolār Rural, Karnataka"
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: AVAILABLE FROM & CONFIRM */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="text-center">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Step 4
                </span>
                <h2 className="text-2xl font-black text-slate-900 mt-2">
                  When is it available for pickup?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Ready date for buyer truck arrival at farm gate.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-3">
                {['Today', 'Tomorrow', 'In 2 Days', 'Within this week'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setAvailableDate(opt)}
                    className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                      availableDate === opt
                        ? 'border-emerald-600 bg-emerald-50 font-extrabold text-emerald-950 shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                      <span className="text-sm">{opt}</span>
                    </div>
                    {availableDate === opt && <Check className="w-5 h-5 text-emerald-600" />}
                  </button>
                ))}
              </div>

              {/* Summary Card */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 max-w-md mx-auto text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Crop:</span>
                  <span className="font-bold text-slate-900">{selectedCrop.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Quantity:</span>
                  <span className="font-bold text-slate-900">{quantity} {unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-bold text-slate-900">
                    {locationType === 'gps' ? (currentUser?.location || 'Koratagere') : customLocation}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Estimated Value:</span>
                  <span className="font-black text-emerald-700 text-sm">
                    ₹{(quantity * selectedCrop.marketPrice).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Controls */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="py-3.5 px-5 rounded-2xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
              >
                Back
              </button>
            )}

            <button
              type="button"
              onClick={handleNext}
              disabled={isSubmitting}
              className="flex-1 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
            >
              {isSubmitting ? (
                <span>Listing Crop...</span>
              ) : step === 4 ? (
                <>
                  <span>LIST MY CROP</span>
                  <Check className="w-5 h-5" />
                </>
              ) : (
                <>
                  <span>Next Step</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">Crop Listed Successfully!</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Your {quantity} {unit} of {selectedCrop.name} is now active. We'll automatically notify matching buyers within your radius.
            </p>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => navigate('/farmer/requirements')}
                className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm shadow-md hover:bg-emerald-700"
              >
                View Matching Buyer Requests
              </button>
              <button
                onClick={() => navigate('/farmer/crops')}
                className="w-full py-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50"
              >
                Go to My Crops
              </button>
            </div>
          </div>
        </div>
      )}

      <VoiceInputModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onResult={(text) => {
          const match = text.match(/\d+/);
          if (match) {
            setQuantity(Number(match[0]));
          }
        }}
      />
    </div>
  );
};
