'use client';

import React from 'react';
import { ActiveRide } from '@/types';
import { History, MapPin, Navigation, Receipt, Star, X, Calendar } from 'lucide-react';

interface RideHistoryModalProps {
  history: ActiveRide[];
  onSelectReceipt: (ride: ActiveRide) => void;
  onClose: () => void;
}

export default function RideHistoryModal({
  history,
  onSelectReceipt,
  onClose,
}: RideHistoryModalProps) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Your Ride History</h2>
              <p className="text-xs text-slate-400">Past Trips & Receipts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {history.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <History className="w-8 h-8 mx-auto opacity-50" />
            <p className="text-xs">No rides recorded yet. Book your first trip!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((ride) => (
              <div
                key={ride.id}
                className="bg-slate-800/50 hover:bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 space-y-3 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-200 capitalize">
                      {ride.tierName || ride.tier}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        ride.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {ride.status}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-sm font-extrabold text-amber-400">
                      ₹{Math.round(ride.fare)}
                    </span>
                  </div>
                </div>

                {/* Route Summary */}
                <div className="text-xs space-y-1.5 text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{ride.pickup.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Navigation className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    <span className="truncate">{ride.dropoff.address}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(ride.createdAt).toLocaleDateString()}</span>
                    {ride.driver && (
                      <span className="ml-1">• Driver: {ride.driver.name}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectReceipt(ride)}
                    className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-semibold transition"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    View Receipt
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
