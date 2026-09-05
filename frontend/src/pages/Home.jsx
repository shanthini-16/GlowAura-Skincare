import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Camera, 
  ShoppingBag, 
  Play, 
  CheckCircle2, 
  ShieldCheck, 
  Droplets, 
  Zap, 
  Utensils, 
  ArrowRight, 
  Star,
  Layers,
  Heart
} from 'lucide-react';
import { productsAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import WeatherAlertWidget from '../components/WeatherAlertWidget';
import { useScan } from '../context/ScanContext';

const Home = () => {
  const [bestsellers, setBestsellers] = useState([]);
  const navigate = useNavigate();
  const { setCurrentScan } = useScan();

  useEffect(() => {
    productsAPI.getAll({ sort: 'bestseller' })
      .then(res => {
        if (res.data?.products) {
          setBestsellers(res.data.products.slice(0, 8));
        }
      })
      .catch(() => {});
  }, []);

  const aboutPillars = [
    {
      title: "AI Skin Detection",
      desc: "Deep computer vision analyzes facial erythema, sebum gloss, pores, and melanin distribution in under 3 seconds.",
      icon: Sparkles,
      color: "from-pink-500 to-rose-400"
    },
    {
      title: "Personalized Products",
      desc: "Our dermatological engine matches your unique barrier from a database of clinically proven cult formulations.",
      icon: Layers,
      color: "from-purple-500 to-pink-500"
    },
    {
      title: "Gut-Skin Diet Plans",
      desc: "Structured 4-week clinical nutrition targeting cellular hydration, anti-acne microbiome, and collagen synthesis.",
      icon: Utensils,
      color: "from-amber-500 to-pink-500"
    },
    {
      title: "Expert Formulations",
      desc: "Evidence-based actives including Niacinamide, Retinol, Salicylic Acid, and 5-Ceramide lipid barriers.",
      icon: ShieldCheck,
      color: "from-emerald-500 to-teal-500"
    }
  ];

  const featuresList = [
    { title: "Computer Vision Scan", desc: "Frontal facial landmarking with strict alignment checks." },
    { title: "Skin Type Detection", desc: "Accurately categorizes Oily, Dry, Combination, Sensitive, or Normal." },
    { title: "Acne & Blemish Mapping", desc: "Quantifies papules & pustules with interactive visual heatmap pins." },
    { title: "Skin Tone & ITA°", desc: "Scientific individual typology angle phototype classification." },
    { title: "Hydration Meter", desc: "Measures epidermal moisture reflectance & barrier smoothness." },
    { title: "Target Concerns", desc: "Pinpoints dark circles, redness, pigmentation, and pores." },
    { title: "3-Tier Regimen", desc: "Step-by-step Morning, Night, and Weekly treatment schedule." },
    { title: "4-Week Diet Guide", desc: "Tailored meal plans, hydration goals, and foods to avoid." },
    { title: "Curated Catalog", desc: "Dynamic price filter (₹0-₹5000), brand filters, and comparison." }
  ];

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        
        {/* Animated Background Glowing Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-tr from-pink-300/30 to-glow-primary/20 rounded-full blur-3xl animate-float-slow pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-glow-secondary/40 to-glow-accent/20 rounded-full blur-3xl animate-float-slow [animation-delay:3s] pointer-events-none" />

        {/* Floating skincare bottle decoration left */}
        <div className="hidden lg:block absolute left-8 top-1/3 transform -rotate-12 animate-float-slow pointer-events-none opacity-80">
          <div className="glass-panel p-3 rounded-2xl shadow-glow-sm">
            <img 
              src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=180&q=80" 
              alt="Serum" 
              className="w-24 h-28 object-contain rounded-xl"
            />
            <span className="text-[10px] font-bold text-glow-primary text-center block mt-1">Niacinamide 10%</span>
          </div>
        </div>

        {/* Floating skincare bottle decoration right */}
        <div className="hidden lg:block absolute right-8 top-1/4 transform rotate-12 animate-float-slow [animation-delay:2s] pointer-events-none opacity-80">
          <div className="glass-panel p-3 rounded-2xl shadow-glow-sm">
            <img 
              src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=180&q=80" 
              alt="Ceramides" 
              className="w-24 h-28 object-contain rounded-xl"
            />
            <span className="text-[10px] font-bold text-glow-primary text-center block mt-1">Ceramides 0.3%</span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Tagline Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-pink-200 dark:border-pink-900/60 shadow-sm text-xs font-bold text-glow-primary animate-fadeIn">
            <Sparkles size={14} className="text-glow-primary animate-pulse" />
            <span>AI-Powered Precision Clinical Dermatology</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-bold text-gray-900 dark:text-white tracking-tight leading-[1.15]">
            Reveal Your Natural Glow with{' '}
            <span className="bg-gradient-to-r from-glow-primary via-[#E04884] to-glow-rose-gold bg-clip-text text-transparent">
              GlowAura
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-normal leading-relaxed">
            Scan your face in real time to diagnose skin type, acne severity, hydration, and tone. Receive tailored 3-tier morning/evening regimens, exact product matches, and a 4-week dermatological nutrition plan.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/scan"
              className="btn-glow text-white text-sm sm:text-base font-bold px-8 py-3.5 rounded-full shadow-glow flex items-center gap-2.5 hover:scale-105 transition-all"
            >
              <Camera size={18} />
              <span>Start AI Skin Analysis</span>
            </Link>

            <Link
              to="/shop"
              className="px-8 py-3.5 rounded-full glass-panel border border-pink-200 dark:border-pink-900/60 text-gray-800 dark:text-gray-100 font-bold text-sm sm:text-base hover:bg-pink-50 dark:hover:bg-white/5 transition-all flex items-center gap-2 shadow-sm"
            >
              <ShoppingBag size={18} className="text-glow-primary" />
              <span>Shop Products</span>
            </Link>

            <Link
              to="/scan?mode=demo"
              className="px-6 py-3.5 rounded-full text-glow-primary hover:bg-pink-50 dark:hover:bg-pink-950/20 font-semibold text-sm flex items-center gap-1.5 transition-colors"
            >
              <Play size={16} className="fill-current" />
              <span>1-Click Test Demo</span>
            </Link>
          </div>

          {/* Trust badges row */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-green-500" />
              100% Medical-Grade OpenCV Diagnostics
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-green-500" />
              All Curated Formulations
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-green-500" />
              Zero Comedogenic Contraindications
            </span>
          </div>

        </div>
      </section>

      {/* WEATHER & UV INDEX ALERT BANNER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6">
        <WeatherAlertWidget />
      </section>

      {/* ABOUT GLOWAURA: THE 5 PILLARS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold text-glow-primary uppercase tracking-widest">
            Scientific Foundation
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-gray-900 dark:text-white">
            How GlowAura Transforms Your Skin
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            A comprehensive ecosystem connecting diagnostic artificial intelligence with clinical cosmetic science and cellular nutrition.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {aboutPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="glass-panel p-5 rounded-3xl border border-pink-200 dark:border-pink-900/40 shadow-sm hover:shadow-glow hover:border-pink-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${pillar.color} text-white flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-pink-100 dark:border-pink-950/40 text-[11px] font-bold text-glow-primary flex items-center gap-1">
                  <span>Explore Science</span>
                  <ArrowRight size={12} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9 ADVANCED FEATURES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-pink-50 via-white to-pink-50/50 dark:from-pink-950/20 dark:via-glow-dark-card dark:to-purple-950/20 border border-pink-200 dark:border-pink-900/50 shadow-glow">
          <div className="text-center space-y-2 mb-10">
            <span className="text-xs font-bold text-glow-primary uppercase tracking-widest">
              Engine Capabilities
            </span>
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              Every Diagnostic Dimension Analyzed
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuresList.map((f, i) => (
              <div 
                key={i} 
                className="p-4 rounded-2xl bg-white/80 dark:bg-glow-dark-surface border border-pink-100 dark:border-pink-950/50 shadow-sm flex items-start gap-3.5"
              >
                <div className="w-8 h-8 rounded-xl bg-pink-100 dark:bg-pink-950 text-glow-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={16} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">{f.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 btn-glow text-white text-xs font-bold px-7 py-3 rounded-full shadow-glow hover:scale-105 transition-all"
            >
              <Camera size={16} />
              <span>Launch Diagnostic Scanner Now</span>
            </Link>
          </div>
        </div>
      </section>

      {/* BESTSELLER PRODUCTS CAROUSEL / GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold text-glow-primary uppercase tracking-widest">
              Curated Catalog
            </span>
            <h2 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
              Cult Skincare Formulations
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
              Tested by clinical dermatologists and guaranteed 100% authentic.
            </p>
          </div>

          <Link
            to="/shop"
            className="text-xs font-bold text-glow-primary hover:underline flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Products</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-glow-primary via-pink-500 to-glow-rose-gold text-white text-center space-y-6 shadow-glow relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-3xl sm:text-5xl font-display font-bold">
              Ready to Discover Your Skin's Blueprint?
            </h2>
            <p className="text-pink-100 text-xs sm:text-sm max-w-lg mx-auto">
              Over 25,000 scans completed with 98.4% diagnostic satisfaction. Take your free 30-second AI analysis now.
            </p>
            <div className="pt-4">
              <Link
                to="/scan"
                className="inline-flex items-center gap-2 bg-white text-glow-primary hover:bg-pink-50 font-bold text-sm px-8 py-3.5 rounded-full shadow-lg hover:scale-105 transition-all"
              >
                <Camera size={18} />
                <span>Start Free Analysis</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
