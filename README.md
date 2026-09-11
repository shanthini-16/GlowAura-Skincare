# GlowAura – AI-Powered Personalized Skincare & Beauty Platform ✨

> An AI-powered skincare and wellness platform featuring computer vision-based skin analysis, personalized skincare routines, nutrition plans, product recommendations, and e-commerce features.
## 🚀 Live Demo

[**Try GlowAura-Skincare Live**](https://glowaura-frontend.onrender.com)
---

## 🌟 Overview

**GlowAura** bridges cutting-edge computer vision with clinical skincare formulations. Users can upload or capture a live selfie to undergo a facial scan that analyzes skin metrics (hydration, oiliness, texture, sensitivity, and acne probability) and generates tailored AM/PM skincare regimens, ingredient suggestions, lifestyle advice, and targeted product recommendations.

---

## 💎 Key Features

- **AI Skin Diagnostics**: Real-time facial scan via MediaPipe / Computer Vision assessing skin health metrics, pore clarity, oil balance, and moisture.
- **Personalized Regimens**: Tailored AM & PM skincare routines matched directly to detected skin types and concerns.
- **Curated Product Store**: Catalog of 52 authentic skincare products across top brands (Plum, Cetaphil, The Ordinary, Minimalist, Dot & Key, Mamaearth, WishCare) with studio packshots optimized for both Light and Dark modes.
- **Smart Filter & Search**: Search by brand, skin concern (Acne, Hydration, Anti-Aging, Radiance), product category, and price range.
- **4-Week Nutritional Diet Plan**: Skin-nourishing meal plans and hydration guides coordinated with skin recovery cycles.
- **Cart & Seamless Checkout**: Full cart management with multi-option payment simulation (UPI, Google Pay, PhonePe, Cards, Net Banking, COD).
- **Session & User Isolation**: Robust JWT authentication ensuring user scan histories and order logs are isolated and private.
- **Admin Dashboard**: Real-time order metrics, customer management, inventory monitoring, and product curation controls.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 (Vite)
- **Routing**: React Router DOM v6
- **Animations & Styling**: Framer Motion, Vanilla CSS3, React Icons (Lucide & Feather icons)
- **State & HTTP**: Axios, Context API, LocalStorage persistence

### Backend & AI
- **Framework**: Flask (Python 3.12)
- **ORM & Database**: Flask-SQLAlchemy, SQLite
- **Security & Auth**: Flask-JWT-Extended, Werkzeug Security
- **Computer Vision & AI**: OpenCV, MediaPipe, NumPy, PIL

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)

---

### 1. Backend Setup

```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
*The backend API will run at `http://127.0.0.1:5000`.*

---

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```
*The client application will run at `http://localhost:5173`.*

---

## 📂 Project Structure

```
glowaura/
├── backend/
│   ├── instance/
│   │   └── glowaura.db          # Pre-seeded database with products and user schemas
│   ├── static/
│   │   └── products/            # Authentic packshot product images
│   ├── app.py                   # Main Flask server & route controllers
│   ├── ai_scanner.py            # Computer Vision & skin analysis algorithms
│   ├── models.py                # SQLAlchemy database models
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── public/
│   │   └── products/            # High-resolution optimized product packshots
│   ├── src/
│   │   ├── assets/              # Logos, banners, vector illustrations
│   │   ├── components/          # Reusable UI components (Navbar, Footer, ProductCard, ThemeToggle)
│   │   ├── context/             # AuthContext, CartContext, ThemeContext
│   │   ├── pages/               # Home, Scan, Shop, ProductDetail, DietPlan, Cart, Checkout, Profile, Admin
│   │   ├── App.jsx              # Main router & theme provider layout
│   │   └── main.jsx             # React DOM entry point
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## 🎨 Theme & Design Philosophy

GlowAura features a luxury soft Pink & White aesthetic inspired by premium beauty leaders:
- **Primary Accent**: `#FF5E9C` / `#E03576`
- **Background**: Soft cream & frosted glass light mode / Deep obsidian dark mode
- **Dynamic Adaptability**: Studio drop shadows and soft gradients ensure light product packaging pops distinctly on dark mode cards.

---

## 📄 License

This project is licensed under the MIT License.
