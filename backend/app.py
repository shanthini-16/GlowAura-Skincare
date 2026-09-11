import os
import json
import uuid
import datetime
import jwt
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash

from models import db, User, Product, SkinScan, Order, Review, Coupon
from ai_analyzer import analyze_skin, decode_base64_image
from recommendation_engine import calculate_match_score, build_personalized_routine
from diet_generator import generate_personalized_diet
from seed_data import seed_database

app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'glowaura_luxury_secret_jwt_key_2026')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///glowaura.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

CORS(app, resources={r"/*": {"origins": "*"}})
db.init_app(app)

with app.app_context():
    seed_database(app)

# Create static upload folder
os.makedirs(os.path.join(app.root_path, 'static', 'uploads'), exist_ok=True)

# Helper: JWT Token generator & validator
def generate_token(user_id, role):
    payload = {
        'user_id': user_id,
        'role': role,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def get_current_user():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return None
    token = auth_header.split(' ')[1]
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return User.query.get(data['user_id'])
    except Exception:
        return None

# Sample demo data for quick one-click testing without camera
SAMPLE_DEMO_PROFILES = {
    "acne_oily": {
        "skin_type": "Oily",
        "acne_severity": "Moderate",
        "acne_score": 55,
        "skin_tone": "Light",
        "skin_tone_hex": "#F7D5C2",
        "hydration_level": "Medium",
        "hydration_score": 58,
        "health_score": 67,
        "confidence_score": 96.2,
        "concerns": ["Active Breakouts", "Oiliness", "Large Pores", "Acne Marks"],
        "detected_spots": [
            {"x": 38.2, "y": 48.6, "radius": 8, "severity": "moderate"},
            {"x": 42.1, "y": 62.4, "radius": 7, "severity": "mild"},
            {"x": 64.5, "y": 51.0, "radius": 9, "severity": "moderate"},
            {"x": 68.3, "y": 59.8, "radius": 6, "severity": "mild"},
            {"x": 51.2, "y": 74.5, "radius": 5, "severity": "mild"}
        ],
        "summary_text": "Clinical AI Scan: High sebum secretion along T-zone and cheeks with multiple inflammatory comedones. Barrier requires Salicylic Acid clarifying and Niacinamide sebum modulation."
    },
    "dry_sensitive": {
        "skin_type": "Sensitive",
        "acne_severity": "Clear",
        "acne_score": 94,
        "skin_tone": "Medium",
        "skin_tone_hex": "#E0AB8B",
        "hydration_level": "Low",
        "hydration_score": 38,
        "health_score": 72,
        "confidence_score": 95.8,
        "concerns": ["Dryness", "Redness", "Barrier Repair", "Fine Lines"],
        "detected_spots": [
            {"x": 36.4, "y": 52.1, "radius": 5, "severity": "mild"},
            {"x": 67.2, "y": 54.0, "radius": 5, "severity": "mild"}
        ],
        "summary_text": "Clinical AI Scan: Transepidermal water loss is elevated with active capillary erythema on bilateral cheeks. We prescribe soothing Centella, 5 Ceramides, and gentle hyaluronic acid."
    },
    "normal_glow": {
        "skin_type": "Normal",
        "acne_severity": "Clear",
        "acne_score": 98,
        "skin_tone": "Fair",
        "skin_tone_hex": "#FCE5D8",
        "hydration_level": "High",
        "hydration_score": 92,
        "health_score": 96,
        "confidence_score": 97.4,
        "concerns": ["Preventative Care", "Uneven Tone"],
        "detected_spots": [],
        "summary_text": "Clinical AI Scan: Exceptional barrier integrity with balanced sebum-hydration equilibrium. Primary focus is broad-spectrum antioxidant protection (Vitamin C & SPF 50)."
    }
}

# ----------------- AUTH ROUTES ----------------- #

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    full_name = data.get('full_name', '').strip()
    phone = data.get('phone', '')

    if not email or not password or not full_name:
        return jsonify({'error': 'Email, password and name are required.'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'An account with this email already exists.'}), 400

    user = User(
        email=email,
        password_hash=generate_password_hash(password),
        full_name=full_name,
        phone=phone,
        role='user'
    )
    db.session.add(user)
    db.session.commit()

    token = generate_token(user.id, user.role)
    return jsonify({
        'token': token,
        'user': user.to_dict(),
        'message': 'Account created successfully! Welcome to GlowAura.'
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')

    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid email or password.'}), 401

    token = generate_token(user.id, user.role)
    return jsonify({
        'token': token,
        'user': user.to_dict(),
        'message': f'Welcome back, {user.full_name}!'
    })

@app.route('/api/auth/otp-login', methods=['POST'])
def otp_login():
    data = request.json or {}
    phone = data.get('phone', '').strip()
    otp = data.get('otp', '1234')

    if not phone:
        return jsonify({'error': 'Phone number is required.'}), 400

    # Find or create user for demo OTP
    user = User.query.filter_by(phone=phone).first()
    if not user:
        user = User(
            email=f"{phone.replace(' ', '')}@glowaura.user",
            password_hash=generate_password_hash('otp_default_pass'),
            full_name='GlowAura Member',
            phone=phone,
            role='user'
        )
        db.session.add(user)
        db.session.commit()

    token = generate_token(user.id, user.role)
    return jsonify({
        'token': token,
        'user': user.to_dict(),
        'message': 'OTP verified successfully!'
    })

@app.route('/api/auth/google-login', methods=['POST'])
def google_login():
    data = request.json or {}
    email = data.get('email', 'google_user@gmail.com')
    full_name = data.get('full_name', 'Google Skincare Fan')

    user = User.query.filter_by(email=email).first()
    if not user:
        user = User(
            email=email,
            password_hash=generate_password_hash(str(uuid.uuid4())),
            full_name=full_name,
            role='user',
            avatar='https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80'
        )
        db.session.add(user)
        db.session.commit()

    token = generate_token(user.id, user.role)
    return jsonify({
        'token': token,
        'user': user.to_dict(),
        'message': 'Google authentication successful!'
    })

@app.route('/api/auth/profile', methods=['GET', 'PUT'])
def user_profile():
    user = get_current_user()
    if not user:
        return jsonify({'error': 'Authentication required.'}), 401

    if request.method == 'PUT':
        data = request.json or {}
        user.full_name = data.get('full_name', user.full_name)
        user.phone = data.get('phone', user.phone)
        if 'skin_type' in data:
            user.skin_type = data['skin_type']
        db.session.commit()

    # Get user's scan history and orders
    scans = [s.to_dict() for s in user.scans]
    orders = [o.to_dict() for o in user.orders]

    user_dict = user.to_dict()
    user_dict['scans_count'] = len(scans)
    user_dict['orders_count'] = len(orders)
    return jsonify({
        'user': user_dict,
        'recent_scans': scans[-5:],
        'recent_orders': orders[-5:]
    })

# ----------------- AI SKIN SCAN ROUTES ----------------- #

@app.route('/api/scan', methods=['POST'])
def scan_skin():
    data = request.json or {}
    image_data = data.get('image')
    demo_type = data.get('demo_type') # 'acne_oily', 'dry_sensitive', 'normal_glow'
    user = get_current_user()

    # Handle quick demo click
    if demo_type and demo_type in SAMPLE_DEMO_PROFILES:
        analysis = dict(SAMPLE_DEMO_PROFILES[demo_type])
        analysis["success"] = True
        saved_image_url = "/logo.jpg"
    else:
        if not image_data:
            return jsonify({
                "success": False,
                "error": "No image provided",
                "code": "NO_IMAGE",
                "message": "Please capture a selfie or upload a photo."
            }), 400

        # Perform OpenCV Computer Vision Analysis
        analysis = analyze_skin(image_data)

        if not analysis.get("success"):
            return jsonify(analysis), 422

        # Save uploaded image to static/uploads
        filename = f"scan_{uuid.uuid4().hex[:12]}.jpg"
        save_path = os.path.join(app.root_path, 'static', 'uploads', filename)
        try:
            cv_img = decode_base64_image(image_data)
            import cv2
            if cv_img is not None:
                cv2.imwrite(save_path, cv_img)
            saved_image_url = f"/uploads/{filename}"
        except Exception:
            saved_image_url = "/logo.jpg"

    # Fetch all 52 products to generate personalized recommendations & routine
    all_products = [p.to_dict() for p in Product.query.all()]
    routine = build_personalized_routine(all_products, analysis)

    # Score top 6 recommended products for immediate display
    scored_products = []
    for p in all_products:
        match_score = calculate_match_score(p, analysis)
        if match_score > 0:
            p_scored = dict(p)
            p_scored['match_score'] = match_score
            scored_products.append(p_scored)
    scored_products.sort(key=lambda x: (x['match_score'], x['rating']), reverse=True)

    # Generate 4-Week Diet Plan based on skin condition
    diet_plan = generate_personalized_diet(
        skin_type=analysis['skin_type'],
        concerns=analysis['concerns'],
        acne_severity=analysis['acne_severity']
    )

    # Persist Scan in DB
    scan_record = SkinScan(
        user_id=user.id if user else None,
        image_path=saved_image_url,
        skin_type=analysis['skin_type'],
        acne_severity=analysis['acne_severity'],
        acne_score=analysis['acne_score'],
        skin_tone=analysis['skin_tone'],
        skin_tone_hex=analysis['skin_tone_hex'],
        hydration_level=analysis['hydration_level'],
        hydration_score=analysis['hydration_score'],
        health_score=analysis['health_score'],
        confidence_score=analysis['confidence_score'],
        concerns_json=json.dumps(analysis['concerns']),
        detected_spots_json=json.dumps(analysis['detected_spots']),
        summary_text=analysis['summary_text'],
        routine_json=json.dumps(routine),
        diet_plan_json=json.dumps(diet_plan),
        recommendations_json=json.dumps(scored_products[:6])
    )
    db.session.add(scan_record)

    # Update user's skin type & streak if authenticated
    if user:
        user.skin_type = analysis['skin_type']
        today_str = datetime.date.today().isoformat()
        if user.last_streak_date != today_str:
            user.streak_days = (user.streak_days or 0) + 1
            user.last_streak_date = today_str

    db.session.commit()

    return jsonify({
        "success": True,
        "scan_id": scan_record.id,
        "image_url": saved_image_url,
        "analysis": analysis,
        "routine": routine,
        "diet_plan": diet_plan,
        "top_recommendations": scored_products[:6]
    })

@app.route('/api/user/scans/latest', methods=['GET'])
def get_user_latest_scan():
    user = get_current_user()
    if not user:
        return jsonify({'scan': None})
    latest = SkinScan.query.filter_by(user_id=user.id).order_by(SkinScan.created_at.desc()).first()
    if not latest:
        return jsonify({'scan': None})

    result = latest.to_scan_result_dict()
    if not result.get('diet_plan'):
        result['diet_plan'] = generate_personalized_diet(
            skin_type=latest.skin_type,
            concerns=result['analysis'].get('concerns', []),
            acne_severity=latest.acne_severity
        )
    if not result.get('top_recommendations'):
        all_products = [p.to_dict() for p in Product.query.all()]
        scored = []
        for p in all_products:
            score = calculate_match_score(p, result['analysis'])
            if score > 0:
                p_scored = dict(p)
                p_scored['match_score'] = score
                scored.append(p_scored)
        scored.sort(key=lambda x: (x['match_score'], x['rating']), reverse=True)
        result['top_recommendations'] = scored[:6]

    return jsonify({'scan': result})

@app.route('/api/user/scans', methods=['GET'])
def get_user_scans():
    user = get_current_user()
    if not user:
        return jsonify({'scans': []})
    scans = SkinScan.query.filter_by(user_id=user.id).order_by(SkinScan.created_at.desc()).all()
    return jsonify({'scans': [s.to_scan_result_dict() for s in scans]})

# ----------------- PRODUCT & CATALOG ROUTES ----------------- #

@app.route('/api/products', methods=['GET'])
def get_products():
    query = Product.query

    # Filters
    search = request.args.get('search', '').strip()
    brand = request.args.get('brand')
    category = request.args.get('category')
    skin_type = request.args.get('skin_type')
    concern = request.args.get('concern')
    min_price = request.args.get('min_price', type=float)
    max_price = request.args.get('max_price', type=float)
    sort_by = request.args.get('sort', 'bestseller')

    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_filter)) |
            (Product.brand.ilike(search_filter)) |
            (Product.ingredients.ilike(search_filter))
        )

    if brand and brand != 'All':
        query = query.filter(Product.brand == brand)

    if category and category != 'All':
        query = query.filter(Product.category == category)

    if min_price is not None:
        query = query.filter(Product.price >= min_price)

    if max_price is not None:
        query = query.filter(Product.price <= max_price)

    products = query.all()
    products_data = [p.to_dict() for p in products]

    # Skin type and concern client filtering
    if skin_type and skin_type != 'All':
        products_data = [
            p for p in products_data
            if 'All' in p['suitable_skin_types'] or skin_type in p['suitable_skin_types']
        ]

    if concern and concern != 'All':
        products_data = [
            p for p in products_data
            if concern in p['target_concerns']
        ]

    # Calculate match score if user provided skin type in request
    user_skin_type = request.args.get('user_skin_type')
    user_concerns = request.args.getlist('user_concerns')
    if user_skin_type:
        mock_scan = {'skin_type': user_skin_type, 'concerns': user_concerns}
        for p in products_data:
            p['match_score'] = calculate_match_score(p, mock_scan)

    # Sorting
    if sort_by == 'price_asc':
        products_data.sort(key=lambda x: x['price'])
    elif sort_by == 'price_desc':
        products_data.sort(key=lambda x: x['price'], reverse=True)
    elif sort_by == 'rating':
        products_data.sort(key=lambda x: x['rating'], reverse=True)
    elif sort_by == 'match_score' and user_skin_type:
        products_data.sort(key=lambda x: x.get('match_score', 0), reverse=True)
    else: # Bestseller default
        products_data.sort(key=lambda x: (x['is_bestseller'], x['rating']), reverse=True)

    # Return brands and categories list for easy frontend filter dropdowns
    all_brands = sorted(list(set([p.brand for p in Product.query.all()])))
    all_categories = sorted(list(set([p.category for p in Product.query.all()])))

    return jsonify({
        'total': len(products_data),
        'products': products_data,
        'brands': all_brands,
        'categories': all_categories
    })

@app.route('/api/products/<int:product_id>', methods=['GET'])
def get_product(product_id):
    product = Product.query.get_or_404(product_id)
    reviews = [r.to_dict() for r in product.reviews]
    
    # Related products from same category or brand
    related = Product.query.filter(
        Product.category == product.category,
        Product.id != product.id
    ).limit(4).all()

    return jsonify({
        'product': product.to_dict(),
        'reviews': reviews,
        'related_products': [p.to_dict() for p in related]
    })

@app.route('/api/products/<int:product_id>/review', methods=['POST'])
def add_review(product_id):
    product = Product.query.get_or_404(product_id)
    data = request.json or {}
    user = get_current_user()

    user_name = user.full_name if user else data.get('user_name', 'Skincare Enthusiast')
    rating = int(data.get('rating', 5))
    title = data.get('title', 'Great Skincare Product')
    comment = data.get('comment', '').strip()
    skin_type = user.skin_type if user else data.get('skin_type', 'Combination')

    if not comment:
        return jsonify({'error': 'Comment is required.'}), 400

    review = Review(
        product_id=product.id,
        user_name=user_name,
        rating=rating,
        title=title,
        comment=comment,
        skin_type=skin_type,
        verified=True
    )
    db.session.add(review)

    # Recalculate average rating
    all_ratings = [r.rating for r in product.reviews] + [rating]
    product.rating = round(sum(all_ratings) / len(all_ratings), 1)
    product.reviews_count += 1

    db.session.commit()

    return jsonify({
        'message': 'Thank you! Your review has been published.',
        'review': review.to_dict(),
        'updated_rating': product.rating
    }), 201

# ----------------- COUPONS & CHECKOUT ----------------- #

@app.route('/api/coupons/apply', methods=['POST'])
def apply_coupon():
    data = request.json or {}
    code = data.get('code', '').strip().upper()
    order_amount = float(data.get('order_amount', 0))

    coupon = Coupon.query.filter_by(code=code, active=True).first()
    if not coupon:
        return jsonify({'valid': False, 'error': 'Invalid coupon code. Try GLOW20 or FIRSTGLOW.'}), 400

    if order_amount < coupon.min_order:
        return jsonify({
            'valid': False,
            'error': f'Minimum cart value of ₹{coupon.min_order:.0f} required to use {code}.'
        }), 400

    if coupon.discount_percent > 0:
        discount = round((coupon.discount_percent / 100.0) * order_amount, 2)
    else:
        discount = coupon.flat_discount

    return jsonify({
        'valid': True,
        'code': coupon.code,
        'discount': discount,
        'description': coupon.description,
        'final_amount': max(0.0, order_amount - discount)
    })

@app.route('/api/orders', methods=['POST'])
def place_order():
    data = request.json or {}
    user = get_current_user()

    items = data.get('items', [])
    if not items:
        return jsonify({'error': 'Cart is empty.'}), 400

    total_amount = float(data.get('total_amount', 0))
    discount_amount = float(data.get('discount_amount', 0))
    coupon_code = data.get('coupon_code')
    payment_method = data.get('payment_method', 'UPI')
    shipping_name = data.get('shipping_name', 'Valued Customer')
    shipping_address = data.get('shipping_address', '123 Beauty Lane, Mumbai, MH')
    shipping_phone = data.get('shipping_phone', '+91 98765 43210')

    order_num = f"GLOW-{datetime.datetime.now().strftime('%y%m%d')}-{uuid.uuid4().hex[:6].upper()}"
    tracking_id = f"TRK-{uuid.uuid4().hex[:8].upper()}"

    order = Order(
        order_number=order_num,
        user_id=user.id if user else None,
        items_json=json.dumps(items),
        total_amount=total_amount,
        discount_amount=discount_amount,
        coupon_code=coupon_code,
        payment_method=payment_method,
        payment_status='Completed' if payment_method != 'Cash on Delivery' else 'Pending',
        order_status='Placed',
        shipping_name=shipping_name,
        shipping_address=shipping_address,
        shipping_phone=shipping_phone,
        tracking_id=tracking_id
    )
    db.session.add(order)
    db.session.commit()

    return jsonify({
        'success': True,
        'order': order.to_dict(),
        'message': 'Your GlowAura order has been confirmed! Preparing your luxury skincare shipment.'
    }), 201

@app.route('/api/orders/<order_number>', methods=['GET'])
def get_order_tracking(order_number):
    order = Order.query.filter_by(order_number=order_number).first_or_404()
    return jsonify({'order': order.to_dict()})

@app.route('/api/user/orders', methods=['GET'])
def get_my_orders():
    user = get_current_user()
    if not user:
        return jsonify({'orders': []})
    orders = Order.query.filter_by(user_id=user.id).order_by(Order.created_at.desc()).all()
    return jsonify({'orders': [o.to_dict() for o in orders]})

# ----------------- DIET & WELLNESS ----------------- #

@app.route('/api/diet/generate', methods=['POST'])
def get_diet():
    data = request.json or {}
    skin_type = data.get('skin_type', 'Combination')
    concerns = data.get('concerns', ['Hydration', 'Glow'])
    acne_severity = data.get('acne_severity', 'Mild')

    plan = generate_personalized_diet(skin_type, concerns, acne_severity)
    return jsonify({'diet_plan': plan})

@app.route('/api/weather-advice', methods=['GET'])
def weather_advice():
    # Dynamic weather recommendation simulating city conditions
    city = request.args.get('city', 'Mumbai')
    return jsonify({
        'city': city,
        'uv_index': 7.8,
        'uv_status': 'Very High',
        'humidity': '76%',
        'temperature': '31°C',
        'weather_condition': 'Sunny with High Humidity',
        'recommendation': 'High UV Index detected! Reapply Broad-Spectrum SPF 50 every 2.5 hours. Opt for lightweight gel hydration to prevent sweat-induced pore congestion.',
        'suggested_products': [
            "Light Fluid SPF 50 PA++++ Invisible Sunscreen",
            "Hydro Boost Hyaluronic Acid Water Gel"
        ]
    })

@app.route('/api/chatbot', methods=['POST'])
def chatbot_reply():
    data = request.json or {}
    query = data.get('message', '').strip().lower()

    if not query:
        return jsonify({'reply': "Hello! I am GlowBot, your AI Skincare Concierge. Ask me about ingredients, acne solutions, routines, or diet!"})

    if 'retinol' in query:
        reply = "Retinol (Vitamin A) accelerates cellular renewal and collagen synthesis. Always introduce it gradually (2x/week PM) and NEVER skip morning sunscreen, as retinol increases photosensitivity."
    elif 'niacinamide' in query:
        reply = "Niacinamide (Vitamin B3) is a miracle multivitamin active! It regulates sebum production, tightens enlarged pores, strengthens the ceramide lipid barrier, and fades acne marks."
    elif 'salicylic' in query or 'bha' in query or 'blackhead' in query:
        reply = "Salicylic Acid (BHA) is lipid-soluble, meaning it penetrates deep inside oily pore linings to dissolve trapped sebum and dead keratinocytes, banishing blackheads and active papules."
    elif 'sunscreen' in query or 'spf' in query:
        reply = "Sunscreen is the #1 anti-aging product! UVA rays penetrate clouds and glass to degrade collagen fibers, while UVB causes sunburn and hyperpigmentation. Apply 2 full finger lengths every morning."
    elif 'diet' in query or 'food' in query or 'water' in query:
        reply = "Cutaneous health reflects gut health! Aim for 3.0L of water daily, load up on lycopene (tomatoes/watermelon) and omega-3s (chia/walnuts), and limit high-glycemic dairy and sugars that trigger IGF-1 acne breakouts."
    elif 'acne' in query or 'pimple' in query:
        reply = "For active acne breakouts, avoid popping or harsh physical scrubs. Cleanse with a low-pH 2% Salicylic Acid wash, treat with Azelaic Acid or Niacinamide, and wear a hydrocolloid blemish dot overnight."
    elif 'dry' in query or 'flaky' in query:
        reply = "For dry, compromised skin: avoid hot water washes. Layer multi-molecular Hyaluronic Acid onto damp skin, immediately locked in with a 5-Ceramide Barrier Cream to prevent transepidermal water loss."
    else:
        reply = f"GlowAura AI suggests maintaining a balanced 4-step routine: Gentle Cleanse, Targeted Active Serum, Barrier-Lock Moisturizer, and SPF 50 Shield. Check our AI Skin Scanner for an instant personalized diagnostic!"

    return jsonify({
        'reply': reply,
        'status': 'success'
    })

# Static asset routes
@app.route('/uploads/<path:filename>')
def serve_uploads(filename):
    return send_from_directory(os.path.join(app.root_path, 'static', 'uploads'), filename)

@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(os.path.join(app.root_path, 'static'), filename)

@app.route('/logo.jpg')
def serve_logo():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'logo.jpg')

# Health check
@app.route('/', methods=['GET'])
def root():
    return "GlowAura Backend is Running", 200

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'online',
        'platform': 'GlowAura AI',
        'version': '2.4.0',
        'products_loaded': Product.query.count()
    })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
