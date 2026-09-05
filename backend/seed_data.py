import json
from werkzeug.security import generate_password_hash
from models import db, User, Product, Coupon, Review, SkinScan

PRODUCTS_DATA = [
    {
        "name": "Salicylic Acid + LHA 02% Cleanser",
        "brand": "Minimalist",
        "category": "Cleanser",
        "price": 299.0,
        "original_price": 349.0,
        "rating": 4.6,
        "reviews_count": 842,
        "image_url": "/products/minimalist_salicylic_acid_lha_02_cleanser.jpg",
        "description": "Daily gentle exfoliating, anti-acne face cleanser formulated with Salicylic Acid (BHA) & LHA to clear pores, reduce sebum, and prevent breakouts without stripping moisture.",
        "ingredients": "Aqua, Glycerin, Cocamidopropyl Betaine, Propanediol, Salicylic Acid, Capryloyl Salicylic Acid (LHA), Sodium Hydroxide, Zinc PCA, Phenoxyethanol.",
        "suitable_skin_types": [
            "Oily",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Active Breakouts",
            "Oiliness",
            "Large Pores",
            "Blackheads"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Hydrating Facial Cleanser for Normal to Dry Skin",
        "brand": "CeraVe",
        "category": "Cleanser",
        "price": 699.0,
        "original_price": 850.0,
        "rating": 4.8,
        "reviews_count": 1250,
        "image_url": "/products/cerave_hydrating_facial_cleanser_for_normal_to_dry_skin.jpg",
        "description": "Formulated with 3 essential ceramides and hyaluronic acid to cleanse, hydrate, and help restore the protective skin barrier with MVE Delivery Technology.",
        "ingredients": "Purified Water, Glycerin, Behentrimonium Methosulfate, Cetearyl Alcohol, Ceramide NP, Ceramide AP, Ceramide EOP, Hyaluronic Acid, Cholesterol, Phytosphingosine.",
        "suitable_skin_types": [
            "Dry",
            "Sensitive",
            "Normal"
        ],
        "target_concerns": [
            "Dryness",
            "Redness",
            "Barrier Repair"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Gentle Skin Cleanser",
        "brand": "Cetaphil",
        "category": "Cleanser",
        "price": 399.0,
        "original_price": 465.0,
        "rating": 4.7,
        "reviews_count": 2100,
        "image_url": "/products/cetaphil_gentle_skin_cleanser.jpg",
        "description": "Creamy, non-foaming formula clinically tested to remove dirt, makeup, and impurities while preserving skin's natural moisture barrier. Soap-free and non-irritating.",
        "ingredients": "Water, Cetyl Alcohol, Propylene Glycol, Sodium Lauryl Sulfate, Stearyl Alcohol, Methylparaben, Propylparaben, Butylparaben.",
        "suitable_skin_types": [
            "Dry",
            "Sensitive",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Dryness",
            "Redness",
            "Preventative Care"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Tea Tree Face Wash with Neem & Salicylic Acid",
        "brand": "Mamaearth",
        "category": "Cleanser",
        "price": 349.0,
        "original_price": 399.0,
        "rating": 4.4,
        "reviews_count": 480,
        "image_url": "/products/mamaearth_tea_tree_face_wash_with_neem_salicylic_acid.jpg",
        "description": "Natural tea tree oil and neem wash formulated to combat acne bacteria and soothe active pimples.",
        "ingredients": "Aqua, Sodium Lauroyl Sarcosinate, Tea Tree Oil, Neem Extract, Salicylic Acid, Allantoin.",
        "suitable_skin_types": [
            "Oily",
            "Combination"
        ],
        "target_concerns": [
            "Oiliness",
            "Active Breakouts",
            "Large Pores"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Green Tea Pore Cleansing Face Wash",
        "brand": "Plum",
        "category": "Cleanser",
        "price": 345.0,
        "original_price": 395.0,
        "rating": 4.5,
        "reviews_count": 620,
        "image_url": "/products/plum_green_tea_pore_cleansing_face_wash.jpg",
        "description": "Rich in green tea extracts and soft cellulose beads that gently exfoliate dead skin, combat acne-causing bacteria, and refresh tired skin.",
        "ingredients": "Camellia Sinensis (Green Tea) Leaf Extract, Glycolic Acid, Cellulose Beads, Cocamidopropyl Betaine, Glycerin, Sodium Laureth Sulfate.",
        "suitable_skin_types": [
            "Oily",
            "Combination"
        ],
        "target_concerns": [
            "Oiliness",
            "Acne Marks",
            "Large Pores"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Low pH Good Morning Gel Cleanser",
        "brand": "Cosrx",
        "category": "Cleanser",
        "price": 850.0,
        "original_price": 990.0,
        "rating": 4.7,
        "reviews_count": 1400,
        "image_url": "/products/cosrx_low_ph_good_morning_gel_cleanser.jpg",
        "description": "Formulated with purifying botanical ingredients and mild BHA, this gently acidic cleanser soothes, refreshes, and softens skin without stripping natural lipids.",
        "ingredients": "Water, Cocamidopropyl Betaine, Sodium Lauroyl Methyl Isethionate, Betaine Salicylate, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Cryptomeria Japonica Leaf Extract.",
        "suitable_skin_types": [
            "Sensitive",
            "Oily",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Redness",
            "Active Breakouts",
            "Preventative Care"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Cica Calming Soothing Blemish Cleanser",
        "brand": "Dot & Key",
        "category": "Cleanser",
        "price": 395.0,
        "original_price": 495.0,
        "rating": 4.5,
        "reviews_count": 310,
        "image_url": "/products/dot_key_cica_calming_soothing_blemish_cleanser.jpg",
        "description": "A sulfate-free calming face wash powered by Centella Asiatica (Cica), Green Tea, and Tea Tree Oil to calm inflamed, irritated, breakout-prone skin.",
        "ingredients": "Centella Asiatica Leaf Water, Glycerin, Decyl Glucoside, Melaleuca Alternifolia Leaf Oil, Salicylic Acid, Panthenol, Allantoin.",
        "suitable_skin_types": [
            "Sensitive",
            "Oily",
            "Combination"
        ],
        "target_concerns": [
            "Redness",
            "Active Breakouts",
            "Barrier Repair"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Glycolic Acid 7% Toning Solution",
        "brand": "The Ordinary",
        "category": "Toner",
        "price": 950.0,
        "original_price": 1150.0,
        "rating": 4.6,
        "reviews_count": 2800,
        "image_url": "/products/the_ordinary_glycolic_acid_7_toning_solution.jpg",
        "description": "An exfoliating toner that targets uneven skin tone and textural irregularities. Enriched with Tasmanian Pepperberry and Aloe Vera to reduce irritation.",
        "ingredients": "Aqua, Glycolic Acid, Rosa Damascena Flower Water, Centaurea Cyanus Flower Water, Aloe Barbadensis Leaf Water, Tasmannia Lanceolata Fruit Extract, Ginseng Root Extract.",
        "suitable_skin_types": [
            "Oily",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Pigmentation",
            "Uneven Tone",
            "Acne Marks"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "PHA 3% + Biotic Clarifying Toner",
        "brand": "Minimalist",
        "category": "Toner",
        "price": 399.0,
        "original_price": 499.0,
        "rating": 4.5,
        "reviews_count": 520,
        "image_url": "/products/minimalist_pha_3_biotic_clarifying_toner.jpg",
        "description": "Ultra-mild polyhydroxy acid toner formulated with Gluconolactone and pre/probiotics for multi-level gentle hydration, pore-tightening, and microbiome balance.",
        "ingredients": "Aqua, Gluconolactone (PHA), Propanediol, Niacinamide, Salicylic Acid, Xylitylglucoside, Anhydroxylitol, Xylitol, Lactococcus Ferment Lysate.",
        "suitable_skin_types": [
            "Sensitive",
            "Dry",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Large Pores",
            "Dryness",
            "Uneven Tone"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "AHA BHA Clarifying Treatment Toner",
        "brand": "Cosrx",
        "category": "Toner",
        "price": 1090.0,
        "original_price": 1290.0,
        "rating": 4.6,
        "reviews_count": 910,
        "image_url": "/products/cosrx_aha_bha_clarifying_treatment_toner.jpg",
        "description": "Formulated with mineral water, Pyrus Malus (Apple) Fruit Water, and Salix Alba (Willow) Bark Water to gently buff away dull flakey patches and unclog pores.",
        "ingredients": "Mineral Water, Salix Alba Bark Water, Pyrus Malus Fruit Water, Butylene Glycol, 1,2-Hexanediol, Allantoin, Panthenol, Glycolic Acid, Betaine Salicylate.",
        "suitable_skin_types": [
            "Oily",
            "Combination",
            "Sensitive"
        ],
        "target_concerns": [
            "Active Breakouts",
            "Large Pores",
            "Blackheads"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Rice Ceramide Moisturizing Toner",
        "brand": "The Face Shop",
        "category": "Toner",
        "price": 820.0,
        "original_price": 990.0,
        "rating": 4.6,
        "reviews_count": 670,
        "image_url": "/products/the_face_shop_rice_ceramide_moisturizing_toner.jpg",
        "description": "Moisturizing toner formulated with rice extracts, rice bran oil, and ceramide to deliver intense hydration and a glass-skin translucent glow.",
        "ingredients": "Water, Glycerin, Alcohol Denat., Glycereth-26, Dipropylene Glycol, PEG-40 Hydrogenated Castor Oil, Ceramide NP, Rice Extract, Rice Bran Oil.",
        "suitable_skin_types": [
            "Dry",
            "Normal"
        ],
        "target_concerns": [
            "Dryness",
            "Uneven Tone",
            "Preventative Care"
        ],
        "acne_friendly": False,
        "is_bestseller": False
    },
    {
        "name": "Centella Asiatica 84% Calming Toner",
        "brand": "Dot & Key",
        "category": "Toner",
        "price": 495.0,
        "original_price": 595.0,
        "rating": 4.7,
        "reviews_count": 340,
        "image_url": "/products/dot_key_centella_asiatica_84_calming_toner.jpg",
        "description": "Infused with 84% Madagascar Centella Asiatica Extract and Hyaluronic Acid to soothe angry, inflamed skin, suppress acne redness, and accelerate recovery.",
        "ingredients": "Centella Asiatica Extract (84%), Dipropylene Glycol, 1,2-Hexanediol, Hydroxyethylcellulose, Sodium Hyaluronate, Disodium EDTA.",
        "suitable_skin_types": [
            "Sensitive",
            "Oily",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Redness",
            "Active Breakouts",
            "Barrier Repair"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Skin Perfecting 2% BHA Liquid Exfoliant Toner",
        "brand": "Paula's Choice",
        "category": "Toner",
        "price": 2700.0,
        "original_price": 3100.0,
        "rating": 4.9,
        "reviews_count": 4200,
        "image_url": "/products/paula_s_choice_skin_perfecting_2_bha_liquid_exfoliant_toner.jpg",
        "description": "Cult-favorite, clinically proven gentle leave-on exfoliant that quickly unclogs pores, smooths wrinkles, brightens, and evens out skin tone with Salicylic Acid.",
        "ingredients": "Water (Aqua), Methylpropanediol, Butylene Glycol, Salicylic Acid, Polysorbate 20, Camellia Oleifera (Green Tea) Leaf Extract, Sodium Hydroxide, Tetrasodium EDTA.",
        "suitable_skin_types": [
            "Oily",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Active Breakouts",
            "Large Pores",
            "Blackheads",
            "Acne Marks"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Niacinamide 10% + Zinc 1% Oil Control Serum",
        "brand": "The Ordinary",
        "category": "Serum",
        "price": 550.0,
        "original_price": 650.0,
        "rating": 4.7,
        "reviews_count": 5600,
        "image_url": "/products/the_ordinary_niacinamide_10_zinc_1_oil_control_serum.jpg",
        "description": "High-strength vitamin and mineral blemish formula that reduces the appearance of skin blemishes, congestion, and balances visible sebum activity.",
        "ingredients": "Aqua, Niacinamide, Pentylene Glycol, Zinc PCA, Dimethyl Isosorbide, Tamarindus Indica Seed Gum, Xanthan gum, Isoceteth-20, Ethoxydiglycol, Phenoxyethanol.",
        "suitable_skin_types": [
            "Oily",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Oiliness",
            "Active Breakouts",
            "Large Pores",
            "Acne Marks"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Hyaluronic Acid 2% + B5 Hydration Booster",
        "brand": "Minimalist",
        "category": "Serum",
        "price": 599.0,
        "original_price": 699.0,
        "rating": 4.8,
        "reviews_count": 1800,
        "image_url": "/products/minimalist_hyaluronic_acid_2_b5_hydration_booster.jpg",
        "description": "Multi-molecular weight hyaluronic acid serum formulated to penetrate multiple layers of the dermis, providing instant plumping, hydration, and soothing relief with Provitamin B5.",
        "ingredients": "Aqua, Sodium Hyaluronate, Dimethyl Isosorbide, Panthenol, Ethoxydiglycol, Phenoxyethanol, Ethylhexylglycerin, Hydroxyethylcellulose.",
        "suitable_skin_types": [
            "Dry",
            "Sensitive",
            "Combination",
            "Normal",
            "Oily"
        ],
        "target_concerns": [
            "Dryness",
            "Fine Lines",
            "Barrier Repair"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Vitamin C 16% Radiance Serum",
        "brand": "Minimalist",
        "category": "Serum",
        "price": 699.0,
        "original_price": 799.0,
        "rating": 4.6,
        "reviews_count": 2100,
        "image_url": "/products/minimalist_vitamin_c_16_radiance_serum.jpg",
        "description": "Advanced stable Vitamin C derivative (Ethyl Ascorbic Acid) combined with Ferulic Acid and Fullerene to fade stubborn hyperpigmentation, melasma, and enhance natural collagen.",
        "ingredients": "Aqua, 3-O-Ethyl Ascorbic Acid, Ethoxydiglycol, Dimethyl Isosorbide, Gluconolactone, Ferulic Acid, Fullerenes, Sodium Gluconate.",
        "suitable_skin_types": [
            "Normal",
            "Combination",
            "Oily",
            "Dry"
        ],
        "target_concerns": [
            "Pigmentation",
            "Uneven Tone",
            "Acne Marks",
            "Fine Lines"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Salicylic Acid 2% Oil-Control Serum",
        "brand": "The Ordinary",
        "category": "Serum",
        "price": 600.0,
        "original_price": 750.0,
        "rating": 4.6,
        "reviews_count": 3100,
        "image_url": "/products/the_ordinary_salicylic_acid_2_oil_control_serum.jpg",
        "description": "Water-based targeted serum crafted to remove dead surface cells and visibly reduce pore congestion for clearer, smoother, and more radiant complexion.",
        "ingredients": "Aqua, Cocamidopropyl Dimethylamine, Chlorphenesin, Citric Acid, Hydroxyethylcellulose, Phenoxyethanol, Polysorbate 20, Salicylic Acid, Sodium Hydroxide.",
        "suitable_skin_types": [
            "Oily",
            "Combination"
        ],
        "target_concerns": [
            "Active Breakouts",
            "Oiliness",
            "Large Pores",
            "Blackheads"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Advanced Snail 96 Mucin Power Essence",
        "brand": "Cosrx",
        "category": "Serum",
        "price": 1450.0,
        "original_price": 1650.0,
        "rating": 4.9,
        "reviews_count": 6800,
        "image_url": "/products/cosrx_advanced_snail_96_mucin_power_essence.jpg",
        "description": "Composed of 96% filtered snail secretion to nourish, replenish hydration, and repair damaged moisture barrier while calming post-inflammatory erythema.",
        "ingredients": "Snail Secretion Filtrate, Betaine, Butylene Glycol, 1,2-Hexanediol, Sodium Polyacrylate, Phenoxyethanol, Sodium Hyaluronate, Allantoin, Ethyl Hexanediol, Arginine.",
        "suitable_skin_types": [
            "Dry",
            "Sensitive",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Dryness",
            "Redness",
            "Barrier Repair",
            "Acne Marks"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Retinol 0.3% + Bakuchiol Youth Recovery Serum",
        "brand": "Minimalist",
        "category": "Serum",
        "price": 679.0,
        "original_price": 799.0,
        "rating": 4.7,
        "reviews_count": 1450,
        "image_url": "/products/minimalist_retinol_0_3_bakuchiol_youth_recovery_serum.jpg",
        "description": "Potent anti-aging elixir featuring pure Retinol stabilized in Squalane alongside Bakuchiol to diminish fine lines, crow's feet, and stimulate cellular regeneration.",
        "ingredients": "Squalane, Caprylic/Capric Triglyceride, Retinol, Bakuchiol, Tocopherol, Dimethyl Isosorbide, Polysorbate 20.",
        "suitable_skin_types": [
            "Normal",
            "Combination",
            "Dry",
            "Oily"
        ],
        "target_concerns": [
            "Fine Lines",
            "Uneven Tone",
            "Preventative Care"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Vitamin C Daily Glow Face Serum with Turmeric",
        "brand": "Mamaearth",
        "category": "Serum",
        "price": 499.0,
        "original_price": 599.0,
        "rating": 4.5,
        "reviews_count": 890,
        "image_url": "/products/mamaearth_vitamin_c_daily_glow_face_serum_with_turmeric.jpg",
        "description": "Enriched with natural Vitamin C from Tangerine and Turmeric extract to reduce dark spots and restore radiance.",
        "ingredients": "Aqua, 3-O-Ethyl Ascorbic Acid, Curcuma Longa Root Extract, Glycerin, Sodium Hyaluronate.",
        "suitable_skin_types": [
            "Normal",
            "Combination",
            "Oily"
        ],
        "target_concerns": [
            "Pigmentation",
            "Acne Marks",
            "Uneven Tone"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Granactive Retinoid 2% Emulsion",
        "brand": "The Ordinary",
        "category": "Serum",
        "price": 1050.0,
        "original_price": 1250.0,
        "rating": 4.7,
        "reviews_count": 1900,
        "image_url": "/products/the_ordinary_granactive_retinoid_2_emulsion.jpg",
        "description": "Next-generation retinoid active technology that offers superior anti-aging performance without the redness, irritation, and peeling of traditional retinol.",
        "ingredients": "Aqua, Glycerin, Caprylic/Capric Triglyceride, Ethyl Macadamiate, Hydroxypinacolone Retinoate, Dimethyl Isosorbide, Cetearyl Alcohol, Bisabolol.",
        "suitable_skin_types": [
            "Normal",
            "Sensitive",
            "Dry",
            "Combination"
        ],
        "target_concerns": [
            "Fine Lines",
            "Uneven Tone",
            "Preventative Care"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Centella Soothing Serum with Peptides",
        "brand": "Dot & Key",
        "category": "Serum",
        "price": 595.0,
        "original_price": 695.0,
        "rating": 4.6,
        "reviews_count": 410,
        "image_url": "/products/dot_key_centella_soothing_serum_with_peptides.jpg",
        "description": "Instant rescue serum for irritated, reactive, and red skin barriers. Concentrated Centella Asiatica calming peptides repair cellular integrity within 48 hours.",
        "ingredients": "Centella Asiatica Water, Copper Tripeptide-1, Glycerin, Niacinamide, Sodium Hyaluronate, Madecassoside, Allantoin.",
        "suitable_skin_types": [
            "Sensitive",
            "Dry",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Redness",
            "Barrier Repair",
            "Active Breakouts"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Ceramides 0.3% + Madecassoside Barrier Repair Cream",
        "brand": "Minimalist",
        "category": "Moisturizer",
        "price": 599.0,
        "original_price": 699.0,
        "rating": 4.8,
        "reviews_count": 2400,
        "image_url": "/products/minimalist_ceramides_0_3_madecassoside_barrier_repair_cream.jpg",
        "description": "Comforting daily moisturizer loaded with 5 skin-identical ceramides, phytosphingosine, and pure Madecassoside to seal micro-cracks in compromised lipid barriers.",
        "ingredients": "Aqua, Avena Sativa (Oat) Kernel Flour, Ceramide NP, Ceramide AP, Ceramide AS, Ceramide NS, Ceramide EOP, Madecassoside, Phytosphingosine, Glycerin.",
        "suitable_skin_types": [
            "Dry",
            "Sensitive",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Dryness",
            "Redness",
            "Barrier Repair"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Hydro Boost Hyaluronic Acid Water Gel",
        "brand": "Neutrogena",
        "category": "Moisturizer",
        "price": 950.0,
        "original_price": 1150.0,
        "rating": 4.7,
        "reviews_count": 3900,
        "image_url": "/products/neutrogena_hydro_boost_hyaluronic_acid_water_gel.jpg",
        "description": "Lightweight, non-comedogenic water gel that instantly quenches dehydrated skin and keeps it supple, smooth, and hydrated for up to 72 continuous hours.",
        "ingredients": "Water, Dimethicone, Glycerin, Dimethicone/Vinyl Dimethicone Crosspolymer, Phenoxyethanol, Polyacrylamide, Sodium Hyaluronate, C13-14 Isoparaffin, Laureth-7.",
        "suitable_skin_types": [
            "Oily",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Dryness",
            "Oiliness",
            "Large Pores"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Natural Moisturizing Factors + HA",
        "brand": "The Ordinary",
        "category": "Moisturizer",
        "price": 650.0,
        "original_price": 790.0,
        "rating": 4.6,
        "reviews_count": 2800,
        "image_url": "/products/the_ordinary_natural_moisturizing_factors_ha.jpg",
        "description": "Non-greasy cream that offers immediate hydration and lasting results by replicating skin's natural moisturizing factors (NMF) with 11 amino acids and phospholipids.",
        "ingredients": "Aqua, Caprylic/Capric Triglyceride, Cetyl Alcohol, Propanediol, Stearyl Alcohol, Glycerin, Sodium Hyaluronate, Arginine, Aspartic Acid, Glycine, Alanine, Serine.",
        "suitable_skin_types": [
            "Dry",
            "Normal",
            "Combination",
            "Sensitive"
        ],
        "target_concerns": [
            "Dryness",
            "Barrier Repair",
            "Preventative Care"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Moisturizing Cream with 3 Essential Ceramides",
        "brand": "CeraVe",
        "category": "Moisturizer",
        "price": 1250.0,
        "original_price": 1490.0,
        "rating": 4.9,
        "reviews_count": 4800,
        "image_url": "/products/cerave_moisturizing_cream_with_3_essential_ceramides.jpg",
        "description": "Rich, velvety restorative cream formulated to continuously release moisturizing ingredients for 24-hour hydration without feeling greasy or clogging pores.",
        "ingredients": "Aqua, Glycerin, Cetearyl Alcohol, Caprylic/Capric Triglyceride, Cetyl Alcohol, Ceteareth-20, Petrolatum, Potassium Phosphate, Ceramide NP, Ceramide AP, Ceramide EOP.",
        "suitable_skin_types": [
            "Dry",
            "Sensitive"
        ],
        "target_concerns": [
            "Dryness",
            "Redness",
            "Barrier Repair"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "72 HR Hydrating Gel Moisturizer with Probiotics",
        "brand": "Dot & Key",
        "category": "Moisturizer",
        "price": 495.0,
        "original_price": 595.0,
        "rating": 4.5,
        "reviews_count": 780,
        "image_url": "/products/dot_key_72_hr_hydrating_gel_moisturizer_with_probiotics.jpg",
        "description": "Oil-free gel moisturizer containing kombucha and fermented probiotics to balance skin's microbiome, tighten enlarged pores, and leave a dewy non-sticky finish.",
        "ingredients": "Aqua, Butylene Glycol, Saccharomyces/Xylinum/Black Tea Ferment, Dimethicone, Sodium Hyaluronate, Carbomer, Phenoxyethanol, Ethylhexylglycerin.",
        "suitable_skin_types": [
            "Oily",
            "Combination"
        ],
        "target_concerns": [
            "Oiliness",
            "Large Pores",
            "Dryness"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Green Tea Oil-Free Mattifying Moisturizer",
        "brand": "Plum",
        "category": "Moisturizer",
        "price": 470.0,
        "original_price": 550.0,
        "rating": 4.4,
        "reviews_count": 620,
        "image_url": "/products/plum_green_tea_oil_free_mattifying_moisturizer.jpg",
        "description": "Zero shine oil-free moisturizer powered by Green Tea Extract, Niacinamide, and Hyaluronic Acid that hydrates acne-prone skin with a velvety matte touch.",
        "ingredients": "Aqua, Aloe Barbadensis Leaf Juice, Isodecyl Neopentanoate, Niacinamide, Camellia Sinensis (Green Tea) Leaf Extract, Sodium Hyaluronate, Phenoxyethanol.",
        "suitable_skin_types": [
            "Oily",
            "Combination"
        ],
        "target_concerns": [
            "Oiliness",
            "Active Breakouts",
            "Large Pores"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Oil-Free Ultra-Moisturizing Lotion with Birch Sap",
        "brand": "Cosrx",
        "category": "Moisturizer",
        "price": 1390.0,
        "original_price": 1600.0,
        "rating": 4.7,
        "reviews_count": 1100,
        "image_url": "/products/cosrx_oil_free_ultra_moisturizing_lotion_with_birch_sap.jpg",
        "description": "Formulated with 70% Betula Platyphylla Japonica Juice (Japanese White Birch Sap) to rapidly calm sensitized and breakout-prone skin without any pore-clogging film.",
        "ingredients": "Betula Platyphylla Japonica Juice, Butylene Glycol, Glycerin, Dimethicone, Betaine, Cetearyl Alcohol, 1,2-Hexanediol, Cetearyl Olivate, Sorbitan Olivate.",
        "suitable_skin_types": [
            "Sensitive",
            "Oily",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Redness",
            "Oiliness",
            "Active Breakouts"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Sensibio Defensive Soothing Cream",
        "brand": "Bioderma",
        "category": "Moisturizer",
        "price": 1150.0,
        "original_price": 1350.0,
        "rating": 4.8,
        "reviews_count": 860,
        "image_url": "/products/bioderma_sensibio_defensive_soothing_cream.jpg",
        "description": "Active soothing cream specifically engineered to fortify the self-defense mechanism of sensitive and hyper-reactive skin exposed to environmental stressors.",
        "ingredients": "Aqua/Water/Eau, Glycerin, Dicaprylyl Ether, Glycol Palmitate, Butylene Glycol, Cetyl Alcohol, Glyceryl Stearate, Tocopherol, Carnosine, Salvia Miltiorrhiza Root Extract.",
        "suitable_skin_types": [
            "Sensitive",
            "Dry",
            "Normal"
        ],
        "target_concerns": [
            "Redness",
            "Barrier Repair",
            "Dryness"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Water Sleeping Mask with Squalane",
        "brand": "Laneige",
        "category": "Moisturizer",
        "price": 1950.0,
        "original_price": 2200.0,
        "rating": 4.8,
        "reviews_count": 3100,
        "image_url": "/products/laneige_water_sleeping_mask_with_squalane.jpg",
        "description": "Overnight probiotic-derived complex and nourishing squalane mask that delivers deep hydration to tired, dull skin while you sleep for a crystal glow by sunrise.",
        "ingredients": "Water/Aqua/Eau, Butylene Glycol, Glycerin, Trehalose, Methyl Trimethicone, 1,2-Hexanediol, Squalane, Phenyl Trimethicone, Carbomer, Tromethamine.",
        "suitable_skin_types": [
            "Dry",
            "Normal",
            "Combination"
        ],
        "target_concerns": [
            "Dryness",
            "Uneven Tone",
            "Preventative Care"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Light Fluid SPF 50 PA++++ Invisible Sunscreen",
        "brand": "Minimalist",
        "category": "Sunscreen",
        "price": 499.0,
        "original_price": 599.0,
        "rating": 4.8,
        "reviews_count": 3800,
        "image_url": "/products/minimalist_light_fluid_spf_50_pa_invisible_sunscreen.jpg",
        "description": "Broad-spectrum SPF 50 sunscreen with 4 very effective modern UV filters. Ultra-light watery texture that absorbs with zero white cast and no greasy residue.",
        "ingredients": "Aqua, Dimethicone, Diisopropyl Adipate, Methylene Bis-Benzotriazolyl Tetramethylbutylphenol, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Ethylhexyl Triazone, Niacinamide.",
        "suitable_skin_types": [
            "All",
            "Oily",
            "Dry",
            "Combination",
            "Sensitive",
            "Normal"
        ],
        "target_concerns": [
            "Preventative Care",
            "Pigmentation",
            "Fine Lines"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Invisible Gel Sunscreen SPF 50+ PA++++",
        "brand": "WishCare",
        "category": "Sunscreen",
        "price": 499.0,
        "original_price": 599.0,
        "rating": 4.7,
        "reviews_count": 4200,
        "image_url": "/products/wishcare_invisible_gel_sunscreen_spf_50_pa.jpg",
        "description": "Transparent gel sunscreen with 100% invisible application. Non-greasy, water-resistant broad-spectrum protection.",
        "ingredients": "Cyclopentasiloxane, Dimethicone Crosspolymer, Ethylhexyl Methoxycinnamate, Zinc Oxide, Niacinamide.",
        "suitable_skin_types": [
            "Oily",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Oiliness",
            "Preventative Care",
            "Dryness"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Ultra Sheer Dry-Touch Sunblock SPF 50+",
        "brand": "Neutrogena",
        "category": "Sunscreen",
        "price": 675.0,
        "original_price": 750.0,
        "rating": 4.5,
        "reviews_count": 2900,
        "image_url": "/products/neutrogena_ultra_sheer_dry_touch_sunblock_spf_50.jpg",
        "description": "Features Helioplex technology for superior broad-spectrum protection. Leaves a clean, non-greasy, matte finish that resists sweat and water for 80 minutes.",
        "ingredients": "Water, Homosalate, Ethylhexyl Salicylate, Benzophenone-3, Octocrylene, Butyl Methoxydibenzoylmethane, Silica, Styrene/Acrylates Copolymer.",
        "suitable_skin_types": [
            "Oily",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Oiliness",
            "Preventative Care"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Watermelon Cooling Matte Sunscreen SPF 50+",
        "brand": "Dot & Key",
        "category": "Sunscreen",
        "price": 445.0,
        "original_price": 545.0,
        "rating": 4.6,
        "reviews_count": 930,
        "image_url": "/products/dot_key_watermelon_cooling_matte_sunscreen_spf_50.jpg",
        "description": "Infused with cold-pressed watermelon extract and hyaluronic acid. Provides an instant cooling sensation, controls mid-day shine, and blocks 98% of UV rays.",
        "ingredients": "Aqua, Ethylhexyl Salicylate, Watermelon Fruit Extract, Hyaluronic Acid, Octocrylene, Dimethicone, Phenoxyethanol, Ethylhexylglycerin.",
        "suitable_skin_types": [
            "Oily",
            "Combination"
        ],
        "target_concerns": [
            "Oiliness",
            "Large Pores",
            "Preventative Care"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Photoderm MAX Cream SPF 50+ High Defense",
        "brand": "Bioderma",
        "category": "Sunscreen",
        "price": 1050.0,
        "original_price": 1250.0,
        "rating": 4.8,
        "reviews_count": 750,
        "image_url": "/products/bioderma_photoderm_max_cream_spf_50_high_defense.jpg",
        "description": "Maximum biological photoprotection with Cellular Bioprotection patent. Prevents cellular DNA breakdown, premature aging, and cutaneous solar intolerance.",
        "ingredients": "Aqua/Water/Eau, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Homosalate, Diisopropyl Sebacate, Bis-Ethylhexyloxyphenol Methoxyphenyl Triazine, Ectoin, Mannitol.",
        "suitable_skin_types": [
            "Sensitive",
            "Dry",
            "Normal"
        ],
        "target_concerns": [
            "Redness",
            "Preventative Care",
            "Barrier Repair"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Daily Sun Gel SPF 50 PA++++ Centella",
        "brand": "Innisfree",
        "category": "Sunscreen",
        "price": 1250.0,
        "original_price": 1450.0,
        "rating": 4.7,
        "reviews_count": 880,
        "image_url": "/products/innisfree_daily_sun_gel_spf_50_pa_centella.jpg",
        "description": "A soothing, dewy chemical sunscreen infused with Jeju green tea and cica that absorbs like a serum, leaving skin radiant, soothed, and shielded.",
        "ingredients": "Water, Dibutyl Adipate, Propanediol, Diethylamino Hydroxybenzoyl Hexyl Benzoate, Ethylhexyl Triazone, Centella Asiatica Extract, Camellia Sinensis Leaf Extract.",
        "suitable_skin_types": [
            "Dry",
            "Sensitive",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Redness",
            "Dryness",
            "Preventative Care"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Caffeine Solution 5% + EGCG De-Puffing Eye Serum",
        "brand": "The Ordinary",
        "category": "Eye Cream",
        "price": 750.0,
        "original_price": 890.0,
        "rating": 4.6,
        "reviews_count": 3400,
        "image_url": "/products/the_ordinary_caffeine_solution_5_egcg_de_puffing_eye_serum.jpg",
        "description": "High concentration of caffeine combined with Epigallocatechin Gallatyl Glucoside (EGCG) from green tea leaves to target dark circles and under-eye bags.",
        "ingredients": "Aqua, Caffeine, Maltodextrin, Glycerin, Propanediol, Epigallocatechin Gallatyl Glucoside, Gallyl Glucoside, Hyaluronic Acid, Oxidized Glutathione.",
        "suitable_skin_types": [
            "All",
            "Oily",
            "Dry",
            "Combination",
            "Normal",
            "Sensitive"
        ],
        "target_concerns": [
            "Dark Circles",
            "Fine Lines"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Multi-Peptide Under Eye Cream with Retinol",
        "brand": "Minimalist",
        "category": "Eye Cream",
        "price": 599.0,
        "original_price": 699.0,
        "rating": 4.7,
        "reviews_count": 920,
        "image_url": "/products/minimalist_multi_peptide_under_eye_cream_with_retinol.jpg",
        "description": "Formulated with Matrixyl 3000, caffeine, and encapsulated retinol to soften crow's feet, boost firmness, and brighten stubborn periorbital discoloration.",
        "ingredients": "Aqua, Glycerin, Butylene Glycol, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Caffeine, Retinol, Sodium Hyaluronate, Tocopherol.",
        "suitable_skin_types": [
            "Dry",
            "Normal",
            "Combination"
        ],
        "target_concerns": [
            "Dark Circles",
            "Fine Lines",
            "Preventative Care"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Pomegranate & Peptides Brightening Eye Cream",
        "brand": "Dot & Key",
        "category": "Eye Cream",
        "price": 545.0,
        "original_price": 645.0,
        "rating": 4.5,
        "reviews_count": 480,
        "image_url": "/products/dot_key_pomegranate_peptides_brightening_eye_cream.jpg",
        "description": "Infused with antioxidant-dense Pomegranate, Vitamin C, and bio-peptides. Cools tired eyes instantly and reverses stress-induced pigmentation.",
        "ingredients": "Aqua, Punica Granatum Fruit Extract, Ascorbyl Glucoside, Acetyl Hexapeptide-8, Glycerin, Dimethicone, Phenoxyethanol.",
        "suitable_skin_types": [
            "All",
            "Sensitive",
            "Dry",
            "Normal"
        ],
        "target_concerns": [
            "Dark Circles",
            "Pigmentation"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Eye Repair Cream with Niacinamide & Ceramides",
        "brand": "CeraVe",
        "category": "Eye Cream",
        "price": 1100.0,
        "original_price": 1300.0,
        "rating": 4.8,
        "reviews_count": 1600,
        "image_url": "/products/cerave_eye_repair_cream_with_niacinamide_ceramides.jpg",
        "description": "Ophthalmologist-tested under eye cream that visibly reduces dark circles and puffiness while restoring the delicate ocular moisture barrier.",
        "ingredients": "Aqua, Niacinamide, Cetyl Alcohol, Caprylic/Capric Triglyceride, Glycerin, Propanediol, Ceramide NP, Ceramide AP, Ceramide EOP, Hyaluronic Acid, Marine & Botanical Complex.",
        "suitable_skin_types": [
            "Sensitive",
            "Dry",
            "Normal",
            "Combination"
        ],
        "target_concerns": [
            "Dark Circles",
            "Dryness",
            "Barrier Repair"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "AHA 30% + BHA 2% Peeling Solution",
        "brand": "The Ordinary",
        "category": "Exfoliant",
        "price": 850.0,
        "original_price": 990.0,
        "rating": 4.8,
        "reviews_count": 8200,
        "image_url": "/products/the_ordinary_aha_30_bha_2_peeling_solution.jpg",
        "description": "10-minute exfoliating facial peeling mask that exfoliates the top dermal layer for brighter, clearer skin and unblocks congested pores.",
        "ingredients": "Glycolic Acid, Aqua, Aloe Barbadensis Leaf Water, Sodium Hydroxide, Daucus Carota Sativa Extract, Propanediol, Cocamidopropyl Dimethylamine, Salicylic Acid, Lactic Acid, Tartaric Acid, Citric Acid.",
        "suitable_skin_types": [
            "Oily",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Pigmentation",
            "Acne Marks",
            "Large Pores",
            "Uneven Tone"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "AHA 25% + PHA 5% + BHA 2% Peeling Solution",
        "brand": "Minimalist",
        "category": "Exfoliant",
        "price": 699.0,
        "original_price": 799.0,
        "rating": 4.7,
        "reviews_count": 2100,
        "image_url": "/products/minimalist_aha_25_pha_5_bha_2_peeling_solution.jpg",
        "description": "Multi-acid chemical peel buffered with Aloe Vera and Turmeric extract. Sheds dead cellular debris, softens fine lines, and refines rough texture safely.",
        "ingredients": "Aqua, Glycolic Acid, Aloe Barbadensis Leaf Juice, Lactic Acid, Gluconolactone, Mandelic Acid, Salicylic Acid, Curcuma Longa (Turmeric) Root Extract, Sodium Hyaluronate.",
        "suitable_skin_types": [
            "Oily",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Uneven Tone",
            "Acne Marks",
            "Large Pores"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Lactic Acid 10% + HA Mild Peeling Formulation",
        "brand": "The Ordinary",
        "category": "Exfoliant",
        "price": 750.0,
        "original_price": 890.0,
        "rating": 4.6,
        "reviews_count": 1900,
        "image_url": "/products/the_ordinary_lactic_acid_10_ha_mild_peeling_formulation.jpg",
        "description": "High-strength lactic acid superficial peeling formulation with purified Tasmanian Pepperberry known to reduce signs of inflammation and sensitivity associated with exfoliation.",
        "ingredients": "Aqua, Lactic Acid, Glycerin, Pentylene Glycol, Propanediol, Sodium Hydroxide, Sodium Hyaluronate Crosspolymer, Tasmannia Lanceolata Fruit/Leaf Extract.",
        "suitable_skin_types": [
            "Dry",
            "Sensitive",
            "Normal",
            "Combination"
        ],
        "target_concerns": [
            "Dryness",
            "Uneven Tone",
            "Fine Lines"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "10% AHA + 1% BHA Body & Face Peeling Solution",
        "brand": "WishCare",
        "category": "Exfoliant",
        "price": 549.0,
        "original_price": 649.0,
        "rating": 4.5,
        "reviews_count": 420,
        "image_url": "/products/wishcare_10_aha_1_bha_body_face_peeling_solution.jpg",
        "description": "Gentle dual chemical exfoliant targeting rough skin texture and clogged pores.",
        "ingredients": "Aqua, Lactic Acid, Glycolic Acid, Salicylic Acid, Centella Asiatica Extract, Blueberry Extract.",
        "suitable_skin_types": [
            "Sensitive",
            "Dry",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Pigmentation",
            "Uneven Tone",
            "Redness"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Salicylic Acid 2% Clarifying Masque with Charcoal",
        "brand": "The Ordinary",
        "category": "Mask",
        "price": 1200.0,
        "original_price": 1400.0,
        "rating": 4.7,
        "reviews_count": 2300,
        "image_url": "/products/the_ordinary_salicylic_acid_2_clarifying_masque_with_charcoal.jpg",
        "description": "Infused with charcoal and clays, this rinse-off masque targets lack of luster and textural irregularities, leaving skin feeling refreshed and purified.",
        "ingredients": "Aqua, Kaolin, Squalane, Glycerin, Dimethyl Isosorbide, Silica Cetyl Silylate, Salicylic Acid, Sodium Polyacrylate, Charcoal Powder, 4-t-Butylcyclohexanol.",
        "suitable_skin_types": [
            "Oily",
            "Combination"
        ],
        "target_concerns": [
            "Oiliness",
            "Active Breakouts",
            "Large Pores",
            "Blackheads"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "Jeju Volcanic Pore Clearing Clay Mask",
        "brand": "Innisfree",
        "category": "Mask",
        "price": 1100.0,
        "original_price": 1300.0,
        "rating": 4.8,
        "reviews_count": 3100,
        "image_url": "/products/innisfree_jeju_volcanic_pore_clearing_clay_mask.jpg",
        "description": "Formulated with volcanic clusters from Jeju Island and AHA. Deep cleanses pores, absorbs sebum by 98%, and sloughs off dead surface cells.",
        "ingredients": "Water/Aqua/Eau, Titanium Dioxide, Butylene Glycol, Volcanic Ash, Glycerin, Silica, Trehalose, Caprylic/Capric Triglyceride, Kaolin, Bentonite.",
        "suitable_skin_types": [
            "Oily",
            "Combination"
        ],
        "target_concerns": [
            "Oiliness",
            "Large Pores",
            "Blackheads"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Hyaluronic & Pink Clay Overnight Sleeping Mask",
        "brand": "Dot & Key",
        "category": "Mask",
        "price": 645.0,
        "original_price": 745.0,
        "rating": 4.6,
        "reviews_count": 520,
        "image_url": "/products/dot_key_hyaluronic_pink_clay_overnight_sleeping_mask.jpg",
        "description": "Luxurious French Pink Clay and Hyaluronic Acid mask that purifies skin overnight without drying it out, revealing a plump, baby-soft bounce.",
        "ingredients": "Aqua, Kaolin (French Pink Clay), Glycerin, Sodium Hyaluronate, Bulgarian Rose Water, Niacinamide, Phenoxyethanol.",
        "suitable_skin_types": [
            "Dry",
            "Sensitive",
            "Normal",
            "Combination"
        ],
        "target_concerns": [
            "Dryness",
            "Uneven Tone",
            "Preventative Care"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "Master Patch Intensive Hydrocolloid Blemish Dots",
        "brand": "Cosrx",
        "category": "Spot Treatment",
        "price": 650.0,
        "original_price": 790.0,
        "rating": 4.9,
        "reviews_count": 5100,
        "image_url": "/products/cosrx_master_patch_intensive_hydrocolloid_blemish_dots.jpg",
        "description": "Ultra-thin, tapered medical hydrocolloid patches infused with Tea Tree Oil and Salicylic Acid to absorb exudate and flatten cystic pimples overnight.",
        "ingredients": "Cellulose Gum, Hydrogenated Poly(C6-20 Olefin), Polyisobutene, Mineral Oil, Melaleuca Alternifolia (Tea Tree) Leaf Oil, Salicylic Acid.",
        "suitable_skin_types": [
            "All",
            "Oily",
            "Combination",
            "Sensitive",
            "Normal"
        ],
        "target_concerns": [
            "Active Breakouts",
            "Acne Marks"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "10% Azelaic Acid Suspension",
        "brand": "The Ordinary",
        "category": "Spot Treatment",
        "price": 950.0,
        "original_price": 1150.0,
        "rating": 4.7,
        "reviews_count": 3900,
        "image_url": "/products/the_ordinary_10_azelaic_acid_suspension.jpg",
        "description": "Multifunctional brightening cream that visibly targets blemish-prone skin, uneven tone, persistent redness, and rosacea with medical-grade azelaic acid.",
        "ingredients": "Aqua, Isodecyl Neopentanoate, Dimethicone, Azelaic Acid, Dimethicone/Bis-Isobutyl PPG-20 Crosspolymer, Dimethyl Isosorbide, Cetearyl Alcohol, Glyceryl Stearate.",
        "suitable_skin_types": [
            "Sensitive",
            "Oily",
            "Combination",
            "Normal"
        ],
        "target_concerns": [
            "Redness",
            "Active Breakouts",
            "Acne Marks",
            "Pigmentation"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    },
    {
        "name": "100% Plant-Derived Squalane Glow Oil",
        "brand": "The Ordinary",
        "category": "Night Cream",
        "price": 850.0,
        "original_price": 990.0,
        "rating": 4.8,
        "reviews_count": 2600,
        "image_url": "/products/the_ordinary_100_plant_derived_squalane_glow_oil.jpg",
        "description": "100% pure plant-derived squalane hydrates skin while supporting its natural moisture barrier without comedogenic pore blockage or greasiness.",
        "ingredients": "100% Pure Plant-Derived Squalane (ECOCERT approved).",
        "suitable_skin_types": [
            "Dry",
            "Sensitive",
            "Normal",
            "Combination"
        ],
        "target_concerns": [
            "Dryness",
            "Barrier Repair",
            "Fine Lines"
        ],
        "acne_friendly": True,
        "is_bestseller": False
    },
    {
        "name": "3:1:1 Barrier Bounce Moisturizing Night Cream",
        "brand": "WishCare",
        "category": "Night Cream",
        "price": 3800.0,
        "original_price": 4400.0,
        "rating": 4.9,
        "reviews_count": 1800,
        "image_url": "/products/wishcare_3_1_1_barrier_bounce_moisturizing_night_cream.jpg",
        "description": "Rich lipid night recovery cream featuring the dermatological 3:1:1 golden ratio of Ceramides, Cholesterol, and Fatty Acids.",
        "ingredients": "Aqua, Ceramide NP, Ceramide AP, Ceramide EOP, Cholesterol, Linoleic Acid, Squalane, Hyaluronic Acid.",
        "suitable_skin_types": [
            "Dry",
            "Normal",
            "Combination"
        ],
        "target_concerns": [
            "Fine Lines",
            "Dryness",
            "Barrier Repair",
            "Preventative Care"
        ],
        "acne_friendly": True,
        "is_bestseller": True
    }
]

COUPONS_DATA = [
    {
        "code": "GLOW20",
        "discount_percent": 20.0,
        "flat_discount": 0.0,
        "min_order": 499.0,
        "active": True,
        "description": "20% off on all skincare orders above ₹499"
    },
    {
        "code": "FIRSTGLOW",
        "discount_percent": 0.0,
        "flat_discount": 200.0,
        "min_order": 799.0,
        "active": True,
        "description": "Flat ₹200 off on your first order above ₹799"
    },
    {
        "code": "AURA50",
        "discount_percent": 50.0,
        "flat_discount": 0.0,
        "min_order": 1499.0,
        "active": True,
        "description": "50% off mega beauty discount on orders above ₹1499"
    }
]

SAMPLE_REVIEWS = [
    {
        "user_name": "Dr. Ananya Sharma",
        "rating": 5,
        "title": "Visible reduction in breakouts within 10 days",
        "comment": "As someone with combination acne-prone skin, this formula has cleared my micro-comedones without any peeling or redness. Highly recommended!",
        "skin_type": "Combination",
        "verified": True
    },
    {
        "user_name": "Priya Mehra",
        "rating": 5,
        "title": "GlowAura AI matched this perfectly!",
        "comment": "The AI skin analysis detected my high redness and recommended this barrier cream. My skin has never felt calmer or more hydrated.",
        "skin_type": "Sensitive",
        "verified": True
    },
    {
        "user_name": "Rohan Deshmukh",
        "rating": 4,
        "title": "Non-greasy and absorbs fast",
        "comment": "Leaves zero white cast and feels like weightless water on my oily T-zone. Perfect daily holy grail.",
        "skin_type": "Oily",
        "verified": True
    }
]

def seed_database(app):
    with app.app_context():
        db.create_all()

        # Seed Users
        if not User.query.filter_by(email="admin@glowaura.com").first():
            admin = User(
                email="admin@glowaura.com",
                password_hash=generate_password_hash("admin123"),
                full_name="GlowAura Director",
                phone="+91 98765 43210",
                role="admin",
                skin_type="Normal"
            )
            db.session.add(admin)

        if not User.query.filter_by(email="demo@glowaura.com").first():
            demo_user = User(
                email="demo@glowaura.com",
                password_hash=generate_password_hash("glow123"),
                full_name="Aarohi Patel",
                phone="+91 91234 56789",
                role="user",
                skin_type="Combination",
                streak_days=5
            )
            db.session.add(demo_user)
            db.session.commit()

            # Add sample scan for demo user
            sample_scan = SkinScan(
                user_id=demo_user.id,
                image_path="/static/logo.jpg",
                skin_type="Combination",
                acne_severity="Mild",
                acne_score=82,
                skin_tone="Light",
                skin_tone_hex="#F7D5C2",
                hydration_level="Medium",
                hydration_score=68,
                health_score=86,
                confidence_score=95.4,
                concerns_json=json.dumps(["Oiliness", "Large Pores", "Acne Marks"]),
                detected_spots_json=json.dumps([
                    {"x": 42.5, "y": 58.2, "radius": 6, "severity": "mild"},
                    {"x": 65.1, "y": 52.8, "radius": 8, "severity": "mild"}
                ]),
                summary_text="Baseline clinical scan: balanced barrier with slight localized T-zone sebum elevation and mild cheek blemishes."
            )
            db.session.add(sample_scan)

        # Seed Coupons
        for c in COUPONS_DATA:
            if not Coupon.query.filter_by(code=c["code"]).first():
                coupon = Coupon(
                    code=c["code"],
                    discount_percent=c["discount_percent"],
                    flat_discount=c["flat_discount"],
                    min_order=c["min_order"],
                    active=c["active"],
                    description=c["description"]
                )
                db.session.add(coupon)

        # Seed Products (Ensure all 52 products)
        existing_count = Product.query.count()
        if existing_count < len(PRODUCTS_DATA):
            # Clear or add missing
            for p_data in PRODUCTS_DATA:
                existing = Product.query.filter_by(name=p_data["name"]).first()
                if not existing:
                    prod = Product(
                        name=p_data["name"],
                        brand=p_data["brand"],
                        category=p_data["category"],
                        price=p_data["price"],
                        original_price=p_data["original_price"],
                        rating=p_data["rating"],
                        reviews_count=p_data["reviews_count"],
                        image_url=p_data["image_url"],
                        description=p_data["description"],
                        ingredients=p_data["ingredients"],
                        suitable_skin_types=json.dumps(p_data["suitable_skin_types"]),
                        target_concerns=json.dumps(p_data["target_concerns"]),
                        acne_friendly=p_data["acne_friendly"],
                        is_bestseller=p_data["is_bestseller"]
                    )
                    db.session.add(prod)
            db.session.commit()

            # Seed sample reviews for top products
            prods = Product.query.limit(10).all()
            for prod in prods:
                if len(prod.reviews) == 0:
                    for s_rev in SAMPLE_REVIEWS:
                        rev = Review(
                            product_id=prod.id,
                            user_name=s_rev["user_name"],
                            rating=s_rev["rating"],
                            title=s_rev["title"],
                            comment=s_rev["comment"],
                            skin_type=s_rev["skin_type"],
                            verified=s_rev["verified"]
                        )
                        db.session.add(rev)

        db.session.commit()
        print(f"Database seeded successfully with {Product.query.count()} products!")
