'use client';

import React, { useState } from 'react';
import { LocationPoint, Waypoint } from '@/types';
import { MapPin, Plus, Trash2, ArrowUpDown, MousePointerClick, Building2, Plane, Train } from 'lucide-react';

interface LocationInputProps {
  pickup: LocationPoint | null;
  dropoff: LocationPoint | null;
  waypoints: Waypoint[];
  cityPresets: LocationPoint[];
  cityName: string;
  onSelectPickup: (loc: LocationPoint) => void;
  onSelectDropoff: (loc: LocationPoint) => void;
  onAddWaypoint: (wp: Waypoint) => void;
  onRemoveWaypoint: (id: string) => void;
  onSwapLocations: () => void;
  onToggleMapPick: (mode: 'pickup' | 'dropoff' | 'waypoint' | null) => void;
  activePickMode: 'pickup' | 'dropoff' | 'waypoint' | null;
}

export default function LocationInput({
  pickup,
  dropoff,
  waypoints,
  cityPresets,
  cityName,
  onSelectPickup,
  onSelectDropoff,
  onAddWaypoint,
  onRemoveWaypoint,
  onSwapLocations,
  onToggleMapPick,
  activePickMode,
}: LocationInputProps) {
  const [showPresetsFor, setShowPresetsFor] = useState<'pickup' | 'dropoff' | 'waypoint' | null>(null);

  const handlePresetSelect = (preset: LocationPoint) => {
    if (showPresetsFor === 'pickup') {
      onSelectPickup(preset);
    } else if (showPresetsFor === 'dropoff') {
      onSelectDropoff(preset);
    } else if (showPresetsFor === 'waypoint') {
      onAddWaypoint({
        id: `wp-${Date.now()}`,
        address: preset.name || preset.address,
        coordinates: preset.coordinates,
      });
    }
    setShowPresetsFor(null);
  };

  return (
    <div className="space-y-3">
      {/* Inputs container */}
      <div className="relative bg-slate-900/90 rounded-2xl p-4 border border-slate-800 shadow-lg">
        {/* Visual route connector line */}
        <div className="absolute left-[29px] top-[32px] bottom-[32px] w-[2px] bg-gradient-to-b from-emerald-500 via-amber-400 to-rose-500"></div>

        {/* Pickup Input */}
        <div className="relative flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center shrink-0 z-10">
            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold tracking-wider uppercase text-emerald-400 block mb-0.5">
              Pickup Location
            </label>
            <input
              type="text"
              readOnly
              value={pickup ? pickup.name || pickup.address : ''}
              placeholder={`Select pickup in ${cityName}...`}
              onClick={() => setShowPresetsFor('pickup')}
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 cursor-pointer"
            />
          </div>
          <button
            type="button"
            title="Pick on map"
            onClick={() => onToggleMapPick(activePickMode === 'pickup' ? null : 'pickup')}
            className={`p-2 rounded-xl border transition-all ${
              activePickMode === 'pickup'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <MousePointerClick className="w-4 h-4" />
          </button>
        </div>

        {/* Waypoints (Multi-stop) */}
        {waypoints.map((wp, idx) => (
          <div key={wp.id} className="relative flex items-center gap-3 mt-3">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center shrink-0 z-10 text-[10px] font-bold text-amber-300">
              {idx + 1}
            </div>
            <div className="flex-1">
              <label className="text-[10px] font-bold tracking-wider uppercase text-amber-400 block mb-0.5">
                Stop {idx + 1}
              </label>
              <input
                type="text"
                readOnly
                value={wp.address}
                className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-100"
              />
            </div>
            <button
              type="button"
              onClick={() => onRemoveWaypoint(wp.id)}
              className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Dropoff Input */}
        <div className="relative flex items-center gap-3 mt-3">
          <div className="w-6 h-6 rounded-lg bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center shrink-0 z-10">
            <div className="w-2 h-2 rounded-sm bg-rose-400"></div>
          </div>
          <div className="flex-1">
            <label className="text-[10px] font-bold tracking-wider uppercase text-rose-400 block mb-0.5">
              Drop-off Destination
            </label>
            <input
              type="text"
              readOnly
              value={dropoff ? dropoff.name || dropoff.address : ''}
              placeholder={`Select destination in ${cityName}...`}
              onClick={() => setShowPresetsFor('dropoff')}
              className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 cursor-pointer"
            />
          </div>
          <button
            type="button"
            title="Pick on map"
            onClick={() => onToggleMapPick(activePickMode === 'dropoff' ? null : 'dropoff')}
            className={`p-2 rounded-xl border transition-all ${
              activePickMode === 'dropoff'
                ? 'bg-rose-500/20 border-rose-400 text-rose-300'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-white'
            }`}
          >
            <MousePointerClick className="w-4 h-4" />
          </button>
        </div>

        {/* Sub-actions: Add Stop & Swap */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => setShowPresetsFor('waypoint')}
            className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold px-2 py-1 rounded-lg hover:bg-amber-500/10 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Multi-Stop
          </button>

          <button
            type="button"
            onClick={onSwapLocations}
            title="Swap Pickup and Destination"
            className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-800 transition"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            Swap
          </button>
        </div>
      </div>

      {/* Preset Location Picker Modal / Drawer */}
      {showPresetsFor && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Popular {cityName} Hotspots for {showPresetsFor}
            </span>
            <button
              onClick={() => setShowPresetsFor(null)}
              className="text-xs text-slate-500 hover:text-slate-300"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {cityPresets.map((preset) => {
              const isAirport = preset.name?.toLowerCase().includes('airport');
              const isMetro = preset.name?.toLowerCase().includes('metro');

              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handlePresetSelect(preset)}
                  className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/40 text-left transition"
                >
                  <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0 mt-0.5">
                    {isAirport ? (
                      <Plane className="w-3.5 h-3.5" />
                    ) : isMetro ? (
                      <Train className="w-3.5 h-3.5" />
                    ) : (
                      <Building2 className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <div className="text-xs font-semibold text-slate-200 truncate">{preset.name}</div>
                    <div className="text-[11px] text-slate-400 truncate">{preset.address}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
