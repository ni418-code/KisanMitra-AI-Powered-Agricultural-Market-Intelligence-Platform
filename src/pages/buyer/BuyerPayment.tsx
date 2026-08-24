import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAppState } from '../../context/AppStateContext';
import confetti from 'canvas-confetti';
import {
  ArrowLeft,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Building2,
  Download,
  Printer,
  Sparkles,
  Check,
} from 'lucide-react';

export const BuyerPayment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { orders, completeOrderPayment } = useAppState();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const order = orders.find((o) => o.id === id) || orders[0];

  if (!order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Order Not Found</h2>
          <button
            onClick={() => navigate('/buyer/orders')}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      completeOrderPayment(order.id);
      setIsProcessing(false);
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#16a34a', '#10b981'],
        });
      } catch (e) {}
    }, 800);
  };

  const isCompleted = order.paymentDetails.status === 'Payment Completed';

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-16">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 text-white py-6 px-4 sm:px-6 lg:px-8 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(`/buyer/orders/${order.id}`)}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-200 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Order</span>
          </button>
          <div className="text-xs font-bold bg-white/15 px-3 py-1 rounded-full">
            Payment & Escrow #{order.id}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 space-y-6">
        {/* Main Payment Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Transparent Escrow Settlement</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                Payment Details
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Direct farm-gate bank settlement for {order.cropName}.
              </p>
            </div>

            <div
              className={`px-4 py-2 rounded-2xl border text-xs font-black flex items-center gap-1.5 ${
                isCompleted
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-amber-100 border-amber-300 text-amber-900'
              }`}
            >
              {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <CreditCard className="w-4 h-4 text-amber-700" />}
              <span>{order.paymentDetails.status}</span>
            </div>
          </div>

          {/* Transparent Calculation Breakdown (Section 30) */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
              Commodity Weighment & Rate Calculation
            </h3>

            <div className="space-y-2 pt-1">
              <div className="flex justify-between">
                <span className="text-slate-600">Crop:</span>
                <span className="font-bold text-slate-900">{order.cropName}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Verified Quantity:</span>
                <span className="font-bold text-slate-900">{order.quantity} {order.unit}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-600">Agreed Unit Rate:</span>
                <span className="font-bold text-slate-900">₹{order.agreedPricePerKg}/kg</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex justify-between items-center text-sm font-bold text-slate-800">
                <span>Calculation Formula:</span>
                <span className="font-mono text-emerald-700">
                  {order.quantity} kg × ₹{order.agreedPricePerKg}/kg = ₹{order.totalAmount.toLocaleString('en-IN')}
                </span>
              </div>

              <div className="flex justify-between text-slate-500">
                <span>Buyer Platform Service Fee:</span>
                <span className="font-bold text-slate-700">₹0.00 (Zero Surcharge)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-between items-center text-base font-black">
              <span className="text-slate-900">Net Payable to Farmer Bank Account:</span>
              <span className="text-2xl text-emerald-700">
                ₹{order.totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Payee Details */}
          <div className="p-4 rounded-2xl bg-white border-2 border-slate-100 text-xs space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Beneficiary Farmer Account</h4>
            <div className="grid grid-cols-2 gap-2 text-slate-600">
              <div>
                <span className="text-slate-400 block">Farmer Name:</span>
                <span className="font-bold text-slate-900">{order.farmerName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Village & Bank Branch:</span>
                <span className="font-bold text-slate-900">{order.farmerLocation}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Payment Mode:</span>
                <span className="font-bold text-slate-900">{order.paymentDetails.method}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Transaction Reference:</span>
                <span className="font-bold font-mono text-slate-900">
                  {order.paymentDetails.transactionId || 'Pending Release'}
                </span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            {!isCompleted ? (
              <button
                type="button"
                onClick={handlePay}
                disabled={isProcessing}
                className="flex-1 py-4 px-8 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                {isProcessing ? (
                  <span>Processing Direct UPI Transfer...</span>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Release Direct Payment (₹{order.totalAmount.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>
            ) : (
              <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-emerald-800 font-extrabold text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Direct Farm-Gate Transaction Completed Successfully ✓</span>
                </div>
                <p className="text-xs text-emerald-700">
                  Receipt generated • Ref: {order.paymentDetails.transactionId}
                </p>
                <div className="flex justify-center gap-3 pt-1">
                  <button
                    onClick={() => alert('Simulated PDF Tax Receipt downloaded to device.')}
                    className="px-4 py-2 bg-white text-slate-800 font-bold text-xs rounded-xl border border-slate-200 shadow-xs hover:bg-slate-50 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                    <span>Download PDF Invoice</span>
                  </button>
                  <Link
                    to="/buyer/orders"
                    className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs hover:bg-blue-700"
                  >
                    View All Orders
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
