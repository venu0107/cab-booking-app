'use client';

import React from 'react';
import { RideOption, RideTier } from '@/types';
import { RIDE_OPTIONS } from '@/lib/constants';
import { Car, Sparkles, Truck, Bike, Users, Clock, Flame } from 'lucide-react';

interface RideOptionsProps {
  selectedTier: RideTier;
  onSelectTier: (tier: RideTier) => void;
  distanceKm: number;
  durationMinutes: number;
  discount: number;
}

export function calculateFare(
  option: RideOption,
  distanceKm: number,
  durationMinutes: number
): number {
  if (distanceKm <= 0) return option.baseFare;
  const raw =
    option.baseFare +
    distanceKm * option.perKmRate +
    durationMinutes * option.perMinuteRate;
  return Math.round(raw * option.multiplier);
}

// Custom Indian Auto Rickshaw SVG Icon
function AutoRickshawIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 17h16" />
      <circle cx="7" cy="18" r="2" />
      <circle cx="17" cy="18" r="2" />
      <path d="M5 17l1.5-6h11l1.5 6" />
      <path d="M9 11V6h6v5" />
      <circle cx="12" cy="18" r="1" />
      <path d="M3 14h2" />
    </svg>
  );
}

const ICONS: Record<string, React.ReactNode> = {
  Auto: <AutoRickshawIcon className="w-5 h-5 text-amber-300" />,
  Bike: <Bike className="w-5 h-5 text-emerald-300" />,
  Car: <Car className="w-5 h-5 text-cyan-300" />,
  Sparkles: <Sparkles className="w-5 h-5 text-purple-300" />,
  Truck: <Truck className="w-5 h-5 text-blue-300" />,
};

export default function RideOptions({
  selectedTier,
  onSelectTier,
  distanceKm,
  durationMinutes,
  discount,
}: RideOptionsProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium px-1">
        <span>Available Indian Ride Options</span>
        {distanceKm > 0 && (
          <span className="text-cyan-400 font-medium">
            {distanceKm} km • ~{durationMinutes} mins
          </span>
        )}
      </div>

      <div className="space-y-2">
        {RIDE_OPTIONS.map((option) => {
          const isSelected = selectedTier === option.id;
          const grossFare = calculateFare(option, distanceKm, durationMinutes);
          const finalFare = Math.max(20, grossFare - discount);

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => onSelectTier(option.id)}
              className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left ${
                isSelected
                  ? 'bg-gradient-to-r from-amber-950/40 via-slate-900 to-cyan-950/40 border-amber-500/80 shadow-lg shadow-amber-950/30'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {ICONS[option.iconName] || <Car className="w-5 h-5" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-100 text-sm">{option.name}</span>
                    {option.popular && (
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-extrabold uppercase bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded-full border border-amber-500/30">
                        <Flame className="w-2.5 h-2.5 fill-amber-300" />
                        Popular
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-normal">
                      <Users className="w-3 h-3" />
                      {option.capacity}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">{option.description}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium mt-1">
                    <Clock className="w-3 h-3" />
                    <span>{option.etaMinutes} mins away</span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-base font-extrabold text-slate-100">
                  ₹{finalFare}
                </div>
                {discount > 0 && grossFare > finalFare && (
                  <div className="text-xs text-slate-500 line-through">
                    ₹{grossFare}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
