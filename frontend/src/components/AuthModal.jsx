import React, { useState } from 'react';
import { X, Mail, Lock, User, Phone, Sparkles, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

const AuthModal = () => {
  const { isAuthModalOpen, closeAuthModal, authModalTab, openAuthModal, loginUser } = useAuth();
  
  const [tab, setTab] = useState(authModalTab || 'login'); // 'login', 'register', 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login({ email, password });
      loginUser(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.register({
        email,
        password,
        full_name: fullName,
        phone
      });
      loginUser(res.data.token, res.data.user);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpLogin = async (e) => {
    e.preventDefault();
    if (!otpSent) {
      if (!phone.trim()) {
        setError('Please enter your phone number.');
        return;
      }
      setOtpSent(true);
      setError('');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.otpLogin({ phone, otp: otpCode });
      loginUser(res.data.token, res.data.user);
    } catch (err) {
      setError('Invalid OTP code. Try 1234.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await authAPI.googleLogin({
        email: 'google_user@gmail.com',
        full_name: 'Google Skincare Member'
      });
      loginUser(res.data.token, res.data.user);
    } catch (err) {
      setError('Google Sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemoUser = () => {
    setEmail('demo@glowaura.com');
    setPassword('glow123');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-glow-dark-card rounded-3xl p-6 sm:p-8 shadow-2xl border border-pink-200 dark:border-pink-900/60">
        
        {/* Close */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Logo & Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 mx-auto rounded-full overflow-hidden p-0.5 bg-gradient-to-tr from-glow-primary to-glow-secondary shadow-glow-sm">
            <img src="/logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-full" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {tab === 'login' && 'Welcome to GlowAura'}
            {tab === 'register' && 'Join the Glow Revolution'}
            {tab === 'otp' && 'Fast OTP Verification'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Access your personalized skin health dossiers and tailored regimens.
          </p>

          {/* Quick Tab Switcher */}
          <div className="flex justify-center gap-2 pt-2">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                tab === 'login' ? 'bg-glow-primary text-white' : 'text-gray-500 hover:text-glow-primary'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); }}
              className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                tab === 'register' ? 'bg-glow-primary text-white' : 'text-gray-500 hover:text-glow-primary'
              }`}
            >
              Register
            </button>
            <button
              onClick={() => { setTab('otp'); setError(''); }}
              className={`text-xs font-bold px-3 py-1 rounded-full transition-all ${
                tab === 'otp' ? 'bg-glow-primary text-white' : 'text-gray-500 hover:text-glow-primary'
              }`}
            >
              Phone OTP
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {/* TAB: LOGIN */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 pl-9 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface focus:outline-none focus:ring-2 focus:ring-glow-primary"
                />
                <Mail size={15} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pl-9 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface focus:outline-none focus:ring-2 focus:ring-glow-primary"
                />
                <Lock size={15} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Quick Demo Autofill helper */}
            <div className="flex items-center justify-start text-[11px] pt-1">
              <button
                type="button"
                onClick={autofillDemoUser}
                className="text-glow-primary hover:underline font-semibold"
              >
                Autofill Demo User
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-glow text-white font-bold py-3 rounded-xl shadow-glow text-xs flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
            >
              {loading ? 'Authenticating...' : 'Sign In to GlowAura'}
            </button>
          </form>
        )}

        {/* TAB: REGISTER */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Aarohi Patel"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 pl-9 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface focus:outline-none focus:ring-2 focus:ring-glow-primary"
                />
                <User size={15} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 pl-9 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface focus:outline-none focus:ring-2 focus:ring-glow-primary"
                />
                <Mail size={15} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Phone</label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 pl-9 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface focus:outline-none focus:ring-2 focus:ring-glow-primary"
                />
                <Phone size={15} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Password</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Min 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2.5 pl-9 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface focus:outline-none focus:ring-2 focus:ring-glow-primary"
                />
                <Lock size={15} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-glow text-white font-bold py-3 rounded-xl shadow-glow text-xs flex items-center justify-center gap-2 hover:scale-[1.01] transition-transform"
            >
              {loading ? 'Creating Profile...' : 'Create Account'}
            </button>
          </form>
        )}

        {/* TAB: OTP LOGIN */}
        {tab === 'otp' && (
          <form onSubmit={handleOtpLogin} className="space-y-3.5 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-gray-700 dark:text-gray-300">Mobile Phone Number</label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 pl-9 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface focus:outline-none focus:ring-2 focus:ring-glow-primary"
                />
                <Phone size={15} className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {otpSent && (
              <div className="space-y-1 animate-fadeIn">
                <div className="flex justify-between">
                  <label className="font-bold text-gray-700 dark:text-gray-300">Enter 4-Digit OTP</label>
                  <span className="text-[10px] text-green-600 font-bold">Demo OTP: 1234</span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  placeholder="1234"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono px-3 py-2 rounded-xl border border-pink-200 dark:border-pink-900/60 bg-white dark:bg-glow-dark-surface"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-glow text-white font-bold py-3 rounded-xl shadow-glow text-xs flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying...' : otpSent ? 'Verify OTP & Enter' : 'Send One-Time Passcode'}
            </button>
          </form>
        )}

        {/* Alternative: Google Login */}
        <div className="mt-5 pt-4 border-t border-pink-100 dark:border-pink-950/40 text-center">
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-glow-dark-surface hover:bg-gray-50 text-gray-700 dark:text-gray-200 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>Continue with Google</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default AuthModal;
