import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Droplets, 
  Flame, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  Download, 
  Share2, 
  ExternalLink,
  Target,
  Zap,
  Info
} from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const SkinGauges = ({ scanData }) => {
  const [showSpotOverlay, setShowSpotOverlay] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!scanData || !scanData.analysis) return null;
  const { analysis, image_url } = scanData;
  const resolvedImageUrl = image_url 
    ? (image_url.startsWith('http') || image_url.startsWith('data:') 
        ? image_url 
        : (import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}${image_url}` : image_url))
    : '/logo.jpg';

  // Circular Score circumference
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (analysis.health_score / 100) * circumference;

  // Hydration status mapping
  const hydrationColor = 
    analysis.hydration_level === 'High' ? 'text-blue-500' :
    analysis.hydration_level === 'Medium' ? 'text-teal-500' : 'text-amber-500';

  // Acne color mapping
  const acneColor = 
    analysis.acne_severity === 'Clear' ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300' :
    analysis.acne_severity === 'Mild' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300' :
    analysis.acne_severity === 'Moderate' ? 'bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300' :
    'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300';

  // Export PDF function
  const handleDownloadPDF = async () => {
    setIsExporting(true);
    const reportElement = document.getElementById('glowaura-diagnostic-report');
    if (!reportElement) {
      setIsExporting(false);
      return;
    }

    try {
      const canvas = await html2canvas(reportElement, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`GlowAura_Skin_Diagnostic_${analysis.skin_type}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  // Share report link
  const handleShareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'GlowAura AI Skin Health Report',
        text: `My skin health score is ${analysis.health_score}/100 with ${analysis.skin_type} skin! Check out GlowAura AI.`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <div id="glowaura-diagnostic-report" className="space-y-6 animate-fadeIn">
      
      {/* Header Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-pink-200 dark:border-pink-900/40 shadow-sm">
        <div>
          <span className="text-xs font-bold text-glow-primary uppercase tracking-wider">
            Diagnostic Dossier #{scanData.scan_id || '9821'}
          </span>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            AI Dermal Analysis Overview
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShareReport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border border-pink-200 dark:border-pink-900/60 text-gray-700 dark:text-gray-200 hover:bg-pink-50 dark:hover:bg-white/5 transition-colors"
          >
            <Share2 size={14} />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
          
          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-1.5 btn-glow text-white text-xs font-bold px-4 py-2 rounded-xl shadow-glow hover:scale-105 transition-all"
          >
            <Download size={14} />
            <span>{isExporting ? 'Generating PDF...' : 'Download Clinical PDF'}</span>
          </button>
        </div>
      </div>

      {/* Main Gauges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Face Photo with Spot Heatmap Marker Overlay */}
        <div className="glass-panel p-5 rounded-3xl border border-pink-200 dark:border-pink-900/40 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="w-full flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
              <Target size={14} className="text-glow-primary" /> Visual Scan Map
            </span>
            <button
              onClick={() => setShowSpotOverlay(!showSpotOverlay)}
              className="text-[11px] text-glow-primary font-semibold hover:underline"
            >
              {showSpotOverlay ? 'Hide Markers' : 'Show Markers'}
            </button>
          </div>

          <div className="relative w-60 h-60 rounded-2xl overflow-hidden border-2 border-pink-200 dark:border-pink-900/60 shadow-md">
            <img 
              src={resolvedImageUrl} 
              alt="Scan Diagnostic" 
              className="w-full h-full object-cover"
            />

            {/* Glowing spot markers */}
            {showSpotOverlay && analysis.detected_spots && analysis.detected_spots.map((spot, idx) => (
              <div
                key={idx}
                className="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                  width: `${Math.max(16, spot.radius * 2.5)}px`,
                  height: `${Math.max(16, spot.radius * 2.5)}px`,
                  border: '2px solid #FF5E9C',
                  backgroundColor: 'rgba(255, 94, 156, 0.35)',
                  boxShadow: '0 0 10px rgba(255, 94, 156, 0.8)',
                  animation: 'pulse 2s infinite'
                }}
              />
            ))}
          </div>

          <div className="w-full mt-4 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Detected Lesions: <strong>{analysis.detected_spots?.length || 0} focal spots</strong></span>
            <span className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
              <ShieldCheck size={14} /> Certified
            </span>
          </div>
        </div>

        {/* Center Column: Circular Health Score & Confidence Meter */}
        <div className="glass-panel p-6 rounded-3xl border border-pink-200 dark:border-pink-900/40 flex flex-col items-center justify-center text-center relative">
          
          <span className="text-xs font-bold uppercase tracking-widest text-glow-primary">
            Overall Health Index
          </span>

          {/* Circular SVG Gauge */}
          <div className="relative w-36 h-36 my-4 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-pink-100 dark:stroke-pink-950/60"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-glow-primary transition-all duration-1000 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-gray-900 dark:text-white">
                {analysis.health_score}
              </span>
              <span className="text-[10px] text-gray-400 uppercase font-semibold">
                out of 100
              </span>
            </div>
          </div>

          {/* Confidence Score Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-900/50 text-xs text-gray-700 dark:text-gray-300">
            <Sparkles size={13} className="text-glow-primary" />
            <span>Confidence: <strong className="text-glow-primary">{analysis.confidence_score}%</strong></span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 max-w-xs leading-relaxed">
            Composite score weighting epidermal hydration, barrier lipid integrity, pore roughness, and erythema.
          </p>
        </div>

        {/* Right Column: Key Dermal Attributes Cards */}
        <div className="space-y-3 flex flex-col justify-between">
          
          {/* Skin Type */}
          <div className="glass-panel p-3.5 rounded-2xl border border-pink-200 dark:border-pink-900/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Skin Type</span>
              <h4 className="text-sm font-bold text-gray-800 dark:text-white">{analysis.skin_type}</h4>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-glow-secondary/80 text-glow-primary">
              Optimal Match
            </span>
          </div>

          {/* Acne Severity */}
          <div className="glass-panel p-3.5 rounded-2xl border border-pink-200 dark:border-pink-900/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Acne Severity</span>
              <h4 className="text-sm font-bold text-gray-800 dark:text-white">
                {analysis.acne_severity} ({analysis.acne_score}/100)
              </h4>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${acneColor}`}>
              {analysis.acne_severity}
            </span>
          </div>

          {/* Skin Tone & Phototype */}
          <div className="glass-panel p-3.5 rounded-2xl border border-pink-200 dark:border-pink-900/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Complexion (ITA°)</span>
              <h4 className="text-sm font-bold text-gray-800 dark:text-white">{analysis.skin_tone} Tone</h4>
            </div>
            <div className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded-full border border-gray-300 shadow-sm"
                style={{ backgroundColor: analysis.skin_tone_hex }}
              />
              <span className="text-[11px] font-mono font-medium text-gray-500 dark:text-gray-400">
                {analysis.skin_tone_hex}
              </span>
            </div>
          </div>

          {/* Hydration Level */}
          <div className="glass-panel p-3.5 rounded-2xl border border-pink-200 dark:border-pink-900/40 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hydration Level</span>
              <h4 className="text-sm font-bold text-gray-800 dark:text-white">
                {analysis.hydration_level} ({analysis.hydration_score}%)
              </h4>
            </div>
            <div className="flex items-center gap-1 text-xs font-bold text-blue-500">
              <Droplets size={14} />
              <span>{analysis.hydration_level}</span>
            </div>
          </div>

        </div>

      </div>

      {/* Target Skin Concerns Tag Cloud */}
      <div className="glass-panel p-5 rounded-2xl border border-pink-200 dark:border-pink-900/40">
        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-300 mb-3 flex items-center gap-1.5">
          <Zap size={14} className="text-glow-primary" />
          Primary Target Concerns Detected ({analysis.concerns?.length || 0})
        </h4>
        <div className="flex flex-wrap gap-2">
          {analysis.concerns && analysis.concerns.map((concern, idx) => (
            <span 
              key={idx} 
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-glow-dark-surface border border-pink-200 dark:border-pink-900/50 text-gray-800 dark:text-gray-200 flex items-center gap-1.5 shadow-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-glow-primary" />
              {concern}
            </span>
          ))}
        </div>
      </div>

      {/* Explainable AI Rationale Section */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-50 to-pink-100/50 dark:from-pink-950/20 dark:to-purple-950/20 border border-pink-200 dark:border-pink-900/40 space-y-2">
        <div className="flex items-center gap-2 text-glow-primary">
          <Info size={16} />
          <h4 className="text-xs font-bold uppercase tracking-wider">
            Explainable AI Clinical Rationale
          </h4>
        </div>
        <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
          {analysis.summary_text}
        </p>
      </div>

    </div>
  );
};

export default SkinGauges;
