import React, { useState } from 'react';
import { 
  Utensils, 
  Droplets, 
  AlertTriangle, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  ChevronRight, 
  Apple, 
  Coffee, 
  Moon, 
  Sun,
  ShieldAlert
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useScan } from '../context/ScanContext';

const DietPlanView = ({ dietPlan }) => {
  const [activeWeek, setActiveWeek] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const { waterGlasses, waterGoal, incrementWater, decrementWater } = useScan();

  if (!dietPlan) return null;

  const currentWeekData = dietPlan.weeks?.find(w => w.week_number === activeWeek) || dietPlan.weeks?.[0];

  const handleDownloadDietPDF = async () => {
    setIsExporting(true);
    const element = document.getElementById('glowaura-diet-container');
    if (!element) {
      setIsExporting(false);
      return;
    }
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`GlowAura_4Week_Nutrition_Diet_Plan.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div id="glowaura-diet-container" className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-200 dark:border-pink-900/40 shadow-glow space-y-8">
      
      {/* Top Banner & PDF Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-pink-100 dark:border-pink-950/40 pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-glow-secondary/80 text-glow-primary">
            <Utensils size={13} /> Gut-Skin Axis Protocol
          </span>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {dietPlan.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {dietPlan.description}
          </p>
        </div>

        <button
          onClick={handleDownloadDietPDF}
          disabled={isExporting}
          className="btn-glow text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-glow flex items-center gap-2 self-start sm:self-auto hover:scale-105 transition-all"
        >
          <Download size={15} />
          <span>{isExporting ? 'Exporting Plan...' : 'Download Diet Plan PDF'}</span>
        </button>
      </div>

      {/* Week Selector Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {dietPlan.weeks?.map((w) => (
          <button
            key={w.week_number}
            onClick={() => setActiveWeek(w.week_number)}
            className={`p-3.5 rounded-2xl text-left border transition-all ${
              activeWeek === w.week_number
                ? 'bg-glow-primary text-white border-glow-primary shadow-glow-sm'
                : 'bg-white dark:bg-glow-dark-surface border-pink-200 dark:border-pink-950/50 hover:border-pink-300'
            }`}
          >
            <span className={`text-[10px] font-bold uppercase tracking-wider block ${
              activeWeek === w.week_number ? 'text-pink-100' : 'text-glow-primary'
            }`}>
              Week {w.week_number}
            </span>
            <h4 className={`text-xs font-bold mt-0.5 ${
              activeWeek === w.week_number ? 'text-white' : 'text-gray-800 dark:text-gray-200'
            }`}>
              {w.theme}
            </h4>
          </button>
        ))}
      </div>

      {/* Current Week Meal Cards */}
      {currentWeekData && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <Sparkles size={16} className="text-glow-primary" />
              <span>Week {currentWeekData.week_number} Focus: {currentWeekData.goal}</span>
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Breakfast */}
            <div className="p-4 rounded-2xl bg-white dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/40 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-amber-500">
                <span className="flex items-center gap-1.5"><Sun size={14} /> Breakfast</span>
                <span className="text-[10px] bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">08:00 AM</span>
              </div>
              <h5 className="text-sm font-bold text-gray-800 dark:text-white">
                {currentWeekData.meals.breakfast.name}
              </h5>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <strong>Ingredients:</strong> {currentWeekData.meals.breakfast.ingredients}
              </p>
              <p className="text-[11px] text-glow-primary font-medium">
                ★ {currentWeekData.meals.breakfast.benefits}
              </p>
            </div>

            {/* Lunch */}
            <div className="p-4 rounded-2xl bg-white dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/40 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-emerald-500">
                <span className="flex items-center gap-1.5"><Utensils size={14} /> Lunch</span>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">01:00 PM</span>
              </div>
              <h5 className="text-sm font-bold text-gray-800 dark:text-white">
                {currentWeekData.meals.lunch.name}
              </h5>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <strong>Ingredients:</strong> {currentWeekData.meals.lunch.ingredients}
              </p>
              <p className="text-[11px] text-glow-primary font-medium">
                ★ {currentWeekData.meals.lunch.benefits}
              </p>
            </div>

            {/* Snack */}
            <div className="p-4 rounded-2xl bg-white dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/40 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-purple-500">
                <span className="flex items-center gap-1.5"><Apple size={14} /> Afternoon Radiance Snack</span>
                <span className="text-[10px] bg-purple-50 dark:bg-purple-950/30 px-2 py-0.5 rounded-full">04:30 PM</span>
              </div>
              <h5 className="text-sm font-bold text-gray-800 dark:text-white">
                {currentWeekData.meals.snack.name}
              </h5>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <strong>Ingredients:</strong> {currentWeekData.meals.snack.ingredients}
              </p>
              <p className="text-[11px] text-glow-primary font-medium">
                ★ {currentWeekData.meals.snack.benefits}
              </p>
            </div>

            {/* Dinner */}
            <div className="p-4 rounded-2xl bg-white dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/40 shadow-sm space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-indigo-500">
                <span className="flex items-center gap-1.5"><Moon size={14} /> Evening Dinner</span>
                <span className="text-[10px] bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 rounded-full">07:30 PM</span>
              </div>
              <h5 className="text-sm font-bold text-gray-800 dark:text-white">
                {currentWeekData.meals.dinner.name}
              </h5>
              <p className="text-xs text-gray-600 dark:text-gray-300">
                <strong>Ingredients:</strong> {currentWeekData.meals.dinner.ingredients}
              </p>
              <p className="text-[11px] text-glow-primary font-medium">
                ★ {currentWeekData.meals.dinner.benefits}
              </p>
            </div>

          </div>
        </div>
      )}

      {/* Hydration Tracker & Supplements Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-pink-100 dark:border-pink-950/40">
        
        {/* Daily Water Tracker */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Droplets size={18} />
              <h4 className="text-sm font-bold">Daily Water Intake Goal</h4>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/40 px-2.5 py-0.5 rounded-full">
              Target: {dietPlan.daily_water_target_liters} Liters
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-black text-gray-900 dark:text-white">
                {waterGlasses} <span className="text-xs text-gray-500 font-normal">/ {waterGoal} glasses logged</span>
              </span>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                Each glass ≈ 250ml. Hydrates deep dermal stratum basale.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={decrementWater}
                className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-800 text-blue-600 font-bold flex items-center justify-center hover:bg-blue-50"
              >
                -
              </button>
              <button
                onClick={incrementWater}
                className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center hover:bg-blue-700 shadow-sm"
              >
                +
              </button>
            </div>
          </div>

          <div className="w-full bg-blue-100 dark:bg-gray-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (waterGlasses / waterGoal) * 100)}%` }}
            />
          </div>
        </div>

        {/* Dermatologist Prescribed Supplements */}
        <div className="p-5 rounded-2xl bg-white dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/40 space-y-3">
          <h4 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Sparkles size={16} className="text-glow-primary" />
            <span>Targeted Clinical Supplements</span>
          </h4>
          <ul className="space-y-2">
            {dietPlan.primary_supplements?.map((sup, idx) => (
              <li key={idx} className="text-xs flex items-start gap-2">
                <CheckCircle2 size={15} className="text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-gray-800 dark:text-white">{sup.name}:</strong>{' '}
                  <span className="text-gray-500 dark:text-gray-400">{sup.benefit}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Foods to Avoid & Dermatologist Nutrition Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-pink-100 dark:border-pink-950/40">
        
        {/* Foods to Avoid */}
        <div className="p-5 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/40 space-y-3">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
            <ShieldAlert size={18} />
            <h4 className="text-sm font-bold">Foods to Strictly Avoid</h4>
          </div>
          <ul className="space-y-2">
            {dietPlan.foods_to_avoid?.map((item, idx) => (
              <li key={idx} className="text-xs flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1.5" />
                <div>
                  <strong className="text-red-800 dark:text-red-300">{item.item}:</strong>{' '}
                  <span className="text-gray-600 dark:text-gray-400">{item.reason}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Dermatologist Habits */}
        <div className="p-5 rounded-2xl bg-pink-50/50 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-950/40 space-y-3">
          <h4 className="text-sm font-bold text-gray-800 dark:text-white flex items-center gap-2">
            <Sparkles size={16} className="text-glow-primary" />
            <span>Dermatologist Daily Tips</span>
          </h4>
          <ul className="space-y-2">
            {dietPlan.dermatologist_tips?.map((tip, idx) => (
              <li key={idx} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2">
                <ChevronRight size={14} className="text-glow-primary flex-shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};

export default DietPlanView;
