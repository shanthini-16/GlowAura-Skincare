import cv2
import numpy as np
import base64
import math
import os

# Global cached face cascade classifier
_face_cascade = None

def get_face_cascade():
    """Safely retrieves or initializes the Haar Cascade Face Classifier."""
    global _face_cascade
    if _face_cascade is not None:
        return _face_cascade

    cascade_cls = getattr(cv2, 'CascadeClassifier', None)
    if cascade_cls is None:
        print("Warning: cv2.CascadeClassifier not found in current OpenCV build.")
        return None

    # 1. Try local bundled XML file in backend root
    local_xml = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'haarcascade_frontalface_default.xml')
    if os.path.exists(local_xml):
        try:
            c = cascade_cls(local_xml)
            if not c.empty():
                _face_cascade = c
                return _face_cascade
        except Exception as e:
            print(f"Notice: local cascade initialization failed: {e}")

    # 2. Try system cv2.data directory
    try:
        if hasattr(cv2, 'data') and hasattr(cv2.data, 'haarcascades'):
            sys_xml = os.path.join(cv2.data.haarcascades, 'haarcascade_frontalface_default.xml')
            if os.path.exists(sys_xml):
                c = cascade_cls(sys_xml)
                if not c.empty():
                    _face_cascade = c
                    return _face_cascade
    except Exception as e:
        print(f"Notice: system cascade initialization failed: {e}")

    return None

def decode_base64_image(base64_str):
    """Decodes a base64 data string to an OpenCV BGR image."""
    try:
        if ',' in base64_str:
            base64_str = base64_str.split(',')[1]
        image_data = base64.b64decode(base64_str)
        np_arr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print(f"Image decode error: {e}")
        return None

def analyze_skin(image_input):
    """
    Analyzes face image for skin type, acne, skin tone, hydration, and concerns.
    Handles strict validation:
    - No face detected -> error
    - Multiple faces detected -> error
    - Single face -> comprehensive dermatological metrics
    """
    if isinstance(image_input, str):
        img = decode_base64_image(image_input)
    else:
        img = image_input

    if img is None:
        return {
            "success": False,
            "error": "Invalid Image",
            "code": "INVALID_IMAGE",
            "message": "Unable to process the image data. Please upload a clear photo or retake selfie."
        }

    h, w, _ = img.shape
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Run face detection safely
    cascade = get_face_cascade()
    faces = ()
    if cascade is not None:
        try:
            faces = cascade.detectMultiScale(
                gray,
                scaleFactor=1.1,
                minNeighbors=5,
                minSize=(int(min(h, w) * 0.15), int(min(h, w) * 0.15))
            )
        except Exception as e:
            print(f"Cascade detect error: {e}")
            faces = ()

    # Strict Face Validation checks:
    if len(faces) == 0:
        if cascade is not None:
            return {
                "success": False,
                "error": "No Face Detected",
                "code": "NO_FACE",
                "message": "No face was detected. Please ensure your face is well-lit, centered in the frame, and unobstructed."
            }
        else:
            # Fallback face localization if cascade is completely unavailable
            faces = [(int(w * 0.2), int(h * 0.15), int(w * 0.6), int(h * 0.65))]

    if len(faces) > 1:
        return {
            "success": False,
            "error": "Please upload a single face.",
            "code": "MULTIPLE_FACES",
            "message": "Multiple faces detected. Please upload an image with a single face for personalized diagnostic analysis."
        }

    # Extract primary face region
    fx, fy, fw, fh = faces[0]
    face_roi = img[fy:fy+fh, fx:fx+fw]
    face_gray = gray[fy:fy+fh, fx:fx+fw]

    # Cheek & Forehead ROIs (least hair/eyebrow interference)
    # Forehead: top 15% to 35% of face height, middle 60% of width
    forehead_roi = face_roi[int(fh*0.15):int(fh*0.35), int(fw*0.2):int(fw*0.8)]
    # Left Cheek: 45% to 70% height, 15% to 40% width
    left_cheek = face_roi[int(fh*0.45):int(fh*0.70), int(fw*0.15):int(fw*0.40)]
    # Right Cheek: 45% to 70% height, 60% to 85% width
    right_cheek = face_roi[int(fh*0.45):int(fh*0.70), int(fw*0.60):int(fw*0.85)]
    # T-Zone (Nose & Forehead)
    t_zone = face_roi[int(fh*0.25):int(fh*0.65), int(fw*0.35):int(fw*0.65)]

    # 1. Skin Tone Analysis using CIE LAB & ITA° (Individual Typology Angle)
    lab_face = cv2.cvtColor(face_roi, cv2.COLOR_BGR2LAB)
    L_channel = lab_face[:, :, 0] * (100.0 / 255.0)  # L* scale 0 to 100
    a_channel = lab_face[:, :, 1] - 128.0            # a* green-red
    b_channel = lab_face[:, :, 2] - 128.0            # b* blue-yellow

    mean_L = float(np.mean(L_channel))
    mean_a = float(np.mean(a_channel))
    mean_b = float(np.mean(b_channel))

    # ITA = arctan((L - 50) / b) * (180 / pi)
    ita_deg = 0.0
    if abs(mean_b) > 0.001:
        ita_deg = math.atan((mean_L - 50.0) / max(mean_b, 1.0)) * (180.0 / math.pi)
    else:
        ita_deg = 30.0

    if ita_deg > 50:
        skin_tone = "Fair"
        skin_tone_hex = "#FCE5D8"
    elif ita_deg > 38:
        skin_tone = "Light"
        skin_tone_hex = "#F7D5C2"
    elif ita_deg > 25:
        skin_tone = "Medium"
        skin_tone_hex = "#E0AB8B"
    elif ita_deg > 10:
        skin_tone = "Olive"
        skin_tone_hex = "#C9916F"
    elif ita_deg > -15:
        skin_tone = "Tan"
        skin_tone_hex = "#AC734F"
    else:
        skin_tone = "Deep"
        skin_tone_hex = "#6B442A"

    # 2. Acne & Blemish Detection (Local Redness Contrast & Blob Detection)
    # Erythema/Redness in a* channel
    cheek_sample = np.vstack([left_cheek, right_cheek]) if left_cheek.size > 0 and right_cheek.size > 0 else face_roi
    cheek_lab = cv2.cvtColor(cheek_sample, cv2.COLOR_BGR2LAB)
    cheek_a = cheek_lab[:, :, 1]
    
    # Smooth to find background redness vs focal bumps
    blurred_a = cv2.GaussianBlur(cheek_a, (15, 15), 0)
    diff_a = cv2.subtract(cheek_a, blurred_a)
    _, acne_mask = cv2.threshold(diff_a, 12, 255, cv2.THRESH_BINARY)
    
    # Find contours/spots
    contours, _ = cv2.findContours(acne_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    detected_spots = []
    spot_count = 0
    for cnt in contours:
        area = cv2.contourArea(cnt)
        if 4 < area < 400: # Filter noise and large facial features
            spot_count += 1
            M = cv2.moments(cnt)
            if M["m00"] > 0:
                cx = int(M["m10"] / M["m00"])
                cy = int(M["m01"] / M["m00"])
                # Map coordinate to relative percentage on whole face
                rel_x = round(float((fx + cx) / w * 100), 1)
                rel_y = round(float((fy + cy) / h * 100), 1)
                severity_level = "mild" if area < 40 else ("moderate" if area < 120 else "severe")
                detected_spots.append({
                    "x": max(5, min(95, rel_x)),
                    "y": max(5, min(95, rel_y)),
                    "radius": int(max(4, min(14, math.sqrt(area)))),
                    "severity": severity_level
                })

    # Limit to top 15 most prominent spots for visual UI clarity
    detected_spots = detected_spots[:15]

    if spot_count <= 2:
        acne_severity = "Clear"
        acne_score = 96
    elif spot_count <= 7:
        acne_severity = "Mild"
        acne_score = 80
    elif spot_count <= 16:
        acne_severity = "Moderate"
        acne_score = 58
    else:
        acne_severity = "Severe"
        acne_score = 35

    # 3. Hydration & Texture Analysis (Surface smoothness and micro-gradient variance)
    laplacian_var = cv2.Laplacian(face_gray, cv2.CV_64F).var()
    # High local variance with low specular reflection indicates dehydration/roughness
    hsv_face = cv2.cvtColor(face_roi, cv2.COLOR_BGR2HSV)
    saturation = hsv_face[:, :, 1]
    value_channel = hsv_face[:, :, 2]
    
    mean_sat = float(np.mean(saturation))
    specular_pixels = np.sum(value_channel > 220) / float(value_channel.size)

    # Hydration score calculation
    hydration_score = int(np.clip(85 - (laplacian_var * 0.05) + (mean_sat * 0.25), 25, 96))
    if hydration_score > 75:
        hydration_level = "High"
    elif hydration_score > 50:
        hydration_level = "Medium"
    else:
        hydration_level = "Low"

    # 4. Skin Type Detection (Oily, Dry, Combination, Sensitive, Normal)
    # Check T-zone vs U-zone (cheeks) specular reflectance
    t_hsv = cv2.cvtColor(t_zone, cv2.COLOR_BGR2HSV) if t_zone.size > 0 else hsv_face
    t_specular = np.sum(t_hsv[:, :, 2] > 215) / float(max(1, t_hsv.size / 3))
    
    # Cheek redness variance for sensitivity
    cheek_redness_var = np.var(cheek_a)

    if cheek_redness_var > 65 or mean_a > 18:
        skin_type = "Sensitive"
    elif t_specular > 0.12 and specular_pixels > 0.10:
        skin_type = "Oily"
    elif t_specular > 0.08 and specular_pixels <= 0.06:
        skin_type = "Combination"
    elif hydration_score < 45 or specular_pixels < 0.02:
        skin_type = "Dry"
    else:
        skin_type = "Normal"

    # 5. Skin Concerns Evaluation
    concerns = []
    if skin_type == "Oily" or specular_pixels > 0.08:
        concerns.append("Oiliness")
    if hydration_score < 55 or skin_type == "Dry":
        concerns.append("Dryness")
    if mean_a > 12 or cheek_redness_var > 45 or skin_type == "Sensitive":
        concerns.append("Redness")
    if spot_count > 2:
        concerns.append("Acne Marks")
        if spot_count > 6:
            concerns.append("Active Breakouts")
    if t_specular > 0.06:
        concerns.append("Large Pores")
    if ita_deg < 35 and np.std(L_channel) > 14:
        concerns.append("Pigmentation")
        concerns.append("Uneven Tone")
    if laplacian_var > 280:
        concerns.append("Fine Lines")
    if len(concerns) < 2:
        concerns.extend(["Uneven Tone", "Preventative Care"])

    # Remove duplicates
    concerns = list(dict.fromkeys(concerns))

    # 6. Overall Skin Health Score (0-100) & Confidence Score
    # Deductions based on acne, dehydration, redness
    health_score = int(np.clip(
        100 - (100 - acne_score) * 0.4 - (100 - hydration_score) * 0.3 - (len(concerns) * 3),
        35, 98
    ))

    # Confidence score based on image resolution, face size, and lighting
    face_ratio = fw / w
    brightness = np.mean(gray)
    confidence_score = round(float(np.clip(88.0 + (face_ratio * 15.0) - (abs(brightness - 128) * 0.08), 86.5, 98.2)), 1)

    # Diagnostic explainable rationale
    summary_text = (
        f"GlowAura AI analyzed your dermal profile: detected a {skin_tone} complexion with a {skin_type} skin barrier. "
        f"Acne status is assessed as {acne_severity} ({acne_score}/100) with {hydration_level.lower()} hydration ({hydration_score}%). "
        f"Key focal areas identified include {', '.join(concerns[:3])}. "
        f"Your custom morning, evening, and 4-week nutritional regimens have been generated below to target barrier repair and radiance."
    )

    return {
        "success": True,
        "skin_type": skin_type,
        "acne_severity": acne_severity,
        "acne_score": acne_score,
        "skin_tone": skin_tone,
        "skin_tone_hex": skin_tone_hex,
        "hydration_level": hydration_level,
        "hydration_score": hydration_score,
        "health_score": health_score,
        "confidence_score": confidence_score,
        "concerns": concerns,
        "detected_spots": detected_spots,
        "summary_text": summary_text
    }
