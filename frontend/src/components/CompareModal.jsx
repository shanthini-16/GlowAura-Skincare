import React from 'react';
import { X, Check, AlertCircle, ShoppingBag, Trash2, Sparkles } from 'lucide-react';
import { useScan } from '../context/ScanContext';
import { useCart } from '../context/CartContext';

const CompareModal = () => {
  const { compareList, toggleCompare, clearCompare, isCompareOpen, setIsCompareOpen } = useScan();
  const { addToCart } = useCart();

  if (!isCompareOpen || compareList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-5xl bg-white dark:bg-glow-dark-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200 dark:border-pink-900/60 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-100 dark:border-pink-950/40 pb-4 mb-6">
          <div>
            <span className="text-xs font-bold text-glow-primary uppercase tracking-wider">
              Diagnostic Comparison
            </span>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Side-by-Side Formulation Analysis ({compareList.length}/3)
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-red-500 hover:underline font-semibold"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsCompareOpen(false)}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-pink-50"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Comparison Table Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {compareList.map((product) => (
            <div 
              key={product.id}
              className="p-4 rounded-2xl bg-pink-50/40 dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/50 flex flex-col justify-between space-y-4"
            >
              <div>
                {/* Remove button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => toggleCompare(product)}
                    className="text-gray-400 hover:text-red-500 p-1"
                    title="Remove from compare"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Image */}
                <div className="w-full h-36 flex items-center justify-center bg-gradient-to-b from-stone-50 via-pink-50/20 to-stone-100 dark:from-[#221622] dark:to-[#150C16] rounded-xl p-2 mb-3 border border-pink-100/50 dark:border-pink-950/40">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/products/coming_soon.svg';
                    }}
                  />
                </div>

                <span className="text-[10px] uppercase font-bold text-glow-primary">
                  {product.brand}
                </span>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-base font-black text-gray-900 dark:text-pink-200 mt-1">
                  ₹{product.price}
                </p>

                {/* Match Score */}
                {product.match_score && (
                  <div className="inline-flex items-center gap-1 my-2 bg-gradient-to-r from-glow-primary to-pink-500 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                    <Sparkles size={12} />
                    <span>{product.match_score}% Match</span>
                  </div>
                )}

                {/* Specs List */}
                <div className="space-y-2 mt-4 text-xs">
                  <div className="border-t border-pink-100 dark:border-pink-950/40 pt-2">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Category</span>
                    <span className="font-semibold text-gray-800 dark:text-gray-200">{product.category}</span>
                  </div>

                  <div className="border-t border-pink-100 dark:border-pink-950/40 pt-2">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Skin Types</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {product.suitable_skin_types?.map((st, i) => (
                        <span key={i} className="text-[10px] bg-pink-100 dark:bg-pink-950/40 text-glow-primary px-1.5 py-0.5 rounded">
                          {st}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-pink-100 dark:border-pink-950/40 pt-2">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Acne Safety</span>
                    <span className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1 mt-0.5">
                      <Check size={13} /> Non-Comedogenic
                    </span>
                  </div>

                  <div className="border-t border-pink-100 dark:border-pink-950/40 pt-2">
                    <span className="text-[10px] font-bold uppercase text-gray-400 block">Active Ingredients</span>
                    <p className="text-[11px] text-gray-600 dark:text-gray-300 line-clamp-3 mt-0.5">
                      {product.ingredients}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => addToCart(product, 1)}
                className="w-full btn-glow text-white text-xs font-bold py-2.5 rounded-xl shadow-glow flex items-center justify-center gap-2"
              >
                <ShoppingBag size={14} />
                <span>Add to Bag</span>
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default CompareModal;
