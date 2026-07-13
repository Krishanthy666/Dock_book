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
        "Rest as much as possible to help your body fight the infection. Drink plenty of warm fluids (such as water, herbal tea, or broth) to stay hydrated. Consider over-the-counter pain relievers like paracetamol or ibuprofen to manage fever and relieve body aches. Avoid strenuous physical activity and isolate yourself from others to prevent spreading the virus.": "உங்கள் உடல் தொற்றுநோயை எதிர்த்துப் போராட முடிந்தவரை ஓய்வெடுங்கள். உடலை நீர்ச்சத்துடன் வைத்திருக்க நிறைய வெதுவெதுப்பான திரவங்களை (தண்ணீர், மூலிகை தேநீர் அல்லது கஞ்சி போன்றவை) குடிக்கவும். காய்ச்சலைக் கட்டுப்படுத்தவும் உடல் வலியைக் குறைக்கவும் பாராசிட்டமால் அல்லது ஐபுப்ரூஃபன் போன்ற வலி நிவாரணிகளைப் பயன்படுத்துவதைக் கருத்தில் கொள்ளுங்கள். கடுமையான உடல் செயல்பாடுகளைத் தவிர்த்து, வைரஸ் பரவாமல் தடுக்க மற்றவர்கிலிருந்து உங்களைத் தனிமைப்படுத்திக் கொள்ளுங்கள்.",
        "Stay hydrated by drinking plenty of warm water or juice. Get adequate rest to support your immune system. Use saline nasal drops or sprays to relieve nasal congestion. Gargle with warm salt water or use throat lozenges to soothe a sore throat. Avoid cold drinks, drafts, and sudden temperature changes.": "நிறைய வெதுவெதுப்பான தண்ணீர் அல்லது சாறு குடிப்பதன் மூலம் உடலை நீர்ச்சத்துடன் வைத்திருங்கள். உங்கள் நோய் எதிர்ப்பு சக்தியை ஆதரிக்க போதுமான ஓய்வு பெறுங்கள். மூக்கடைப்பை நீக்க உப்பு நாசி சொட்டுகள் அல்லது ஸ்ப்ரேக்களைப் பயன்படுத்தவும். தொண்டை புண்ணைத் தணிக்க வெதுவெதுப்பான உப்பு நீரால் வாய் கொப்பளிக்கவும் அல்லது தொண்டை மாத்திரைகளைப் பயன்படுத்தவும். குளிர்ந்த பானங்கள், காற்று வீசும் இடங்கள் மற்றும் திடீர் வெப்பநிலை மாற்றங்களைத் தவிர்க்கவும்.",
        "Isolate yourself immediately in a well-ventilated single room. Wear a high-filtration mask (like N95 or KN95) if you must be around others. Monitor your oxygen levels daily using a pulse oximeter. Stay hydrated, rest, and take fever-reducing medications. Seek emergency medical attention immediately if you experience shortness of breath, chest pain, or blue lips.": "நன்கு காற்றோட்டமான ஒற்றை அறையில் உடனடியாக உங்களைத் தனிமைப்படுத்திக் கொள்ளுங்கள். நீங்கள் மற்றவர்களுடன் இருக்க வேண்டியிருந்தால் அதிக வடிகட்டுதல் கொண்ட முகமூடியை (N95 அல்லது KN95 போன்றது) அணியுங்கள். பல்ஸ் ஆக்ஸிமீட்டரைப் பயன்படுத்தி தினமும் உங்கள் ஆக்ஸிஜன் அளவைக் கண்காணியுங்கள். நீர்ச்சத்துடன் இருங்கள், ஓய்வெடுங்கள் மற்றும் காய்ச்சலைக் குறைக்கும் மருந்துகளை உட்கொள்ளுங்கள். உங்களுக்கு மூச்சுத் திணறல், நெஞ்சு வலி அல்லது உதடுகள் நீல நிறமாக மாறுவது போன்ற அறிகுறிகள் ஏற்பட்டால் உடனடியாக அவசர மருத்துவ உதவியை நாடவும்.",
        "Rest in a quiet, dark, and cool room. Avoid screens, bright lights, and loud noises. Apply a cold compress or ice pack wrapped in a cloth to your forehead or the back of your neck. Sip water to stay hydrated, as dehydration is a common trigger. Avoid caffeine and strong odors, and consider taking over-the-counter pain relievers at the onset.": "அமைதியான, இருண்ட மற்றும் குளிர்ந்த அறையில் ஓய்வெடுங்கள். திரைகள், பிரகாசமான விளக்குகள் மற்றும் உரத்த சத்தங்களைத் தவிர்க்கவும். உங்கள் நெற்றியில் அல்லது உங்கள் கழுத்தின் பின்புறத்தில் ஒரு துணியில் சுற்றப்பட்ட குளிர்ந்த ஒத்தடம் அல்லது ஐஸ் பேக்கை வைக்கவும். நீர்ச்சத்துடன் இருக்க தண்ணீரை கொஞ்சம் கொஞ்சமாக பருகுங்கள், ஏனெனில் நீர்ச்சத்து குறைபாடு ஒரு பொதுவான அலர்ஜி தூண்டுதலாகும். காஃபின் மற்றும் வலுவான வாசனை திரவியங்களைத் தவிர்க்கவும், மேலும் தொடக்கத்திலேயே வலி நிவாரணிகளை உட்கொள்வதைக் கருத்தில் கொள்ளுங்கள்.",
        "Use your prescribed rescue inhaler (bronchodilator) immediately as directed. Sit upright and try to keep your breathing calm and steady. Remove yourself from any environment containing triggers (such as dust, cigarette smoke, pet dander, or pollen). If symptoms do not improve within 10-15 minutes or you find it difficult to speak, seek emergency medical care.": "உங்களுக்கு பரிந்துரைக்கப்பட்ட இன்ஹேலரை (ப்ரோன்கோடைலேட்டர்) உடனடியாக அறிவுறுத்தப்பட்டபடி பயன்படுத்தவும். நிமிர்ந்து உட்கார்ந்து உங்கள் சுவாசத்தை அமைதியாகவும் சீராகவும் வைக்க முயற்சிக்கவும். அலர்ஜி தூண்டுதல்கள் (தூசி, சிகரெட் புகை, செல்லப்பிராணிகளின் பொடுகு அல்லது மகரந்தம் போன்றவை) உள்ள எந்தவொரு சூழலிலிருந்தும் உங்களை விலக்கிக் கொள்ளுங்கள். 10-15 நிமிடங்களுக்குள் அறிகுறிகள் குறையவில்லை என்றாலோ அல்லது பேசுவதற்கு கடினமாக இருந்தாலோ, அவசர மருத்துவ உதவியை நாடவும்.",
        "Monitor your blood sugar levels regularly throughout the day. Adhere strictly to a balanced, low-glycemic index dietary plan. Stay well-hydrated by drinking water and avoiding sugary beverages. Take your prescribed insulin or oral diabetic medications exactly as scheduled. Engage in light physical activity like walking after meals to help manage glucose levels.": "நாள் முழுவதும் உங்கள் இரத்த சர்க்கரை அளவை தவறாமல் கண்காணிக்கவும். சமநிலையான, குறைந்த குளுக்கோஸ் உணவு திட்டத்தை கண்டிப்பாக பின்பற்றவும். தண்ணீர் குடிப்பது மற்றும் சர்க்கரை பானங்களை தவிர்ப்பதன் மூலம் உடலை நன்றாக நீர்ச்சத்துடன் வைத்திருங்கள். உங்களுக்கு பரிந்துரைக்கப்பட்ட இன்சுலின் அல்லது வாய்வழி நீரிழிவு மருந்துகளை திட்டமிட்டபடி சரியாக எடுத்துக் கொள்ளுங்கள். குளுக்கோஸ் அளவை நிர்வகிக்க உதவ உணவுக்குப் பிறகு நடைப்பயிற்சி போன்ற லேசான உடல் செயல்பாடுகளில் ஈடுபடுங்கள்.",
        "Reduce sodium (salt) intake and avoid processed foods. Practice stress-relief techniques such as deep breathing exercises, yoga, or daily meditation. Monitor your blood pressure at home and keep a log. Avoid caffeine, alcohol, and nicotine. Take your prescribed antihypertensive medications consistently at the same time every day.": "சோடியம் (உப்பு) உட்கொள்வதைக் குறைத்து, பதப்படுத்தப்பட்ட உணவுகளைத் தவிர்க்கவும். ஆழ்ந்த சுவாசப் பயிற்சிகள், யோகா அல்லது தினசரி தியானம் போன்ற மன அழுத்த நிவாரண நுட்பங்களைப் பயிற்சி செய்யவும். வீட்டில் உங்கள் இரத்த அழுத்தத்தைக் கண்காணித்து அதைப் பதிவு செய்து வைக்கவும். காஃபின், மது மற்றும் நிகோடினைத் தவிர்க்கவும். உங்களுக்கு பரிந்துரைக்கப்பட்ட இரத்த அழுத்தத்தைக் குறைக்கும் மருந்துகளை ஒவ்வொரு நாளும் ஒரே நேரத்தில் தொடர்ந்து எடுத்துக் கொள்ளுங்கள்.",
        "Drink plenty of fluids (water, diluted juice, or oral rehydration solutions) in small, frequent sips to replace lost fluids and electrolytes. Avoid solid food for the first few hours until your stomach settles. When ready, eat bland, low-fat foods (such as bananas, plain white rice, applesauce, or toast). Avoid dairy, caffeine, alcohol, and spicy foods.": "இழந்த திரவங்கள் மற்றும் எலக்ட்ரோலைட்டுகளை ஈடுசெய்ய தண்ணீர், நீர்த்த சாறு அல்லது வாய்வழி ரீஹைட்ரேஷன் கரைசல்களை சிறிய, அடிக்கடி பருகுங்கள். உங்கள் வயிறு சரியாகும் வரை முதல் சில மணிநேரங்களுக்கு திட உணவுகளைத் தவிர்க்கவும். தயாரானதும், காரமில்லாத, குறைந்த கொழுப்புள்ள உணவுகளை (வாழைப்பழம், எளிய வெள்ளை சாதம், ஆப்பிள் சாஸ் அல்லது டோஸ்ட் போன்றவை) உண்ணுங்கள். பால் பொருட்கள், காஃபின், மது மற்றும் காரமான உணவுகளைத் தவிர்க்கவும்.",
        "Drink plenty of water to help flush bacteria out of your kidneys and urinary tract. Get plenty of bed rest to help your body recover. Make sure to complete the entire course of prescribed antibiotics, even if you start feeling better sooner. Avoid holding your urine, and apply a warm heating pad to your back or abdomen to ease pain.": "உங்கள் சிறுநீரகங்கள் மற்றும் சிறுநீர் பாதையில் இருந்து பாக்டீரியாக்களை வெளியேற்ற நிறைய தண்ணீர் குடிக்கவும். உங்கள் உடல் குணமடைய நிறைய படுக்கை ஓய்வு எடுங்கள். நீங்கள் விரைவில் குணமடைந்ததாக உணர்ந்தாலும், பரிந்துரைக்கப்பட்ட ஆன்டிபயாடிக் மருந்துகளின் முழு தொகுப்பையும் முடிப்பதை உறுதிப்படுத்திக் கொள்ளுங்கள். சிறுநீரை அடக்குவதைத் தவிர்க்கவும், வலியைக் குறைக்க உங்கள் முதுகு அல்லது அடிவயிற்றில் வெதுவெதுப்பான ஒத்தடம் கொடுக்கவும்.",
        "Engage in regular low-impact exercises such as swimming, cycling, or walking to keep joints flexible. Apply warm compresses or take a warm bath to soothe stiff joints, or use cold packs to reduce swelling and acute pain. Maintain a healthy body weight to reduce stress on weight-bearing joints. Consult a physical therapist for a tailored exercise routine.": "மூட்டுகளை நெகிழ்வாக வைத்திருக்க நீச்சல், சைக்கிள் ஓட்டுதல் அல்லது நடைப்பயிற்சி போன்ற வழக்கமான குறைந்த தாக்கமுடைய உடற்பயிற்சிகளில் ஈடுபடுங்கள். விறைப்பான மூட்டுகளைத் தணிக்க வெதுவெதுப்பான ஒத்தடங்களைப் பயன்படுத்துங்கள் அல்லது வெதுவெதுப்பான குளியல் எடுங்கள், அல்லது வீக்கம் மற்றும் கடுமையான வலியைக் குறைக்க குளிர்ந்த ஒத்தடங்களைப் பயன்படுத்துங்கள். உடல் எடையை சீராக வைத்திருப்பதன் மூலம் மூட்டுகளின் மீதான அழுத்தத்தை குறையுங்கள். தனிப்பயனாக்கப்பட்ட உடற்பயிற்சி முறைக்கு ஒரு பிசியோதெரபிஸ்ட்டை அணுகவும்."
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
        "Rest as much as possible to help your body fight the infection. Drink plenty of warm fluids (such as water, herbal tea, or broth) to stay hydrated. Consider over-the-counter pain relievers like paracetamol or ibuprofen to manage fever and relieve body aches. Avoid strenuous physical activity and isolate yourself from others to prevent spreading the virus.": "ඔබේ ශරීරයට ආසාදනයට එරෙහිව සටන් කිරීමට උපකාර කිරීම සඳහා හැකිතාක් විවේක ගන්න. විජලනය වළක්වා ගැනීම සඳහා උණුසුම් දියර වර්ග (වතුර, ඖෂධීය තේ, හෝ කැඳ වැනි) ඕනෑතරම් පානය කරන්න. උණ පාලනය කිරීමට සහ සන්ධි වේදනාව සමනය කිරීමට පැරසිටමෝල් හෝ අයිබියුප්‍රොෆෙන් වැනි වේදනා නාශක භාවිතය ගැන සලකා බලන්න. වෛරසය පැතිරීම වැළැක්වීම සඳහා දැඩි ශාරීරික ක්‍රියාකාරකම්වලින් වැළකී සිටින්න සහ අනෙක් අයගෙන් හුදකලා වන්න.",
        "Stay hydrated by drinking plenty of warm water or juice. Get adequate rest to support your immune system. Use saline nasal drops or sprays to relieve nasal congestion. Gargle with warm salt water or use throat lozenges to soothe a sore throat. Avoid cold drinks, drafts, and sudden temperature changes.": "උණුසුම් ජලය හෝ පළතුරු යුෂ හොඳින් පානය කිරීමෙන් ශරීරය සජලීයව තබා ගන්න. ඔබේ ප්‍රතිශක්තිකරණ පද්ධතියට සහය වීම සඳහා ප්‍රමාණවත් විවේකයක් ගන්න. නාසයේ හිරවීම සමනය කිරීමට සේලයින් නාසික බිංදු හෝ ස්ප්‍රේ භාවිතා කරන්න. උගුරේ අමාරුව සමනය කිරීම සඳහා උණුසුම් ලුණු වතුරෙන් උගුර සෝදන්න හෝ උගුරේ පෙති භාවිතා කරන්න. ශීතල බීම, අධික ශීතල සුළඟ සහ හදිසි උෂ්ණත්ව වෙනස්වීම් වලින් වළකින්න.",
        "Isolate yourself immediately in a well-ventilated single room. Wear a high-filtration mask (like N95 or KN95) if you must be around others. Monitor your oxygen levels daily using a pulse oximeter. Stay hydrated, rest, and take fever-reducing medications. Seek emergency medical attention immediately if you experience shortness of breath, chest pain, or blue lips.": "හොඳින් වාතාශ්‍රය ඇති තනි කාමරයක වහාම හුදකලා වන්න. ඔබට වෙනත් අය අසල සිටීමට සිදුවුවහොත් ඉහළ ආරක්ෂාවක් සහිත මුඛ ආවරණයක් (N95 හෝ KN95 වැනි) පළඳින්න. පල්ස් ඔක්සිමීටරයක් භාවිතයෙන් දිනපතා ඔබේ ඔක්සිජන් මට්ටම නිරීක්ෂණය කරන්න. හොඳින් වතුර බොන්න, විවේක ගන්න, සහ උණ අඩු කරන ඖෂධ ගන්න. ඔබට හුස්ම ගැනීමේ අපහසුවක්, පපුවේ වේදනාවක් හෝ තොල් නිල් පැහැ වීමක් ඇති වුවහොත් වහාම හදිසි වෛද්‍ය ප්‍රතිකාර ලබා ගන්න.",
        "Rest in a quiet, dark, and cool room. Avoid screens, bright lights, and loud noises. Apply a cold compress or ice pack wrapped in a cloth to your forehead or the back of your neck. Sip water to stay hydrated, as dehydration is a common trigger. Avoid caffeine and strong odors, and consider taking over-the-counter pain relievers at the onset.": "නිශ්ශබ්ද, අඳුරු සහ සිසිල් කාමරයක විවේක ගන්න. පරිගණක/ජංගම දුරකථන තිර දෙස බැලීමෙන්, දීප්තිමත් ආලෝකයෙන් සහ අධික ශබ්දවලින් වළකින්න. රෙදිකඩක ඔතාගත් අයිස් පැකට්ටුවක් නළලට හෝ බෙල්ල පිටුපසට තබා ගන්න. විජලනය වීම හිසරදයට ප්‍රධාන හේතුවක් බැවින් හොඳින් වතුර බොන්න. කැෆේන් සහ තද ගඳ/සුවඳවලින් වළකින්න, හිසරදය ආරම්භ වන විටම වේදනා නාශකයක් ගැනීමට සලකා බලන්න.",
        "Use your prescribed rescue inhaler (bronchodilator) immediately as directed. Sit upright and try to keep your breathing calm and steady. Remove yourself from any environment containing triggers (such as dust, cigarette smoke, pet dander, or pollen). If symptoms do not improve within 10-15 minutes or you find it difficult to speak, seek emergency medical care.": "ඔබට නියමිත ඉන්හේලරය (ශ්වාසනාල විස්තාරකය) උපදෙස් පරිදි වහාම භාවිතා කරන්න. කෙළින්ම වාඩි වී ඔබේ හුස්ම ගැනීම සන්සුන්ව හා ස්ථාවරව තබා ගැනීමට උත්සාහ කරන්න. දූවිලි, දුම්කොළ දුම, සුරතල් සතුන්ගේ ලොම් හෝ මල් රේණු වැනි ආසාත්මිකතා ඇති කරන දේවලින් වහාම ඉවත් වන්න. මිනිත්තු 10-15ක් ඇතුළත රෝග ලක්ෂණ යටපත් නොවන්නේ නම් හෝ ඔබට කතා කිරීමට අපහසු නම් වහාම හදිසි ප්‍රතිකාර ලබා ගන්න.",
        "Monitor your blood sugar levels regularly throughout the day. Adhere strictly to a balanced, low-glycemic index dietary plan. Stay well-hydrated by drinking water and avoiding sugary beverages. Take your prescribed insulin or oral diabetic medications exactly as scheduled. Engage in light physical activity like walking after meals to help manage glucose levels.": "දවස පුරා ඔබේ රුධිරයේ සීනි මට්ටම නිතිපතා නිරීක්ෂණය කරන්න. සමබර, අඩු ග්ලයිසමික් දර්ශකයක් සහිත ආහාර පාලනයක් අනුගමනය කරන්න. වතුර හොඳින් බොන්න සහ පැණිරස බීම වර්ග ගැනීමෙන් වළකින්න. ඔබට නියමිත ඉන්සියුලින් හෝ දියවැඩියා පෙති නියමිත වේලාවට ලබා ගන්න. ආහාර ගැනීමෙන් පසු ඇවිදීම වැනි සැහැල්ලු ව්‍යායාමවල නිරත වීමෙන් ශරීරයේ ග්ලූකෝස් මට්ටම පාලනය කිරීමට උපකාරී වේ.",
        "Reduce sodium (salt) intake and avoid processed foods. Practice stress-relief techniques such as deep breathing exercises, yoga, or daily meditation. Monitor your blood pressure daily, and avoid caffeine. Take your prescribed antihypertensive medications consistently at the same time every day.": "ලුණු භාවිතය අඩු කර සකස් කළ ආහාර ගැනීමෙන් වළකින්න. ගැඹුරු හුස්ම ගැනීමේ ව්‍යායාම, යෝග හෝ දිනපතා භාවනා කිරීම වැනි මානසික ආතතිය දුරු කිරීමේ ක්‍රම ප්‍රගුණ කරන්න. දිනපතා රුධිර පීඩනය නිරීක්ෂණය කරන්න, සහ කැෆේන් අඩංගු පානවලින් වළකින්න. ඔබට නියමිත රුධිර පීඩනය අඩු කරන ඖෂධ සෑම දිනකම එකම වේලාවක නිතිපතා ලබා ගන්න.",
        "Drink plenty of fluids (water, diluted juice, or oral rehydration solutions) in small, frequent sips to replace lost fluids and electrolytes. Avoid solid food for the first few hours until your stomach settles. When ready, eat bland, low-fat foods (such as bananas, plain white rice, applesauce, or toast). Avoid dairy, caffeine, alcohol, and spicy foods.": "වතුර හෝ ඉලෙක්ට්‍රොලයිට් දියර ස්වල්පය බැගින් නිතර පානය කරන්න, පැය කිහිපයකට ඝන ආහාර ගැනීමෙන් වළකින්න, පසුව මෘදු ආහාර (කෙසෙල්, බත්, ටෝස්ට් කළ පාන්) වලින් ආරම්භ කරන්න.",
        "Drink plenty of water to help flush bacteria out of your kidneys and urinary tract. Get plenty of bed rest to help your body recover. Make sure to complete the entire course of prescribed antibiotics, even if you start feeling better sooner. Avoid holding your urine, and apply a warm heating pad to your back or abdomen to ease pain.": "හොඳින් වතුර බොන්න සහ වෛද්‍යවරයා නියම කළ ප්‍රතිජීවක ඖෂධ මාත්‍රාව සම්පූර්ණ කිරීමට වගබලා ගන්න. මුත්‍රා රඳවා තබා ගැනීමෙන් වළකින්න, වේදනාව සමනය කිරීම සඳහා කොන්දට හෝ යටිබඩට උණුසුම් වතුර බෑගයක් තබා ගන්න.",
        "Engage in regular low-impact exercises such as swimming, cycling, or walking to keep joints flexible. Apply warm compresses or take a warm bath to soothe stiff joints, or use cold packs to reduce swelling and acute pain. Maintain a healthy body weight to reduce stress on weight-bearing joints. Consult a physical therapist for a tailored exercise routine.": "සැහැල්ලු ව්‍යායාමවල (පිහිනීම, ඇවිදීම) නිරත වන්න, සන්ධි තද ගතිය සඳහා උණුසුම් තැවීම් කරන්න හෝ උණුසුම් වතුරෙන් නාන්න, ඉදිමීම සහ දැඩි වේදනාව සඳහා සීතල තැවීම් කරන්න. සන්ධි මත ඇති වන බර අඩු කිරීමට ශරීරයේ බර සෞඛ්‍ය සම්පන්නව පවත්වා ගන්න. ඔබට ගැළපෙන ව්‍යායාම සඳහා භෞත චිකිත්සකවරයෙකුගෙන් උපදෙස් ලබා ගන්න."
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
