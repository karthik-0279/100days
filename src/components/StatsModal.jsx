import React from 'react';
import { X, Trophy, Flame, Droplets, Footprints } from 'lucide-react';
import { calculateDayScore } from '../data/defaultData';

export default function StatsModal({ isOpen, onClose, days = [], currentDay }) {
  if (!isOpen) return null;

  const totalDays = 100;
  const perfectDays = days.filter((d) => calculateDayScore(d).isComplete).length;

  // Habit metrics
  const walkRunCount = days.filter((d) => (d.morningRunWalk?.completed || d.walkRun?.completed)).length;
  const waterMetCount = days.filter((d) => {
    const glasses = d.waterIntake?.glasses || 0;
    const amountMl = d.waterIntake?.amountMl || 0;
    return d.waterIntake?.completed || glasses >= 14 || amountMl >= 3500;
  }).length;

  const totalKm = days.reduce((sum, d) => {
    const run = d.morningRunWalk || d.walkRun || {};
    return sum + (parseFloat(run.distanceKm) || 0);
  }, 0);

  const totalSteps = days.reduce((sum, d) => {
    const run = d.morningRunWalk || d.walkRun || {};
    return sum + (parseInt(run.steps) || 0);
  }, 0);

  const totalDurationMin = days.reduce((sum, d) => {
    const run = d.morningRunWalk || d.walkRun || {};
    return sum + (parseInt(run.durationMin || run.durationMinutes) || 0);
  }, 0);

  const totalWaterLiters = days.reduce((sum, d) => {
    const amount = d.waterIntake?.amountMl || ((d.waterIntake?.glasses || 0) * 250);
    return sum + (amount / 1000);
  }, 0);

  // Current streak
  let currentStreak = 0;
  for (let i = currentDay - 1; i >= 0; i--) {
    if (calculateDayScore(days[i]).count >= 1) {
      currentStreak++;
    } else {
      break;
    }
  }

  const habitCards = [
    {
      title: 'Morning Walk & Run',
      count: walkRunCount,
      percent: Math.round((walkRunCount / totalDays) * 100),
      color: 'from-blue-500/20 to-indigo-500/10 border-blue-500/30 text-blue-400',
      barColor: 'bg-blue-400',
      icon: Footprints,
      sub: `${totalKm.toFixed(1)} km total / ${totalSteps.toLocaleString()} steps`
    },
    {
      title: 'Daily Hydration (3.5L)',
      count: waterMetCount,
      percent: Math.round((waterMetCount / totalDays) * 100),
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/30 text-cyan-400',
      barColor: 'bg-cyan-400',
      icon: Droplets,
      sub: `${totalWaterLiters.toFixed(1)} Liters consumed`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">100-Day Performance &amp; Analytics</h2>
              <p className="text-xs text-slate-400">Aggregated statistics across your 100-day fitness journey</p>
            </div>
          </div>

          <button
            onClick={onClose}
            type="button"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 custom-scrollbar">
          
          {/* Top Big Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                <Flame className="w-3.5 h-3.5 text-orange-400" /> Active Streak
              </span>
              <div className="text-2xl font-bold text-white font-mono">{currentStreak} <span className="text-xs text-slate-400 font-normal">days</span></div>
              <span className="text-[11px] text-emerald-400 font-medium">≥1 habit/day</span>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                <Trophy className="w-3.5 h-3.5 text-amber-400" /> 100% Days
              </span>
              <div className="text-2xl font-bold text-amber-400 font-mono">{perfectDays} <span className="text-xs text-slate-400 font-normal">/ 100</span></div>
              <span className="text-[11px] text-slate-400">Both habits checked</span>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <span className="text-xs text-slate-400 flex items-center gap-1 mb-1">
                <Footprints className="w-3.5 h-3.5 text-blue-400" /> Total Distance
              </span>
              <div className="text-2xl font-bold text-blue-400 font-mono">{totalKm.toFixed(1)} <span className="text-xs text-slate-400 font-normal">km</span></div>
              <span className="text-[11px] text-slate-400">{Math.round(totalDurationMin / 60)}h {totalDurationMin % 60}m logged</span>
            </div>
          </div>

          {/* Habit Progress Bars */}
          <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-sm font-semibold text-white">Habit Adherence Breakdown (100 Days)</h3>
            <div className="space-y-3.5">
              {habitCards.map((habit) => {
                const Icon = habit.icon;
                return (
                  <div key={habit.title} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded-md border ${habit.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <span className="font-medium text-slate-200">{habit.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px] hidden sm:inline">{habit.sub}</span>
                        <span className="font-mono font-bold text-white">{habit.count} / 100 <span className="text-slate-400 font-normal">({habit.percent}%)</span></span>
                      </div>
                    </div>

                    <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full ${habit.barColor} rounded-full transition-all duration-500`}
                        style={{ width: `${habit.percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Motivational Footer */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-teal-500/10 border border-emerald-500/20 text-xs text-slate-300">
            <p className="leading-relaxed">
              <span className="font-semibold text-emerald-400">&ldquo;We are what we repeatedly do.&rdquo;</span> Consistent morning movement and 3.5L hydration will compound into physical and mental sharpness over 100 days.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            type="button"
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs transition-colors"
          >
            Close Analytics
          </button>
        </div>
      </div>
    </div>
  );
}
