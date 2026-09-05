import React, { useState, useEffect } from 'react';
import { Utensils, Sparkles } from 'lucide-react';
import DietPlanView from '../components/DietPlanView';
import { wellnessAPI } from '../services/api';
import { useScan } from '../context/ScanContext';

const DietPage = () => {
  const { currentScan } = useScan();
  const [dietPlan, setDietPlan] = useState(currentScan?.diet_plan || null);
  const [selectedType, setSelectedType] = useState(currentScan?.analysis?.skin_type || 'Combination');

  useEffect(() => {
    wellnessAPI.getDietPlan({
      skin_type: selectedType,
      concerns: currentScan?.analysis?.concerns || ['Hydration', 'Glow'],
      acne_severity: currentScan?.analysis?.acne_severity || 'Mild'
    })
      .then(res => {
        if (res.data?.diet_plan) {
          setDietPlan(res.data.diet_plan);
        }
      })
      .catch(() => {});
  }, [selectedType, currentScan]);

  const skinTypes = ['Combination', 'Oily', 'Dry', 'Sensitive', 'Normal'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-pink-100 dark:border-pink-950/50 pb-6">
        <div>
          <span className="text-xs font-bold text-glow-primary uppercase tracking-widest flex items-center gap-1.5">
            <Utensils size={14} /> Clinical Cellular Nutrition
          </span>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mt-1">
            4-Week Dermatological Diet Protocol
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-xl">
            Targeting systemic inflammation, sebaceous gland IGF-1 modulation, and optimal collagen synthesis.
          </p>
        </div>

        {/* Skin Type Filter Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-pink-100/60 dark:bg-glow-dark-surface rounded-2xl border border-pink-200 dark:border-pink-900/50 self-start sm:self-auto">
          {skinTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedType === type
                  ? 'bg-glow-primary text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-glow-primary'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Diet Plan View with PDF download */}
      <DietPlanView dietPlan={dietPlan} />

    </div>
  );
};

export default DietPage;
