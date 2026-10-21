'use client';

import React, { useState } from 'react';
import { ActiveRide } from '@/types';
import { Phone, MessageSquare, AlertTriangle, XCircle, ShieldCheck, Star, Navigation2, CheckCircle2 } from 'lucide-react';

interface ActiveRideSheetProps {
  ride: ActiveRide;
  onCancelRide: () => void;
  onTriggerSos: () => void;
  onAdvanceSimulation?: () => void;
}

export default function ActiveRideSheet({
  ride,
  onCancelRide,
  onTriggerSos,
  onAdvanceSimulation,
}: ActiveRideSheetProps) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([
    'Hello! I am on my way to your pickup point.',
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setChatMessages((prev) => [...prev, `You: ${inputMsg}`]);
    setInputMsg('');
    setTimeout(() => {
      setChatMessages((prev) => [...prev, 'Driver: Got it, see you in 2 minutes!']);
    }, 1200);
  };

  const statusConfig = {
    searching: {
      title: 'Searching for Nearby Drivers',
      subtitle: 'Matching you with the closest top-rated driver...',
      badgeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      progress: 25,
    },
    driver_assigned: {
      title: 'Driver Assigned',
      subtitle: `${ride.driver?.name} accepted your request`,
      badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
      progress: 50,
    },
    arriving: {
      title: 'Driver is Arriving',
      subtitle: `${ride.driver?.name} is 2 mins away in a ${ride.driver?.vehicle}`,
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      progress: 75,
    },
    in_progress: {
      title: 'Trip in Progress',
      subtitle: `En route to ${ride.dropoff.name || ride.dropoff.address}`,
      badgeClass: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
      progress: 90,
    },
    completed: {
      title: 'Trip Completed',
      subtitle: 'You have arrived at your destination!',
      badgeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      progress: 100,
    },
    cancelled: {
      title: 'Trip Cancelled',
      subtitle: 'This ride has been cancelled',
      badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
      progress: 0,
    },
    idle: {
      title: 'Ready',
      subtitle: '',
      badgeClass: '',
      progress: 0,
    },
  }[ride.status];

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
      {/* Status banner with progress bar */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <span
              className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border mb-1 ${statusConfig.badgeClass}`}
            >
              {ride.status.replace('_', ' ').toUpperCase()}
            </span>
            <h3 className="text-base font-bold text-slate-100">{statusConfig.title}</h3>
            <p className="text-xs text-slate-400">{statusConfig.subtitle}</p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Fare</span>
            <span className="text-lg font-bold text-slate-100">₹{Math.round(ride.fare)}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-cyan-500 via-emerald-400 to-cyan-400 h-full transition-all duration-700 ease-out"
            style={{ width: `${statusConfig.progress}%` }}
          />
        </div>
      </div>

      {/* Driver card if assigned */}
      {ride.driver && (
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={ride.driver.avatarUrl}
              alt={ride.driver.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-cyan-500/50"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-slate-100">{ride.driver.name}</span>
                <span className="inline-flex items-center gap-0.5 text-xs text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded-md font-medium">
                  <Star className="w-3 h-3 fill-amber-400" />
                  {ride.driver.rating}
                </span>
              </div>
              <div className="text-xs text-slate-300 font-medium">{ride.driver.vehicle}</div>
              <div className="text-[11px] font-mono text-cyan-400 tracking-wider">
                {ride.driver.plate}
              </div>
            </div>
          </div>

          {/* Quick Communication Actions */}
          <div className="flex items-center gap-2">
            <a
              href={`tel:${ride.driver.phone}`}
              className="p-2.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 hover:text-white transition"
              title="Call Driver"
            >
              <Phone className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => setChatOpen(!chatOpen)}
              className="p-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition"
              title="Message Driver"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Chat drawer */}
      {chatOpen && (
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 space-y-2">
          <div className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>In-App Chat with Driver</span>
            <button onClick={() => setChatOpen(false)} className="text-slate-500 hover:text-slate-300">
              ✕
            </button>
          </div>
          <div className="max-h-32 overflow-y-auto space-y-1.5 text-xs p-1">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-2 rounded-xl max-w-[85%] ${
                  msg.startsWith('You:')
                    ? 'ml-auto bg-cyan-600 text-white rounded-br-none'
                    : 'bg-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {msg}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Type message..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-cyan-500 text-slate-950 font-semibold rounded-xl text-xs"
            >
              Send
            </button>
          </form>
        </div>
      )}

      {/* Action buttons (SOS, Cancel, Advance Demo) */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        {ride.status !== 'completed' && ride.status !== 'cancelled' && (
          <>
            {/* Emergency SOS button */}
            <button
              type="button"
              onClick={onTriggerSos}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition"
            >
              <AlertTriangle className="w-4 h-4" />
              Emergency SOS
            </button>

            {/* Cancel Ride button */}
            {ride.status !== 'in_progress' && (
              <button
                type="button"
                onClick={onCancelRide}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
              >
                <XCircle className="w-4 h-4" />
                Cancel Ride
              </button>
            )}

            {/* Step Simulation button for quick interactive testing */}
            {onAdvanceSimulation && (
              <button
                type="button"
                onClick={onAdvanceSimulation}
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-medium transition"
              >
                <Navigation2 className="w-3.5 h-3.5 animate-pulse" />
                Advance Trip Stage (Demo Simulation)
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
