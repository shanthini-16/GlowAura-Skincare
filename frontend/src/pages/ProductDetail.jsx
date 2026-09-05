import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Leaf, 
  ArrowLeft, 
  Share2, 
  Plus, 
  Minus,
  MessageSquare
} from 'lucide-react';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useScan } from '../context/ScanContext';
import ProductCard from '../components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  // New review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const { addToCart } = useCart();
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const { currentScan } = useScan();

  useEffect(() => {
    setLoading(true);
    productsAPI.getById(id)
      .then(res => {
        setProduct(res.data.product);
        setReviews(res.data.reviews || []);
        setRelated(res.data.related_products || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-glow-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-500 font-semibold">Loading Formulation Data...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <Link to="/shop" className="text-glow-primary hover:underline text-xs mt-2 inline-block">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isFav = isInWishlist(product.id);

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    try {
      const res = await productsAPI.addReview(product.id, {
        user_name: reviewName || 'Verified Skincare Fan',
        rating: reviewRating,
        comment: reviewComment,
        skin_type: currentScan?.analysis?.skin_type || 'Normal'
      });
      if (res.data?.review) {
        setReviews(prev => [res.data.review, ...prev]);
        setReviewSubmitted(true);
        setReviewComment('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="text-xs font-bold text-gray-600 dark:text-gray-300 hover:text-glow-primary flex items-center gap-1.5 transition-colors"
      >
        <ArrowLeft size={14} />
        <span>Back to Products</span>
      </button>

      {/* Main Showcase Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Image Gallery */}
        <div className="glass-panel p-8 rounded-3xl border border-pink-200 dark:border-pink-900/40 shadow-glow flex items-center justify-center relative aspect-square bg-gradient-to-b from-stone-50/70 via-pink-50/20 to-stone-100/50 dark:from-[#1E141E] dark:via-[#170E18] dark:to-[#120B13]">
          {product.is_bestseller && (
            <span className="absolute top-4 left-4 bg-amber-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
              Cult Bestseller
            </span>
          )}

          <button
            onClick={() => toggleWishlist(product)}
            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-black/40 backdrop-blur-sm text-gray-400 hover:text-glow-primary shadow-sm"
          >
            <Heart size={20} className={isFav ? "fill-glow-primary text-glow-primary" : ""} />
          </button>

          <img
            src={product.image_url}
            alt={product.name}
            className="max-h-80 max-w-full object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/products/coming_soon.svg';
            }}
          />
        </div>

        {/* Right Column: Specifications & Purchasing */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-extrabold text-glow-primary tracking-wider">
                {product.brand}
              </span>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500 font-medium">
                {product.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white leading-snug">
              {product.name}
            </h1>

            {/* Ratings & Match Score */}
            <div className="flex items-center gap-4 mt-3">
              <div className="flex items-center gap-1.5 text-xs">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className={i < Math.floor(product.rating) ? "fill-current" : "text-gray-300"} />
                  ))}
                </div>
                <span className="font-bold text-gray-800 dark:text-gray-200">{product.rating}</span>
                <span className="text-gray-400">({product.reviews_count} verified clinical reviews)</span>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-pink-50/50 dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/40 flex items-baseline gap-3">
            <span className="text-3xl font-black text-gray-900 dark:text-pink-100">
              ₹{product.price}
            </span>
            {product.original_price && (
              <span className="text-sm text-gray-400 line-through">
                ₹{product.original_price}
              </span>
            )}
            <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/40 px-2 py-0.5 rounded-md">
              Inclusive of all luxury taxes & packaging
            </span>
          </div>

          {/* Dermatological Description */}
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
            {product.description}
          </p>

          {/* Skin Compatibility Badges */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">
              Clinical Compatibility
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.suitable_skin_types?.map((st, i) => (
                <span key={i} className="text-xs px-3 py-1 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-glow-primary font-semibold">
                  {st} Skin
                </span>
              ))}
              {product.acne_friendly && (
                <span className="text-xs px-3 py-1 rounded-xl bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-300 font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} /> Non-Comedogenic
                </span>
              )}
            </div>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-pink-200 dark:border-pink-900/60 rounded-2xl overflow-hidden bg-white dark:bg-glow-dark-surface">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:bg-pink-50"
                >
                  <Minus size={14} />
                </button>
                <span className="px-4 text-xs font-bold text-gray-800 dark:text-white">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:bg-pink-50"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                onClick={() => addToCart(product, quantity)}
                className="flex-1 py-3 px-6 rounded-2xl border-2 border-glow-primary text-glow-primary hover:bg-glow-primary hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <ShoppingBag size={16} />
                <span>Add to Bag</span>
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 btn-glow text-white text-xs font-bold py-3 px-6 rounded-2xl shadow-glow flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
              >
                <span>Buy Now</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Full Ingredients INCI Breakdown */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-200 dark:border-pink-900/40 shadow-sm space-y-3">
        <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Leaf size={18} className="text-glow-primary" />
          <span>Full Transparent INCI Ingredient List</span>
        </h3>
        <p className="text-xs text-gray-600 dark:text-gray-300 font-mono leading-relaxed bg-pink-50/40 dark:bg-glow-dark-surface p-4 rounded-2xl border border-pink-100 dark:border-pink-950/50">
          {product.ingredients}
        </p>
      </div>

      {/* Verified Reviews Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-pink-100 dark:border-pink-950/50 pb-4">
          <div>
            <span className="text-xs font-bold text-glow-primary uppercase tracking-wider">
              Real Patient Feedback
            </span>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              Customer Reviews ({reviews.length})
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <p className="text-xs text-gray-500">No reviews yet. Be the first to share your experience!</p>
            ) : (
              reviews.map((rev) => (
                <div 
                  key={rev.id} 
                  className="p-4 rounded-2xl bg-white dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/40 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-800 dark:text-white">{rev.user_name}</span>
                      {rev.verified && (
                        <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.2 rounded-full font-semibold">
                          Verified Buyer
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-gray-400">{rev.created_at}</span>
                  </div>

                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={12} className={i < rev.rating ? "fill-current" : "text-gray-300"} />
                    ))}
                  </div>

                  <h5 className="text-xs font-bold text-gray-900 dark:text-white">{rev.title}</h5>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Review Form */}
          <div className="p-6 rounded-3xl glass-panel border border-pink-200 dark:border-pink-900/40 space-y-4 self-start">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-glow-primary" />
              <span>Write a Clinical Review</span>
            </h4>

            {reviewSubmitted ? (
              <div className="p-4 rounded-2xl bg-green-50 text-green-700 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 size={16} />
                <span>Thank you! Your verified review has been posted.</span>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-gray-600">Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Priya Rao"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full px-3 py-2 mt-1 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-600">Rating</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full px-3 py-2 mt-1 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface font-semibold"
                  >
                    <option value={5}>5 Stars - Outstanding Results</option>
                    <option value={4}>4 Stars - Very Good</option>
                    <option value={3}>3 Stars - Average</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-600">Review Comments</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share how this product affected your skin barrier, breakouts, or hydration..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 mt-1 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-glow text-white font-bold py-2.5 rounded-xl shadow-glow text-xs"
                >
                  Submit Review
                </button>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-pink-100 dark:border-pink-950/50">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Pair with Synergistic Formulations
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {related.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default ProductDetail;
