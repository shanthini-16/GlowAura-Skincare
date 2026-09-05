import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';
import CompareModal from '../components/CompareModal';
import { useWishlist } from '../context/WishlistContext';
import { useScan } from '../context/ScanContext';
import { Sparkles, Scale, Heart, ShoppingBag } from 'lucide-react';

const ShopPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const showWishlistOnly = searchParams.get('wishlist') === 'true';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedSkinType, setSelectedSkinType] = useState('All');
  const [selectedConcern, setSelectedConcern] = useState('All');
  const [priceRange, setPriceRange] = useState(5000);
  const [sortBy, setSortBy] = useState('bestseller');

  const { wishlist } = useWishlist();
  const { compareList, setIsCompareOpen, currentScan } = useScan();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        search,
        brand: selectedBrand,
        category: selectedCategory,
        skin_type: selectedSkinType,
        concern: selectedConcern,
        max_price: priceRange,
        sort: sortBy
      };

      if (currentScan?.analysis?.skin_type) {
        params.user_skin_type = currentScan.analysis.skin_type;
        params.user_concerns = currentScan.analysis.concerns;
      }

      const res = await productsAPI.getAll(params);
      if (res.data) {
        setProducts(res.data.products || []);
        if (res.data.brands) setBrands(res.data.brands);
        if (res.data.categories) setCategories(res.data.categories);
      }
    } catch (err) {
      console.error("Fetch products error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, selectedBrand, selectedCategory, selectedSkinType, selectedConcern, priceRange, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedBrand('All');
    setSelectedCategory('All');
    setSelectedSkinType('All');
    setSelectedConcern('All');
    setPriceRange(5000);
    setSortBy('bestseller');
  };

  // Filter if wishlist view is active
  const displayedProducts = showWishlistOnly
    ? products.filter(p => wishlist.some(w => w.id === p.id))
    : products;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-pink-100 dark:border-pink-950/50 pb-6">
        <div>
          <span className="text-xs font-bold text-glow-primary uppercase tracking-widest flex items-center gap-1.5">
            <Sparkles size={14} /> Comprehensive Skincare Library
          </span>
          <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white mt-1">
            {showWishlistOnly ? 'My Saved Wishlist' : 'Clinical Skincare Catalog'}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Showing {displayedProducts.length} verified dermatologist-grade formulations.
          </p>
        </div>

        {/* Wishlist toggle link */}
        {showWishlistOnly && (
          <button
            onClick={() => window.history.back()}
            className="text-xs text-glow-primary font-bold hover:underline"
          >
            ← Back to Full Catalog
          </button>
        )}
      </div>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Column: Filter Sidebar */}
        <div className="lg:col-span-1">
          <FilterSidebar
            search={search}
            setSearch={setSearch}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedSkinType={selectedSkinType}
            setSelectedSkinType={setSelectedSkinType}
            selectedConcern={selectedConcern}
            setSelectedConcern={setSelectedConcern}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            brands={brands}
            categories={categories}
            onReset={handleResetFilters}
          />
        </div>

        {/* Right Column: Product Grid */}
        <div className="lg:col-span-3 space-y-6">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 rounded-3xl bg-pink-100/40 dark:bg-pink-950/20 animate-pulse" />
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="glass-panel p-12 text-center rounded-3xl space-y-4">
              <ShoppingBag size={36} className="mx-auto text-glow-primary opacity-50" />
              <h3 className="text-base font-bold text-gray-800 dark:text-white">No Products Match These Filters</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try widening your price range slider or clearing the selected skin type and concern filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="btn-glow text-white text-xs font-bold px-6 py-2 rounded-full shadow-glow"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Floating Compare Drawer Trigger (if items added to compare) */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
          <button
            onClick={() => setIsCompareOpen(true)}
            className="btn-glow text-white text-xs font-bold px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 hover:scale-105 transition-all"
          >
            <Scale size={16} />
            <span>Compare {compareList.length} Selected Products</span>
          </button>
        </div>
      )}

      {/* Compare Modal */}
      <CompareModal />

    </div>
  );
};

export default ShopPage;
