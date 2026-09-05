import React, { useState } from 'react';
import { Sparkles, RefreshCw, ShoppingBag, ArrowRight } from 'lucide-react';
import FaceScanner from '../components/FaceScanner';
import SkinGauges from '../components/SkinGauges';
import RoutineCard from '../components/RoutineCard';
import DietPlanView from '../components/DietPlanView';
import ProductCard from '../components/ProductCard';
import { useScan } from '../context/ScanContext';

const ScanPage = () => {
  const { currentScan, setCurrentScan, hasCompletedScan, loadingScans } = useScan();
  const [activeTab, setActiveTab] = useState('dossier'); // 'dossier', 'routine', 'diet', 'products'
  const [isScanningNew, setIsScanningNew] = useState(false);

  const handleScanComplete = (scanResult) => {
    setCurrentScan(scanResult);
    setIsScanningNew(false);
  };

  const handleResetScan = () => {
    setIsScanningNew(true);
  };

  if (loadingScans) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-10 h-10 border-3 border-glow-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-gray-500 font-semibold">Loading clinical diagnostic profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* If no scan done yet, or user clicked Perform New Scan, display FaceScanner */}
      {(!currentScan || isScanningNew) ? (
        <div className="space-y-6">
          {currentScan && (
            <div className="flex items-center justify-between p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/40 text-xs">
              <span className="text-gray-600 dark:text-gray-300">
                You are performing a new facial scan. Your previous results remain securely archived in your account.
              </span>
              <button
                onClick={() => setIsScanningNew(false)}
                className="font-bold text-glow-primary hover:underline ml-4 whitespace-nowrap"
              >
                ← Back to Active Dossier
              </button>
            </div>
          )}
          <FaceScanner onScanComplete={handleScanComplete} />
        </div>
      ) : (
        /* If scan result exists, display Complete Interactive Diagnostic Dashboard */
        <div className="space-y-8 animate-fadeIn">
          
          {/* Top Diagnostic Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-gradient-to-r from-glow-primary via-pink-500 to-glow-accent text-white shadow-glow">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-pink-100 flex items-center gap-1.5">
                <Sparkles size={14} /> Diagnostic Result Finalized
              </span>
              <h2 className="text-2xl font-bold mt-1">
                {currentScan.analysis?.skin_type} Skin Profile ({currentScan.analysis?.health_score}/100)
              </h2>
              <p className="text-xs text-pink-100 max-w-md mt-0.5">
                Targeting: {currentScan.analysis?.concerns?.slice(0, 3).join(', ')}
              </p>
            </div>

            {hasCompletedScan && (
              <button
                onClick={handleResetScan}
                className="px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold transition-all flex items-center gap-2 self-start sm:self-auto border border-white/30 shadow-sm"
              >
                <RefreshCw size={14} />
                <span>Perform New Scan</span>
              </button>
            )}
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex border-b border-pink-100 dark:border-pink-950/50 space-x-2 sm:space-x-8 overflow-x-auto scrollbar-none text-xs font-bold">
            <button
              onClick={() => setActiveTab('dossier')}
              className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'dossier'
                  ? 'border-glow-primary text-glow-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <span>Dermal Diagnostic Dossier</span>
            </button>

            <button
              onClick={() => setActiveTab('routine')}
              className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'routine'
                  ? 'border-glow-primary text-glow-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <span>Personalized Routine</span>
            </button>

            <button
              onClick={() => setActiveTab('diet')}
              className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'diet'
                  ? 'border-glow-primary text-glow-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <span>4-Week Diet & Nutrition</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`pb-3 px-2 border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-glow-primary text-glow-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <span>Matched Formulations</span>
            </button>
          </div>

          {/* TAB CONTENT 1: Dossier */}
          {activeTab === 'dossier' && (
            <div className="space-y-8">
              <SkinGauges scanData={currentScan} />
              
              {/* Routine teaser below dossier */}
              <div className="p-6 rounded-3xl glass-panel border border-pink-200 dark:border-pink-900/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                    Step-by-Step Regimen Generated
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Morning, Night, and Weekly application sequence formulated for your barrier.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('routine')}
                  className="btn-glow text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-glow flex items-center gap-2"
                >
                  <span>View Full Routine</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: Routine */}
          {activeTab === 'routine' && (
            <RoutineCard routine={currentScan.routine} />
          )}

          {/* TAB CONTENT 3: Diet Plan */}
          {activeTab === 'diet' && (
            <DietPlanView dietPlan={currentScan.diet_plan} />
          )}

          {/* TAB CONTENT 4: Matched Products */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-glow-primary uppercase tracking-wider">
                    Highest Match Scores
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    Formulations Calibrated for Your Skin
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
                {currentScan.top_recommendations?.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default ScanPage;
