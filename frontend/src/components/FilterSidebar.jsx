import React from 'react';
import { Filter, RotateCcw, Search, Sparkles } from 'lucide-react';

const FilterSidebar = ({
  search,
  setSearch,
  selectedBrand,
  setSelectedBrand,
  selectedCategory,
  setSelectedCategory,
  selectedSkinType,
  setSelectedSkinType,
  selectedConcern,
  setSelectedConcern,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy,
  brands = [],
  categories = [],
  onReset
}) => {
  const skinTypes = ['All', 'Oily', 'Dry', 'Combination', 'Sensitive', 'Normal'];
  const skinConcerns = [
    'All',
    'Active Breakouts',
    'Oiliness',
    'Dryness',
    'Redness',
    'Pigmentation',
    'Large Pores',
    'Dark Circles',
    'Fine Lines',
    'Barrier Repair'
  ];

  return (
    <div className="glass-panel p-5 rounded-3xl border border-pink-200 dark:border-pink-900/40 space-y-6 shadow-sm">
      
      {/* Title & Reset */}
      <div className="flex items-center justify-between border-b border-pink-100 dark:border-pink-950/40 pb-3">
        <div className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-sm">
          <Filter size={16} className="text-glow-primary" />
          <span>Filters & Precision Search</span>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-glow-primary hover:underline flex items-center gap-1 font-semibold"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Live Search */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Search Actives & Products
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="e.g. Niacinamide, CeraVe, SPF..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 pl-9 text-xs rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface focus:outline-none focus:ring-2 focus:ring-glow-primary"
          />
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* Sort Option */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Sort Catalog
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-glow-primary font-medium"
        >
          <option value="bestseller">Bestsellers First</option>
          <option value="match_score">Highest Skin Match %</option>
          <option value="rating">Highest Rated (4.5+ ★)</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {/* Price Slider ₹0 to ₹5000 */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Price Range
          </span>
          <span className="font-extrabold text-glow-primary">
            Up to ₹{priceRange}
          </span>
        </div>
        <input
          type="range"
          min="200"
          max="5000"
          step="50"
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-glow-primary h-1.5 bg-pink-200 dark:bg-gray-700 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-gray-400">
          <span>₹200</span>
          <span>₹2,500</span>
          <span>₹5,000</span>
        </div>
      </div>

      {/* Skin Type Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Target Skin Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {skinTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedSkinType(type)}
              className={`px-3 py-1 text-xs rounded-xl transition-all font-semibold ${
                selectedSkinType === type
                  ? 'bg-glow-primary text-white shadow-sm'
                  : 'bg-white dark:bg-glow-dark-surface text-gray-700 dark:text-gray-300 border border-pink-100 dark:border-pink-900/40 hover:bg-pink-50'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Concern Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Target Concern
        </label>
        <div className="flex flex-wrap gap-1.5">
          {skinConcerns.map((concern) => (
            <button
              key={concern}
              onClick={() => setSelectedConcern(concern)}
              className={`px-2.5 py-1 text-[11px] rounded-xl transition-all font-medium ${
                selectedConcern === concern
                  ? 'bg-glow-primary text-white shadow-sm'
                  : 'bg-white dark:bg-glow-dark-surface text-gray-600 dark:text-gray-300 border border-pink-100 dark:border-pink-900/40 hover:bg-pink-50'
              }`}
            >
              {concern}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Product Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-glow-primary font-medium"
        >
          <option value="All">All Categories (10 Types)</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Brand Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
          Brand
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-glow-primary font-medium"
        >
          <option value="All">All Premium Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

    </div>
  );
};

export default FilterSidebar;
