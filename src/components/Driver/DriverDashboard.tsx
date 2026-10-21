'use client';

import React, { useState, useEffect } from 'react';
import { ActiveRide, UserProfile } from '@/types';
import { sounds } from '@/lib/soundEffects';
import {
  Power,
  DollarSign,
  TrendingUp,
  Award,
  Navigation,
  CheckCircle,
  MapPin,
  Clock,
  Car,
  Check,
  X,
} from 'lucide-react';

interface DriverDashboardProps {
  driverProfile: UserProfile;
  activeRide: ActiveRide | null;
  onAcceptRide: () => void;
  onDeclineRide: () => void;
  onUpdateRideStatus: (status: ActiveRide['status']) => void;
}

export default function DriverDashboard({
  driverProfile,
  activeRide,
  onAcceptRide,
  onDeclineRide,
  onUpdateRideStatus,
}: DriverDashboardProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [requestCountdown, setRequestCountdown] = useState(15);

  const isIncomingRequest = activeRide && activeRide.status === 'searching';
  const isTripAssigned =
    activeRide &&
    ['driver_assigned', 'arriving', 'in_progress'].includes(activeRide.status);

  // Play radar ping when new incoming request appears
  useEffect(() => {
    if (isIncomingRequest && isOnline) {
      sounds.playDriverPing();
      setRequestCountdown(15);
      const timer = setInterval(() => {
        setRequestCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            onDeclineRide();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isIncomingRequest, isOnline, onDeclineRide]);

  return (
    <div className="space-y-4">
      {/* Driver Online Toggle Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <img
            src={driverProfile.avatarUrl}
            alt={driverProfile.fullName}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500/50"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-slate-100 text-base">{driverProfile.fullName}</h2>
              <span className="text-[11px] bg-emerald-500/10 text-emerald-400 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/20">
                PRO DRIVER
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {driverProfile.vehicleDetails?.model} • {driverProfile.vehicleDetails?.plate}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsOnline(!isOnline)}
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-semibold text-xs transition-all shadow-lg ${
            isOnline
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-400'
          }`}
        >
          <Power className="w-4 h-4" />
          {isOnline ? 'ONLINE' : 'GO ONLINE'}
        </button>
      </div>

      {/* Driver Performance Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 text-center">
          <div className="flex items-center justify-center text-emerald-400 mb-1">
            <DollarSign className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-slate-100">₹2,480</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Today Earnings</div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 text-center">
          <div className="flex items-center justify-center text-cyan-400 mb-1">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-slate-100">8 Trips</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Completed</div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-3.5 text-center">
          <div className="flex items-center justify-center text-amber-400 mb-1">
            <Award className="w-4 h-4" />
          </div>
          <div className="text-lg font-bold text-slate-100">{driverProfile.rating} ★</div>
          <div className="text-[10px] text-slate-400 uppercase tracking-wider">Driver Rating</div>
        </div>
      </div>

      {/* Incoming Ride Request Modal (when searching) */}
      {isOnline && isIncomingRequest && (
        <div className="bg-gradient-to-b from-cyan-950/80 to-slate-900 border-2 border-cyan-500 rounded-3xl p-5 shadow-2xl animate-pulse space-y-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold text-cyan-300">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
              NEW RIDE REQUEST
            </span>
            <span className="text-xs font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full">
              {requestCountdown}s remaining
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Pickup (1.2 km away)</span>
                <p className="text-xs font-medium text-slate-100">{activeRide.pickup.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Navigation className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-[11px] text-slate-400 uppercase font-semibold">Drop-off Destination</span>
                <p className="text-xs font-medium text-slate-100">{activeRide.dropoff.address}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <div>
              <span className="text-[11px] text-slate-400 block">Estimated Payout</span>
              <span className="text-xl font-bold text-emerald-400">₹{Math.round(activeRide.fare)}</span>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Passenger</span>
              <span className="text-xs font-medium text-slate-200">{activeRide.riderName} (4.96 ★)</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              type="button"
              onClick={onDeclineRide}
              className="py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
            >
              <X className="w-4 h-4" />
              Decline
            </button>
            <button
              type="button"
              onClick={onAcceptRide}
              className="py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/25 transition"
            >
              <Check className="w-4 h-4" />
              Accept Ride (₹{Math.round(activeRide.fare)})
            </button>
          </div>
        </div>
      )}

      {/* Assigned Trip Controls */}
      {isTripAssigned && (
        <div className="bg-slate-900 border border-cyan-500/40 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
              Active Trip Navigation
            </span>
            <span className="text-xs text-slate-400">
              Passenger: <strong className="text-white">{activeRide.riderName}</strong>
            </span>
          </div>

          {/* Stepper buttons */}
          <div className="space-y-2">
            {activeRide.status === 'driver_assigned' && (
              <button
                type="button"
                onClick={() => onUpdateRideStatus('arriving')}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Navigation className="w-4 h-4" />
                Start Driving to Pickup
              </button>
            )}

            {activeRide.status === 'arriving' && (
              <button
                type="button"
                onClick={() => onUpdateRideStatus('in_progress')}
                className="w-full py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <Car className="w-4 h-4" />
                Passenger Picked Up - Start Trip
              </button>
            )}

            {activeRide.status === 'in_progress' && (
              <button
                type="button"
                onClick={() => onUpdateRideStatus('completed')}
                className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
              >
                <CheckCircle className="w-4 h-4" />
                Complete Trip & Collect Payment (₹{Math.round(activeRide.fare)})
              </button>
            )}
          </div>
        </div>
      )}

      {/* Offline notice */}
      {!isOnline && (
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 text-center text-slate-400 space-y-2">
          <Power className="w-8 h-8 mx-auto text-slate-600" />
          <h4 className="text-sm font-semibold text-slate-300">You are currently offline</h4>
          <p className="text-xs text-slate-500">Go online to receive ride requests nearby.</p>
        </div>
      )}
    </div>
  );
}
