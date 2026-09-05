import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { ScanProvider } from './context/ScanContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';
import GlowBotModal from './components/GlowBotModal';

// Pages
import Home from './pages/Home';
import ScanPage from './pages/ScanPage';
import ShopPage from './pages/ShopPage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import ProfilePage from './pages/ProfilePage';
import DietPage from './pages/DietPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <ScanProvider>
              <Router>
                <div className="min-h-screen flex flex-col bg-[#FFF9FC] dark:bg-[#0F090E] text-gray-800 dark:text-gray-100 transition-colors duration-300 font-sans">
                  
                  {/* Glassmorphic Navbar */}
                  <Navbar />

                  {/* Main Routed Page Content */}
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/scan" element={<ScanPage />} />
                      <Route path="/shop" element={<ShopPage />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/checkout" element={<CheckoutPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/diet" element={<DietPage />} />
                    </Routes>
                  </main>

                  {/* Slide-out Cart Drawer */}
                  <CartDrawer />

                  {/* Authentication Modal */}
                  <AuthModal />

                  {/* Floating AI Skincare Concierge & Voice Assistant */}
                  <GlowBotModal />

                  {/* Luxury Footer */}
                  <Footer />

                </div>
              </Router>
            </ScanProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
