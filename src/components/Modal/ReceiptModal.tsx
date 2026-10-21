'use client';

import React from 'react';
import { ActiveRide } from '@/types';
import { Printer, X, Download, ShieldCheck, MapPin, Navigation } from 'lucide-react';

interface ReceiptModalProps {
  ride: ActiveRide;
  onClose: () => void;
}

export default function ReceiptModal({ ride, onClose }: ReceiptModalProps) {
  const handlePrint = () => {
    window.print();
  };

  const isAuto = ride.tier === 'auto' || ride.tier === 'bike';
  const baseFare = isAuto ? 30 : 60;
  const distanceFee = Math.round(ride.distanceKm * (isAuto ? 15 : 18));
  const timeFee = Math.round(ride.durationMinutes * (isAuto ? 1.5 : 2.5));
  const subtotal = baseFare + distanceFee + timeFee;
  const discount = ride.discount || 0;
  const gst = Math.round((subtotal - discount) * 0.05); // 5% GST on cab aggregators in India
  const total = Math.max(20, subtotal - discount + gst);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6 text-slate-100 max-h-[90vh] overflow-y-auto print:border-none print:shadow-none print:bg-white print:text-black">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white print:text-black">
                BHARAT<span className="text-amber-400">RIDE</span>
              </span>
              <span className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono px-2 py-0.5 rounded-full">
                GST TAX INVOICE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Trip Date: {new Date(ride.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} • {new Date(ride.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Total Highlight */}
        <div className="bg-gradient-to-r from-amber-950/40 via-slate-800/40 to-emerald-950/30 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Total Paid</span>
            <span className="text-2xl font-extrabold text-amber-400">₹{total}</span>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Payment Mode</span>
            <span className="text-xs font-bold uppercase text-slate-200">
              {ride.paymentMethod.replace('_', ' ')} • Paid
            </span>
          </div>
        </div>

        {/* Route Details */}
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-xs">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Pickup</span>
              <p className="text-slate-200 font-medium">{ride.pickup.address}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center shrink-0 mt-0.5">
              <Navigation className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-semibold">Drop-off</span>
              <p className="text-slate-200 font-medium">{ride.dropoff.address}</p>
            </div>
          </div>
        </div>

        {/* Itemized Fare Breakdown */}
        <div className="space-y-2 text-xs">
          <div className="font-semibold text-slate-300 pb-1 border-b border-slate-800">
            Fare Summary ({ride.tierName || 'Ride'})
          </div>

          <div className="flex justify-between text-slate-400">
            <span>Base Fare</span>
            <span className="text-slate-200">₹{baseFare}</span>
          </div>

          <div className="flex justify-between text-slate-400">
            <span>Distance Fee ({ride.distanceKm} km)</span>
            <span className="text-slate-200">₹{distanceFee}</span>
          </div>

          <div className="flex justify-between text-slate-400">
            <span>Time Fare ({ride.durationMinutes} mins)</span>
            <span className="text-slate-200">₹{timeFee}</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-emerald-400 font-medium">
              <span>Promo Savings ({ride.promoCode || 'PROMO'})</span>
              <span>-₹{discount}</span>
            </div>
          )}

          <div className="flex justify-between text-slate-400">
            <span>GST (5% Passenger Transport)</span>
            <span className="text-slate-200">₹{gst}</span>
          </div>

          <div className="flex justify-between font-bold text-sm text-slate-100 pt-2 border-t border-slate-800">
            <span>Final Paid Amount</span>
            <span className="text-amber-400">₹{total}</span>
          </div>
        </div>

        {/* Driver & Registration Footer */}
        {ride.driver && (
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div>
              <span>Driver: </span>
              <strong className="text-slate-200">{ride.driver.name}</strong>
              <span className="text-[11px] block font-mono text-slate-300">{ride.driver.vehicle} ({ride.driver.plate})</span>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-[11px]">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Commercial Taxi</span>
            </div>
          </div>
        )}

        <div className="flex gap-2 print:hidden">
          <button
            type="button"
            onClick={handlePrint}
            className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition shadow-lg"
          >
            <Download className="w-4 h-4" />
            Print / Save PDF Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
