'use client';

import React, { useState, useEffect } from 'react';
import {
  Car,
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Sparkles,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  X,
} from 'lucide-react';
import { UserRole } from '@/types';
import { registerUser, loginUser, AuthResult } from '@/lib/auth';

interface AuthModalProps {
  onAuthSuccess: () => void;
}

type AuthMode = 'login' | 'register';

export default function AuthModal({ onAuthSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('rider');

  useEffect(() => {
    setError('');
    setSuccess('');
    setPassword('');
    setConfirmPassword('');
  }, [mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (mode === 'register') {
      if (!fullName.trim() || fullName.trim().length < 2) {
        setError('Please enter your full name (min 2 characters).');
        return;
      }
      if (!phone.trim()) {
        setError('Please enter your mobile number.');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please try again.');
        return;
      }
    }

    setIsLoading(true);

    // Simulate brief async for UX
    await new Promise((r) => setTimeout(r, 700));

    let result: AuthResult;
    if (mode === 'login') {
      result = loginUser(email, password);
    } else {
      result = registerUser({ fullName, email, phone, password, role });
    }

    setIsLoading(false);

    if (!result.success) {
      setError(result.error || 'Something went wrong. Please try again.');
    } else {
      setSuccess(
        mode === 'login'
          ? `Welcome back, ${result.user?.fullName.split(' ')[0]}! 🎉`
          : `Account created! Welcome to BharatRide, ${result.user?.fullName.split(' ')[0]}! 🚀`
      );
      setTimeout(() => {
        onAuthSuccess();
      }, 900);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/95 backdrop-blur-xl p-4">
      {/* Animated background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo & Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 via-orange-400 to-amber-300 shadow-2xl shadow-amber-500/40 mb-4">
            <Car className="w-8 h-8 text-slate-950" />
          </div>
          <h1 className="text-3xl font-black tracking-wider text-white">
            BHARAT<span className="text-amber-400">RIDE</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">India&apos;s Premier Cab & Auto Booking</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/60 rounded-3xl shadow-2xl overflow-hidden">
          {/* Mode Toggle Tabs */}
          <div className="flex border-b border-slate-800">
            <button
              type="button"
              onClick={() => setMode('login')}
              className={`flex-1 py-4 text-sm font-bold transition-all ${
                mode === 'login'
                  ? 'text-amber-400 bg-amber-500/5 border-b-2 border-amber-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setMode('register')}
              className={`flex-1 py-4 text-sm font-bold transition-all ${
                mode === 'register'
                  ? 'text-amber-400 bg-amber-500/5 border-b-2 border-amber-400'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Header text */}
            <div className="mb-2">
              <h2 className="text-xl font-black text-white">
                {mode === 'login' ? 'Welcome back! 👋' : 'Join BharatRide 🚗'}
              </h2>
              <p className="text-slate-400 text-xs mt-0.5">
                {mode === 'login'
                  ? 'Sign in to book rides, view history, and more.'
                  : 'Create your account to get started in seconds.'}
              </p>
            </div>

            {/* Register-only fields */}
            {mode === 'register' && (
              <>
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Arjun Kumar Verma"
                      required
                      className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Mobile Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <span className="text-sm">🇮🇳</span>
                      <span className="text-xs text-slate-400 font-bold">+91</span>
                    </div>
                    <Phone className="absolute left-[72px] top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      required
                      maxLength={10}
                      className="w-full pl-[96px] pr-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition"
                    />
                  </div>
                </div>

                {/* Role Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    I want to
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('rider')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                        role === 'rider'
                          ? 'bg-amber-500/15 border-amber-500/50 text-amber-400'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      Book Rides
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('driver')}
                      className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-sm font-bold transition-all ${
                        role === 'driver'
                          ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <Car className="w-4 h-4" />
                      Drive & Earn
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yourname@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Min. 6 characters' : 'Enter your password'}
                  required
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  className="w-full pl-10 pr-12 py-3 bg-slate-800/60 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password (register only) */}
            {mode === 'register' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    required
                    autoComplete="new-password"
                    className={`w-full pl-10 pr-12 py-3 bg-slate-800/60 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                      confirmPassword && password !== confirmPassword
                        ? 'border-red-500/60 focus:ring-red-500/30'
                        : confirmPassword && password === confirmPassword
                        ? 'border-emerald-500/60 focus:ring-emerald-500/30'
                        : 'border-slate-700 focus:ring-amber-500/50 focus:border-amber-500/50'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  {/* Inline match indicator */}
                  {confirmPassword && (
                    <span className="absolute right-10 top-1/2 -translate-y-1/2">
                      {password === confirmPassword ? (
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-xs text-red-300">{error}</p>
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="flex items-start gap-2.5 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-xs text-emerald-300">{success}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || Boolean(success)}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-400 to-amber-500 hover:from-amber-400 hover:to-orange-300 disabled:opacity-60 text-slate-950 font-black rounded-2xl text-sm tracking-wide shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition transform active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-slate-900/40 border-t-slate-900 rounded-full animate-spin" />
                  <span>{mode === 'login' ? 'Signing In...' : 'Creating Account...'}</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Redirecting...</span>
                </>
              ) : (
                <>
                  <span>{mode === 'login' ? 'Sign In to BharatRide' : 'Create My Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Toggle mode */}
            <p className="text-center text-xs text-slate-500 pt-1">
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('register')}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    Register here
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('login')}
                    className="text-amber-400 font-bold hover:underline"
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>
          </form>

          {/* Footer */}
          <div className="px-6 pb-5 text-center">
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-600">
              <Sparkles className="w-3 h-3 text-amber-500/50" />
              <span>BharatRide — Auto, Bike Taxi & AC Cabs across India</span>
              <Sparkles className="w-3 h-3 text-amber-500/50" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
