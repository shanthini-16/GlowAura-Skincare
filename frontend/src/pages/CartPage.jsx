import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    shippingCharge,
    finalTotal,
    coupon,
    applyCouponCode,
    removeCoupon,
    couponError,
    freeShippingRemaining,
    freeShippingThreshold
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setCouponLoading(true);
    await applyCouponCode(inputCoupon);
    setCouponLoading(false);
    setInputCoupon('');
  };

  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  if (cartItems.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-20 h-20 bg-pink-50 dark:bg-pink-950/40 text-glow-primary rounded-full flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Beauty Bag is Empty</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          Explore our collection of dermatologist-approved products or perform an AI skin scan for a customized regimen.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/shop" className="btn-glow text-white text-xs font-bold px-6 py-3 rounded-full shadow-glow">
            Explore Products
          </Link>
          <Link to="/scan" className="px-6 py-3 rounded-full border border-glow-primary text-glow-primary text-xs font-bold hover:bg-pink-50">
            Start Skin Analysis
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="border-b border-pink-100 dark:border-pink-950/50 pb-4 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-glow-primary uppercase tracking-wider">
            Shopping Cart
          </span>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white mt-0.5">
            Your Luxury Skincare Bag ({cartItems.length} items)
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-gray-400 hover:text-red-500 font-semibold"
        >
          Clear Bag
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Items List */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Free Shipping Meter */}
          <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-950/40 space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-gray-700 dark:text-gray-300">
                {freeShippingRemaining > 0 ? (
                  <>Add <strong className="text-glow-primary">₹{freeShippingRemaining.toFixed(0)}</strong> more for Free Shipping</>
                ) : (
                  <span className="text-green-600 font-bold flex items-center gap-1">
                    <Sparkles size={14} /> You unlocked Free Luxury Express Delivery!
                  </span>
                )}
              </span>
              <span className="text-glow-primary font-bold">{freeShippingPercent}%</span>
            </div>
            <div className="w-full bg-pink-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-glow-primary to-pink-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Items */}
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div 
                key={item.id}
                className="p-4 rounded-2xl bg-white dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/50 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-contain bg-gradient-to-b from-stone-50 to-pink-50/40 dark:from-[#221622] dark:to-[#150C16] p-1 border border-pink-100 dark:border-pink-950/50 filter drop-shadow-sm"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/products/coming_soon.svg';
                    }}
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-glow-primary">
                      {item.brand}
                    </span>
                    <h3 className="text-sm font-bold text-gray-800 dark:text-white line-clamp-1">
                      {item.name}
                    </h3>
                    <p className="text-xs font-bold text-gray-900 dark:text-pink-200 mt-1">
                      ₹{item.price}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  {/* Quantity */}
                  <div className="flex items-center border border-pink-200 dark:border-pink-900/60 rounded-xl overflow-hidden bg-pink-50/50">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-gray-600 hover:bg-pink-100"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="px-3 text-xs font-bold text-gray-800 dark:text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-gray-600 hover:bg-pink-100"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <span className="text-sm font-black text-gray-900 dark:text-white min-w-[70px] text-right">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

        {/* Right 1 Column: Order Summary & Checkout */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-pink-200 dark:border-pink-900/40 shadow-glow space-y-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              Order Summary
            </h3>

            {/* Coupons Form */}
            {coupon ? (
              <div className="flex items-center justify-between p-3 rounded-xl bg-pink-100/70 border border-glow-primary/40">
                <div className="flex items-center gap-2 text-xs">
                  <Tag size={15} className="text-glow-primary" />
                  <strong className="text-glow-primary">{coupon.code}</strong>
                  <span className="text-gray-600">-₹{discountAmount.toFixed(2)}</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-500 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <label className="text-[11px] font-bold text-gray-500 uppercase">Apply Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="GLOW20 / FIRSTGLOW"
                    value={inputCoupon}
                    onChange={(e) => setInputCoupon(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface focus:outline-none focus:ring-1 focus:ring-glow-primary uppercase"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="px-4 py-2 text-xs font-bold text-white bg-gray-900 dark:bg-glow-primary rounded-xl hover:opacity-90"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-red-500">{couponError}</p>}
              </form>
            )}

            {/* Price Details */}
            <div className="space-y-2 text-xs border-t border-pink-100 dark:border-pink-950/40 pt-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Cart Subtotal</span>
                <span className="font-semibold text-gray-800 dark:text-gray-200">₹{subtotal.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-glow-primary font-semibold">
                  <span>Promo Discount</span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Estimated Shipping</span>
                <span className="font-semibold">
                  {shippingCharge === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${shippingCharge}`}
                </span>
              </div>
              <div className="pt-2 border-t border-pink-100 dark:border-pink-950/40 flex justify-between text-base font-black text-gray-900 dark:text-white">
                <span>Final Total</span>
                <span className="text-glow-primary">₹{finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full btn-glow text-white font-bold py-3.5 px-4 rounded-xl shadow-glow flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform text-xs"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={16} />
            </button>

            <div className="text-center pt-1 text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
              <ShieldCheck size={14} className="text-green-500" />
              <span>Safe & Secure 256-Bit SSL Checkout</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CartPage;
