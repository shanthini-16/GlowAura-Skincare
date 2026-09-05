import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Sparkles, Check, Scale } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useScan } from '../context/ScanContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { compareList, toggleCompare } = useScan();

  const isFav = isInWishlist(product.id);
  const isCompared = compareList.some(p => p.id === product.id);

  const discountPercent = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  return (
    <div className="group relative rounded-3xl bg-white dark:bg-glow-dark-card border border-pink-100 dark:border-pink-950/50 shadow-sm hover:shadow-glow hover:border-pink-300 dark:hover:border-pink-800 transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Image Container */}
      <div className="relative aspect-square w-full overflow-hidden bg-gradient-to-b from-stone-50/80 via-pink-50/30 to-stone-100/60 dark:from-[#221622] dark:via-[#1A101B] dark:to-[#150C16] p-4 flex items-center justify-center border-b border-pink-100/50 dark:border-pink-950/40">
        
        {/* Match Score Badge (if present) */}
        {product.match_score ? (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1 bg-gradient-to-r from-glow-primary to-pink-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md">
            <Sparkles size={11} />
            <span>{product.match_score}% Match</span>
          </div>
        ) : product.is_bestseller ? (
          <div className="absolute top-3 left-3 z-10 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
            Bestseller
          </div>
        ) : null}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist(product);
          }}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm text-gray-400 hover:text-glow-primary transition-colors shadow-sm"
          title={isFav ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart size={16} className={isFav ? "fill-glow-primary text-glow-primary" : ""} />
        </button>

        {/* Compare Checkbox Icon */}
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleCompare(product);
          }}
          className={`absolute bottom-3 left-3 z-10 p-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition-all ${
            isCompared 
              ? 'bg-glow-primary text-white shadow-sm' 
              : 'bg-white/80 dark:bg-black/50 text-gray-600 dark:text-gray-300 hover:bg-pink-100'
          }`}
          title="Compare product"
        >
          <Scale size={13} />
          <span className="hidden group-hover:inline">{isCompared ? 'Compared' : 'Compare'}</span>
        </button>

        {/* Product Image */}
        <Link to={`/product/${product.id}`} className="w-full h-full flex items-center justify-center p-2">
          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_6px_16px_rgba(0,0,0,0.35)] group-hover:scale-105 transition-all duration-500 rounded-xl"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/products/coming_soon.svg';
            }}
          />
        </Link>
      </div>

      {/* Product Information */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-400 mb-1">
            <span className="uppercase font-bold tracking-wider text-glow-primary text-[10px]">
              {product.brand}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-md bg-pink-50 dark:bg-pink-950/40 text-gray-600 dark:text-gray-300">
              {product.category}
            </span>
          </div>

          <Link to={`/product/${product.id}`}>
            <h3 className="text-sm font-bold text-gray-800 dark:text-white line-clamp-2 hover:text-glow-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center text-amber-400">
              <Star size={13} className="fill-current" />
            </div>
            <span className="font-bold text-gray-700 dark:text-gray-200">{product.rating}</span>
            <span className="text-[11px]">({product.reviews_count})</span>
          </div>
        </div>

        {/* Price & Add to Bag CTA */}
        <div className="pt-2 border-t border-pink-50 dark:border-pink-950/40 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-gray-900 dark:text-pink-100">
                ₹{product.price}
              </span>
              {product.original_price && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{product.original_price}
                </span>
              )}
            </div>
            {discountPercent > 0 && (
              <span className="text-[10px] text-green-600 dark:text-green-400 font-bold">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className="p-2.5 rounded-2xl bg-pink-50 dark:bg-pink-950/40 text-glow-primary hover:bg-glow-primary hover:text-white transition-colors duration-200 shadow-sm"
            title="Add to Luxury Bag"
          >
            <ShoppingBag size={17} />
          </button>
        </div>

      </div>

    </div>
  );
};

export default ProductCard;
