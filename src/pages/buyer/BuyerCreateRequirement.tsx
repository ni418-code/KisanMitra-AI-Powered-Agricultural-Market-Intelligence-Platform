import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import { validateMspPrice } from '../../services/mspValidator';
import {
  PlusCircle,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Search,
  Building2,
  Users,
} from 'lucide-react';

export const BuyerCreateRequirement: React.FC = () => {
  const { crops, addBuyerRequirement } = useAppState();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [cropId, setCropId] = useState('tomato');
  const [quantity, setQuantity] = useState<number>(500);
  const [unit, setUnit] = useState<'kg' | 'quintal'>('kg');
  const [offerPrice, setOfferPrice] = useState<number>(32);
  const [requiredDate, setRequiredDate] = useState('Tomorrow');
  const [pickupRadiusKm, setPickupRadiusKm] = useState<number>(30);
  const [notes, setNotes] = useState('Immediate requirement for wholesale distribution. Direct farm-gate collection.');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [matchingState, setMatchingState] = useState<'idle' | 'searching' | 'matched'>('idle');
  const [createdReqId, setCreatedReqId] = useState<string>('');
  const [matchedCount, setMatchedCount] = useState<number>(0);

  const selectedCrop = crops.find((c) => c.id === cropId) || crops[0];

  // MSP Validation Check
  const mspValidation = validateMspPrice(cropId, offerPrice);

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1);
    } else {
      handlePostRequirement();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/buyer/requirements');
    }
  };

  const handlePostRequirement = () => {
    if (!mspValidation.isValid) return;

    setIsSubmitting(true);
    setMatchingState('searching');

    setTimeout(() => {
      const result = addBuyerRequirement({
        cropId,
        quantity: Number(quantity),
        unit,
        offerPrice: Number(offerPrice),
        requiredDate,
        pickupRadiusKm: Number(pickupRadiusKm),
        notes,
      });

      setIsSubmitting(false);
      setCreatedReqId(result.requirement.id);
      setMatchedCount(result.matchCount);
      setMatchingState('matched');
    }, 1200);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 text-white py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-200 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{step === 1 ? 'Cancel' : 'Back'}</span>
          </button>
          <div className="text-xs font-black bg-blue-500/30 px-3 py-1 rounded-full border border-blue-400/30">
            Step {step} of 5
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4">
        {/* Step Progress Bar */}
        <div className="bg-white rounded-2xl p-3 shadow-xs border border-slate-200/80 mb-6">
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(step / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Searching / Matched Overlay Screens */}
        {matchingState === 'searching' && (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-card space-y-6 animate-in fade-in duration-200">
            <div className="relative inline-flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-blue-50 border-4 border-blue-600 border-t-transparent animate-spin" />
              <Search className="w-8 h-8 text-blue-600 absolute" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Finding Matching Farmers...
              </h2>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Scanning active farmer listings for {selectedCrop.name} within {pickupRadiusKm} km radius of Bengaluru.
              </p>
            </div>
          </div>
        )}

        {matchingState === 'matched' && (
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-card space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-black text-slate-900">
                Requirement Successfully Posted ✓
              </h2>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Farmers with matching crops have received an instant priority notification.
              </p>
            </div>

            {/* Requirement Snapshot Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedCrop.image}
                    alt={selectedCrop.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="font-extrabold text-slate-900 text-base">
                      {selectedCrop.name}
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">
                      {quantity} {unit} @ ₹{offerPrice}/kg
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-400 block uppercase">Estimated</span>
                  <span className="text-lg font-black text-emerald-700">
                    ₹{(quantity * offerPrice).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400">Pickup Radius:</span> Within {pickupRadiusKm} km
                </div>
                <div>
                  <span className="text-slate-400">Required Date:</span> {requiredDate}
                </div>
              </div>
            </div>

            {/* Matching Result Box */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-extrabold text-emerald-950 text-sm">
                  {matchedCount > 0
                    ? `Found ${matchedCount} Matching Farmer(s) Nearby!`
                    : 'Requirement Saved • Looking for Farmers'}
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  {matchedCount > 0
                    ? `Ramesh Patil in Koratagere (15 km away) has 500 kg ${selectedCrop.name} available.`
                    : 'Your requirement is kept active. You will be notified instantly when a matching farmer lists this crop.'}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => navigate(`/buyer/requirements/${createdReqId}`)}
                className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors text-center"
              >
                View Requirement & Matching Farmers
              </button>
              <button
                onClick={() => navigate('/buyer/dashboard')}
                className="py-3.5 px-6 rounded-2xl border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 text-center"
              >
                Dashboard
              </button>
            </div>
          </div>
        )}

        {/* 5-Step Wizard Form */}
        {matchingState === 'idle' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card">
            {/* STEP 1: SELECT CROP */}
            {step === 1 && (
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    Step 1 of 5
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">
                    Select Crop Requirement
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Choose the commodity you need to procure from local farms.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                  {crops.map((crop) => {
                    const isSelected = cropId === crop.id;
                    return (
                      <button
                        key={crop.id}
                        type="button"
                        onClick={() => {
                          setCropId(crop.id);
                          // Default reasonable price offer
                          setOfferPrice(crop.marketPrice >= (crop.mspPrice || 0) ? crop.marketPrice + 2 : crop.marketPrice);
                        }}
                        className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center group ${
                          isSelected
                            ? 'border-blue-600 bg-blue-50/60 shadow-md ring-2 ring-blue-500/20'
                            : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden mb-2 bg-slate-100">
                          <img
                            src={crop.image}
                            alt={crop.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <span className="font-extrabold text-sm text-slate-900 block leading-tight">
                          {crop.name}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium mt-0.5">
                          Mandi: ₹{crop.marketPrice}/kg
                        </span>
                        {crop.mspPrice && (
                          <span className="text-[10px] text-amber-700 font-bold mt-0.5">
                            MSP: ₹{crop.mspPrice}/kg
                          </span>
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
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    Step 2 of 5
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">
                    How much {selectedCrop.name} do you need?
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Specify the total procurement volume required.
                  </p>
                </div>

                <div className="max-w-sm mx-auto space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min={10}
                      step={10}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                      className="flex-1 px-4 py-3.5 rounded-2xl border-2 border-slate-200 text-2xl font-black text-slate-900 focus:outline-none focus:border-blue-600 text-center"
                    />
                    <div className="flex rounded-2xl border-2 border-slate-200 p-1 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => setUnit('kg')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                          unit === 'kg' ? 'bg-blue-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        kg
                      </button>
                      <button
                        type="button"
                        onClick={() => setUnit('quintal')}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                          unit === 'quintal' ? 'bg-blue-600 text-white' : 'text-slate-600'
                        }`}
                      >
                        quintal
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    {[500, 1000, 2500, 5000].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setQuantity(preset)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-colors ${
                          quantity === preset
                            ? 'border-blue-600 bg-blue-50 text-blue-800'
                            : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {preset} {unit}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: PRICE WILLING TO PAY & CRITICAL MSP VALIDATION */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    Step 3 of 5
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">
                    Price Willing to Pay (₹/kg)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Enter your firm price offer for farm-gate procurement.
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Your Price Offer (₹ per kg)
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-xl font-bold text-slate-400">
                        ₹
                      </span>
                      <input
                        type="number"
                        min={1}
                        step={0.5}
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(Number(e.target.value))}
                        className={`w-full pl-10 pr-4 py-3.5 rounded-2xl border-2 text-2xl font-black text-slate-900 focus:outline-none text-center ${
                          !mspValidation.isValid
                            ? 'border-red-400 bg-red-50/40 text-red-950 focus:border-red-600'
                            : 'border-slate-200 focus:border-blue-600'
                        }`}
                      />
                    </div>
                  </div>

                  {/* CRITICAL MSP VALIDATION ADVISOR CARD */}
                  <div
                    className={`rounded-2xl p-4 border transition-all ${
                      !mspValidation.isValid
                        ? 'bg-red-50 border-red-200 text-red-900 shadow-sm'
                        : mspValidation.hasMsp
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!mspValidation.isValid ? (
                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      )}

                      <div className="space-y-1 flex-1 text-xs">
                        <div className="flex justify-between font-bold">
                          <span>
                            {mspValidation.hasMsp
                              ? `Applicable MSP: ₹${mspValidation.mspPrice?.toFixed(2)}/kg`
                              : `Market Rate: ₹${selectedCrop.marketPrice}/kg`}
                          </span>
                          <span className="font-black">Your Offer: ₹{offerPrice}/kg</span>
                        </div>

                        <p
                          className={`text-xs ${
                            !mspValidation.isValid
                              ? 'font-bold text-red-700'
                              : mspValidation.hasMsp
                              ? 'font-medium text-emerald-800'
                              : 'text-slate-600'
                          }`}
                        >
                          {mspValidation.message}
                        </p>

                        {!mspValidation.isValid && (
                          <div className="pt-1 font-extrabold text-red-700 flex items-center gap-1">
                            <span>⚠️ Offer price must meet or exceed the applicable MSP.</span>
                          </div>
                        )}
                        {mspValidation.isValid && mspValidation.hasMsp && (
                          <div className="pt-1 font-bold text-emerald-700 flex items-center gap-1">
                            <span>✓ Price requirement satisfied.</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Total Calculation pill */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-medium">Estimated Order Total:</span>
                    <span className="text-xl font-black text-slate-900">
                      ₹{(quantity * offerPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: REQUIRED DATE */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    Step 4 of 5
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">
                    When do you need the harvest?
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Select target farm-gate collection timeline.
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-3">
                  {['Today', 'Tomorrow', 'In 2 Days', 'Within 7 Days'].map((dateOpt) => (
                    <button
                      key={dateOpt}
                      type="button"
                      onClick={() => setRequiredDate(dateOpt)}
                      className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                        requiredDate === dateOpt
                          ? 'border-blue-600 bg-blue-50 font-extrabold text-blue-950 shadow-sm'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-blue-600" />
                        <span className="text-sm">{dateOpt}</span>
                      </div>
                      {requiredDate === dateOpt && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: PICKUP RADIUS & CONFIRM */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in duration-150">
                <div className="text-center">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full">
                    Step 5 of 5
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 mt-2">
                    Pickup Radius from Hub
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Define maximum travel distance for your procurement transport vehicles.
                  </p>
                </div>

                <div className="max-w-md mx-auto space-y-3">
                  {[15, 30, 50, 100].map((radius) => (
                    <button
                      key={radius}
                      type="button"
                      onClick={() => setPickupRadiusKm(radius)}
                      className={`w-full p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                        pickupRadiusKm === radius
                          ? 'border-blue-600 bg-blue-50 font-extrabold text-blue-950 shadow-sm'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-blue-600" />
                        <span className="text-sm">Within {radius} km</span>
                      </div>
                      {pickupRadiusKm === radius && <CheckCircle2 className="w-5 h-5 text-blue-600" />}
                    </button>
                  ))}
                </div>

                {/* Final Review Card */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 max-w-md mx-auto text-xs space-y-2">
                  <h4 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                    Requirement Summary
                  </h4>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Crop:</span>
                    <span className="font-bold text-slate-900">{selectedCrop.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Quantity:</span>
                    <span className="font-bold text-slate-900">{quantity} {unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Price Offer:</span>
                    <span className="font-bold text-emerald-700">₹{offerPrice}/kg</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Pickup Date:</span>
                    <span className="font-bold text-slate-900">{requiredDate}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-black">
                    <span className="text-slate-900">Total Valuation:</span>
                    <span className="text-blue-700">
                      ₹{(quantity * offerPrice).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Form Navigation Buttons */}
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
                disabled={step === 3 && !mspValidation.isValid}
                className={`flex-1 py-3.5 px-6 rounded-2xl font-black text-base shadow-md flex items-center justify-center gap-2 transition-all ${
                  step === 3 && !mspValidation.isValid
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 hover:scale-[1.01]'
                }`}
              >
                {step === 5 ? (
                  <>
                    <span>POST REQUIREMENT</span>
                    <CheckCircle2 className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <span>Continue to Step {step + 1}</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
