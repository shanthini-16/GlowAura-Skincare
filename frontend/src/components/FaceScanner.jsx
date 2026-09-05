import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, AlertCircle, Sparkles, CheckCircle2, Zap, Play, Eye } from 'lucide-react';
import { scanAPI } from '../services/api';
import { useScan } from '../context/ScanContext';

const FaceScanner = ({ onScanComplete }) => {
  const { setCurrentScan } = useScan();
  const [activeTab, setActiveTab] = useState('camera'); // 'camera', 'upload', 'demo'
  const [imagePreview, setImagePreview] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [errorBanner, setErrorBanner] = useState(null);
  
  // Camera stream state
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const fileInputRef = useRef(null);

  const scanStepsText = [
    "Aligning facial landmarks & focal frame...",
    "Analyzing skin tone & Individual Typology Angle (ITA°)...",
    "Screening for acne comedones & redness distribution...",
    "Measuring surface hydration & epidermal sebum...",
    "Synthesizing 4-week nutritional & product regimen..."
  ];

  // Start webcam
  const startCamera = async () => {
    setErrorBanner(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 720 }, height: { ideal: 720 }, facingMode: 'user' }
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.warn("Camera access denied or unavailable", err);
      setErrorBanner({
        title: "Camera Access Unavailable",
        message: "Please allow camera access or use the Upload Photo / 1-Click Demo options."
      });
      setCameraActive(false);
    }
  };

  // Stop webcam
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => stopCamera();
  }, [activeTab]);

  // Capture photo from video
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 640;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setImagePreview(dataUrl);
    stopCamera();
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setErrorBanner({
        title: "Invalid File Type",
        message: "Please upload an image file (JPG, PNG, WEBP)."
      });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
      setErrorBanner(null);
    };
    reader.readAsDataURL(file);
  };

  // Run AI skin scan
  const executeScan = async (overrideDemo = null) => {
    setErrorBanner(null);
    setIsScanning(true);
    setScanStep(0);

    // Step sequence animation
    const interval = setInterval(() => {
      setScanStep(prev => (prev < scanStepsText.length - 1 ? prev + 1 : prev));
    }, 550);

    try {
      let payload = {};
      if (overrideDemo) {
        payload = { demo_type: overrideDemo };
      } else {
        payload = { image: imagePreview };
      }

      const res = await scanAPI.analyze(payload);
      clearInterval(interval);
      setScanStep(scanStepsText.length - 1);

      if (res.data.success) {
        setCurrentScan(res.data);
        if (onScanComplete) {
          onScanComplete(res.data);
        }
      }
    } catch (err) {
      clearInterval(interval);
      const resp = err.response?.data;
      if (resp && resp.error) {
        setErrorBanner({
          title: resp.error,
          message: resp.message || "Skin analysis could not be completed."
        });
      } else {
        setErrorBanner({
          title: "Analysis Interrupted",
          message: "Unable to process the image. Please verify lighting and try again."
        });
      }
    } finally {
      setIsScanning(false);
    }
  };

  // Retake or reset
  const resetScan = () => {
    setImagePreview(null);
    setErrorBanner(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  return (
    <div className="max-w-3xl mx-auto glass-panel rounded-3xl p-6 sm:p-8 shadow-glow border border-pink-200/80 dark:border-pink-900/40 relative overflow-hidden">
      
      {/* Decorative Glow Blob */}
      <div className="absolute -top-24 -right-24 w-52 h-52 bg-glow-secondary/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-52 h-52 bg-glow-primary/20 rounded-full blur-3xl pointer-events-none" />

      {/* Title & Tabs */}
      <div className="text-center space-y-2 mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-glow-secondary/80 text-glow-primary tracking-wide">
          <Sparkles size={13} /> Optical Computer Vision & AI Diagnostics
        </span>
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-gray-900 dark:text-white">
          AI Precision Skin Scanner
        </h2>
        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
          Capture a selfie, upload a portrait, or test with calibrated diagnostic profiles for instant acne, hydration, and skin tone analysis.
        </p>

        {/* Tab Switcher */}
        <div className="inline-flex p-1 bg-pink-100/70 dark:bg-glow-dark-surface rounded-2xl border border-pink-200 dark:border-pink-900/50 mt-4">
          <button
            onClick={() => { setActiveTab('camera'); resetScan(); }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'camera'
                ? 'bg-white dark:bg-glow-primary text-glow-primary dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-glow-primary'
            }`}
          >
            <Camera size={14} />
            <span>Live Camera</span>
          </button>
          <button
            onClick={() => { setActiveTab('upload'); resetScan(); }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-glow-primary text-glow-primary dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-glow-primary'
            }`}
          >
            <Upload size={14} />
            <span>Upload Photo</span>
          </button>
          <button
            onClick={() => { setActiveTab('demo'); resetScan(); }}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
              activeTab === 'demo'
                ? 'bg-white dark:bg-glow-primary text-glow-primary dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-glow-primary'
            }`}
          >
            <Zap size={14} className="text-yellow-500" />
            <span>1-Click Demos</span>
          </button>
        </div>
      </div>

      {/* Error / Validation Alert Banner */}
      {errorBanner && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-300 flex items-start gap-3 animate-fadeIn">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="font-bold block text-sm">{errorBanner.title}</strong>
            <p className="mt-0.5">{errorBanner.message}</p>
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div className="relative w-full max-w-md mx-auto aspect-square rounded-3xl overflow-hidden bg-black/90 shadow-2xl flex items-center justify-center border-2 border-pink-200 dark:border-pink-900/60">
        
        {/* TAB 1: Camera Stream */}
        {activeTab === 'camera' && !imagePreview && (
          <div className="relative w-full h-full">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover mirror"
            />
            {/* Oval Face Alignment Guide */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-56 h-72 border-2 border-dashed border-pink-400/80 rounded-[50%] shadow-[0_0_20px_rgba(255,94,156,0.3)] animate-pulse" />
              <div className="absolute top-4 text-center bg-black/50 backdrop-blur-sm px-4 py-1.5 rounded-full text-white text-[11px] font-medium">
                Position your face inside the oval
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Upload Mode */}
        {activeTab === 'upload' && !imagePreview && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-full flex flex-col items-center justify-center p-8 text-center cursor-pointer border-2 border-dashed border-pink-300 dark:border-pink-800 rounded-3xl hover:bg-pink-50/10 transition-colors"
          >
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload} 
              accept="image/*" 
              className="hidden" 
            />
            <div className="w-16 h-16 rounded-full bg-pink-500/20 text-glow-primary flex items-center justify-center mb-4 animate-bounce">
              <Upload size={28} />
            </div>
            <h4 className="text-white text-base font-bold">Select Selfie or Portrait</h4>
            <p className="text-gray-400 text-xs mt-1 max-w-xs">
              Drag and drop or browse files. Ensure clear front-facing lighting with natural expression.
            </p>
            <span className="mt-4 px-4 py-2 rounded-full bg-white/10 text-white text-xs font-semibold hover:bg-white/20">
              Browse Photos
            </span>
          </div>
        )}

        {/* TAB 3: Instant 1-Click Demos */}
        {activeTab === 'demo' && !imagePreview && (
          <div className="w-full h-full p-6 flex flex-col justify-center space-y-3.5 bg-gradient-to-br from-pink-950/40 via-purple-950/40 to-black">
            <div className="text-center mb-2">
              <span className="text-xs text-glow-primary font-bold tracking-wider uppercase">Instant Evaluation</span>
              <h4 className="text-white text-sm font-semibold">Select a Diagnostic Test Case</h4>
            </div>

            <button
              onClick={() => executeScan('acne_oily')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-pink-400/30 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-pink-300 group-hover:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping" />
                  Acne-Prone & Oily Profile
                </span>
                <p className="text-[11px] text-gray-300 mt-0.5">Moderate papules, T-zone sebum elevation, pore congestion</p>
              </div>
              <Play size={16} className="text-glow-primary" />
            </button>

            <button
              onClick={() => executeScan('dry_sensitive')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-pink-400/30 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-pink-300 group-hover:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-400" />
                  Dehydrated & Sensitive Profile
                </span>
                <p className="text-[11px] text-gray-300 mt-0.5">Low hydration, cheek erythema, delicate skin barrier</p>
              </div>
              <Play size={16} className="text-glow-primary" />
            </button>

            <button
              onClick={() => executeScan('normal_glow')}
              className="p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-pink-400/30 text-left transition-all group flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-bold text-pink-300 group-hover:text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  Balanced Radiant Glow Profile
                </span>
                <p className="text-[11px] text-gray-300 mt-0.5">Optimal lipid-water equilibrium, high radiance score</p>
              </div>
              <Play size={16} className="text-glow-primary" />
            </button>
          </div>
        )}

        {/* Captured/Uploaded Preview */}
        {imagePreview && (
          <div className="relative w-full h-full">
            <img 
              src={imagePreview} 
              alt="Scan Preview" 
              className="w-full h-full object-cover" 
            />

            {/* Laser Beam Animation during scan */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div 
                  className="w-full h-1.5 bg-gradient-to-r from-transparent via-glow-primary to-transparent shadow-[0_0_15px_#FF5E9C] animate-shimmer"
                  style={{
                    position: 'absolute',
                    animation: 'scan-laser 2s ease-in-out infinite alternate'
                  }}
                />
                <style>{`
                  @keyframes scan-laser {
                    0% { top: 0%; opacity: 0.8; }
                    100% { top: 96%; opacity: 0.8; }
                  }
                `}</style>
              </div>
            )}
          </div>
        )}

        {/* Scanning Step Overlay */}
        {isScanning && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="w-16 h-16 rounded-full border-4 border-glow-secondary border-t-glow-primary animate-spin mb-4" />
            <span className="text-xs font-bold text-glow-primary uppercase tracking-widest">
              AI Diagnostic Matrix
            </span>
            <h4 className="text-white text-sm font-semibold mt-1">
              {scanStepsText[scanStep]}
            </h4>
            <div className="w-48 bg-gray-800 rounded-full h-1.5 mt-4 overflow-hidden">
              <div 
                className="bg-glow-primary h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${((scanStep + 1) / scanStepsText.length) * 100}%` }}
              />
            </div>
          </div>
        )}

      </div>

      {/* Control Buttons */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {activeTab === 'camera' && !imagePreview && (
          <button
            onClick={capturePhoto}
            className="btn-glow text-white font-bold text-sm px-7 py-3 rounded-full shadow-glow flex items-center gap-2 hover:scale-105"
          >
            <Camera size={18} />
            <span>Capture Selfie</span>
          </button>
        )}

        {imagePreview && !isScanning && (
          <>
            <button
              onClick={() => executeScan()}
              className="btn-glow text-white font-bold text-sm px-7 py-3 rounded-full shadow-glow flex items-center gap-2 hover:scale-105"
            >
              <Sparkles size={18} />
              <span>Run Skin Analysis</span>
            </button>
            <button
              onClick={resetScan}
              className="px-5 py-3 rounded-full border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-pink-50 dark:hover:bg-white/5 flex items-center gap-2"
            >
              <RefreshCw size={15} />
              <span>Retake</span>
            </button>
          </>
        )}
      </div>

    </div>
  );
};

export default FaceScanner;
