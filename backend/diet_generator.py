def generate_personalized_diet(skin_type="Combination", concerns=None, acne_severity="Mild"):
    """
    Generates a tailored 4-week diet plan structured by dermatological and nutritional synergy:
    Week 1: Cellular Hydration & Flushing
    Week 2: Skin Barrier & Collagen Repair
    Week 3: Anti-Acne & Anti-Inflammatory Microbiome
    Week 4: Radiance & Glow Maintenance
    """
    if concerns is None:
        concerns = ["Hydration", "Glow"]

    is_acne_prone = acne_severity in ["Mild", "Moderate", "Severe"] or "Acne Marks" in concerns

    return {
        "title": "GlowAura 4-Week Dermatological Nutrition Protocol",
        "description": f"Clinically calibrated for {skin_type} skin targeting {', '.join(concerns[:3])}.",
        "daily_water_target_liters": 3.2 if skin_type == "Dry" else 3.0,
        "daily_water_glasses": 12 if skin_type == "Dry" else 10,
        "primary_supplements": [
            {"name": "Zinc Picolinate (30mg)", "benefit": "Controls sebum hyper-production and speeds wound healing"},
            {"name": "Omega-3 Fatty Acids (EPA/DHA 1000mg)", "benefit": "Fortifies intercellular lipid matrix and calms redness"},
            {"name": "Liposomal Vitamin C (500mg)", "benefit": "Accelerates pro-collagen synthesis and fades melanin deposits"},
            {"name": "Spore Probiotics (50 Billion CFU)", "benefit": "Balances the gut-skin axis to prevent acne flares"}
        ],
        "foods_to_avoid": [
            {"item": "High-Glycemic Sugars & Syrups", "reason": "Triggers insulin spikes that overstimulate sebaceous gland IGF-1 receptors."},
            {"item": "Skim & Commercial Cow Milk", "reason": "Contains bovine hormones that aggravate inflammatory cystic acne."},
            {"item": "Trans-Fats & Deep Fried Foods", "reason": "Oxidizes sebum lipids causing clogged pores and free radical stress."},
            {"item": "Excessive Table Sodium", "reason": "Causes fluid retention and periorbital morning puffiness."}
        ],
        "dermatologist_tips": [
            "Drink 500ml of room temperature water with lemon first thing upon waking to stimulate hepatic detox.",
            "Incorporate raw culinary herbs (cilantro, parsley, mint) for natural heavy metal chelation.",
            "Eat colorful vegetables spanning the antioxidant rainbow (carotenoids, lycopene, anthocyanins).",
            "Stop eating at least 3 hours before sleep to optimize overnight autophagy and skin cellular repair."
        ],
        "weeks": [
            {
                "week_number": 1,
                "theme": "Hydration & Electrolyte Infusion",
                "goal": "Rehydrate interstitial skin tissue and flush stored metabolic toxins.",
                "meals": {
                    "breakfast": {
                        "name": "Hydra-Green Smoothie Bowl",
                        "ingredients": "Spinach, cucumber, chia seeds, coconut water, kiwi, and hemp hearts.",
                        "benefits": "Rich in potassium, magnesium, and bio-available water."
                    },
                    "lunch": {
                        "name": "Mediterranean Quinoa & Avocado Salad",
                        "ingredients": "Cooked quinoa, English cucumber, heirloom tomatoes, kalamata olives, avocado, cold-pressed olive oil.",
                        "benefits": "Essential monounsaturated fatty acids that prevent transepidermal water loss (TEWL)."
                    },
                    "snack": {
                        "name": "Watermelon & Mint Slices + Raw Almonds",
                        "ingredients": "Fresh watermelon wedges sprinkled with chia seeds and 8 raw soaked almonds.",
                        "benefits": "Lycopene sun-shielding and vitamin E moisture reinforcement."
                    },
                    "dinner": {
                        "name": "Steamed Wild Salmon / Silken Tofu with Asparagus",
                        "ingredients": "Grilled salmon or herb-crusted tofu, steamed asparagus, sauteed zucchini, lemon-dill dressing.",
                        "benefits": "Clean protein providing amino acid building blocks for moisture retention."
                    }
                }
            },
            {
                "week_number": 2,
                "theme": "Skin Repair & Collagen Synthesis",
                "goal": "Rebuild structural dermis proteins and accelerate post-breakout epidermal healing.",
                "meals": {
                    "breakfast": {
                        "name": "Collagen-Boosted Rolled Oats & Berry Parfait",
                        "ingredients": "Gluten-free rolled oats, plant collagen booster, wild blueberries, pumpkin seeds, almond milk.",
                        "benefits": "Packed with anthocyanins to safeguard newly formed elastin fibers."
                    },
                    "lunch": {
                        "name": "Lentil & Sweet Potato Power Bowl",
                        "ingredients": "Steamed beluga lentils, roasted orange sweet potatoes, massaged kale, tahini lemon dressing.",
                        "benefits": "Abundant beta-carotene converts to natural vitamin A (retinol equivalent) in the body."
                    },
                    "snack": {
                        "name": "Golden Turmeric Bone Broth / Miso Shiitake Cup",
                        "ingredients": "Simmered vegetable miso or bone broth infused with grated fresh turmeric and cracked black pepper.",
                        "benefits": "Curcuminoids suppress cellular NF-kB inflammatory cascades."
                    },
                    "dinner": {
                        "name": "Herb-Roasted Tempeh or Chicken with Broccoli Florets",
                        "ingredients": "Rosemary-seasoned lean protein, roasted broccoli, garlic-infused mashed cauliflower.",
                        "benefits": "Sulfur compounds like sulforaphane stimulate skin cell rejuvenation."
                    }
                }
            },
            {
                "week_number": 3,
                "theme": "Anti-Acne & Microbiome Balancing",
                "goal": "Eliminate systemic gut inflammation, stabilize hormones, and clear blemish-causing microbes.",
                "meals": {
                    "breakfast": {
                        "name": "Anti-Inflammatory Golden Papaya Chia Pudding",
                        "ingredients": "Overnight chia seeds in coconut kefir, topped with ripe papaya cubes and crushed walnuts.",
                        "benefits": "Papain enzymes gently clear sluggish digestion while probiotics rebalance cutaneous flora."
                    },
                    "lunch": {
                        "name": "Warm Spiced Chickpea & Spinach Stew",
                        "ingredients": "Slow-cooked chickpeas, fresh baby spinach, cumin, ginger, coriander, and brown basmati rice.",
                        "benefits": "Low-glycemic index prevents sebum-stimulating insulin surges."
                    },
                    "snack": {
                        "name": "Ceremonial Matcha Latte with Pumpkin Seeds",
                        "ingredients": "Whisked ceremonial Uji matcha, oat milk, 1 tbsp raw pepitas (pumpkin seeds).",
                        "benefits": "EGCG catechins inhibit 5-alpha reductase and reduce acne-causing sebum."
                    },
                    "dinner": {
                        "name": "Baked Cod / Cauliflower Steak with Rainbow Chard",
                        "ingredients": "Baked white fish or roasted thick-cut cauliflower, braised rainbow chard, squeeze of fresh lime.",
                        "benefits": "Clean, light evening digestion that prevents toxic overnight byproduct buildup."
                    }
                }
            },
            {
                "week_number": 4,
                "theme": "Radiance & Glow Maintenance",
                "goal": "Maximize cutaneous blood micro-circulation and lock in lasting luminous radiance.",
                "meals": {
                    "breakfast": {
                        "name": "Radiant Berry & Flaxseed Acai Bowl",
                        "ingredients": "Unsweetened organic acai puree, ground flaxseed, pomegranate arils, fresh raspberries.",
                        "benefits": "Unrivaled ORAC antioxidant score protecting cells from environmental urban pollutants."
                    },
                    "lunch": {
                        "name": "Rainbow Buddha Bowl with Citrus Tahini Dressing",
                        "ingredients": "Edamame, grated purple cabbage, shredded carrots, avocado, brown rice, sesame seeds.",
                        "benefits": "Carotenoid glow confirmed in clinical dermatology to impart healthy skin luminosity."
                    },
                    "snack": {
                        "name": "Brazil Nuts (2 nuts) & Dark Chocolate (85%+)",
                        "ingredients": "Two raw Brazil nuts (100% daily selenium requirement) + one square single-origin dark chocolate.",
                        "benefits": "Selenium supports glutathione peroxidase, your body's master antioxidant enzyme."
                    },
                    "dinner": {
                        "name": "Grilled Herbed Trout / Marinated Tofu with Zucchini Ribbons",
                        "ingredients": "Lightly grilled protein with lemon zest, herb ribbons, cherry tomatoes, and warm farro.",
                        "benefits": "Complete amino acid profile sustaining taut epidermal elasticity and enduring glow."
                    }
                }
            }
        ]
    }
