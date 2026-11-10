import React from 'react';
import { Droplets, Plus, Minus, CheckCircle, RotateCcw, Sparkles } from 'lucide-react';
import { GLASS_SIZE_ML } from '../data/defaultData';

export default function WaterTracker({ waterData, onChange }) {
  const amountMl = waterData?.amountMl || 0;
  const targetMl = waterData?.targetMl || 3500;
  const glasses = waterData?.glasses || Math.round(amountMl / GLASS_SIZE_ML);
  const totalGlasses = Math.round(targetMl / GLASS_SIZE_ML); // 14
  const percentage = Math.min(100, Math.round((amountMl / targetMl) * 100));
  const isGoalReached = amountMl >= targetMl;

  const handleAddGlass = () => {
    const newGlasses = glasses + 1;
    const newAmount = newGlasses * GLASS_SIZE_ML;
    onChange({
      ...waterData,
      glasses: newGlasses,
      amountMl: newAmount,
      completed: newAmount >= targetMl
    });
  };

  const handleRemoveGlass = () => {
    if (glasses <= 0) return;
    const newGlasses = glasses - 1;
    const newAmount = Math.max(0, newGlasses * GLASS_SIZE_ML);
    onChange({
      ...waterData,
      glasses: newGlasses,
      amountMl: newAmount,
      completed: newAmount >= targetMl
    });
  };

  const handleSetGlassCount = (targetCount) => {
    const newAmount = targetCount * GLASS_SIZE_ML;
    onChange({
      ...waterData,
      glasses: targetCount,
      amountMl: newAmount,
      completed: newAmount >= targetMl
    });
  };

  const handleFullTarget = () => {
    onChange({
      ...waterData,
      glasses: totalGlasses,
      amountMl: targetMl,
      completed: true
    });
  };

  const handleReset = () => {
    onChange({
      ...waterData,
      glasses: 0,
      amountMl: 0,
      completed: false
    });
  };

  return (
    <div className={`rounded-2xl border p-5 transition-all relative overflow-hidden ${
      isGoalReached
        ? 'bg-gradient-to-b from-cyan-950/30 to-slate-900/90 border-cyan-500/40 shadow-lg shadow-cyan-950/40'
        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
    }`}>
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${
            isGoalReached
              ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
              : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
          }`}>
            <Droplets className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">Daily Water Intake</h3>
              {isGoalReached && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  <Sparkles className="w-3 h-3" /> Target Reached
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              Target: <span className="text-cyan-300 font-semibold">{(targetMl / 1000).toFixed(1)}L</span> ({totalGlasses} glasses of 250ml)
            </p>
          </div>
        </div>

        {/* Liters Progress */}
        <div className="text-right">
          <span className="text-xl font-extrabold text-white">{(amountMl / 1000).toFixed(2)}</span>
          <span className="text-xs text-slate-400 font-mono"> / {(targetMl / 1000).toFixed(1)}L</span>
          <div className="text-[11px] font-bold text-cyan-400">{percentage}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-4 p-0.5 border border-slate-700/60">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-teal-400 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* 14 Interactive Glasses Matrix */}
      <div className="mb-4">
        <div className="text-[11px] font-medium text-slate-400 mb-2 flex items-center justify-between">
          <span>Tap a glass to set intake directly:</span>
          <span className="text-cyan-300 font-semibold">{glasses} of {totalGlasses} Glasses</span>
        </div>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 sm:gap-2">
          {Array.from({ length: totalGlasses }, (_, idx) => {
            const glassNum = idx + 1;
            const isFilled = glassNum <= glasses;
            return (
              <button
                key={glassNum}
                type="button"
                onClick={() => handleSetGlassCount(isFilled && glassNum === glasses ? glassNum - 1 : glassNum)}
                className={`h-11 rounded-lg flex flex-col items-center justify-center gap-0.5 text-[10px] font-mono transition-all border ${
                  isFilled
                    ? 'bg-gradient-to-t from-cyan-600 to-sky-400 border-cyan-300 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-slate-800/80 hover:bg-slate-700/80 border-slate-700/70 text-slate-400'
                }`}
                title={`Glass ${glassNum} (${glassNum * GLASS_SIZE_ML}ml)`}
              >
                <Droplets className={`w-3.5 h-3.5 ${isFilled ? 'fill-slate-950 text-slate-950' : 'text-slate-500'}`} />
                <span>{glassNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Increment Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleRemoveGlass}
            disabled={glasses <= 0}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-xs font-semibold text-slate-300 transition-all border border-slate-700"
          >
            <Minus className="w-3.5 h-3.5" />
            <span>-250ml</span>
          </button>

          <button
            type="button"
            onClick={handleAddGlass}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white transition-all shadow-sm shadow-cyan-600/30"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+250ml (1 Glass)</span>
          </button>

          <button
            type="button"
            onClick={() => handleSetGlassCount(glasses + 2)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-cyan-300 border border-slate-700 transition-all"
          >
            <span>+500ml Bottle</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleFullTarget}
            className="px-2.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-all"
          >
            Goal Complete (3.5L)
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all"
            title="Reset Water to 0ml"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Health Tip */}
      <div className="mt-3 text-[11px] text-cyan-400/80 bg-cyan-950/20 border border-cyan-900/30 rounded-lg px-2.5 py-1.5 flex items-center justify-between">
        <span>💡 Tip: Drink 2 glasses right after waking up &amp; 1 glass before running.</span>
        <span className="font-mono text-slate-400">{glasses >= totalGlasses ? 'Target Complete! 🌟' : `${totalGlasses - glasses} glasses left`}</span>
      </div>
    </div>
  );
}

