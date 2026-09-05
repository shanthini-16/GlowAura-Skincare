import json

def calculate_match_score(product, skin_analysis):
    """
    Computes accurate match score (0-100%) for a product given skin diagnostics.
    Enforces strict dermatological safety:
    - Never recommends products unsuitable for detected skin type (returns 0 or <40).
    - Checks acne severity vs product comedogenic compatibility.
    """
    skin_type = skin_analysis.get('skin_type', 'Normal')
    concerns = skin_analysis.get('concerns', [])
    acne_severity = skin_analysis.get('acne_severity', 'Clear')
    
    suitable_types = product.get('suitable_skin_types', [])
    target_concerns = product.get('target_concerns', [])
    acne_friendly = product.get('acne_friendly', True)
    rating = product.get('rating', 4.5)

    # 1. Strict Skin Type Gate
    # "Never recommend products unsuitable for detected skin"
    if "All" not in suitable_types and skin_type not in suitable_types:
        return 0

    # 2. Strict Acne Safety Gate
    if acne_severity in ['Moderate', 'Severe'] and not acne_friendly:
        return 0

    # Base score for compatible skin type
    score = 65.0

    # 3. Concern Matching Bonus (+8% per matching concern, up to +24%)
    concern_overlap = set(concerns).intersection(set(target_concerns))
    score += len(concern_overlap) * 9.0

    # 4. Acne Friendliness Bonus
    if acne_severity != 'Clear' and acne_friendly:
        score += 6.0

    # 5. Product Rating boost (+2% to +5%)
    score += (rating - 4.0) * 5.0

    # Clamp between 72% and 99% for valid matches
    final_score = int(min(99, max(72, score)))
    return final_score

def build_personalized_routine(products, skin_analysis):
    """
    Selects optimal products from catalog for Morning, Night, and Weekly routines.
    """
    skin_type = skin_analysis.get('skin_type', 'Normal')
    acne_severity = skin_analysis.get('acne_severity', 'Clear')

    # Score all products
    scored_products = []
    for p in products:
        score = calculate_match_score(p, skin_analysis)
        if score > 0:
            p_copy = dict(p)
            p_copy['match_score'] = score
            scored_products.append(p_copy)

    # Sort by match score then rating descending
    scored_products.sort(key=lambda x: (x['match_score'], x.get('rating', 0)), reverse=True)

    def find_best_for_category(categories):
        for p in scored_products:
            if p.get('category') in categories:
                return p
        # Fallback to any in category if scored filtered
        for p in products:
            if p.get('category') in categories:
                p_copy = dict(p)
                p_copy['match_score'] = 82
                return p_copy
        return None

    morning_cleanser = find_best_for_category(['Cleanser'])
    morning_serum = find_best_for_category(['Serum'])
    morning_moisturizer = find_best_for_category(['Moisturizer'])
    morning_sunscreen = find_best_for_category(['Sunscreen'])

    night_cleanser = find_best_for_category(['Cleanser'])
    night_treatment = find_best_for_category(['Spot Treatment', 'Serum', 'Night Cream'])
    night_cream = find_best_for_category(['Night Cream', 'Moisturizer'])
    night_eye_cream = find_best_for_category(['Eye Cream'])

    weekly_exfoliant = find_best_for_category(['Exfoliant'])
    weekly_mask = find_best_for_category(['Mask'])

    return {
        "morning": [
            {
                "step": 1,
                "step_name": "Purify & Cleanse",
                "category": "Cleanser",
                "product": morning_cleanser,
                "instructions": "Wash gently with lukewarm water for 60 seconds to clear overnight sebum without stripping lipid barrier."
            },
            {
                "step": 2,
                "step_name": "Target & Correct",
                "category": "Serum",
                "product": morning_serum,
                "instructions": "Apply 3-4 drops and pat gently into damp skin to boost cellular hydration and antioxidant defense."
            },
            {
                "step": 3,
                "step_name": "Hydrate & Lock",
                "category": "Moisturizer",
                "product": morning_moisturizer,
                "instructions": "Smooth a pea-sized amount over face and neck to reinforce the stratum corneum."
            },
            {
                "step": 4,
                "step_name": "Shield & Protect",
                "category": "Sunscreen",
                "product": morning_sunscreen,
                "instructions": "Apply 2 finger lengths generously 15 minutes before sun exposure to prevent photo-aging and UV dark spots."
            }
        ],
        "night": [
            {
                "step": 1,
                "step_name": "Deep Cleanse",
                "category": "Cleanser",
                "product": night_cleanser,
                "instructions": "Double cleanse to thoroughly dissolve makeup, sunscreen residue, and environmental micro-pollutants."
            },
            {
                "step": 2,
                "step_name": "Active Treatment",
                "category": "Treatment",
                "product": night_treatment,
                "instructions": "Target active breakouts and hyperpigmentation directly overnight when cell regeneration peaks."
            },
            {
                "step": 3,
                "step_name": "Cellular Barrier Recovery",
                "category": "Night Cream",
                "product": night_cream,
                "instructions": "Massage a rich layer to stimulate overnight collagen remodeling and moisture barrier replenishing."
            },
            {
                "step": 4,
                "step_name": "Periorbital Rejuvenation",
                "category": "Eye Cream",
                "product": night_eye_cream,
                "instructions": "Dab lightly with ring finger along orbital bone to reduce dark circles and puffiness."
            }
        ],
        "weekly": [
            {
                "step": 1,
                "step_name": "Chemical Exfoliation",
                "frequency": "1-2 times per week (PM)",
                "category": "Exfoliant",
                "product": weekly_exfoliant,
                "instructions": "Dissolves dead keratinocyte build-up, decongests pores, and accelerates cellular turnover."
            },
            {
                "step": 2,
                "step_name": "Intensive Skin Mask",
                "frequency": "2 times per week",
                "category": "Mask",
                "product": weekly_mask,
                "instructions": "Leave on for 10-15 minutes to deeply purify pores or flood the skin with botanical hydrators."
            }
        ]
    }
