import React from 'react';
import { Footprints, Check, Flame, Clock, MapPin, Sparkles, Activity } from 'lucide-react';

export default function WalkRunTracker({ runData, onChange }) {
  const isCompleted = runData?.completed || false;
  const distanceKm = Number(runData?.distanceKm) || 0;
  const durationMin = Number(runData?.durationMin) || 0;
  const steps = Number(runData?.steps) || 0;
  const workoutType = runData?.type || 'Brisk Walk & Jog';

  // Approximate calorie estimation (~65 kcal per km)
  const caloriesBurned = Math.round(distanceKm * 65);

  const workoutTypes = [
    { label: 'Brisk Walk', icon: '🚶‍♂️', desc: 'Zone 2 cardio & recovery' },
    { label: 'Morning Run', icon: '🏃‍♂️', desc: 'High cardio & stamina' },
    { label: 'Interval Walk & Run', icon: '⚡', desc: 'Fat burning intervals' }
  ];

  const handleToggleComplete = () => {
    onChange({
      ...runData,
      completed: !isCompleted,
      // Default to sensible values if checking complete from 0
      distanceKm: !isCompleted && distanceKm === 0 ? 4.0 : distanceKm,
      durationMin: !isCompleted && durationMin === 0 ? 35 : durationMin,
      steps: !isCompleted && steps === 0 ? 5500 : steps
    });
  };

  const handleUpdate = (field, value) => {
    onChange({
      ...runData,
      [field]: value
    });
  };

  return (
    <div className={`rounded-2xl border p-5 transition-all relative overflow-hidden ${
      isCompleted
        ? 'bg-gradient-to-b from-emerald-950/30 to-slate-900/90 border-emerald-500/40 shadow-lg shadow-emerald-950/40'
        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
    }`}>
      {/* Top Header & Completion Checkbox */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isCompleted
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
          }`}>
            <Footprints className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">Morning Walk &amp; Running</h3>
              {isCompleted && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  <Sparkles className="w-3 h-3" /> Done
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Daily aerobic endurance &amp; fat burn routine
            </p>
          </div>
        </div>

        {/* Big Checkbox Toggle Button */}
        <button
          type="button"
          onClick={handleToggleComplete}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isCompleted
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
            isCompleted ? 'bg-slate-950 border-slate-950 text-emerald-400' : 'border-slate-500'
          }`}>
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
          <span>{isCompleted ? 'Completed' : 'Mark Done'}</span>
        </button>
      </div>

      {/* Workout Type Selector */}
      <div className="mb-4">
        <label className="text-[11px] font-medium text-slate-400 mb-1.5 block">
          Workout Mode:
        </label>
        <div className="grid grid-cols-3 gap-2">
          {workoutTypes.map((type) => {
            const isSelected = workoutType === type.label;
            return (
              <button
                key={type.label}
                type="button"
                onClick={() => handleUpdate('type', type.label)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-sm'
                    : 'bg-slate-800/70 hover:bg-slate-800 border-slate-700/60 text-slate-400'
                }`}
              >
                <div className="text-base mb-0.5">{type.icon}</div>
                <div className="font-semibold text-xs text-white">{type.label}</div>
                <div className="text-[10px] text-slate-400">{type.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Numerical Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        
        {/* Distance in KM */}
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-emerald-400" /> Distance
            </span>
            <span className="text-emerald-400 font-bold">{distanceKm.toFixed(1)} km</span>
          </div>

          <div className="flex items-center justify-between gap-2 mt-2">
            <button
              type="button"
              onClick={() => handleUpdate('distanceKm', Math.max(0, distanceKm - 0.5))}
              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white font-mono"
            >
              -0.5
            </button>

            <input
              type="number"
              step="0.1"
              min="0"
              value={distanceKm || ''}
              onChange={(e) => handleUpdate('distanceKm', parseFloat(e.target.value) || 0)}
              className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-center text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
              placeholder="0.0"
            />

            <button
              type="button"
              onClick={() => handleUpdate('distanceKm', distanceKm + 0.5)}
              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white font-mono"
            >
              +0.5
            </button>
          </div>
        </div>

        {/* Duration in Minutes */}
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-teal-400" /> Duration
            </span>
            <span className="text-teal-400 font-bold">{durationMin} min</span>
          </div>

          <div className="flex items-center justify-between gap-2 mt-2">
            <button
              type="button"
              onClick={() => handleUpdate('durationMin', Math.max(0, durationMin - 5))}
              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white font-mono"
            >
              -5m
            </button>

            <input
              type="number"
              step="5"
              min="0"
              value={durationMin || ''}
              onChange={(e) => handleUpdate('durationMin', parseInt(e.target.value, 10) || 0)}
              className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-center text-xs font-bold text-white focus:outline-none focus:border-teal-500"
              placeholder="0"
            />

            <button
              type="button"
              onClick={() => handleUpdate('durationMin', durationMin + 5)}
              className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white font-mono"
            >
              +5m
            </button>
          </div>
        </div>

        {/* Steps Count */}
        <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
            <span className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-amber-400" /> Steps Count
            </span>
            <span className="text-amber-400 font-bold">{steps ? steps.toLocaleString() : '0'}</span>
          </div>

          <div className="flex items-center justify-between gap-1.5 mt-2">
            {[4000, 6000, 10000].map((stepVal) => (
              <button
                key={stepVal}
                type="button"
                onClick={() => handleUpdate('steps', stepVal)}
                className={`flex-1 py-1 rounded text-[10px] font-mono font-medium transition-all ${
                  steps === stepVal
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                }`}
              >
                {stepVal >= 1000 ? `${stepVal / 1000}k` : stepVal}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Burned Calorie & Benefit Footer */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-amber-400">
          <Flame className="w-3.5 h-3.5 fill-amber-400" />
          <span className="font-semibold">Est. Burn: ~{caloriesBurned} kcal</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Pace: {distanceKm > 0 && durationMin > 0 ? (durationMin / distanceKm).toFixed(1) : '0'} min/km</span>
        </div>

        <input
          type="text"
          value={runData?.notes || ''}
          onChange={(e) => handleUpdate('notes', e.target.value)}
          placeholder="Workout route or feeling (e.g. Park loop, fresh morning air)"
          className="w-full sm:w-64 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  );
}

