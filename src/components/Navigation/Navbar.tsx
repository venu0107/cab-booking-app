'use client';

import React from 'react';
import { UserRole, UserProfile, CityId } from '@/types';
import {
  Car,
  User,
  History,
  LifeBuoy,
  MapPin,
  LogOut,
} from 'lucide-react';

interface NavbarProps {
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  selectedCity: CityId;
  onSelectCity: (city: CityId) => void;
  activeProfile: UserProfile;
  onOpenProfile: () => void;
  onOpenHistory: () => void;
  onOpenSupport: () => void;
  hasActiveRide: boolean;
  onLogout?: () => void;
}

export default function Navbar({
  currentRole,
  onSwitchRole,
  selectedCity,
  onSelectCity,
  activeProfile,
  onOpenProfile,
  onOpenHistory,
  onOpenSupport,
  hasActiveRide,
  onLogout,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-[1000] w-full border-b border-slate-800 bg-slate-950/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 h-16 flex items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 via-white to-emerald-500 p-[1.5px] shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
              <Car className="w-4 h-4 text-amber-400" />
            </div>
          </div>
          <div>
            <span className="text-base sm:text-lg font-black tracking-wider text-white">
              BHARAT<span className="text-amber-400">RIDE</span>
            </span>
            <span className="hidden lg:inline-block ml-2 text-[9px] font-bold tracking-widest uppercase text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
              INDIA CABS &amp; AUTO
            </span>
          </div>
        </div>

        {/* City Selector */}
        <div className="relative">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-2xl px-2.5 py-1.5 shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <select
              value={selectedCity}
              onChange={(e) => onSelectCity(e.target.value as CityId)}
              className="bg-transparent text-xs font-bold text-slate-100 focus:outline-none cursor-pointer pr-1"
            >
              <option value="bengaluru" className="bg-slate-900 text-white">🏙️ Bengaluru (KA)</option>
              <option value="mumbai" className="bg-slate-900 text-white">🌊 Mumbai (MH)</option>
              <option value="delhi" className="bg-slate-900 text-white">🏛️ Delhi NCR (DL)</option>
              <option value="hyderabad" className="bg-slate-900 text-white">💎 Hyderabad (TS)</option>
              <option value="visakhapatnam" className="bg-slate-900 text-white">🏖️ Visakhapatnam (AP)</option>
            </select>
          </div>
        </div>

        {/* Center: Role Switcher (Rider vs Driver mode) */}
        <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 p-1 rounded-2xl shadow-inner">
          <button
            type="button"
            onClick={() => onSwitchRole('rider')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              currentRole === 'rider'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Rider View</span>
          </button>

          <button
            type="button"
            onClick={() => onSwitchRole('driver')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all ${
              currentRole === 'driver'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5" />
            <span>Driver View</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* History */}
          <button
            type="button"
            onClick={onOpenHistory}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-medium"
            title="Ride History"
          >
            <History className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Trips</span>
          </button>

          {/* Support */}
          <button
            type="button"
            onClick={onOpenSupport}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-medium"
            title="Help &amp; Support"
          >
            <LifeBuoy className="w-4 h-4 text-emerald-400" />
            <span className="hidden md:inline">Help</span>
          </button>

          {/* Profile Avatar */}
          <button
            type="button"
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 p-1 pl-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-2xl transition"
          >
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">
                {activeProfile.fullName.split(' ')[0]}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">{activeProfile.email}</p>
            </div>
            <img
              src={activeProfile.avatarUrl}
              alt={activeProfile.fullName}
              className="w-8 h-8 rounded-xl object-cover ring-1 ring-amber-500/40"
            />
          </button>

          {/* Logout */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-900 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 text-slate-500 hover:text-red-400 transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
