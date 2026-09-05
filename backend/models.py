from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    full_name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    role = db.Column(db.String(20), default='user') # 'user', 'admin'
    avatar = db.Column(db.String(255), nullable=True)
    skin_type = db.Column(db.String(50), nullable=True)
    streak_days = db.Column(db.Integer, default=1)
    last_streak_date = db.Column(db.String(20), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    scans = db.relationship('SkinScan', backref='user', lazy=True, cascade="all, delete-orphan")
    orders = db.relationship('Order', backref='user', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'full_name': self.full_name,
            'phone': self.phone,
            'role': self.role,
            'avatar': self.avatar or 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            'skin_type': self.skin_type,
            'streak_days': self.streak_days,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class SkinScan(db.Model):
    __tablename__ = 'skin_scans'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    image_path = db.Column(db.String(255), nullable=False)
    skin_type = db.Column(db.String(50), nullable=False) # Oily, Dry, Combination, Sensitive, Normal
    acne_severity = db.Column(db.String(50), nullable=False) # Clear, Mild, Moderate, Severe
    acne_score = db.Column(db.Integer, default=90) # 0-100 (100 = clear)
    skin_tone = db.Column(db.String(50), nullable=False) # Fair, Light, Medium, Olive, Tan, Deep
    skin_tone_hex = db.Column(db.String(20), default='#F3CEAE')
    hydration_level = db.Column(db.String(50), nullable=False) # Low, Medium, High
    hydration_score = db.Column(db.Integer, default=70) # 0-100
    health_score = db.Column(db.Integer, default=85) # Overall 0-100
    confidence_score = db.Column(db.Float, default=94.5) # 0-100 %
    concerns_json = db.Column(db.Text, default='[]') # JSON list
    detected_spots_json = db.Column(db.Text, default='[]') # JSON list of {x, y, radius, severity}
    summary_text = db.Column(db.Text, nullable=True)
    routine_json = db.Column(db.Text, default='{}')
    diet_plan_json = db.Column(db.Text, default='{}')
    recommendations_json = db.Column(db.Text, default='[]')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'image_path': self.image_path,
            'skin_type': self.skin_type,
            'acne_severity': self.acne_severity,
            'acne_score': self.acne_score,
            'skin_tone': self.skin_tone,
            'skin_tone_hex': self.skin_tone_hex,
            'hydration_level': self.hydration_level,
            'hydration_score': self.hydration_score,
            'health_score': self.health_score,
            'confidence_score': self.confidence_score,
            'concerns': json.loads(self.concerns_json) if self.concerns_json else [],
            'detected_spots': json.loads(self.detected_spots_json) if self.detected_spots_json else [],
            'summary_text': self.summary_text,
            'routine': json.loads(self.routine_json) if self.routine_json else {},
            'diet_plan': json.loads(self.diet_plan_json) if self.diet_plan_json else {},
            'top_recommendations': json.loads(self.recommendations_json) if self.recommendations_json else [],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def to_scan_result_dict(self):
        return {
            'success': True,
            'scan_id': self.id,
            'user_id': self.user_id,
            'image_url': self.image_path,
            'analysis': {
                'skin_type': self.skin_type,
                'acne_severity': self.acne_severity,
                'acne_score': self.acne_score,
                'skin_tone': self.skin_tone,
                'skin_tone_hex': self.skin_tone_hex,
                'hydration_level': self.hydration_level,
                'hydration_score': self.hydration_score,
                'health_score': self.health_score,
                'confidence_score': self.confidence_score,
                'concerns': json.loads(self.concerns_json) if self.concerns_json else [],
                'detected_spots': json.loads(self.detected_spots_json) if self.detected_spots_json else [],
                'summary_text': self.summary_text
            },
            'routine': json.loads(self.routine_json) if self.routine_json else {},
            'diet_plan': json.loads(self.diet_plan_json) if self.diet_plan_json else {},
            'top_recommendations': json.loads(self.recommendations_json) if self.recommendations_json else [],
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Product(db.Model):
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    brand = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False) # Cleanser, Toner, Serum, Moisturizer, Sunscreen, Eye Cream, Exfoliant, Mask, Spot Treatment, Night Cream
    price = db.Column(db.Float, nullable=False)
    original_price = db.Column(db.Float, nullable=True)
    rating = db.Column(db.Float, default=4.5)
    reviews_count = db.Column(db.Integer, default=42)
    image_url = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    ingredients = db.Column(db.Text, nullable=False)
    suitable_skin_types = db.Column(db.Text, default='["All"]') # JSON list: Oily, Dry, Combination, Sensitive, Normal, All
    target_concerns = db.Column(db.Text, default='[]') # JSON list
    acne_friendly = db.Column(db.Boolean, default=True)
    is_bestseller = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    reviews = db.relationship('Review', backref='product', lazy=True, cascade="all, delete-orphan")
    
    def to_dict(self, match_score=None):
        data = {
            'id': self.id,
            'name': self.name,
            'brand': self.brand,
            'category': self.category,
            'price': self.price,
            'original_price': self.original_price or round(self.price * 1.25),
            'rating': self.rating,
            'reviews_count': self.reviews_count,
            'image_url': self.image_url,
            'description': self.description,
            'ingredients': self.ingredients,
            'suitable_skin_types': json.loads(self.suitable_skin_types) if self.suitable_skin_types else [],
            'target_concerns': json.loads(self.target_concerns) if self.target_concerns else [],
            'acne_friendly': self.acne_friendly,
            'is_bestseller': self.is_bestseller
        }
        if match_score is not None:
            data['match_score'] = match_score
        return data

class Review(db.Model):
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    user_name = db.Column(db.String(100), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    title = db.Column(db.String(150), nullable=True)
    comment = db.Column(db.Text, nullable=False)
    skin_type = db.Column(db.String(50), nullable=True)
    verified = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'user_name': self.user_name,
            'rating': self.rating,
            'title': self.title,
            'comment': self.comment,
            'skin_type': self.skin_type,
            'verified': self.verified,
            'created_at': self.created_at.strftime('%b %d, %Y') if self.created_at else ''
        }

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(50), unique=True, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    items_json = db.Column(db.Text, nullable=False)
    total_amount = db.Column(db.Float, nullable=False)
    discount_amount = db.Column(db.Float, default=0.0)
    coupon_code = db.Column(db.String(50), nullable=True)
    payment_method = db.Column(db.String(50), nullable=False) # UPI, GPay, PhonePe, Card, NetBanking, COD
    payment_status = db.Column(db.String(50), default='Completed')
    order_status = db.Column(db.String(50), default='Placed') # Placed, Packed, Shipped, Delivered
    shipping_name = db.Column(db.String(100), nullable=False)
    shipping_address = db.Column(db.Text, nullable=False)
    shipping_phone = db.Column(db.String(20), nullable=False)
    tracking_id = db.Column(db.String(50), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'order_number': self.order_number,
            'user_id': self.user_id,
            'items': json.loads(self.items_json) if self.items_json else [],
            'total_amount': self.total_amount,
            'discount_amount': self.discount_amount,
            'coupon_code': self.coupon_code,
            'payment_method': self.payment_method,
            'payment_status': self.payment_status,
            'order_status': self.order_status,
            'shipping_name': self.shipping_name,
            'shipping_address': self.shipping_address,
            'shipping_phone': self.shipping_phone,
            'tracking_id': self.tracking_id,
            'created_at': self.created_at.strftime('%b %d, %Y, %I:%M %p') if self.created_at else ''
        }

class Coupon(db.Model):
    __tablename__ = 'coupons'
    
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(50), unique=True, nullable=False)
    discount_percent = db.Column(db.Float, default=0.0)
    flat_discount = db.Column(db.Float, default=0.0)
    min_order = db.Column(db.Float, default=0.0)
    active = db.Column(db.Boolean, default=True)
    description = db.Column(db.String(200), nullable=False)
    
    def to_dict(self):
        return {
            'code': self.code,
            'discount_percent': self.discount_percent,
            'flat_discount': self.flat_discount,
            'min_order': self.min_order,
            'description': self.description
        }
