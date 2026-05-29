"use client";

import { Star, User, MessageSquare, Calendar } from "lucide-react";

interface TrainerWidgetProps {
  name?: string;
  specialty?: string;
  rating?: number;
  clients?: number;
  experience?: string;
  nextSession?: string;
  sessionFocus?: string;
  avatarUrl?: string;
}

export default function TrainerWidget({
  name = "Michael Johnson",
  specialty = "Certified Strength & Conditioning Specialist",
  rating = 4.8,
  clients = 95,
  experience = "8 years",
  nextSession = "Tomorrow 4:00 PM",
  sessionFocus = "Upper Body Focus",
  avatarUrl = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=60",
}: TrainerWidgetProps) {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        My Personal Trainer
      </h3>

      <div className="flex flex-wrap justify-between items-start gap-4">
        {/* Trainer info */}
        <div className="flex items-start gap-4">
          <img
            src={avatarUrl}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border-2 border-emerald-100"
          />
          <div>
            <div className="font-semibold text-gray-900">{name}</div>
            <div className="text-xs text-gray-500 mt-0.5 max-w-[200px]">{specialty}</div>

            <div className="flex items-center gap-3 mt-2 text-xs">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={12} fill="currentColor" />
                <span className="font-semibold">{rating}</span>
              </div>
              <span className="text-gray-300">•</span>
              <div className="text-gray-500">{experience} exp.</div>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1.5">
              <div className="flex items-center gap-1">
                <User size={11} />
                <span>{clients} clients</span>
              </div>
            </div>
          </div>
        </div>

        {/* Next session pill */}
        <div className="shrink-0 rounded-xl px-5 py-4 text-center bg-gradient-to-br from-emerald-600 to-green-700 text-white min-w-[160px]">
          <div className="text-xs opacity-80">Next Session</div>
          <div className="text-sm font-bold mt-1">{nextSession}</div>
          <div className="text-xs opacity-70 mt-1.5">{sessionFocus}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
          <Calendar size={14} />
          Book Session
        </button>
        <button className="border border-emerald-400 text-emerald-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-50 transition-colors flex items-center gap-2">
          <MessageSquare size={14} />
          Message
        </button>
      </div>
    </div>
  );
}
