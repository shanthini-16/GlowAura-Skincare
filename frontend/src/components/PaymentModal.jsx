import React, { useState } from 'react';
import { 
  CreditCard, 
  QrCode, 
  Smartphone, 
  Building2, 
  Banknote, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

const PaymentModal = ({ isOpen, onClose, totalAmount, onPaymentSuccess }) => {
  const [activeMethod, setActiveMethod] = useState('upi'); // 'upi', 'card', 'netbanking', 'cod'
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Card details state
  const [cardNumber, setCardNumber] = useState('4532 8910 2345 6789');
  const [cardHolder, setCardHolder] = useState('AAROHI PATEL');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('482');

  // UPI state
  const [upiApp, setUpiApp] = useState('gpay'); // 'gpay', 'phonepe', 'paytm', 'qr'
  const [customUpi, setCustomUpi] = useState('user@oksbi');

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  if (!isOpen) return null;

  const handlePayNow = () => {
    setIsProcessing(true);
    
    // Simulate gateway verification
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      
      // Fire luxury pink and gold confetti
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF5E9C', '#FFD6E8', '#FFD700', '#FFFFFF', '#E9A6C3']
      });

      if (onPaymentSuccess) {
        onPaymentSuccess({
          method: activeMethod === 'upi' ? `UPI (${upiApp.toUpperCase()})` :
                  activeMethod === 'card' ? 'Credit/Debit Card' :
                  activeMethod === 'netbanking' ? `Net Banking (${selectedBank})` : 'Cash on Delivery',
          amount: totalAmount
        });
      }
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-glow-dark-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200 dark:border-pink-900/60 overflow-hidden">
        
        {/* Close Button */}
        {!paymentSuccess && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        )}

        {/* State 1: Payment Selection & Processing */}
        {!paymentSuccess ? (
          <div className="space-y-6">
            
            <div>
              <span className="text-xs font-bold text-glow-primary uppercase tracking-wider flex items-center gap-1">
                <Lock size={12} /> 256-Bit Encrypted Payment
              </span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">
                Complete Luxury Checkout
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Amount Payable: <strong className="text-base text-glow-primary font-black">₹{totalAmount.toFixed(2)}</strong>
              </p>
            </div>

            {/* Payment Method Selector Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setActiveMethod('upi')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  activeMethod === 'upi'
                    ? 'bg-pink-50 dark:bg-pink-950/40 border-glow-primary text-glow-primary shadow-sm'
                    : 'bg-white dark:bg-glow-dark-surface border-pink-100 dark:border-pink-950/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <QrCode size={18} />
                <span>UPI / QR</span>
              </button>

              <button
                onClick={() => setActiveMethod('card')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  activeMethod === 'card'
                    ? 'bg-pink-50 dark:bg-pink-950/40 border-glow-primary text-glow-primary shadow-sm'
                    : 'bg-white dark:bg-glow-dark-surface border-pink-100 dark:border-pink-950/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <CreditCard size={18} />
                <span>Card</span>
              </button>

              <button
                onClick={() => setActiveMethod('netbanking')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  activeMethod === 'netbanking'
                    ? 'bg-pink-50 dark:bg-pink-950/40 border-glow-primary text-glow-primary shadow-sm'
                    : 'bg-white dark:bg-glow-dark-surface border-pink-100 dark:border-pink-950/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Building2 size={18} />
                <span>Net Banking</span>
              </button>

              <button
                onClick={() => setActiveMethod('cod')}
                className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  activeMethod === 'cod'
                    ? 'bg-pink-50 dark:bg-pink-950/40 border-glow-primary text-glow-primary shadow-sm'
                    : 'bg-white dark:bg-glow-dark-surface border-pink-100 dark:border-pink-950/50 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Banknote size={18} />
                <span>Cash on Delivery</span>
              </button>
            </div>

            {/* TAB 1: UPI / GPay / PhonePe / Paytm */}
            {activeMethod === 'upi' && (
              <div className="space-y-4 p-4 rounded-2xl bg-pink-50/40 dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/50">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={() => setUpiApp('gpay')}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      upiApp === 'gpay' ? 'border-glow-primary bg-white text-glow-primary shadow-sm' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Google Pay
                  </button>
                  <button
                    onClick={() => setUpiApp('phonepe')}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      upiApp === 'phonepe' ? 'border-glow-primary bg-white text-glow-primary shadow-sm' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    PhonePe
                  </button>
                  <button
                    onClick={() => setUpiApp('paytm')}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      upiApp === 'paytm' ? 'border-glow-primary bg-white text-glow-primary shadow-sm' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Paytm UPI
                  </button>
                  <button
                    onClick={() => setUpiApp('qr')}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                      upiApp === 'qr' ? 'border-glow-primary bg-white text-glow-primary shadow-sm' : 'border-gray-200 text-gray-600'
                    }`}
                  >
                    Scan QR
                  </button>
                </div>

                {upiApp === 'qr' ? (
                  <div className="text-center py-2 space-y-2">
                    {/* Simulated Dynamic QR Code */}
                    <div className="w-36 h-36 mx-auto bg-white p-2 rounded-2xl border border-pink-200 shadow-sm flex items-center justify-center">
                      <div className="w-full h-full bg-gradient-to-tr from-pink-500 via-pink-400 to-glow-accent rounded-lg flex items-center justify-center text-white">
                        <QrCode size={90} className="text-white" />
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500">Scan with any UPI App (BHIM, GPay, PhonePe)</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Enter VPA / UPI ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customUpi}
                        onChange={(e) => setCustomUpi(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="flex-1 px-3 py-2 text-xs rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-black/30 focus:outline-none focus:ring-1 focus:ring-glow-primary"
                      />
                      <span className="inline-flex items-center px-3 text-xs font-semibold bg-green-50 text-green-700 rounded-xl">
                        Verified
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Card with Visual 3D Preview */}
            {activeMethod === 'card' && (
              <div className="space-y-4">
                {/* Visual Card Display */}
                <div className="w-full h-44 rounded-2xl p-5 text-white bg-gradient-to-tr from-[#E04884] via-[#FF5E9C] to-glow-accent shadow-glow flex flex-col justify-between relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="font-display text-sm tracking-widest uppercase font-bold">GlowAura Platinum</span>
                    <Sparkles size={20} className="text-pink-200" />
                  </div>
                  <div className="text-lg font-mono tracking-widest font-bold">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>
                  <div className="flex justify-between items-end text-xs font-mono">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider opacity-70 block">Card Holder</span>
                      <span className="font-bold">{cardHolder || 'VALUED CUSTOMER'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase tracking-wider opacity-70 block">Expires</span>
                      <span className="font-bold">{cardExpiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                {/* Card Inputs */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="col-span-2 space-y-1">
                    <label className="font-bold uppercase tracking-wider text-gray-500">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface"
                    />
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="font-bold uppercase tracking-wider text-gray-500">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold uppercase tracking-wider text-gray-500">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold uppercase tracking-wider text-gray-500">CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: Net Banking */}
            {activeMethod === 'netbanking' && (
              <div className="space-y-3 p-4 rounded-2xl bg-pink-50/40 dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/50">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Select Bank</label>
                <div className="grid grid-cols-2 gap-2">
                  {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank', 'Kotak Mahindra'].map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBank(b)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all text-left ${
                        selectedBank === b
                          ? 'border-glow-primary bg-white dark:bg-glow-dark-card text-glow-primary shadow-sm'
                          : 'border-pink-100 dark:border-pink-950/40 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Cash on Delivery */}
            {activeMethod === 'cod' && (
              <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-amber-800 dark:text-amber-200 text-xs space-y-1">
                <strong className="font-bold block">Cash on Delivery Available</strong>
                <p>Pay cash or via UPI QR code directly to our luxury delivery executive at your doorstep.</p>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePayNow}
              disabled={isProcessing}
              className="w-full btn-glow text-white font-bold py-3.5 px-4 rounded-2xl shadow-glow flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Processing Secure Payment...</span>
                </>
              ) : (
                <>
                  <span>Pay ₹{totalAmount.toFixed(2)} Securely</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

          </div>
        ) : (
          /* State 2: Payment Success Confirmation */
          <div className="text-center py-8 space-y-4">
            <div className="w-20 h-20 bg-green-100 dark:bg-green-950/50 text-green-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Payment Successful!
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 max-w-sm mx-auto">
              Your order is confirmed. Our laboratory is preparing your personalized skincare regimen for dispatch.
            </p>

            <div className="p-4 rounded-2xl bg-pink-50 dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/50 max-w-xs mx-auto text-xs space-y-1.5 text-left">
              <div className="flex justify-between">
                <span className="text-gray-500">Amount Paid:</span>
                <strong className="text-gray-800 dark:text-white">₹{totalAmount.toFixed(2)}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Method:</span>
                <strong className="text-glow-primary capitalize">{activeMethod.toUpperCase()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status:</span>
                <span className="text-green-600 font-bold">Verified & Paid</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="btn-glow text-white font-bold text-xs px-8 py-3 rounded-full shadow-glow"
            >
              View Order Tracking & Receipt
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;
