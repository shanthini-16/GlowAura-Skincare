import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ArrowRight, Sparkles, Tag, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartDrawer = () => {
  const {
    cartItems,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    discountAmount,
    shippingCharge,
    finalTotal,
    freeShippingThreshold,
    freeShippingRemaining,
    coupon,
    applyCouponCode,
    removeCoupon,
    couponError
  } = useCart();

  const [inputCoupon, setInputCoupon] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    setCouponLoading(true);
    await applyCouponCode(inputCoupon);
    setCouponLoading(false);
    setInputCoupon('');
  };

  const freeShippingPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const proceedToCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-glow-dark-card shadow-2xl flex flex-col border-l border-pink-100 dark:border-pink-950/60">
          
          {/* Header */}
          <div className="p-5 border-b border-pink-100 dark:border-pink-950/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="text-glow-primary" size={22} />
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">Luxury Beauty Bag</h2>
              <span className="text-xs bg-glow-secondary/80 text-glow-primary px-2 py-0.5 rounded-full font-semibold">
                {cartItems.length} items
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-pink-50 dark:hover:bg-white/5"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-pink-50/70 dark:bg-pink-950/20 px-5 py-3 border-b border-pink-100 dark:border-pink-950/40">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <span className="text-gray-700 dark:text-gray-300">
                {freeShippingRemaining > 0 ? (
                  <>Add <strong className="text-glow-primary">₹{freeShippingRemaining.toFixed(0)}</strong> for Free Shipping</>
                ) : (
                  <span className="text-green-600 dark:text-green-400 flex items-center gap-1 font-bold">
                    <Sparkles size={14} /> You unlocked Free Luxury Delivery!
                  </span>
                )}
              </span>
              <span className="text-glow-primary">{freeShippingPercent}%</span>
            </div>
            <div className="w-full bg-pink-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-glow-primary to-pink-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${freeShippingPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-pink-50 dark:bg-pink-950/30 text-glow-primary rounded-full flex items-center justify-center mx-auto">
                  <ShoppingBag size={28} />
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white text-base">Your Bag is Empty</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                  Discover AI-tailored skincare matches formulated specifically for your dermal diagnostics.
                </p>
                <Link
                  to="/shop"
                  onClick={closeCart}
                  className="inline-block btn-glow text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-glow"
                >
                  Explore Products
                </Link>
              </div>
            ) : (
              cartItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex gap-3.5 p-3 rounded-2xl bg-white dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/40 shadow-sm"
                >
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-16 rounded-xl object-contain bg-gradient-to-b from-stone-50 to-pink-50/40 dark:from-[#221622] dark:to-[#150C16] p-1 border border-pink-100 dark:border-pink-950/50 filter drop-shadow-sm"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/products/coming_soon.svg';
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-glow-primary tracking-wider">
                          {item.brand}
                        </span>
                        <h4 className="text-xs font-semibold text-gray-800 dark:text-white truncate max-w-[170px]">
                          {item.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-bold text-gray-900 dark:text-pink-200">
                        ₹{item.price}
                      </span>
                      
                      {/* Quantity Selector */}
                      <div className="flex items-center border border-pink-200 dark:border-pink-900/50 rounded-lg overflow-hidden bg-pink-50/50 dark:bg-black/20">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-950/60"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="px-2 text-xs font-bold text-gray-800 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-pink-950/60"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cartItems.length > 0 && (
            <div className="p-5 border-t border-pink-100 dark:border-pink-950/50 bg-glow-bg/50 dark:bg-glow-dark-bg/50 space-y-4">
              
              {/* Promo code form */}
              {coupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-pink-100/70 dark:bg-pink-950/40 border border-glow-primary/40">
                  <div className="flex items-center gap-2">
                    <Tag size={15} className="text-glow-primary" />
                    <span className="text-xs font-bold text-glow-primary">{coupon.code}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-300">-₹{discountAmount}</span>
                  </div>
                  <button 
                    onClick={removeCoupon}
                    className="text-xs text-red-500 font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon (e.g. GLOW20)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface focus:outline-none focus:ring-1 focus:ring-glow-primary"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-4 py-2 text-xs font-semibold text-white bg-gray-800 dark:bg-glow-primary rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[10px] text-red-500 font-medium pl-1">{couponError}</p>}
                </form>
              )}

              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800 dark:text-gray-200">₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-glow-primary font-medium">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Luxury Shipping</span>
                  <span className="font-semibold">
                    {shippingCharge === 0 ? <span className="text-green-600 dark:text-green-400">FREE</span> : `₹${shippingCharge}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-pink-100 dark:border-pink-950/60 flex justify-between text-sm font-bold text-gray-900 dark:text-white">
                  <span>Total Amount</span>
                  <span className="text-glow-primary text-base">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={proceedToCheckout}
                className="w-full btn-glow text-white font-bold py-3 px-4 rounded-xl shadow-glow flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
