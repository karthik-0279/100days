import React from 'react';
import { Sparkles, Scale, Zap, Moon, Sun, MessageSquare } from 'lucide-react';

export default function DayNotes({ dayData, onUpdate }) {
  const weightKg = dayData?.weightKg || '';
  const energyLevel = dayData?.energyLevel || 'High';
  const reflection = dayData?.notes || '';

  const handleWeightChange = (e) => {
    onUpdate({
      ...dayData,
      weightKg: e.target.value
    });
  };

  const handleEnergySelect = (level) => {
    onUpdate({
      ...dayData,
      energyLevel: level
    });
  };

  const handleReflectionChange = (e) => {
    onUpdate({
      ...dayData,
      notes: e.target.value
    });
  };

  const energyOptions = [
    { label: 'High', icon: Zap, color: 'text-amber-400 border-amber-500/40 bg-amber-500/10' },
    { label: 'Moderate', icon: Sun, color: 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10' },
    { label: 'Low', icon: Moon, color: 'text-blue-400 border-blue-500/40 bg-blue-500/10' }
  ];

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-white text-base">Day Reflection & Body Metrics</h3>
              <p className="text-xs text-slate-400">Track weight checkpoints & daily energy mindset</p>
            </div>
          </div>
        </div>

        {/* Quick Weight & Energy Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Weight Input */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-2">
              <Scale className="w-3.5 h-3.5 text-purple-400" />
              Morning Weight (kg)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.1"
                placeholder="e.g. 74.2"
                value={weightKg}
                onChange={handleWeightChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
              />
              <span className="text-xs text-slate-400 font-mono">kg</span>
            </div>
          </div>

          {/* Energy Level */}
          <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-2">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              Energy & Mood
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {energyOptions.map(({ label, icon: Icon, color }) => {
                const isSelected = energyLevel === label;
                return (
                  <button
                    key={label}
                    type="button"
                    onClick={() => handleEnergySelect(label)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border flex items-center justify-center gap-1 transition-all ${
                      isSelected
                        ? color
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-3 h-3" />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reflection Note */}
        <div>
          <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mb-2">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
            Notes & Micro-Victories
          </label>
          <textarea
            rows="3"
            placeholder="How did today feel? How was digestion with curd & oats? Any dessert cravings resisted?"
            value={reflection}
            onChange={handleReflectionChange}
            className="w-full bg-slate-950/60 border border-slate-800/80 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500/60 transition-colors resize-none"
          />
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500 font-mono">
        <span>100-Day Consistency Engine</span>
        <span>Every single habit compounds</span>
      </div>
    </div>
  );
}
