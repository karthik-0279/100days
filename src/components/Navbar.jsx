import React from 'react';
import { Flame, Trophy, Grid, BarChart3, Download, Upload, RotateCcw, Sparkles } from 'lucide-react';

export default function Navbar({
  currentStreak,
  totalCompletedDays,
  totalDays,
  onOpenGrid,
  onOpenStats,
  onExportData,
  onImportData,
  onResetData
}) {
  const percentComplete = Math.round((totalCompletedDays / totalDays) * 100);

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-slate-950/80 border-b border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand / Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
            <Flame className="w-5 h-5 text-white fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-white">
                100 DAYS
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
                Fitness Tracker
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Morning Walk &amp; Running • 3.5L Daily Hydration
            </p>
          </div>
        </div>

        {/* Badges & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Streak Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400 animate-pulse" />
            <span>{currentStreak} {currentStreak === 1 ? 'Day' : 'Days'} Streak</span>
          </div>

          {/* 100-Day Progress Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-emerald-400" />
            <span>{totalCompletedDays}/{totalDays} Days ({percentComplete}%)</span>
          </div>

          <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

          {/* Grid Overview Button */}
          <button
            onClick={onOpenGrid}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
            title="100-Day Visual Grid Overview"
          >
            <Grid className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">100-Day Grid</span>
          </button>

          {/* Stats Button */}
          <button
            onClick={onOpenStats}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition-all"
            title="Analytics &amp; Habit Stats"
          >
            <BarChart3 className="w-3.5 h-3.5 text-teal-400" />
            <span className="hidden sm:inline">Stats</span>
          </button>

          {/* Export / Backup */}
          <button
            onClick={onExportData}
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-all"
            title="Export JSON Backup"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Import Backup */}
          <label
            className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 cursor-pointer transition-all"
            title="Import JSON Backup"
          >
            <Upload className="w-3.5 h-3.5" />
            <input
              type="file"
              accept=".json"
              onChange={onImportData}
              className="hidden"
            />
          </label>

          {/* Reset */}
          <button
            onClick={onResetData}
            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 border border-transparent transition-all"
            title="Reset All Tracker Data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

        </div>

      </div>
    </header>
  );
}

