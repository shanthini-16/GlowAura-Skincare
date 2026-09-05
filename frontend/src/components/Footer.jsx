import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, HeartHandshake, Leaf, Award, Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-white dark:bg-[#120B11] border-t border-pink-100 dark:border-pink-950/60 transition-colors duration-300">
      
      {/* Brand Trust Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-pink-100 dark:border-pink-950/40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-950/10">
            <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 text-glow-primary flex items-center justify-center mb-3">
              <Sparkles size={22} />
            </div>
            <h4 className="text-sm font-bold text-gray-800 dark:text-white">AI Computer Vision</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Multi-spectral dermal & pore analysis</p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-950/10">
            <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 text-glow-primary flex items-center justify-center mb-3">
              <ShieldCheck size={22} />
            </div>
            <h4 className="text-sm font-bold text-gray-800 dark:text-white">Clinical Actives</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">100% verified & safe formulations</p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-950/10">
            <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 text-glow-primary flex items-center justify-center mb-3">
              <Leaf size={22} />
            </div>
            <h4 className="text-sm font-bold text-gray-800 dark:text-white">Clean & Cruelty Free</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Ethical testing & clean ingredients</p>
          </div>

          <div className="flex flex-col items-center p-4 rounded-2xl bg-pink-50/50 dark:bg-pink-950/10">
            <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 text-glow-primary flex items-center justify-center mb-3">
              <Award size={22} />
            </div>
            <h4 className="text-sm font-bold text-gray-800 dark:text-white">Dermatologist Curated</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Precision regimens for radiant skin</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
          
          {/* Brand Identity */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src="/logo.jpg" 
                alt="GlowAura" 
                className="w-10 h-10 rounded-full border border-glow-primary shadow-glow-sm"
              />
              <span className="font-display font-bold text-2xl bg-gradient-to-r from-glow-primary to-glow-rose-gold bg-clip-text text-transparent">
                GlowAura
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 max-w-sm leading-relaxed">
              GlowAura merges high-resolution computer vision face diagnostics with precision dermatological formulations and tailored 4-week nutritional regimens. Reveal your authentic glow.
            </p>
            <div className="pt-2">
              <span className="text-xs font-semibold text-glow-primary uppercase tracking-widest">
                Reveal Your Natural Glow with AI
              </span>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              AI Diagnostics
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/scan" className="hover:text-glow-primary transition-colors">Instant Face Scan</Link></li>
              <li><Link to="/scan" className="hover:text-glow-primary transition-colors">Acne Severity Meter</Link></li>
              <li><Link to="/scan" className="hover:text-glow-primary transition-colors">Skin Tone & ITA°</Link></li>
              <li><Link to="/scan" className="hover:text-glow-primary transition-colors">Hydration Diagnostics</Link></li>
            </ul>
          </div>

          {/* Shop & Regimens */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              E-Commerce
            </h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/shop" className="hover:text-glow-primary transition-colors">All Skincare Products</Link></li>
              <li><Link to="/shop?category=Cleanser" className="hover:text-glow-primary transition-colors">Gentle Cleansers</Link></li>
              <li><Link to="/shop?category=Serum" className="hover:text-glow-primary transition-colors">Treatment Serums</Link></li>
              <li><Link to="/shop?category=Sunscreen" className="hover:text-glow-primary transition-colors">Invisible Sunscreens</Link></li>
              <li><Link to="/diet" className="hover:text-glow-primary transition-colors">4-Week Diet Nutrition</Link></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
              The Glow Journal
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Receive weekly dermatologist ingredient breakdowns, active routine drops, and private member discounts.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-2 text-xs font-semibold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 p-3 rounded-xl border border-green-200 dark:border-green-900/40">
                <CheckCircle2 size={16} />
                <span>You're subscribed to GlowAura VIP!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-pink-200 dark:border-pink-900/60 bg-pink-50/50 dark:bg-glow-dark-surface focus:outline-none focus:ring-2 focus:ring-glow-primary"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-glow-primary text-white rounded-lg text-xs font-semibold hover:bg-glow-primary-dark transition-colors flex items-center"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>
                <span className="text-[10px] text-gray-400 block">No spam. Only evidence-based skincare science.</span>
              </form>
            )}
          </div>

        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-pink-100 dark:border-pink-950/40 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 dark:text-gray-400 gap-4">
          <p>© {new Date().getFullYear()} GlowAura Inc. All rights reserved. Powered by Deep Computer Vision & AI.</p>
          <div className="flex space-x-6">
            <span className="hover:underline cursor-pointer">Clinical Privacy</span>
            <span className="hover:underline cursor-pointer">Terms of Diagnostic Service</span>
            <span className="hover:underline cursor-pointer">Security Standards</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
