import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Calendar,
  Flame,
  Award,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  LayoutGrid,
  CheckSquare,
  Sparkles,
  Download,
  Upload,
  AlertCircle
} from 'lucide-react';

const STORAGE_KEY = 'karthik_100_days_data';
const CURRENT_DAY_KEY = 'karthik_100_days_current_day';
const TOTAL_DAYS = 100;

const DEFAULT_HABITS = [
  'Healthy Curd Salad',
  'Oats Breakfast',
  'Reduced-Sugar Diet',
  'Morning Walk & Running',
  'Daily Water Intake Goal'
];

// Helper to generate 100 days structure
const generateInitial100Days = () => {
  const days = [];
  for (let i = 1; i <= TOTAL_DAYS; i++) {
    days.push({
      day: i,
      tasks: DEFAULT_HABITS.map((title, index) => ({
        id: `day-${i}-task-${index + 1}`,
        title,
        completed: i === 1 && index < 4 // Pre-complete 4 tasks on Day 1 for immediate success demo
      }))
    });
  }
  return days;
};

// Check if day has >= 4 completed tasks (Success criteria)
const getDayStatus = (day) => {
  if (!day || !day.tasks || day.tasks.length === 0) return 'pending';
  const completedCount = day.tasks.filter((t) => t.completed).length;
  if (completedCount >= 4) return 'success';
  if (completedCount > 0) return 'in-progress';
  return 'pending';
};

export default function App() {
  // 1. State Management & LocalStorage Sync
  const [days, setDays] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === TOTAL_DAYS) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved 100 days data:', e);
    }
    return generateInitial100Days();
  });

  const [currentDay, setCurrentDay] = useState(() => {
    try {
      const saved = localStorage.getItem(CURRENT_DAY_KEY);
      if (saved) {
        const num = parseInt(saved, 10);
        if (num >= 1 && num <= TOTAL_DAYS) return num;
      }
    } catch (e) {}
    return 1;
  });

  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'grid'
  const [newTaskInput, setNewTaskInput] = useState('');

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
    } catch (e) {
      console.error('Failed to sync with localStorage:', e);
    }
  }, [days]);

  useEffect(() => {
    try {
      localStorage.setItem(CURRENT_DAY_KEY, currentDay.toString());
    } catch (e) {}
  }, [currentDay]);

  const activeDayIndex = currentDay - 1;
  const activeDay = days[activeDayIndex] || days[0];
  const activeDayCompleted = activeDay.tasks.filter((t) => t.completed).length;
  const isDaySuccess = activeDayCompleted >= 4;

  // Header stats: Total Success Days out of 100
  const totalSuccessDays = days.filter((d) => getDayStatus(d) === 'success').length;
  const successPercentage = Math.round((totalSuccessDays / TOTAL_DAYS) * 100);

  // Active streak of consecutive success days
  let currentStreak = 0;
  for (let i = currentDay - 1; i >= 0; i--) {
    if (getDayStatus(days[i]) === 'success') {
      currentStreak++;
    } else {
      break;
    }
  }

  // Trigger celebration confetti
  const triggerCelebration = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#10b981', '#06b6d4', '#f59e0b', '#3b82f6']
    });
  };

  // Toggle task completed or not
  const handleToggleTask = (taskId) => {
    setDays((prevDays) => {
      const updated = [...prevDays];
      const targetDay = { ...updated[activeDayIndex] };
      const prevStatus = getDayStatus(targetDay);

      targetDay.tasks = targetDay.tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      );

      const newStatus = getDayStatus(targetDay);
      if (prevStatus !== 'success' && newStatus === 'success') {
        triggerCelebration();
      }

      updated[activeDayIndex] = targetDay;
      return updated;
    });
  };

  // Add custom daily task
  const handleAddTask = (e) => {
    e.preventDefault();
    const trimmed = newTaskInput.trim();
    if (!trimmed) return;

    setDays((prevDays) => {
      const updated = [...prevDays];
      const targetDay = { ...updated[activeDayIndex] };
      const newTask = {
        id: `day-${currentDay}-task-${Date.now()}`,
        title: trimmed,
        completed: false
      };
      targetDay.tasks = [...targetDay.tasks, newTask];
      updated[activeDayIndex] = targetDay;
      return updated;
    });

    setNewTaskInput('');
  };

  // Delete task
  const handleDeleteTask = (taskId) => {
    setDays((prevDays) => {
      const updated = [...prevDays];
      const targetDay = { ...updated[activeDayIndex] };
      targetDay.tasks = targetDay.tasks.filter((t) => t.id !== taskId);
      updated[activeDayIndex] = targetDay;
      return updated;
    });
  };

  // Reset current day tasks
  const handleResetDay = () => {
    if (window.confirm(`Reset all tasks for Day ${currentDay}?`)) {
      setDays((prevDays) => {
        const updated = [...prevDays];
        const targetDay = { ...updated[activeDayIndex] };
        targetDay.tasks = DEFAULT_HABITS.map((title, index) => ({
          id: `day-${currentDay}-task-${index + 1}`,
          title,
          completed: false
        }));
        updated[activeDayIndex] = targetDay;
        return updated;
      });
    }
  };

  // Export JSON backup
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(days, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `100days_backup_day${currentDay}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import JSON backup
  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (Array.isArray(parsed) && parsed.length === TOTAL_DAYS) {
          setDays(parsed);
          alert('100-Day data imported successfully!');
        } else {
          alert('Invalid file format. Must be an array of 100 days.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      
      {/* 1. Header with Stats & Views */}
      <header className="sticky top-0 z-30 w-full backdrop-blur-md bg-slate-950/90 border-b border-slate-800/80">
        <div className="max-w-4xl mx-auto px-4 py-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Brand & Success Day Counter */}
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-cyan-500 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20">
                <Flame className="w-5 h-5 text-slate-950 fill-slate-950" />
              </div>
              <div>
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white flex items-center gap-2">
                  100 DAYS <span className="text-emerald-400">FITNESS</span>
                </h1>
                <p className="text-[11px] text-slate-400">
                  ≥ 4 completed tasks = Daily Success (Green)
                </p>
              </div>
            </div>

            {/* Streak & Success Badges */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold shadow-sm">
                <Award className="w-3.5 h-3.5 text-emerald-400" />
                <span>{totalSuccessDays} / {TOTAL_DAYS} Success</span>
              </div>
              {currentStreak > 0 && (
                <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>{currentStreak}d Streak</span>
                </div>
              )}
            </div>
          </div>

          {/* Tab Switcher: Tasks vs 100-Day Grid */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto justify-center">
            <button
              onClick={() => setActiveTab('tasks')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tasks'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Daily Tasks</span>
            </button>

            <button
              onClick={() => setActiveTab('grid')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'grid'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>100-Day Map</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        
        {/* VIEW 1: DAILY TASKS TRACKER */}
        {activeTab === 'tasks' ? (
          <div className="space-y-6 animate-fade-in">
            
            {/* Day Selector & Navigation Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                
                {/* Previous / Next Navigation */}
                <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                  <button
                    onClick={() => setCurrentDay((c) => Math.max(1, c - 1))}
                    disabled={currentDay <= 1}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 border border-slate-700/60 transition-colors"
                    title="Previous Day"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <h2 className="text-2xl font-black text-white tracking-tight">
                        Day {currentDay}
                      </h2>
                      <span className="text-slate-500 text-sm font-normal">/ {TOTAL_DAYS}</span>

                      {/* Day Status Pill */}
                      {isDaySuccess ? (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/40 flex items-center gap-1 animate-pulse">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          SUCCESS
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700/60">
                          {activeDayCompleted}/4 Tasks Needed
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {isDaySuccess
                        ? `🎉 Success achieved! ${activeDayCompleted} tasks completed.`
                        : `Complete at least 4 tasks to turn Day ${currentDay} Green.`}
                    </p>
                  </div>

                  <button
                    onClick={() => setCurrentDay((c) => Math.min(TOTAL_DAYS, c + 1))}
                    disabled={currentDay >= TOTAL_DAYS}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed text-slate-200 border border-slate-700/60 transition-colors"
                    title="Next Day"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Quick Jump Buttons & Dropdown */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <span className="text-xs text-slate-400 font-medium">Jump:</span>
                  {[1, 25, 50, 75, 100].map((d) => (
                    <button
                      key={d}
                      onClick={() => setCurrentDay(d)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        currentDay === d
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60'
                      }`}
                    >
                      D{d}
                    </button>
                  ))}

                  <select
                    value={currentDay}
                    onChange={(e) => setCurrentDay(Number(e.target.value))}
                    aria-label="Select day"
                    className="bg-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none focus:border-emerald-500 cursor-pointer"
                  >
                    {Array.from({ length: TOTAL_DAYS }, (_, i) => i + 1).map((d) => (
                      <option key={d} value={d}>
                        Day {d}
                      </option>
                    ))}
                  </select>
                </div>

              </div>

              {/* Progress bar to Day 100 */}
              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                  <span>Day {currentDay} of {TOTAL_DAYS}</span>
                  <span className="text-emerald-400 font-semibold">{successPercentage}% Overall Success Rate</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-300"
                    style={{ width: `${(currentDay / TOTAL_DAYS) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Daily Tasks List */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    Daily Task Checklist
                    <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-normal">
                      {activeDayCompleted} / {activeDay.tasks.length} Completed
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click each button below to mark the task completed or not
                  </p>
                </div>

                <button
                  onClick={handleResetDay}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 transition-colors p-1"
                  title="Reset tasks for this day"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Reset Day</span>
                </button>
              </div>

              {/* Task Items */}
              <div className="space-y-2.5">
                {activeDay.tasks.map((task) => {
                  return (
                    <div
                      key={task.id}
                      className={`flex items-center justify-between gap-3 p-3.5 rounded-xl border transition-all duration-150 ${
                        task.completed
                          ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {/* Interactive Button: Task completed or not */}
                      <button
                        type="button"
                        onClick={() => handleToggleTask(task.id)}
                        className="flex-1 flex items-center gap-3 text-left group"
                      >
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border transition-all ${
                            task.completed
                              ? 'bg-emerald-500 border-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                              : 'border-slate-600 bg-slate-900 group-hover:border-slate-400'
                          }`}
                        >
                          {task.completed && (
                            <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                          )}
                        </div>

                        <span
                          className={`text-sm font-medium transition-all ${
                            task.completed
                              ? 'text-slate-200 line-through decoration-slate-500/60 text-slate-400'
                              : 'text-white'
                          }`}
                        >
                          {task.title}
                        </span>
                      </button>

                      {/* Status Tag & Delete Button */}
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleTask(task.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            task.completed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                          }`}
                        >
                          {task.completed ? 'Completed' : 'Mark Done'}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Task Form */}
              <form onSubmit={handleAddTask} className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add custom task for Day ..."
                  value={newTaskInput}
                  onChange={(e) => setNewTaskInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!newTaskInput.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs transition-colors shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </form>
            </div>

          </div>
        ) : (
          /* VIEW 2: 100-DAY GITHUB-STYLE CONTRIBUTION GRID */
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-5 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <LayoutGrid className="w-5 h-5 text-cyan-400" />
                  100-Day Contribution Grid
                </h3>
                <p className="text-xs text-slate-400">
                  Green = Success (≥ 4 tasks completed). Click any day to view or edit tasks.
                </p>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-emerald-500 inline-block border border-emerald-400"></span>
                  <span className="text-slate-300">Success (≥4)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-cyan-600/40 inline-block border border-cyan-500/50"></span>
                  <span className="text-slate-300">In-Progress</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded bg-slate-900 inline-block border border-slate-800"></span>
                  <span className="text-slate-400">Pending</span>
                </div>
              </div>
            </div>

            {/* 100 Squares Matrix */}
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 sm:gap-2.5">
              {days.map((day) => {
                const status = getDayStatus(day);
                const completedCount = day.tasks.filter((t) => t.completed).length;
                const isCurrent = day.day === currentDay;

                let colorClasses = '';
                if (status === 'success') {
                  colorClasses = 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold hover:bg-emerald-400 shadow-md shadow-emerald-500/20';
                } else if (status === 'in-progress') {
                  colorClasses = 'bg-cyan-600/30 border-cyan-500/50 text-cyan-300 hover:bg-cyan-600/40';
                } else {
                  colorClasses = 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-300';
                }

                if (isCurrent) {
                  colorClasses += ' ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-105 z-10';
                }

                return (
                  <button
                    key={day.day}
                    type="button"
                    onClick={() => {
                      setCurrentDay(day.day);
                      setActiveTab('tasks');
                    }}
                    title={`Day ${day.day}: ${completedCount} completed (${status.toUpperCase()})`}
                    className={`relative aspect-square rounded-xl border flex flex-col items-center justify-center p-1 transition-all duration-150 ${colorClasses}`}
                  >
                    <span className="text-xs sm:text-sm">{day.day}</span>
                    <span className="text-[10px] opacity-80">
                      {completedCount}/{day.tasks.length}
                    </span>
                    {status === 'success' && (
                      <span className="absolute -top-1 -right-1 text-slate-950 text-xs font-black">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Total Success: <strong className="text-emerald-400 font-mono">{totalSuccessDays} Days</strong></span>
              <span>Clicking any square opens that day's task checklist</span>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-5 px-4 mt-8">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>100-Day Fitness Tracker (Healthy Curd Salad · Oats Breakfast · Low Sugar · Walk &amp; Run · Water Goal)</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={handleExportData}
              className="flex items-center gap-1 hover:text-slate-300 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Backup</span>
            </button>

            <label className="flex items-center gap-1 hover:text-slate-300 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </footer>

    </div>
  );
}
