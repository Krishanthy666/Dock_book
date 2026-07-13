from deep_translator import GoogleTranslator
import logging

logger = logging.getLogger("translator")

def translate_to_english(text: str, source_lang: str) -> str:
    """
    Translates input text to English.
    If source_lang is 'en', returns text as is.
    If translation fails, returns original text.
    """
    if not text or not text.strip():
        return text

    source_lang = source_lang.lower().strip()
    if source_lang == 'en':
        return text

    # Map frontend lang codes to deep-translator codes if different
    # 'ta' is Tamil, 'si' is Sinhala
    try:
        translated = GoogleTranslator(source=source_lang, target='en').translate(text)
        return translated if translated else text
    except Exception as e:
        logger.error(f"Translation to English failed for source '{source_lang}': {e}")
        return text

LOCAL_TRANSLATIONS = {
    "ta": {
        # Diseases
        "Flu": "காய்ச்சல் (Flu)",
        "Common Cold": "சளி (Common Cold)",
        "COVID-19": "கோவிட்-19 (COVID-19)",
        "Migraine": "ஒற்றைத் தலைவலி (Migraine)",
        "Asthma": "ஆஸ்துமா (Asthma)",
        "Diabetes": "நீரிழிவு நோய் (Diabetes)",
        "Hypertension": "உயர் இரத்த அழுத்தம் (Hypertension)",
        "Food Poisoning": "உணவு நச்சுத்தன்மை (Food Poisoning)",
        "Kidney Infection": "சிறுநீரக தொற்று (Kidney Infection)",
        "Arthritis": "கீல்வாதம் (Arthritis)",
        
        # Specialists
        "General Practitioner": "பொது மருத்துவர் (General Practitioner)",
        "Pulmonologist": "நுரையீரல் நிபுணர் (Pulmonologist)",
        "Neurologist": "நரம்பியல் நிபுணர் (Neurologist)",
        "Endocrinologist": "நாளமில்லா சுரப்பி நிபுணர் (Endocrinologist)",
        "Cardiologist": "இருதய நோய் நிபுணர் (Cardiologist)",
        "Gastroenterologist": "இரைப்பை குடல் நிபுணர் (Gastroenterologist)",
        "Nephrologist": "சிறுநீரக மருத்துவர் (Nephrologist)",
        "Rheumatologist": "வாத நோய் நிபுணர் (Rheumatologist)",
        
        # Care Advice
        "Rest as much as possible, drink plenty of warm fluids (water, tea, broth), and consider over-the-counter pain relievers to manage fever and body aches.": "முடிந்தவரை ஓய்வெடுக்கவும், நிறைய சூடான திரவங்களை (தண்ணீர், தேநீர், கஞ்சி) குடிக்கவும், காய்ச்சல் மற்றும் உடல் வலியை நிர்வகிக்க மருத்துவர் பரிந்துரைக்காத வலி நிவாரணிகளை எடுத்துக்கொள்வதை பரிசீலிக்கவும்.",
        "Stay hydrated by drinking warm water, rest your body, and use throat lozenges or saline nasal drops if needed to relieve congestion.": "சூடான நீரைக் குடிப்பதன் மூலம் உடலை நீர்ச்சத்துடன் வைத்திருக்கவும், உடலுக்கு ஓய்வு அளிக்கவும், தேவைப்பட்டால் அடைப்பை நீக்க தொண்டை மாத்திரைகள் அல்லது உப்பு நாசி சொட்டுகளைப் பயன்படுத்தவும்.",
        "Isolate yourself immediately in a well-ventilated room, wear a high-filtration mask, monitor your oxygen levels, and seek emergency medical care if you experience breathing difficulties.": "நன்கு காற்றோட்டமான அறையில் உடனடியாக உங்களைத் தனிமைப்படுத்திக் கொள்ளுங்கள், உயர் வடிகட்டுதல் முகமூடியை அணியுங்கள், உங்கள் ஆக்ஸிஜன் அளவைக் கண்காணியுங்கள், மேலும் உங்களுக்கு மூச்சு விடுவதில் சிரமம் இருந்தால் அவசர மருத்துவ உதவியை நாடவும்.",
        "Rest in a quiet, dark room, avoid screen time, apply a cold compress to your forehead or neck, and stay hydrated.": "அமைதியான, இருண்ட அறையில் ஓய்வெடுக்கவும், திரை நேரத்தைத் தவிர்க்கவும், உங்கள் நெற்றியில் அல்லது கழுத்தில் குளிர்ந்த ஒத்தடம் கொடுக்கவும், மேலும் நீர்ச்சத்துடன் இருக்கவும்.",
        "Use your prescribed rescue inhaler immediately, stay calm, sit upright, and remove yourself from any known triggers like dust, smoke, or pollen.": "உங்களுக்கு பரிந்துரைக்கப்பட்ட இன்ஹேலரை உடனடியாகப் பயன்படுத்தவும், அமைதியாக இருங்கள், நிமிர்ந்து உட்காரவும், மேலும் தூசி, புகை அல்லது மகரந்தம் போன்ற அறியப்பட்ட அலர்ஜி தூண்டுதல்களிலிருந்து உங்களை விலக்கிக் கொள்ளுங்கள்.",
        "Monitor your blood sugar levels regularly, adhere strictly to your low-glycemic dietary plan, stay hydrated, and take any prescribed insulin or medications.": "உங்கள் இரத்த சர்க்கரை அளவை தவறாமல் கண்காணிக்கவும், குறைந்த குளுக்கோஸ் உணவு முறையை கண்டிப்பாக பின்பற்றவும், நீர்ச்சத்துடன் இருக்கவும், பரிந்துரைக்கப்பட்ட இன்சுலின் அல்லது மருந்துகளை எடுத்துக்கொள்ளவும்.",
        "Reduce sodium intake, practice stress-management techniques (deep breathing, meditation), monitor your blood pressure daily, and avoid caffeine.": "உப்பு உட்கொள்வதை குறைக்கவும், மன அழுத்த மேலாண்மை நுட்பங்களை (ஆழ்ந்த சுவாசம், தியானம்) பயிற்சி செய்யவும், தினமும் உங்கள் இரத்த அழுத்தத்தை கண்காணிக்கவும், மேலும் காஃபினைத் தவிர்க்கவும்.",
        "Stay hydrated by sipping water or electrolyte solutions, avoid solid foods for a few hours, then start with bland foods (bananas, rice, toast).": "தண்ணீர் அல்லது எலக்ட்ரோலைட் கரைசல்களை பருகுவதன் மூலம் உடலை நீர்ச்சத்துடன் வைத்திருக்கவும், சில மணிநேரங்களுக்கு திட உணவுகளைத் தவிர்க்கவும், பின்னர் காரமில்லாத உணவுகளை (வாழைப்பழம், சாதம், டோஸ்ட்) உண்ணத் தொடங்குங்கள்.",
        "Drink plenty of water to help flush out bacteria, rest, and make sure to complete any prescribed antibiotic courses exactly as directed by your doctor.": "பாக்டீரியாவை வெளியேற்ற நிறைய தண்ணீர் குடிக்கவும், ஓய்வெடுக்கவும், மேலும் உங்கள் மருத்துவர் இயக்கியபடி பரிந்துரைக்கப்பட்ட ஆன்டிபயாடிக் மருந்துகளை முழுமையாக முடிக்கவும்.",
        "Engage in low-impact gentle exercises (swimming, walking), use warm compresses to soothe stiff joints or cold packs to reduce acute inflammation, and maintain a healthy weight.": "குறைந்த தாக்கமுடைய மென்மையான உடற்பயிற்சிகளில் (நீச்சல், நடைப்பயிற்சி) ஈடுபடுங்கள், விறைப்பான மூட்டுகளைத் தணிக்க வெதுவெதுப்பான ஒத்தடத்தையோ அல்லது வீக்கத்தைக் குறைக்க குளிர்ந்த ஒத்தடத்தையோ பயன்படுத்தவும், மேலும் ஆரோக்கியமான எடையைப் பராமரிக்கவும்."
    },
    "si": {
        # Diseases
        "Flu": "ඉන්ෆ්ලුවෙන්සා උණ (Flu)",
        "Common Cold": "සෙම්ප්‍රතිශ්‍යාව (Common Cold)",
        "COVID-19": "කොවිඩ්-19 (COVID-19)",
        "Migraine": "ඉරුවාරදය (Migraine)",
        "Asthma": "ඇදුම (Asthma)",
        "Diabetes": "දියවැඩියාව (Diabetes)",
        "Hypertension": "අධි රුධිර පීඩනය (Hypertension)",
        "Food Poisoning": "ආහාර විෂවීම (Food Poisoning)",
        "Kidney Infection": "වකුගඩු ආසාදනය (Kidney Infection)",
        "Arthritis": "සන්ධි ප්‍රදාහය / ආතරයිටිස් (Arthritis)",
        
        # Specialists
        "General Practitioner": "පවුලේ වෛද්‍යවරයා (General Practitioner)",
        "Pulmonologist": "පෙනහළු විශේෂඥ වෛද්‍ය (Pulmonologist)",
        "Neurologist": "ස්නායු විශේෂඥ වෛද්‍ය (Neurologist)",
        "Endocrinologist": "හෝමෝන විශේෂඥ වෛද්‍ය (Endocrinologist)",
        "Cardiologist": "හෘද රෝග විශේෂඥ වෛද්‍ය (Cardiologist)",
        "Gastroenterologist": "ආමාශ ආන්ත්‍රික විශේෂඥ වෛද්‍ය (Gastroenterologist)",
        "Nephrologist": "වකුගඩු රෝග විශේෂඥ වෛද්‍ය (Nephrologist)",
        "Rheumatologist": "සන්ධි සහ වාත රෝග විශේෂඥ වෛද්‍ය (Rheumatologist)",
        
        # Care Advice
        "Rest as much as possible, drink plenty of warm fluids (water, tea, broth), and consider over-the-counter pain relievers to manage fever and body aches.": "හැකිතාක් විවේක ගන්න, ඕනෑතරම් උණුසුම් දියර වර්ග (වතුර, තේ, කැඳ) පානය කරන්න, සහ උණ සහ ඇඟපත වේදනාව පාලනය කිරීම සඳහා වේදනා නාශක භාවිතය ගැන සලකා බලන්න.",
        "Stay hydrated by drinking warm water, rest your body, and use throat lozenges or saline nasal drops if needed to relieve congestion.": "උණුසුම් ජලය පානය කිරීමෙන් විජලනය වළක්වා ගන්න, ශරීරයට විවේකයක් දෙන්න, සහ අවශ්‍ය නම් නාසයේ හිරවීම අඩු කිරීමට උගුරේ පෙති හෝ සේලයින් නාසික බිංදු භාවිතා කරන්න.",
        "Isolate yourself immediately in a well-ventilated room, wear a high-filtration mask, monitor your oxygen levels, and seek emergency medical care if you experience breathing difficulties.": "හොඳින් වාතාශ්‍රය ඇති කාමරයක වහාම හුදකලා වන්න, ආරක්ෂිත මුඛ ආවරණයක් පළඳින්න, ඔක්සිජන් මට්ටම නිරීක්ෂණය කරන්න, සහ හුස්ම ගැනීමට අපහසු නම් වහාම හදිසි ප්‍රතිකාර පතන්න.",
        "Rest in a quiet, dark room, avoid screen time, apply a cold compress to your forehead or neck, and stay hydrated.": "නිශ්ශබ්ද, අඳුරු කාමරයක විවේක ගන්න, පරිගණක/ජංගම දුරකථන තිර දෙස බැලීමෙන් වළකින්න, නළලට හෝ බෙල්ලට සීතල සම්පීඩනයක් යොදන්න, සහ හොඳින් වතුර බොන්න.",
        "Use your prescribed rescue inhaler immediately, stay calm, sit upright, and remove yourself from any known triggers like dust, smoke, or pollen.": "ඔබට නියමිත ඉන්හේලරය වහාම භාවිතා කරන්න, සන්සුන් වන්න, කෙළින්ම වාඩි වන්න, සහ දූවිලි, දුම හෝ මල් රේණු වැනි ආසාත්මිකතා ඇති කරන දේවලින් වහාම ඉවත් වන්න.",
        "Monitor your blood sugar levels regularly, adhere strictly to your low-glycemic dietary plan, stay hydrated, and take any prescribed insulin or medications.": "රුධිරයේ සීනි මට්ටම නිරන්තරයෙන් පරීක්ෂා කරන්න, පිෂ්ඨය අඩු ආහාර පාලනය අනුගමනය කරන්න, හොඳින් වතුර බොන්න, සහ වෛද්‍යවරයා නියම කළ ඉන්සියුලින් හෝ ඖෂධ ලබා ගන්න.",
        "Reduce sodium intake, practice stress-management techniques (deep breathing, meditation), monitor your blood pressure daily, and avoid caffeine.": "ලුණු භාවිතය අඩු කරන්න, මානසික ආතතිය පාලනය කිරීමේ ක්‍රම (ගැඹුරු හුස්ම ගැනීම, භාවනාව) ප්‍රගුණ කරන්න, දිනපතා රුධිර පීඩනය නිරීක්ෂණය කරන්න, සහ කැෆේන් අඩංගු පානවලින් වළකින්න.",
        "Stay hydrated by sipping water or electrolyte solutions, avoid solid foods for a few hours, then start with bland foods (bananas, rice, toast).": "වතුර හෝ ඉලෙක්ට්‍රොලයිට් දියර ස්වල්පය බැගින් නිතර පානය කරන්න, පැය කිහිපයකට ඝන ආහාර ගැනීමෙන් වළකින්න, පසුව මෘදු ආහාර (කෙසෙල්, බත්, ටෝස්ට් කළ පාන්) වලින් ආරම්භ කරන්න.",
        "Drink plenty of water to help flush out bacteria, rest, and make sure to complete any prescribed antibiotic courses exactly as directed by your doctor.": "හොඳින් වතුර බොන්න සහ වෛද්‍යවරයා නියම කළ ප්‍රතිජීවක ඖෂධ මාත්‍රාව සම්පූර්ණ කිරීමට වගබලා ගන්න.",
        "Engage in low-impact gentle exercises (swimming, walking), use warm compresses to soothe stiff joints or cold packs to reduce acute inflammation, and maintain a healthy weight.": "සැහැල්ලු ව්‍යායාමවල (පිහිනීම, ඇවිදීම) නිරත වන්න, සන්ධි තද ගතිය සඳහා උණුසුම් සම්පීඩනයක් හෝ තදබල ඉදිමීම් සඳහා සීතල සම්පීඩනයක් යොදන්න, සහ සෞඛ්‍ය සම්පන්න බරක් පවත්වා ගන්න."
    }
}

def translate_to_english(text: str, source_lang: str) -> str:
    """
    Translates input text to English.
    If source_lang is 'en', returns text as is.
    If translation fails, returns original text.
    """
    if not text or not text.strip():
        return text

    source_lang = source_lang.lower().strip()
    if source_lang == 'en':
        return text

    # Map frontend lang codes to deep-translator codes if different
    try:
        translated = GoogleTranslator(source=source_lang, target='en').translate(text)
        return translated if translated else text
    except Exception as e:
        logger.error(f"Translation to English failed for source '{source_lang}': {e}")
        return text

def translate_from_english(text: str, target_lang: str) -> str:
    """
    Translates English text to the target language (e.g. 'ta', 'si').
    If target_lang is 'en', returns text as is.
    If translation fails, returns original text.
    """
    if not text or not text.strip():
        return text

    target_lang = target_lang.lower().strip()
    if target_lang == 'en':
        return text

    # Try local translation mapping first for reliability and speed
    local_dict = LOCAL_TRANSLATIONS.get(target_lang, {})
    if text in local_dict:
        return local_dict[text]

    try:
        translated = GoogleTranslator(source='en', target=target_lang).translate(text)
        return translated if translated else text
    except Exception as e:
        logger.error(f"Translation from English failed to target '{target_lang}': {e}")
        return text
