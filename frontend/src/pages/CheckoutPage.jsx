import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  ShoppingBag, 
  Printer, 
  Truck, 
  Sparkles 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { checkoutAPI } from '../services/api';
import PaymentModal from '../components/PaymentModal';

const CheckoutPage = () => {
  const { cartItems, finalTotal, discountAmount, subtotal, shippingCharge, coupon, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Shipping details state
  const [shippingName, setShippingName] = useState(user?.full_name || 'Aarohi Patel');
  const [shippingPhone, setShippingPhone] = useState(user?.phone || '+91 98765 43210');
  const [shippingAddress, setShippingAddress] = useState('Flat 402, Lotus Radiance Towers, Bandra West, Mumbai, MH - 400050');
  
  // Payment Modal Trigger
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  if (cartItems.length === 0 && !confirmedOrder) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">No Items to Checkout</h2>
        <Link to="/shop" className="btn-glow text-white text-xs font-bold px-6 py-2.5 rounded-full inline-block">
          Explore Formulations
        </Link>
      </div>
    );
  }

  // Handle successful payment from PaymentModal
  const handlePaymentSuccess = async (paymentDetails) => {
    try {
      const orderPayload = {
        items: cartItems,
        total_amount: finalTotal,
        discount_amount: discountAmount,
        coupon_code: coupon?.code || null,
        payment_method: paymentDetails.method,
        shipping_name: shippingName,
        shipping_address: shippingAddress,
        shipping_phone: shippingPhone
      };

      const res = await checkoutAPI.placeOrder(orderPayload);
      if (res.data?.success) {
        setConfirmedOrder(res.data.order);
        clearCart();
      }
    } catch (err) {
      console.error("Order placement error:", err);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* State 1: Order Confirmation Receipt */}
      {confirmedOrder ? (
        <div id="glowaura-tax-invoice" className="glass-panel p-8 sm:p-12 rounded-3xl border border-pink-200 dark:border-pink-900/40 shadow-glow space-y-8 animate-fadeIn">
          
          {/* Top Receipt Brand Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-pink-100 dark:border-pink-950/40 pb-6 gap-4">
            <div className="flex items-center gap-3">
              <img src="/logo.jpg" alt="Logo" className="w-12 h-12 rounded-full border border-glow-primary shadow-sm" />
              <div>
                <h1 className="font-display font-bold text-2xl text-gray-900 dark:text-white">GlowAura Inc.</h1>
                <p className="text-[10px] text-gray-400 font-mono">OFFICIAL LUXURY TAX INVOICE</p>
              </div>
            </div>

            <div className="text-left sm:text-right text-xs">
              <span className="font-bold text-green-600 bg-green-50 dark:bg-green-950/40 px-3 py-1 rounded-full inline-block mb-1">
                Order Verified & Paid
              </span>
              <p className="text-gray-500 font-mono">Invoice #{confirmedOrder.order_number}</p>
              <p className="text-gray-400 text-[11px]">{confirmedOrder.created_at}</p>
            </div>
          </div>

          {/* Shipment & Customer Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            <div className="p-4 rounded-2xl bg-pink-50/40 dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/50 space-y-1">
              <strong className="text-gray-900 dark:text-white uppercase tracking-wider block text-[10px]">
                Shipment Destination:
              </strong>
              <p className="font-bold text-gray-800 dark:text-gray-200">{confirmedOrder.shipping_name}</p>
              <p className="text-gray-600 dark:text-gray-400">{confirmedOrder.shipping_address}</p>
              <p className="text-gray-500">Contact: {confirmedOrder.shipping_phone}</p>
            </div>

            <div className="p-4 rounded-2xl bg-pink-50/40 dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/50 space-y-1">
              <strong className="text-gray-900 dark:text-white uppercase tracking-wider block text-[10px]">
                Logistics & Payment:
              </strong>
              <p className="text-gray-600 dark:text-gray-400">Payment: <strong className="text-glow-primary">{confirmedOrder.payment_method}</strong></p>
              <p className="text-gray-600 dark:text-gray-400">Tracking Code: <span className="font-mono font-bold text-gray-800 dark:text-white">{confirmedOrder.tracking_id}</span></p>
              <p className="text-green-600 font-semibold flex items-center gap-1">
                <Truck size={13} /> Dispatched via Luxury Express Courier
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="border border-pink-100 dark:border-pink-950/50 rounded-2xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-pink-50/60 dark:bg-glow-dark-surface text-gray-500 border-b border-pink-100 dark:border-pink-950/40">
                <tr>
                  <th className="py-3 px-4">Item Formulation</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-pink-50 dark:divide-pink-950/30">
                {confirmedOrder.items?.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3 px-4 font-semibold text-gray-800 dark:text-gray-200">
                      {item.brand} - {item.name}
                    </td>
                    <td className="py-3 px-4 text-center">{item.quantity}</td>
                    <td className="py-3 px-4 text-right">₹{item.price}</td>
                    <td className="py-3 px-4 text-right font-bold text-gray-900 dark:text-white">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Financial Summary */}
          <div className="max-w-xs ml-auto space-y-1.5 text-xs text-right">
            <div className="flex justify-between">
              <span className="text-gray-500">Subtotal:</span>
              <span className="font-semibold">₹{confirmedOrder.total_amount.toFixed(2)}</span>
            </div>
            {confirmedOrder.discount_amount > 0 && (
              <div className="flex justify-between text-glow-primary">
                <span>Promo Discount:</span>
                <span>-₹{confirmedOrder.discount_amount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-500">Shipping:</span>
              <span className="font-bold text-green-600">FREE</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-pink-100 text-sm font-black">
              <span>Total Paid:</span>
              <span className="text-glow-primary text-base">₹{confirmedOrder.total_amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Invoice Actions */}
          <div className="pt-6 border-t border-pink-100 dark:border-pink-950/40 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handlePrintInvoice}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-xs font-bold hover:bg-pink-50"
            >
              <Printer size={15} />
              <span>Print Tax Invoice</span>
            </button>

            <Link
              to="/profile"
              className="btn-glow text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-glow"
            >
              View Order in Profile History
            </Link>
          </div>

        </div>
      ) : (
        /* State 2: Standard Checkout Input View */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left 2 Columns: Shipping Address */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-200 dark:border-pink-900/40 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-glow-primary">
                <MapPin size={20} />
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  1. Luxury Shipping Address
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Recipient Name</label>
                  <input
                    type="text"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Contact Number</label>
                  <input
                    type="tel"
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Full Delivery Street Address</label>
                  <textarea
                    rows={3}
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface"
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-pink-200 dark:border-pink-900/40 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-pink-100 text-glow-primary flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 dark:text-white">GlowAura White-Glove Delivery</h4>
                  <p className="text-[11px] text-gray-500">Dispatched in temperature-controlled protective packaging</p>
                </div>
              </div>
              <span className="text-xs font-bold text-green-600">INCLUDED</span>
            </div>
          </div>

          {/* Right Column: Order Summary & Trigger Payment Modal */}
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-3xl border border-pink-200 dark:border-pink-900/40 shadow-glow space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">
                Review & Confirm
              </h3>

              <div className="max-h-48 overflow-y-auto space-y-2 text-xs">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-1">
                    <span className="truncate max-w-[170px] text-gray-700 dark:text-gray-300">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-pink-100 dark:border-pink-950/40 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-glow-primary">
                    <span>Coupon Discount</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-bold text-green-600">
                    {shippingCharge === 0 ? 'FREE' : `₹${shippingCharge}`}
                  </span>
                </div>
                <div className="pt-2 border-t border-pink-100 flex justify-between text-base font-black">
                  <span>Total Payable</span>
                  <span className="text-glow-primary">₹{finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsPaymentModalOpen(true)}
                className="w-full btn-glow text-white font-bold py-3.5 px-4 rounded-xl shadow-glow flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform text-xs"
              >
                <span>Select Payment (UPI / Card / COD)</span>
                <ArrowRight size={16} />
              </button>

              <div className="text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
                <ShieldCheck size={13} className="text-green-500" />
                <span>100% Purchase Protection & Authentic Guarantee</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* Simulated Payment Gateway Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={finalTotal}
        onPaymentSuccess={handlePaymentSuccess}
      />

    </div>
  );
};

export default CheckoutPage;
