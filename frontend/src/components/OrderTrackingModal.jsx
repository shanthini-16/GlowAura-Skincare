import React from 'react';
import { Package, Truck, CheckCircle2, Clock, MapPin, X, ArrowRight } from 'lucide-react';

const OrderTrackingModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const steps = [
    { title: 'Order Placed', desc: 'Received & verified by clinical team', icon: Clock, completed: true },
    { title: 'Packed & Sealed', desc: 'Formulated in sterile luxury box', icon: Package, completed: ['Packed', 'Shipped', 'Delivered'].includes(order.order_status) },
    { title: 'In Transit', desc: 'Dispatched via express courier', icon: Truck, completed: ['Shipped', 'Delivered'].includes(order.order_status) },
    { title: 'Delivered', desc: 'Safely delivered to your address', icon: CheckCircle2, completed: order.order_status === 'Delivered' }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-glow-dark-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200 dark:border-pink-900/60">
        
        <div className="flex items-center justify-between border-b border-pink-100 dark:border-pink-950/40 pb-4 mb-6">
          <div>
            <span className="text-xs font-bold text-glow-primary uppercase tracking-wider">
              Live Shipment Tracking
            </span>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {order.order_number}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tracking Details Banner */}
        <div className="p-4 rounded-2xl bg-pink-50/60 dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/40 mb-6 text-xs flex justify-between items-center">
          <div>
            <span className="text-gray-400 block text-[10px] uppercase">Tracking Number</span>
            <strong className="font-mono text-gray-800 dark:text-white text-xs">{order.tracking_id}</strong>
          </div>
          <div className="text-right">
            <span className="text-gray-400 block text-[10px] uppercase">Est. Delivery</span>
            <strong className="text-glow-primary text-xs">Within 48 Hours</strong>
          </div>
        </div>

        {/* Vertical Stepper Timeline */}
        <div className="space-y-6 relative pl-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div key={idx} className="flex items-start gap-4 relative">
                {/* Connecting Line */}
                {idx < steps.length - 1 && (
                  <div 
                    className={`absolute left-4 top-8 bottom-0 w-0.5 -ml-px ${
                      step.completed ? 'bg-glow-primary' : 'bg-gray-200 dark:bg-gray-800'
                    }`}
                  />
                )}
                
                {/* Circle Icon */}
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-colors ${
                    step.completed 
                      ? 'bg-glow-primary text-white shadow-glow-sm' 
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                  }`}
                >
                  <Icon size={16} />
                </div>

                <div>
                  <h4 className={`text-xs font-bold ${
                    step.completed ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                  }`}>
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shipping Address */}
        <div className="mt-6 pt-4 border-t border-pink-100 dark:border-pink-950/40 text-xs text-gray-600 dark:text-gray-300 flex items-start gap-2">
          <MapPin size={16} className="text-glow-primary flex-shrink-0 mt-0.5" />
          <div>
            <strong className="text-gray-800 dark:text-white block">Delivery Destination:</strong>
            <p>{order.shipping_name}, {order.shipping_address}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default OrderTrackingModal;
