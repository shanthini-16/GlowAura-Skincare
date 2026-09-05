import React from 'react';
import { Droplets, Sparkles, Plus, Minus } from 'lucide-react';
import { useScan } from '../context/ScanContext';

const WaterReminderWidget = () => {
  const { waterGlasses, waterGoal, incrementWater, decrementWater } = useScan();
  const percentage = Math.min(100, Math.round((waterGlasses / waterGoal) * 100));

  return (
    <div className="p-5 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/40 shadow-sm space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
          <Droplets size={18} />
          <h4 className="text-sm font-bold">Hydration Tracker</h4>
        </div>
        <span className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-full">
          Goal: {waterGoal} Glasses (2.5L)
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-2xl font-black text-gray-900 dark:text-white">
            {waterGlasses} <span className="text-xs text-gray-500 font-normal">/ {waterGoal} glasses</span>
          </span>
          <p className="text-[10px] text-gray-500">Essential for dermal water-retention & flushing toxins.</p>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={decrementWater}
            className="w-7 h-7 rounded-full bg-white dark:bg-gray-800 border border-blue-200 text-blue-600 font-bold flex items-center justify-center hover:bg-blue-50"
          >
            -
          </button>
          <button
            onClick={incrementWater}
            className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center hover:bg-blue-700 shadow-sm"
          >
            +
          </button>
        </div>
      </div>

      <div className="w-full bg-blue-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
        <div 
          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default WaterReminderWidget;
