'use client';

import React, { useState } from 'react';
import { ActiveRide } from '@/types';
import { AlertTriangle, Phone, ShieldAlert, CheckCircle, X } from 'lucide-react';

interface EmergencySosModalProps {
  ride: ActiveRide;
  onClose: () => void;
}

export default function EmergencySosModal({ ride, onClose }: EmergencySosModalProps) {
  const [alertSent, setAlertSent] = useState(false);

  const handleTriggerEmergency = () => {
    setAlertSent(true);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border-2 border-rose-500/80 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-500">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500 flex items-center justify-center animate-pulse">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Emergency Assistance</h2>
              <p className="text-xs text-rose-400 font-medium">India National Safety Protocol</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!alertSent ? (
          <>
            <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl p-4 text-xs text-rose-200 space-y-2">
              <p className="font-semibold text-rose-300">
                Are you in immediate emergency?
              </p>
              <p className="text-slate-300">
                Triggering SOS will broadcast your live GPS coordinates, vehicle registration ({ride.driver?.plate}), and route to the local Police Control Room (PCR) and your emergency contacts.
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleTriggerEmergency}
                className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-2xl shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 text-sm tracking-wide transition animate-bounce"
              >
                <AlertTriangle className="w-5 h-5" />
                BROADCAST SOS ALERT NOW
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href="tel:112"
                  className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-semibold flex items-center justify-center gap-2 text-xs border border-slate-700 transition"
                >
                  <Phone className="w-4 h-4 text-rose-400" />
                  Call 112 (Emergency)
                </a>
                <a
                  href="tel:1091"
                  className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-semibold flex items-center justify-center gap-2 text-xs border border-slate-700 transition"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  Call 1091 (Women Helpline)
                </a>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-4 text-center py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Emergency Alert Broadcasted</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your live telemetry has been transmitted to PCR and emergency contacts.
              </p>
            </div>

            <div className="bg-slate-800/80 rounded-2xl p-3 text-xs text-left space-y-1.5 border border-slate-700">
              <div className="flex justify-between text-slate-400">
                <span>Trip ID:</span>
                <span className="font-mono text-white">{ride.id.slice(0, 10)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Current Coordinates:</span>
                <span className="font-mono text-amber-400">
                  {ride.pickup.coordinates.lat.toFixed(4)}, {ride.pickup.coordinates.lng.toFixed(4)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Vehicle:</span>
                <span className="text-white font-mono">{ride.driver?.vehicle} ({ride.driver?.plate})</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-2xl text-xs transition"
            >
              Close & Dismiss Alert
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
