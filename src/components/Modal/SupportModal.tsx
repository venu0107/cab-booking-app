'use client';

import React, { useState } from 'react';
import { SupportTicket } from '@/types';
import { getSupportTickets, saveSupportTicket } from '@/lib/storage';
import { LifeBuoy, Send, CheckCircle2, Clock, X, HelpCircle } from 'lucide-react';

interface SupportModalProps {
  userId: string;
  onClose: () => void;
}

export default function SupportModal({ userId, onClose }: SupportModalProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>(() => getSupportTickets());
  const [category, setCategory] = useState<SupportTicket['category']>('lost_item');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const newTicket: SupportTicket = {
      id: `TICK-${Math.floor(1000 + Math.random() * 9000)}`,
      userId,
      category,
      subject: subject.trim(),
      message: message.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    saveSupportTicket(newTicket);
    setTickets((prev) => [newTicket, ...prev]);
    setSubmitted(true);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <LifeBuoy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Help & Support Center</h2>
              <p className="text-xs text-slate-400">24/7 Passenger & Driver Assistance</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-5 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-100">Support Ticket Created</h3>
            <p className="text-xs text-slate-400">
              Our support team has received your ticket and will respond within 2-4 hours.
            </p>
            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200"
            >
              Submit Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Issue Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as SupportTicket['category'])}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="lost_item">Lost an Item in Vehicle</option>
                <option value="fare_dispute">Payment / Fare Discrepancy</option>
                <option value="safety">Safety or Driving Conduct</option>
                <option value="driver_feedback">Driver Feedback / Compliment</option>
                <option value="other">Other Account Inquiry</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Brief summary of the issue..."
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">
                Detailed Description
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Provide details (date of trip, lost item description, etc.)..."
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg transition"
            >
              <Send className="w-4 h-4" />
              Submit Support Ticket
            </button>
          </form>
        )}

        {/* Existing tickets list */}
        {tickets.length > 0 && (
          <div className="pt-2 border-t border-slate-800 space-y-2">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Your Recent Support Requests ({tickets.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {tickets.map((t) => (
                <div
                  key={t.id}
                  className="bg-slate-800/50 border border-slate-800 rounded-xl p-2.5 text-xs flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-cyan-400 font-semibold">{t.id}</span>
                      <span className="text-slate-200 font-medium truncate max-w-[180px]">
                        {t.subject}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/30 uppercase">
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
