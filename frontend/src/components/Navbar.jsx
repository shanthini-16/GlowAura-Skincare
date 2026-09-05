import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  ShoppingBag, 
  Heart, 
  User as UserIcon, 
  Moon, 
  Sun, 
  Camera, 
  Menu, 
  X, 
  LogOut,
  Utensils
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const { user, logout, openAuthModal } = useAuth();
  const { totalItemsCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { darkMode, toggleDarkMode } = useTheme();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'AI Face Scan', path: '/scan', icon: Sparkles, highlight: true },
    { name: 'Shop Products', path: '/shop' },
    { name: 'Diet Plan', path: '/diet', icon: Utensils }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 glass-nav transition-all duration-300">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-glow-primary via-pink-400 to-glow-accent text-white text-xs py-1.5 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2 shadow-sm">
        <Sparkles size={13} className="animate-spin" style={{ animationDuration: '4s' }} />
        <span>Use code <strong>GLOW20</strong> for 20% off | Free Luxury Delivery above ₹999</span>
        <Sparkles size={13} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-glow-primary to-glow-secondary shadow-glow-sm group-hover:scale-105 transition-transform duration-300">
              <img 
                src="/logo.jpg" 
                alt="GlowAura Logo" 
                className="w-full h-full object-cover rounded-full bg-white"
              />
            </div>
            <div>
              <span className="font-display font-bold text-2xl tracking-tight bg-gradient-to-r from-glow-primary via-[#E04884] to-glow-rose-gold bg-clip-text text-transparent">
                GlowAura
              </span>
              <p className="text-[10px] tracking-wider uppercase font-semibold text-gray-500 dark:text-gray-400 -mt-1 hidden sm:block">
                Reveal Your Natural Glow
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                    isActive(link.path)
                      ? 'bg-glow-secondary/60 text-glow-primary dark:bg-glow-primary/20 dark:text-pink-300 font-semibold shadow-sm'
                      : link.highlight
                      ? 'text-glow-primary hover:bg-glow-secondary/30 font-semibold'
                      : 'text-gray-700 dark:text-gray-200 hover:text-glow-primary hover:bg-glow-secondary/20 dark:hover:bg-white/5'
                  }`}
                >
                  {Icon && <Icon size={15} className={link.highlight ? 'text-glow-primary animate-pulse' : ''} />}
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons & CTAs */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Theme"
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors"
            >
              {darkMode ? <Sun size={19} className="text-yellow-400" /> : <Moon size={19} />}
            </button>

            {/* Wishlist Link */}
            <Link
              to="/shop?wishlist=true"
              className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors"
              title="Wishlist"
            >
              <Heart size={20} className={wishlistCount > 0 ? "fill-glow-primary text-glow-primary" : ""} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-glow-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-scale">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-800 transition-colors"
              title="Shopping Cart"
            >
              <ShoppingBag size={20} />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-glow-primary text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth Button */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-full border border-pink-200 dark:border-pink-900/40 hover:shadow-sm"
                  >
                    <img 
                      src={user.avatar} 
                      alt={user.full_name} 
                      className="w-7 h-7 rounded-full object-cover border border-glow-primary"
                    />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 hidden md:block max-w-[80px] truncate">
                      {user.full_name.split(' ')[0]}
                    </span>
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-52 glass-panel rounded-2xl shadow-xl py-2 z-50 animate-fadeIn"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-pink-100 dark:border-pink-950/50">
                        <p className="text-xs text-gray-500 dark:text-gray-400">Signed in as</p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user.email}</p>
                        {user.skin_type && (
                          <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full bg-glow-secondary/80 text-glow-primary font-semibold">
                            {user.skin_type} Skin
                          </span>
                        )}
                      </div>
                      <Link to="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-white/5">
                        <UserIcon size={16} className="text-glow-primary" /> My Profile & History
                      </Link>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 text-left border-t border-pink-100 dark:border-pink-950/50 mt-1"
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-xs font-semibold px-3.5 py-2 rounded-full border border-glow-primary text-glow-primary hover:bg-glow-primary hover:text-white transition-all duration-200 shadow-sm"
                >
                  Sign In
                </button>
              )}
            </div>

            {/* Quick Action Button */}
            <Link
              to="/scan"
              className="hidden sm:inline-flex items-center gap-1.5 btn-glow text-white text-xs font-semibold px-4 py-2 rounded-full shadow-glow-sm hover:scale-105 transition-all"
            >
              <Camera size={14} />
              <span>Analyze Skin</span>
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-pink-50 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-pink-100 dark:border-pink-950/50 px-4 pt-3 pb-6 space-y-2 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2.5 rounded-xl text-sm font-medium ${
                isActive(link.path)
                  ? 'bg-glow-primary text-white font-bold'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-white/5'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              to="/scan"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 btn-glow text-white font-semibold py-3 rounded-xl shadow-glow text-sm"
            >
              <Camera size={16} /> Start AI Face Scan
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
