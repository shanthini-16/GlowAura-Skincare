import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkoutAPI } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('glowaura_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('glowaura_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        original_price: product.original_price,
        image_url: product.image_url,
        category: product.category,
        quantity: quantity
      }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item => item.id === productId ? { ...item, quantity } : item)
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    setCouponError('');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const applyCouponCode = async (code) => {
    setCouponError('');
    try {
      const res = await checkoutAPI.applyCoupon({
        code: code.trim().toUpperCase(),
        order_amount: subtotal
      });
      if (res.data.valid) {
        setCoupon({
          code: res.data.code,
          discount: res.data.discount,
          description: res.data.description
        });
        return { success: true, message: `Coupon ${res.data.code} applied successfully!` };
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to apply coupon.';
      setCouponError(msg);
      return { success: false, message: msg };
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError('');
  };

  const discountAmount = coupon ? coupon.discount : 0;
  const shippingCharge = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCharge);
  const freeShippingThreshold = 999;
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      coupon,
      couponError,
      applyCouponCode,
      removeCoupon,
      subtotal,
      discountAmount,
      shippingCharge,
      finalTotal,
      freeShippingThreshold,
      freeShippingRemaining,
      totalItemsCount,
      isCartOpen,
      setIsCartOpen,
      openCart: () => setIsCartOpen(true),
      closeCart: () => setIsCartOpen(false)
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
