import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Sparkles, 
  ShoppingBag, 
  Calendar, 
  FileText, 
  Truck, 
  LogOut, 
  Flame,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useScan } from '../context/ScanContext';
import { authAPI, checkoutAPI } from '../services/api';
import OrderTrackingModal from '../components/OrderTrackingModal';

const ProfilePage = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { currentScan } = useScan();
  const [profileData, setProfileData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'scans', 'settings'
  const [selectedTrackingOrder, setSelectedTrackingOrder] = useState(null);

  useEffect(() => {
    if (user) {
      authAPI.getProfile()
        .then(res => setProfileData(res.data))
        .catch(() => {});

      checkoutAPI.getUserOrders()
        .then(res => setOrders(res.data.orders || []))
        .catch(() => {});
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold">Please Sign In</h2>
        <p className="text-xs text-gray-500">Sign in to view your saved skin scans, routine dossiers, and order shipments.</p>
        <button
          onClick={() => openAuthModal('login')}
          className="btn-glow text-white text-xs font-bold px-6 py-2.5 rounded-full"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Profile Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-pink-200 dark:border-pink-900/40 shadow-glow flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={user.full_name}
            className="w-20 h-20 rounded-full object-cover border-2 border-glow-primary shadow-md"
          />
          <div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {user.full_name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-glow-secondary/80 text-glow-primary">
                Glow Member
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{user.email}</p>
            {user.skin_type && (
              <span className="inline-block mt-2 text-xs font-bold text-glow-primary bg-pink-100 dark:bg-pink-950/60 px-3 py-1 rounded-xl">
                Diagnosed Skin Type: {user.skin_type}
              </span>
            )}
          </div>
        </div>

        {/* Skincare Streak Badge */}
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-pink-500/20 border border-amber-300 dark:border-amber-900/40 text-center">
            <div className="flex items-center justify-center text-amber-500 gap-1 font-black text-lg">
              <Flame size={20} className="fill-current animate-bounce" />
              <span>{user.streak_days || 5} Days</span>
            </div>
            <span className="text-[10px] uppercase font-bold text-gray-500 block mt-0.5">
              Skincare Streak 🔥
            </span>
          </div>

          <button
            onClick={logout}
            className="p-3 rounded-2xl border border-pink-200 dark:border-pink-950/60 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex border-b border-pink-100 dark:border-pink-950/50 space-x-6 text-xs font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'orders' ? 'border-glow-primary text-glow-primary' : 'border-transparent text-gray-500'
          }`}
        >
          <ShoppingBag size={14} />
          <span>Order History ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('scans')}
          className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-2 ${
            activeTab === 'scans' ? 'border-glow-primary text-glow-primary' : 'border-transparent text-gray-500'
          }`}
        >
          <Sparkles size={14} />
          <span>Diagnostic Scan History</span>
        </button>
      </div>

      {/* TAB 1: Order History */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="glass-panel p-10 rounded-3xl text-center space-y-3">
              <ShoppingBag size={32} className="mx-auto text-glow-primary opacity-50" />
              <h4 className="text-sm font-bold text-gray-800 dark:text-white">No Orders Placed Yet</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Explore our catalog of dermatologically validated formulations to place your first luxury order.
              </p>
              <Link to="/shop" className="inline-block btn-glow text-white text-xs font-bold px-6 py-2 rounded-full shadow-glow">
                Explore Shop
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div 
                key={order.id}
                className="p-5 rounded-3xl bg-white dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs">
                    <strong className="text-gray-900 dark:text-white font-mono">{order.order_number}</strong>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{order.created_at}</span>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                    {order.items?.length} items • <strong className="text-glow-primary">₹{order.total_amount.toFixed(2)}</strong> via {order.payment_method}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                    order.order_status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-pink-100 text-glow-primary'
                  }`}>
                    {order.order_status}
                  </span>

                  <button
                    onClick={() => setSelectedTrackingOrder(order)}
                    className="flex items-center gap-1 text-xs font-bold px-4 py-2 rounded-xl border border-pink-200 dark:border-pink-900/60 text-gray-700 dark:text-gray-200 hover:bg-pink-50"
                  >
                    <Truck size={14} />
                    <span>Track</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: Scan History */}
      {activeTab === 'scans' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl glass-panel border border-pink-200 dark:border-pink-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Active Diagnostic Baseline</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Current Barrier Health: <strong>{currentScan?.analysis?.health_score || 86}/100</strong> • Complexion: <strong>{currentScan?.analysis?.skin_tone || 'Light'}</strong>
              </p>
            </div>
            <Link
              to="/scan"
              className="btn-glow text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-glow"
            >
              Open Active Scan Dossier
            </Link>
          </div>
        </div>
      )}

      {/* Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={Boolean(selectedTrackingOrder)}
        onClose={() => setSelectedTrackingOrder(null)}
        order={selectedTrackingOrder}
      />

    </div>
  );
};

export default ProfilePage;
