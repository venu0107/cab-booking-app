'use client';

import React, { useState } from 'react';
import { Tag, Check, X } from 'lucide-react';
import { PROMO_CODES } from '@/lib/constants';

interface PromoCodeInputProps {
  grossFare: number;
  onApplyPromo: (code: string, discount: number) => void;
  appliedPromo?: string;
  appliedDiscount: number;
}

export default function PromoCodeInput({
  grossFare,
  onApplyPromo,
  appliedPromo,
  appliedDiscount,
}: PromoCodeInputProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const clean = code.trim().toUpperCase();

    if (!clean) return;

    const promo = PROMO_CODES[clean];
    if (!promo) {
      setError('Invalid code. Try "DESI50", "NAMASTE" or "AUTO20"');
      return;
    }

    let calculatedDiscount = 0;
    if (promo.type === 'percent') {
      calculatedDiscount = Math.round((grossFare * promo.value) / 100);
      if (promo.maxDiscount && calculatedDiscount > promo.maxDiscount) {
        calculatedDiscount = promo.maxDiscount;
      }
    } else {
      calculatedDiscount = promo.value;
    }

    // Do not discount more than fare
    calculatedDiscount = Math.min(grossFare * 0.85, calculatedDiscount);
    onApplyPromo(clean, Math.round(calculatedDiscount));
    setCode('');
  };

  const handleRemove = () => {
    onApplyPromo('', 0);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-3">
      {appliedPromo ? (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <Check className="w-4 h-4" />
            <span>Code <strong>{appliedPromo}</strong> applied</span>
            <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              -₹{appliedDiscount} OFF
            </span>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="text-slate-400 hover:text-rose-400 p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApply} className="flex items-center gap-2">
          <div className="relative flex-1">
            <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Promo code (e.g. DESI50, NAMASTE)"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
                setError('');
              }}
              className="w-full bg-slate-800/80 border border-slate-700/60 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 uppercase font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={!code.trim()}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-400 hover:text-cyan-300 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            Apply
          </button>
        </form>
      )}

      {error && <p className="text-[11px] text-rose-400 mt-1.5 px-1">{error}</p>}
    </div>
  );
}
