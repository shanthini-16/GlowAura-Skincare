import React, { useState } from 'react';
import { Sun, Moon, Calendar, Sparkles, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const RoutineCard = ({ routine }) => {
  const [activeTab, setActiveTab] = useState('morning'); // 'morning', 'night', 'weekly'
  const { addToCart } = useCart();
  const [addedAll, setAddedAll] = useState(false);

  if (!routine) return null;

  const currentSteps = routine[activeTab] || [];

  const handleAddAllToCart = () => {
    currentSteps.forEach(step => {
      if (step.product) {
        addToCart(step.product, 1);
      }
    });
    setAddedAll(true);
    setTimeout(() => setAddedAll(false), 2500);
  };

  return (
    <div className="glass-panel p-6 rounded-3xl border border-pink-200 dark:border-pink-900/40 shadow-glow space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-glow-primary uppercase tracking-wider">
            Custom Formulations
          </span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Personalized Daily & Weekly Regimen
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 bg-pink-100/70 dark:bg-glow-dark-surface rounded-2xl border border-pink-200 dark:border-pink-900/40">
          <button
            onClick={() => setActiveTab('morning')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'morning'
                ? 'bg-white dark:bg-glow-primary text-glow-primary dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-glow-primary'
            }`}
          >
            <Sun size={13} className="text-amber-500" />
            <span>Morning (AM)</span>
          </button>
          
          <button
            onClick={() => setActiveTab('night')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'night'
                ? 'bg-white dark:bg-glow-primary text-glow-primary dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-glow-primary'
            }`}
          >
            <Moon size={13} className="text-indigo-400" />
            <span>Night (PM)</span>
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'weekly'
                ? 'bg-white dark:bg-glow-primary text-glow-primary dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-glow-primary'
            }`}
          >
            <Calendar size={13} className="text-emerald-500" />
            <span>Weekly</span>
          </button>
        </div>
      </div>

      {/* Routine Steps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentSteps.map((step, idx) => {
          const product = step.product;
          return (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-white dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/60 shadow-sm flex flex-col justify-between group hover:border-pink-300 dark:hover:border-pink-800 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-950/60 text-glow-primary text-xs font-black flex items-center justify-center">
                    {step.step || idx + 1}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-pink-50 dark:bg-pink-900/30 text-glow-primary">
                    {step.category}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  {step.step_name}
                </h4>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {step.instructions}
                </p>

                {/* Recommended Product Card */}
                {product && (
                  <div className="mt-4 p-2.5 rounded-xl bg-pink-50/50 dark:bg-black/30 border border-pink-100 dark:border-pink-950/40 flex items-center gap-3">
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-12 h-12 rounded-lg object-contain bg-gradient-to-b from-stone-50 to-pink-50/40 dark:from-[#221622] dark:to-[#150C16] p-0.5 border border-pink-100 dark:border-pink-900/40 filter drop-shadow-sm"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/products/coming_soon.svg';
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[9px] uppercase font-bold text-glow-primary">
                        {product.brand}
                      </span>
                      <h5 className="text-xs font-semibold text-gray-800 dark:text-white truncate">
                        {product.name}
                      </h5>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-gray-900 dark:text-pink-200">
                          ₹{product.price}
                        </span>
                        {product.match_score && (
                          <span className="text-[10px] font-bold text-green-600 dark:text-green-400">
                            {product.match_score}% Match
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {product && (
                <button
                  onClick={() => addToCart(product, 1)}
                  className="mt-4 w-full py-1.5 px-3 rounded-xl border border-glow-primary/50 text-glow-primary hover:bg-glow-primary hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <ShoppingBag size={13} />
                  <span>Add Step to Cart</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Routine Bottom CTA */}
      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-pink-100 dark:border-pink-950/40">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          *Formulated without pore-clogging comedogenic oils or harsh drying alcohols.
        </p>

        <button
          onClick={handleAddAllToCart}
          className="btn-glow text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-glow flex items-center gap-2 hover:scale-105 transition-all"
        >
          {addedAll ? (
            <>
              <Check size={15} />
              <span>Added to Bag!</span>
            </>
          ) : (
            <>
              <ShoppingBag size={15} />
              <span>Add All {activeTab.toUpperCase()} Products to Bag</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
};

export default RoutineCard;
