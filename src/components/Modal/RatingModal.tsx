'use client';

import React, { useState } from 'react';
import { ActiveRide } from '@/types';
import { Star, Heart, Check, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RatingModalProps {
  ride: ActiveRide;
  onSubmit: (rating: number, review: string, tip: number) => void;
  onClose: () => void;
}

const COMPLIMENTS = [
  'Clean & Fresh Car',
  'Smooth & Safe Driving',
  'Great Conversation',
  'Quick Route',
  'Comfortable Ride',
  'Polite & Professional',
];

export default function RatingModal({ ride, onSubmit, onClose }: RatingModalProps) {
  const [stars, setStars] = useState(5);
  const [hoverStars, setHoverStars] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [selectedTip, setSelectedTip] = useState<number>(0);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    const fullReview = [
      selectedTags.join(', '),
      reviewText.trim(),
    ]
      .filter(Boolean)
      .join(' — ');

    onSubmit(stars, fullReview, selectedTip);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="text-base font-bold">Rate Your Experience</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Driver info */}
        {ride.driver && (
          <div className="text-center space-y-2">
            <img
              src={ride.driver.avatarUrl}
              alt={ride.driver.name}
              className="w-16 h-16 rounded-full object-cover mx-auto ring-4 ring-cyan-500/30"
            />
            <div>
              <h3 className="font-bold text-slate-100">{ride.driver.name}</h3>
              <p className="text-xs text-slate-400">{ride.driver.vehicle}</p>
            </div>
          </div>
        )}

        {/* 5 Star interactive rating */}
        <div className="flex items-center justify-center gap-2 py-1">
          {[1, 2, 3, 4, 5].map((star) => {
            const isFilled = (hoverStars || stars) >= star;
            return (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverStars(star)}
                onMouseLeave={() => setHoverStars(0)}
                onClick={() => setStars(star)}
                className="p-1 transition-transform hover:scale-125 focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 transition-colors ${
                    isFilled
                      ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                      : 'text-slate-700'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Compliment badges */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 block">
            What made this ride great?
          </label>
          <div className="flex flex-wrap gap-1.5">
            {COMPLIMENTS.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    active
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                      : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-600'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tip selection */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-400 block">
            Add a tip for the driver (Optional)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[0, 2, 5, 10].map((amount) => (
              <button
                key={amount}
                type="button"
                onClick={() => setSelectedTip(amount)}
                className={`py-2 rounded-xl text-xs font-bold border transition ${
                  selectedTip === amount
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                    : 'bg-slate-800/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                {amount === 0 ? 'No Tip' : `+$${amount}`}
              </button>
            ))}
          </div>
        </div>

        {/* Feedback comment input */}
        <div>
          <textarea
            rows={2}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share additional feedback..."
            className="w-full bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-emerald-400 hover:from-cyan-400 hover:to-emerald-300 text-slate-950 font-bold rounded-2xl text-xs shadow-lg transition"
        >
          Submit Review & Finish
        </button>
      </div>
    </div>
  );
}
