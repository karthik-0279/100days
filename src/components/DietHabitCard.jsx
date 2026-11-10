import React from 'react';
import { Check, Sparkles, Plus, Minus, Tag, ShieldCheck, HeartPulse } from 'lucide-react';

export default function DietHabitCard({
  title,
  subtitle,
  icon,
  badgeText,
  colorScheme = 'emerald', // 'emerald', 'amber', 'rose'
  isCompleted,
  onToggleComplete,
  options = [],
  selectedOption,
  onSelectOption,
  notes,
  onChangeNotes,
  toppings = [],
  selectedToppings = [],
  onToggleTopping,
  cravingsResisted,
  onUpdateCravings,
  portion,
  onChangePortion,
  tips
}) {
  const colorMap = {
    emerald: {
      bgActive: 'bg-gradient-to-b from-emerald-950/30 to-slate-900/90 border-emerald-500/40 shadow-emerald-950/40',
      iconBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      btnActive: 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30',
      pillActive: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold',
    },
    amber: {
      bgActive: 'bg-gradient-to-b from-amber-950/30 to-slate-900/90 border-amber-500/40 shadow-amber-950/40',
      iconBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      btnActive: 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30',
      pillActive: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-semibold',
    },
    rose: {
      bgActive: 'bg-gradient-to-b from-rose-950/30 to-slate-900/90 border-rose-500/40 shadow-rose-950/40',
      iconBg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
      btnActive: 'bg-rose-500 hover:bg-rose-400 text-slate-950 shadow-rose-500/30',
      pillActive: 'bg-rose-500/20 text-rose-300 border-rose-500/40 font-semibold',
    }
  };

  const scheme = colorMap[colorScheme] || colorMap.emerald;

  return (
    <div className={`rounded-2xl border p-5 transition-all relative overflow-hidden ${
      isCompleted
        ? `${scheme.bgActive} shadow-lg`
        : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
    }`}>
      {/* Top Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${scheme.iconBg}`}>
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">{title}</h3>
              {isCompleted && (
                <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${scheme.badge}`}>
                  <Sparkles className="w-3 h-3" /> Completed
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">{subtitle}</p>
          </div>
        </div>

        {/* Checkbox Button */}
        <button
          type="button"
          onClick={onToggleComplete}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
            isCompleted
              ? scheme.btnActive
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
          }`}
        >
          <div className={`w-4 h-4 rounded-md flex items-center justify-center border ${
            isCompleted ? 'bg-slate-950 border-slate-950 text-emerald-400' : 'border-slate-500'
          }`}>
            {isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </div>
          <span>{isCompleted ? 'Done' : 'Mark Done'}</span>
        </button>
      </div>

      {/* Preset Options Pills (e.g. Recipe Types or Strictness Levels) */}
      {options && options.length > 0 && (
        <div className="mb-3">
          <label className="text-[11px] font-medium text-slate-400 mb-1.5 block">
            {badgeText || 'Select Style / Variation:'}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {options.map((opt) => {
              const isSelected = selectedOption === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onSelectOption && onSelectOption(opt)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-all border ${
                    isSelected
                      ? scheme.pillActive
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700/60'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Optional Toppings Checklist for Oats */}
      {toppings && toppings.length > 0 && (
        <div className="mb-3">
          <label className="text-[11px] font-medium text-slate-400 mb-1.5 block">
            Healthy Superfood Toppings Added:
          </label>
          <div className="flex flex-wrap gap-1.5">
            {toppings.map((top) => {
              const isChecked = selectedToppings.includes(top);
              return (
                <button
                  key={top}
                  type="button"
                  onClick={() => onToggleTopping && onToggleTopping(top)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-mono transition-all border flex items-center gap-1 ${
                    isChecked
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
                      : 'bg-slate-800/80 hover:bg-slate-700 text-slate-400 border-slate-700/60'
                  }`}
                >
                  <span>{isChecked ? '✓' : '+'}</span>
                  <span>{top}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Portion Size for Curd Salad */}
      {portion !== undefined && onChangePortion && (
        <div className="mb-3 flex items-center gap-2">
          <label className="text-[11px] font-medium text-slate-400 shrink-0">
            Portion Size:
          </label>
          <input
            type="text"
            value={portion}
            onChange={(e) => onChangePortion(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            placeholder="e.g. 1 Medium Bowl (~250g)"
          />
        </div>
      )}

      {/* Cravings Resisted Counter for Reduced-Sugar Diet */}
      {cravingsResisted !== undefined && onUpdateCravings && (
        <div className="mb-3 p-2.5 rounded-xl bg-slate-800/70 border border-slate-700/60 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-white font-semibold">Temptations &amp; Sweets Resisted:</span>
            <p className="text-[11px] text-slate-400">Times you chose health over sugary cravings</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onUpdateCravings(Math.max(0, cravingsResisted - 1))}
              className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-8 text-center font-bold text-amber-400 text-sm font-mono">{cravingsResisted}</span>
            <button
              type="button"
              onClick={() => onUpdateCravings(cravingsResisted + 1)}
              className="p-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Notes Input */}
      <div className="pt-2 border-t border-slate-800/80">
        <input
          type="text"
          value={notes || ''}
          onChange={(e) => onChangeNotes && onChangeNotes(e.target.value)}
          placeholder="Notes or meal details (e.g. eaten with roasted cumin & pink salt)"
          className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
        />
      </div>

      {/* Health Tip */}
      {tips && (
        <div className="mt-2.5 text-[11px] text-slate-400 bg-slate-800/40 rounded-lg px-2.5 py-1 border border-slate-800 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{tips}</span>
        </div>
      )}
    </div>
  );
}

