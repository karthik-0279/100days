import React from 'react';
import { X, Flame, Award, Calendar } from 'lucide-react';
import { calculateDayScore } from '../data/defaultData';

export default function GridOverview({ isOpen, onClose, days = [], currentDay, onSelectDay }) {
  if (!isOpen) return null;

  const getScoreColor = (score, isCurrent) => {
    let base = '';
    if (score === 2) {
      base = 'bg-amber-400/20 border-amber-400/60 text-amber-300 hover:bg-amber-400/30';
    } else if (score === 1) {
      base = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/30';
    } else {
      base = 'bg-slate-800/40 border-slate-800/80 text-slate-500 hover:border-slate-700 hover:text-slate-300';
    }

    if (isCurrent) {
      base += ' ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-950 scale-105 font-bold z-10';
    }
    return base;
  };

  const perfectDaysCount = days.filter((d) => calculateDayScore(d).isComplete).length;
  const activeDaysCount = days.filter((d) => calculateDayScore(d).count > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                100-Day Journey Matrix
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium">
                  {activeDaysCount}/100 Started
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Click any day to jump directly into its habit tracker
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Legend & Stats Banner */}
        <div className="px-6 py-3 bg-slate-950/40 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-slate-400">Legend:</span>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-amber-400/20 border border-amber-400/60 inline-block"></span>
              <span className="text-slate-300">2/2 Complete (Walk &amp; Hydration)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-emerald-500/20 border border-emerald-500/50 inline-block"></span>
              <span className="text-slate-300">1/2 In-Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-3.5 rounded bg-slate-800/40 border border-slate-800 inline-block"></span>
              <span className="text-slate-400">0/2 Unlogged</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-300 font-mono text-[11px]">
            <span className="flex items-center gap-1 text-amber-400">
              <Award className="w-3.5 h-3.5" />
              {perfectDaysCount} Perfect Days
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <Flame className="w-3.5 h-3.5" />
              Current: Day {currentDay}
            </span>
          </div>
        </div>

        {/* 100 Squares Grid */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 custom-scrollbar">
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5">
            {days.map((day, index) => {
              const dayNum = day.day || day.dayNumber || index + 1;
              const scoreObj = calculateDayScore(day);
              const score = scoreObj.count;
              const isCurrent = dayNum === currentDay;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => {
                    onSelectDay(dayNum);
                    onClose();
                  }}
                  className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center p-1 transition-all duration-150 ${getScoreColor(
                    score,
                    isCurrent
                  )}`}
                >
                  <span className="text-xs sm:text-sm font-semibold">{dayNum}</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[1, 2].map((dot) => (
                      <span
                        key={dot}
                        className={`w-1.5 h-1.5 rounded-full ${
                          dot <= score ? 'bg-current' : 'bg-slate-700/50'
                        }`}
                      />
                    ))}
                  </div>

                  {score === 2 && (
                    <span className="absolute -top-1 -right-1 text-amber-400 text-xs">
                      ★
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Jump Shortcuts */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400">Quick Milestone Jump:</span>
          <div className="flex items-center gap-2">
            {[1, 25, 50, 75, 100].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  onSelectDay(num);
                  onClose();
                }}
                className={`px-2.5 py-1 rounded-lg border font-mono transition-colors ${
                  currentDay === num
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                Day {num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
