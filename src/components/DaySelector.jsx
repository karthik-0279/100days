import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, CheckCircle2, CircleDashed, Sparkles, Quote } from 'lucide-react';
import { MOTIVATIONAL_QUOTES } from '../data/defaultData';

export default function DaySelector({
  currentDay,
  totalDays,
  dayScore,
  onPrevDay,
  onNextDay,
  onSelectDay
}) {
  const quoteIndex = (currentDay - 1) % MOTIVATIONAL_QUOTES.length;
  const quote = MOTIVATIONAL_QUOTES[quoteIndex];

  return (
    <div className="space-y-4">
      
      {/* Main Day Navigation Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 right-1/4 w-48 h-24 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Day Navigation & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={onPrevDay}
              disabled={currentDay <= 1}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 hover:text-white border border-slate-700/60 transition-all shadow-sm"
              title="Previous Day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>Day {currentDay}</span>
                  <span className="text-slate-500 text-lg font-normal">/ {totalDays}</span>
                </h1>

                {/* Score Status Badge */}
                {dayScore.isComplete ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm animate-bounce-short">
                    <Sparkles className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                    <span>100% Complete</span>
                  </span>
                ) : dayScore.count > 0 ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    <CircleDashed className="w-3 h-3 text-teal-400" />
                    <span>{dayScore.count}/{dayScore.total || 2} Habits ({dayScore.percent}%)</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700/50">
                    <span>0/{dayScore.total || 2} Completed</span>
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Calendar className="w-3 h-3 text-emerald-400" />
                <span>100-Day Fitness Challenge</span>
              </div>
            </div>

            <button
              onClick={onNextDay}
              disabled={currentDay >= totalDays}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 hover:text-white border border-slate-700/60 transition-all shadow-sm"
              title="Next Day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Jump Dropdown & Milestones */}
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
            <span className="text-xs text-slate-400 font-medium">Jump:</span>
            {[1, 25, 50, 75, 100].map((d) => (
              <button
                key={d}
                onClick={() => onSelectDay(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  currentDay === d
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                }`}
              >
                D{d}
              </button>
            ))}

            <select
              value={currentDay}
              onChange={(e) => onSelectDay(Number(e.target.value))}
              aria-label="Select any day from 1 to 100"
              className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer font-medium"
            >
              {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  Day {d}
                </option>
              ))}
            </select>
          </div>

        </div>

        {/* 100-Day Micro Progress Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span>Progress: Day {currentDay} of {totalDays}</span>
            <span className="text-emerald-400 font-semibold">{Math.round((currentDay / totalDays) * 100)}% Through Challenge</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${(currentDay / totalDays) * 100}%` }}
            />
          </div>
        </div>

      </div>

      {/* Motivational Quote Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-900/40 border border-emerald-900/30 rounded-xl p-3 sm:px-4 flex items-center gap-3 text-xs text-slate-300">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
          <Quote className="w-3.5 h-3.5" />
        </div>
        <p className="italic text-slate-300">
          &ldquo;{quote}&rdquo;
        </p>
      </div>

    </div>
  );
}

