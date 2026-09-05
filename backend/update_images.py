import os, sys, json, urllib.request, io, shutil, re
from PIL import Image, ImageDraw
import seed_data

FRONTEND_DIR = os.path.abspath(os.path.join('..', 'frontend', 'public', 'products'))
BACKEND_DIR = os.path.abspath(os.path.join('static', 'products'))
os.makedirs(FRONTEND_DIR, exist_ok=True)
os.makedirs(BACKEND_DIR, exist_ok=True)

def fetch_shopify_dict(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        res = urllib.request.urlopen(req, timeout=12)
        data = json.loads(res.read().decode('utf-8'))
        return {p['title']: p['images'][0]['src'] for p in data.get('products', []) if p.get('images')}
    except Exception as e:
        print(f'Shopify fetch failed for {url}: {e}')
        return {}

print('Fetching catalogs...')
min_c = fetch_shopify_dict('https://beminimalist.co/products.json?limit=250')
plum_c = fetch_shopify_dict('https://plumgoodness.com/products.json?limit=250')
dk_c = fetch_shopify_dict('https://www.dotandkey.com/products.json?limit=250')
wish_c = fetch_shopify_dict('https://www.mywishcare.com/products.json?limit=250')
cosrx_c = fetch_shopify_dict('https://www.cosrx.com/products.json?limit=250')
print('Catalogs loaded.')

def find_img(d, kw):
    for title, img_url in d.items():
        if all(k.lower() in title.lower() for k in kw):
            return img_url
    return None

def create_packshot(brand, name, category, path):
    im = Image.new('RGB', (600, 600), (255, 255, 255))
    draw = ImageDraw.Draw(im)
    draw.ellipse([(90, 90), (510, 510)], fill=(255, 245, 248))
    cat = category.lower()
    b_fill = (248, 250, 252)
    b_line = (226, 232, 240)
    
    if 'serum' in cat or 'oil' in cat:
        draw.rounded_rectangle([(230, 240), (370, 480)], radius=24, fill=b_fill, outline=b_line, width=3)
        draw.rounded_rectangle([(250, 310), (350, 440)], radius=8, fill=(255, 255, 255), outline=(241, 245, 249), width=1)
        draw.rectangle([(270, 200), (330, 240)], fill=(220, 225, 230), outline=(200, 205, 210), width=2)
        draw.arc([(280, 160), (320, 205)], 180, 360, fill=(30, 41, 59), width=12)
    elif 'cleanser' in cat or 'wash' in cat:
        draw.rounded_rectangle([(220, 210), (380, 490)], radius=30, fill=b_fill, outline=b_line, width=3)
        draw.rounded_rectangle([(240, 270), (360, 430)], radius=8, fill=(255, 255, 255), outline=(241, 245, 249), width=1)
        draw.rectangle([(280, 180), (320, 210)], fill=(200, 205, 210), width=3)
        draw.polygon([(260, 165), (340, 165), (350, 180), (250, 180)], fill=(30, 41, 59))
        draw.rectangle([(240, 170), (260, 178)], fill=(30, 41, 59))
    elif 'cream' in cat or 'moisturizer' in cat or 'mask' in cat or 'night' in cat:
        draw.rounded_rectangle([(190, 280), (410, 480)], radius=28, fill=b_fill, outline=b_line, width=3)
        draw.rounded_rectangle([(210, 330), (390, 440)], radius=8, fill=(255, 255, 255), outline=(241, 245, 249), width=1)
        draw.rounded_rectangle([(180, 230), (420, 285)], radius=12, fill=(255, 255, 255), outline=(255, 94, 156), width=3)
    elif 'sunscreen' in cat or 'eye' in cat:
        draw.polygon([(240, 190), (360, 190), (345, 460), (255, 460)], fill=b_fill, outline=b_line)
        draw.rectangle([(260, 460), (340, 490)], fill=(255, 255, 255), outline=(200, 205, 210), width=2)
        draw.rounded_rectangle([(255, 260), (345, 410)], radius=6, fill=(255, 255, 255), outline=(241, 245, 249), width=1)
    else:
        draw.rounded_rectangle([(235, 190), (365, 490)], radius=20, fill=b_fill, outline=b_line, width=3)
        draw.rectangle([(265, 140), (335, 190)], fill=(255, 255, 255), outline=(200, 205, 210), width=2)
        draw.rounded_rectangle([(245, 250), (355, 430)], radius=6, fill=(255, 255, 255), outline=(241, 245, 249), width=1)

    draw.text((300, 325), brand.upper(), fill=(255, 94, 156), anchor='mm')
    short_n = (name[:23] + '...') if len(name) > 23 else name
    draw.text((300, 355), short_n, fill=(51, 65, 85), anchor='mm')
    draw.text((300, 380), category, fill=(100, 116, 139), anchor='mm')
    draw.rounded_rectangle([(200, 35), (400, 75)], radius=20, fill=(255, 241, 242), outline=(255, 94, 156), width=2)
    draw.text((300, 55), 'Official Packshot Placeholder', fill=(255, 94, 156), anchor='mm')
    im.save(path, 'JPEG', quality=92)

# Update brand names to include Mamaearth and WishCare
products = seed_data.PRODUCTS_DATA

# 4 -> Mamaearth Tea Tree
products[3]['brand'] = 'Mamaearth'
products[3]['name'] = 'Tea Tree Face Wash with Neem & Salicylic Acid'
products[3]['description'] = 'Natural tea tree oil and neem wash formulated to combat acne bacteria and soothe active pimples.'
products[3]['ingredients'] = 'Aqua, Sodium Lauroyl Sarcosinate, Tea Tree Oil, Neem Extract, Salicylic Acid, Allantoin.'

# 20 -> Mamaearth Vitamin C
products[19]['brand'] = 'Mamaearth'
products[19]['name'] = 'Vitamin C Daily Glow Face Serum with Turmeric'
products[19]['description'] = 'Enriched with natural Vitamin C from Tangerine and Turmeric extract to reduce dark spots and restore radiance.'
products[19]['ingredients'] = 'Aqua, 3-O-Ethyl Ascorbic Acid, Curcuma Longa Root Extract, Glycerin, Sodium Hyaluronate.'

# 33 -> WishCare Sunscreen
products[32]['brand'] = 'WishCare'
products[32]['name'] = 'Invisible Gel Sunscreen SPF 50+ PA++++'
products[32]['description'] = 'Transparent gel sunscreen with 100% invisible application. Non-greasy, water-resistant broad-spectrum protection.'
products[32]['ingredients'] = 'Cyclopentasiloxane, Dimethicone Crosspolymer, Ethylhexyl Methoxycinnamate, Zinc Oxide, Niacinamide.'

# 45 -> WishCare Peeling
products[44]['brand'] = 'WishCare'
products[44]['name'] = '10% AHA + 1% BHA Body & Face Peeling Solution'
products[44]['description'] = 'Gentle dual chemical exfoliant targeting rough skin texture and clogged pores.'
products[44]['ingredients'] = 'Aqua, Lactic Acid, Glycolic Acid, Salicylic Acid, Centella Asiatica Extract, Blueberry Extract.'

# 52 -> WishCare Barrier Bounce
products[51]['brand'] = 'WishCare'
products[51]['name'] = '3:1:1 Barrier Bounce Moisturizing Night Cream'
products[51]['description'] = 'Rich lipid night recovery cream featuring the dermatological 3:1:1 golden ratio of Ceramides, Cholesterol, and Fatty Acids.'
products[51]['ingredients'] = 'Aqua, Ceramide NP, Ceramide AP, Ceramide EOP, Cholesterol, Linoleic Acid, Squalane, Hyaluronic Acid.'

# Static known packshot URLs
STATIC_URLS = {
    'cerave_hydrating_cleanser': 'https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/skincare/cleansers/hydrating-facial-cleanser/photos/2026/700x785/hfc-atf-1-700x785-v1.jpg',
    'cetaphil_gentle_cleanser': 'https://www.cetaphil.in/dw/image/v2/BGGN_PRD/on/demandware.static/-/Sites-galderma-in-m-catalog/default/dw311450bb/GSC%20Revive%20A+/236%20ml/ATF/1.FoP-236.png',
    'mamaearth_tea_tree_face_wash': 'https://www.bbassets.com/media/uploads/p/l/40144739_3-mamaearth-tea-tree-face-wash.jpg',
    'plum_green_tea_cleanser': 'https://plumgoodness.com/cdn/shop/files/02_1a9ae793-ae41-46b5-8a4b-e26dcbf6eeda.jpg',
    'the_ordinary_glycolic': 'https://images-static.nykaa.com/media/catalog/product/7/6/769915190601_1.jpg?tr=w-500',
    'paulas_choice_bha': 'https://images-static.nykaa.com/media/catalog/product/6/5/655439020162_1.jpg?tr=w-500',
    'the_ordinary_niacinamide': 'https://images-static.nykaa.com/media/catalog/product/8/8/88a48a1THECI00000026_1.jpg?tr=w-500',
    'the_ordinary_salicylic': 'https://images-static.nykaa.com/media/catalog/product/7/6/769915194517_1.jpg?tr=w-500',
    'the_ordinary_retinoid': 'https://images-static.nykaa.com/media/catalog/product/7/6/769915190472_1.jpg?tr=w-500',
    'neutrogena_hydro_boost': 'https://images-static.nykaa.com/media/catalog/product/0/7/070501053118_1.jpg?tr=w-500',
    'the_ordinary_nmf': 'https://images-static.nykaa.com/media/catalog/product/7/6/769915190625_1.jpg?tr=w-500',
    'cerave_moisturizing_cream': 'https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/skincare/moisturizers/moisturizing-cream/photos/2026/700x785/mc-atf-1-700x785-v1.jpg',
    'bioderma_sensibio': 'https://images-static.nykaa.com/media/catalog/product/3/4/3401343696245_1.jpg?tr=w-500',
    'laneige_sleeping_mask': 'https://images-static.nykaa.com/media/catalog/product/8/8/8809643068772_1.jpg?tr=w-500',
    'wishcare_invisible_sunscreen': 'https://images-static.nykaa.com/media/catalog/product/tr:h-800,w-800,cm-pad_resize/a/1/a1bb71fWISHC00000033_1.jpg',
    'neutrogena_sunblock': 'https://images-static.nykaa.com/media/catalog/product/0/7/070501060000_1.jpg?tr=w-500',
    'bioderma_photoderm': 'https://images-static.nykaa.com/media/catalog/product/3/4/3401573670671_1.jpg?tr=w-500',
    'the_ordinary_caffeine': 'https://images-static.nykaa.com/media/catalog/product/7/6/769915190670_1.jpg?tr=w-500',
    'cerave_eye_repair': 'https://www.cerave.com/-/media/project/loreal/brand-sites/cerave/americas/us/skincare/eye-creams/eye-repair-cream/photos/2026/700x785/erc-atf-1-700x785-v1.jpg',
    'the_ordinary_peeling': 'https://images-static.nykaa.com/media/catalog/product/2/f/2f64156769915195606_1.jpg?tr=w-500',
    'the_ordinary_lactic': 'https://images-static.nykaa.com/media/catalog/product/7/6/769915190458_1.jpg?tr=w-500',
    'the_ordinary_masque': 'https://images-static.nykaa.com/media/catalog/product/7/6/769915195323_1.jpg?tr=w-500',
    'innisfree_volcanic': 'https://images-static.nykaa.com/media/catalog/product/8/8/8809612850780_1.jpg?tr=w-500',
    'the_ordinary_azelaic': 'https://images-static.nykaa.com/media/catalog/product/7/6/769915190588_1.jpg?tr=w-500',
    'the_ordinary_squalane': 'https://images-static.nykaa.com/media/catalog/product/7/6/769915190519_1.jpg?tr=w-500'
}

for i, p in enumerate(products):
    brand = p['brand']
    name = p['name']
    cat = p['category']
    # Generate slug
    slug = re.sub(r'[^a-z0-9]+', '_', f'{brand}_{name}'.lower()).strip('_')
    front_file = os.path.join(FRONTEND_DIR, f'{slug}.jpg')
    back_file = os.path.join(BACKEND_DIR, f'{slug}.jpg')
    
    # Try finding image
    src_url = None
    # 1. Check brand catalog
    b_low = brand.lower()
    if 'minimalist' in b_low:
        src_url = find_img(min_c, name.split()[:2])
    elif 'plum' in b_low:
        src_url = find_img(plum_c, ['green tea'])
    elif 'dot' in b_low:
        src_url = find_img(dk_c, name.split()[:2])
    elif 'cosrx' in b_low:
        src_url = find_img(cosrx_c, name.split()[:2])
    elif 'wishcare' in b_low:
        src_url = find_img(wish_c, name.split()[:2])
    
    # 2. Check static known
    if not src_url:
        for k, u in STATIC_URLS.items():
            if k in slug:
                src_url = u
                break

    downloaded = False
    if src_url:
        try:
            req = urllib.request.Request(src_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
            res = urllib.request.urlopen(req, timeout=8)
            raw = res.read()
            im = Image.open(io.BytesIO(raw))
            if im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info):
                canvas = Image.new('RGBA', (600, 600), (255, 255, 255, 255))
                im_rgba = im.convert('RGBA')
                im_rgba.thumbnail((560, 560), Image.Resampling.LANCZOS)
                offset = ((600 - im_rgba.width) // 2, (600 - im_rgba.height) // 2)
                canvas.paste(im_rgba, offset, im_rgba)
                final_im = canvas.convert('RGB')
            else:
                final_im = Image.new('RGB', (600, 600), (255, 255, 255))
                im_rgb = im.convert('RGB')
                im_rgb.thumbnail((560, 560), Image.Resampling.LANCZOS)
                offset = ((600 - im_rgb.width) // 2, (600 - im_rgb.height) // 2)
                final_im.paste(im_rgb, offset)
            final_im.save(front_file, 'JPEG', quality=92)
            shutil.copyfile(front_file, back_file)
            downloaded = True
            print(f'[{i+1}/52] OK [CDN]: {slug}')
        except Exception as e:
            pass

    if not downloaded:
        create_packshot(brand, name, cat, front_file)
        shutil.copyfile(front_file, back_file)
        print(f'[{i+1}/52] OK [PLACEHOLDER]: {slug}')

    p['image_url'] = f'/products/{slug}.jpg'

# Now update seed_data.py content
with open('seed_data.py', 'r', encoding='utf-8') as f:
    text = f.read()

# Replace PRODUCTS_DATA definition
new_json = json.dumps(products, indent=4)
text = re.sub(r'PRODUCTS_DATA = \[[\s\S]*?\]\n\nCOUPONS_DATA', 'PRODUCTS_DATA = ' + new_json + '\n\nCOUPONS_DATA', text)

with open('seed_data.py', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated seed_data.py with new image URLs and products.')

# Re-seed database
from app import app
with app.app_context():
    from models import db, Product
    for p in products:
        prod = Product.query.filter_by(name=p['name']).first()
        if prod:
            prod.brand = p['brand']
            prod.image_url = p['image_url']
            prod.category = p['category']
            prod.description = p['description']
            prod.ingredients = p['ingredients']
        else:
            new_p = Product(
                name=p['name'],
                brand=p['brand'],
                category=p['category'],
                price=p['price'],
                original_price=p['original_price'],
                rating=p['rating'],
                reviews_count=p['reviews_count'],
                image_url=p['image_url'],
                description=p['description'],
                ingredients=p['ingredients'],
                suitable_skin_types=json.dumps(p['suitable_skin_types']),
                target_concerns=json.dumps(p['target_concerns']),
                acne_friendly=p['acne_friendly'],
                is_bestseller=p['is_bestseller']
            )
            db.session.add(new_p)
    db.session.commit()
    print(f'Database successfully synced with {Product.query.count()} products!')
