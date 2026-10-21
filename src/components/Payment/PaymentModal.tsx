'use client';

import React, { useState } from 'react';
import { PaymentMethod } from '@/types';
import { CreditCard, QrCode, Banknote, ShieldCheck, Lock, X, Check, Building, Smartphone } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentModalProps {
  fare: number;
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  onConfirmPayment: () => void;
  onClose: () => void;
}

export default function PaymentModal({
  fare,
  selectedMethod,
  onSelectMethod,
  onConfirmPayment,
  onClose,
}: PaymentModalProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState('arjun.verma@okhdfcbank');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardNumber, setCardNumber] = useState('6071 •••• •••• 1234');
  const [expiry, setExpiry] = useState('08/29');
  const [cvc, setCvc] = useState('888');

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
      onConfirmPayment();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">BharatRide Payment</h2>
              <p className="text-[11px] text-slate-400">Fast & Secure Indian Gateways</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount to pay banner */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Payable Amount</span>
            <span className="text-2xl font-extrabold text-amber-400">₹{Math.round(fare)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4" />
            <span>NPCI / 256-Bit Secure</span>
          </div>
        </div>

        {/* Method selector tabs: UPI, Cash, Cards, NetBanking */}
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => onSelectMethod('upi')}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition ${
              selectedMethod === 'upi'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span className="text-[10px] font-bold">UPI</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMethod('cash')}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition ${
              selectedMethod === 'cash'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span className="text-[10px] font-bold">Cash</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMethod('card')}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition ${
              selectedMethod === 'card'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span className="text-[10px] font-bold">RuPay / Card</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMethod('netbanking')}
            className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition ${
              selectedMethod === 'netbanking'
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white'
            }`}
          >
            <Building className="w-4 h-4" />
            <span className="text-[10px] font-bold">NetBanking</span>
          </button>
        </div>

        {/* Dynamic form based on method */}
        <form onSubmit={handlePay} className="space-y-3">
          {selectedMethod === 'upi' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-200 block">Instant UPI Apps</span>
                    <span className="text-[10px] text-slate-400">GPay • PhonePe • Paytm • BHIM</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">
                  Zero Fee
                </span>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  Enter UPI ID / VPA
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="mobilenumber@upi or name@okaxis"
                  required
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {selectedMethod === 'cash' && (
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
              <Banknote className="w-8 h-8 mx-auto text-emerald-400" />
              <p className="text-xs text-slate-300">
                Pay exact cash of <strong>₹{Math.round(fare)}</strong> to your driver upon reaching the drop-off location.
              </p>
              <p className="text-[11px] text-amber-400">
                Tip: Drivers also accept QR scan directly in auto/cab!
              </p>
            </div>
          )}

          {selectedMethod === 'card' && (
            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                  RuPay / Debit / Credit Card
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono tracking-wider focus:outline-none focus:border-amber-500"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                      RuPay
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    Expires
                  </label>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    placeholder="MM/YY"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-slate-400 block mb-1">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={cvc}
                    onChange={(e) => setCvc(e.target.value)}
                    placeholder="123"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          )}

          {selectedMethod === 'netbanking' && (
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 block">
                Select Your Bank
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              >
                <option value="HDFC Bank">HDFC Bank</option>
                <option value="State Bank of India (SBI)">State Bank of India (SBI)</option>
                <option value="ICICI Bank">ICICI Bank</option>
                <option value="Axis Bank">Axis Bank</option>
                <option value="Kotak Mahindra Bank">Kotak Mahindra Bank</option>
                <option value="Punjab National Bank">Punjab National Bank</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                Verifying with NPCI Bank Gateway...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Proceed to Pay ₹{Math.round(fare)}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
