import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  en: {
    logo: "eDocBook",
    nav_home: "Home",
    nav_dashboard: "Dashboard",
    nav_checker: "Symptom Checker",
    nav_login: "Sign In",
    nav_logout: "Log Out",
    welcome: "Welcome",
    hero_title: "Your Path to Smarter Healthcare",
    hero_subtitle: "AI-powered symptom checking and instant doctor booking. Get diagnosed by AI and consult verified specialists in minutes.",
    btn_start_checker: "Get Started",
    btn_how_works: "How It Works",
    step_1_title: "1. Describe Symptoms",
    step_1_desc: "Type how you feel in detail. English, Tamil, and Sinhala inputs are all supported.",
    step_2_title: "2. AI Diagnosis",
    step_2_desc: "Our machine learning model analyzes symptoms to predict conditions and recommend specialties.",
    step_3_title: "3. Book & Consult",
    step_3_desc: "Choose from matched specialists, pay securely via Stripe, and receive instant confirmation.",
    
    // Auth Page
    auth_welcome_back: "Welcome Back",
    auth_create_account: "Create Account",
    auth_email: "Email Address",
    auth_password: "Password",
    auth_name: "Full Name",
    auth_sign_in: "Sign In",
    auth_sign_up: "Sign Up",
    auth_no_account: "Don't have an account? Register here",
    auth_have_account: "Already have an account? Login here",
    
    // Dashboard
    dash_title: "Your Health Dashboard",
    dash_no_appointments: "You have no appointments scheduled.",
    dash_new_booking: "Book New Appointment",
    dash_table_id: "ID",
    dash_table_doctor: "Doctor",
    dash_table_specialty: "Specialty",
    dash_table_condition: "Condition",
    dash_table_status: "Payment Status",
    dash_table_date: "Date & Time",
    dash_live_chat_title: "Live Chat with Support",
    dash_live_chat_desc: "Need immediate assistance or want to cancel? Start a conversation with our support team.",
    dash_btn_live_chat: "Open Chat Support",
    
    // Symptom Checker
    check_title: "AI Symptom Analyzer & Doctor Matcher",
    check_placeholder: "Describe how you feel (e.g., 'I have joint pain, muscle stiffness, and swelling')",
    check_btn_analyze: "Analyze Symptoms",
    check_analyzing: "Analyzing symptoms...",
    check_report_title: "AI Diagnostic Report",
    check_rec_specialist: "Recommended Specialist",
    check_predicted_disease: "Predicted Condition",
    check_advice: "Care Advice",
    check_nhs_btn: "Read NHS Guidelines",
    check_doc_avail: "Matching Specialists Available Now",
    check_fee: "Consultation Fee",
    check_rating: "Rating",
    check_btn_book: "Book Appointment",
    
    // Payment
    pay_summary: "Booking Summary",
    pay_patient: "Patient",
    pay_doctor: "Doctor",
    pay_specialty: "Specialty",
    pay_condition: "Condition",
    pay_total: "Total Due",
    pay_card_details: "Card Details",
    pay_btn_pay: "Pay & Confirm Booking",
    pay_processing: "Processing Booking...",
    pay_wait: "Please wait while we confirm your appointment",
    pay_success: "Payment Successful! 🎉",
    pay_confirmed: "Appointment Confirmed",
    pay_email_sent: "A confirmation email has been sent to",
    pay_redirect: "Redirecting to your dashboard...",
    
    // Chatbot widget
    chat_widget_title: "eDocBook Support Bot",
    chat_widget_placeholder: "Ask me anything...",
    chat_widget_welcome: "Hi! I'm your AI health assistant. Ask me about booking, costs, cancellations, or describe your symptoms!",
    nav_community: "Patient Forum",
    nav_live_chat: "Support Chat",
    comm_title: "Patient Community Forums",
    comm_subtitle: "Connect with other patients experiencing the same condition. Share advice, daily routines, and support each other.",
    comm_write_post: "Share your day, activities, or advice...",
    comm_btn_post: "Post to Channel",
    comm_like: "Like",
    comm_comment: "Comment",
    comm_comments: "Comments",
    comm_add_comment: "Write a comment...",
    comm_btn_comment: "Send",
    comm_active_channel: "Active Channel",
    comm_join_btn: "Go to disease community forum",
    comm_search_placeholder: "Search posts by content or author...",
    comm_tab_feed: "Forum Feed",
    comm_tab_chat: "Group Chat",
    comm_chat_placeholder: "Type a message..."
  },
  ta: {
    logo: "ஈ-டொக்புக்",
    nav_home: "முகப்பு",
    nav_dashboard: "டாஷ்போர்டு",
    nav_checker: "அறிகுறி பரிசோதகர்",
    nav_login: "உள்நுழைக",
    nav_logout: "வெளியேறு",
    welcome: "வரவேற்கிறோம்",
    hero_title: "சிறந்த ஆரோக்கியத்திற்கான பாதை",
    hero_subtitle: "செயற்கை நுண்ணறிவு கொண்ட அறிகுறி பரிசோதனை மற்றும் உடனடி மருத்துவர் முன்பதிவு. நிபுணர்களை சில நிமிடங்களில் கலந்தாலோசிக்கவும்.",
    btn_start_checker: "தொடங்கவும்",
    btn_how_works: "எப்படி செயல்படுகிறது",
    step_1_title: "1. அறிகுறிகளை விளக்கவும்",
    step_1_desc: "நீங்கள் எப்படி உணருகிறீர்கள் என்பதை விரிவாக தட்டச்சு செய்யவும். தமிழ், சிங்களம், ஆங்கில உள்ளீடுகள் ஆதரிக்கப்படுகின்றன.",
    step_2_title: "2. AI நோயறிதல்",
    step_2_desc: "எங்கள் கணினி கற்றல் மாதிரி அறிகுறிகளை பகுப்பாய்வு செய்து நோய்களைக் கணித்து மருத்துவத் துறையைப் பரிந்துரைக்கிறது.",
    step_3_title: "3. முன்பதிவு & ஆலோசனை",
    step_3_desc: "பரிந்துரைக்கப்பட்ட சிறப்பு மருத்துவர்களிடமிருந்து தேர்வு செய்து, பாதுகாப்பாக பணம் செலுத்தி, உடனடியாக முன்பதிவை உறுதிசெய்யவும்.",
    
    // Auth Page
    auth_welcome_back: "மீண்டும் வருக",
    auth_create_account: "கணக்கை உருவாக்குங்கள்",
    auth_email: "மின்னஞ்சல் முகவரி",
    auth_password: "கடவுச்சொல்",
    auth_name: "முழு பெயர்",
    auth_sign_in: "உள்நுழைக",
    auth_sign_up: "பதிவு செய்க",
    auth_no_account: "கணக்கு இல்லையா? இங்கே பதிவு செய்யவும்",
    auth_have_account: "ஏற்கனவே கணக்கு உள்ளதா? இங்கே உள்நுழையவும்",
    
    // Dashboard
    dash_title: "உங்கள் சுகாதார டாஷ்போர்டு",
    dash_no_appointments: "உங்களுக்கு திட்டமிடப்பட்ட முன்பதிவுகள் எதுவும் இல்லை.",
    dash_new_booking: "புதிய முன்பதிவு செய்க",
    dash_table_id: "குறிப்பு எண்",
    dash_table_doctor: "மருத்துவர்",
    dash_table_specialty: "சிறப்புத் துறை",
    dash_table_condition: "கணிக்கப்பட்ட நோய்",
    dash_table_status: "கட்டண நிலை",
    dash_table_date: "தேதி மற்றும் நேரம்",
    dash_live_chat_title: "நேரடி அரட்டை ஆதரவு",
    dash_live_chat_desc: "உடனடி உதவி வேண்டுமா அல்லது ரத்து செய்ய வேண்டுமா? எங்கள் ஆதரவுக் குழுவுடன் அரட்டையடிக்கவும்.",
    dash_btn_live_chat: "அரட்டை ஆதரவைத் திறக்கவும்",
    
    // Symptom Checker
    check_title: "AI அறிகுறி பகுப்பாய்வி & மருத்துவர் பொருத்தம்",
    check_placeholder: "நீங்கள் எப்படி உணருகிறீர்கள் என்பதை விளக்குங்கள் (எ.கா., 'எனக்கு மூட்டு வலி, தசை இறுக்கம் மற்றும் வீக்கம் உள்ளது')",
    check_btn_analyze: "அறிகுறிகளை பகுப்பாய்வு செய்க",
    check_analyzing: "அறிகுறிகளை பகுப்பாய்வு செய்கிறது...",
    check_report_title: "AI கண்டறியும் அறிக்கை",
    check_rec_specialist: "பரிந்துரைக்கப்பட்ட நிபுணர்",
    check_predicted_disease: "கணிக்கப்பட்ட நோய் நிலை",
    check_advice: "சுகாதார ஆலோசனை",
    check_nhs_btn: "NHS வழிகாட்டுதலைப் படிக்கவும்",
    check_doc_avail: "தற்போது கிடைக்கக்கூடிய சிறப்பு மருத்துவர்கள்",
    check_fee: "ஆலோசனை கட்டணம்",
    check_rating: "மதிப்பீடு",
    check_btn_book: "முன்பதிவு செய்ய",
    
    // Payment
    pay_summary: "முன்பதிவு சுருக்கம்",
    pay_patient: "நோயாளி",
    pay_doctor: "மருத்துவர்",
    pay_specialty: "சிறப்புத் துறை",
    pay_condition: "நோய் நிலை",
    pay_total: "செலுத்த வேண்டிய தொகை",
    pay_card_details: "அட்டை விபரங்கள்",
    pay_btn_pay: "பணம் செலுத்தி முன்பதிவை உறுதிசெய்",
    pay_processing: "முன்பதிவு செய்யப்படுகிறது...",
    pay_wait: "உங்கள் முன்பதிவை உறுதிசெய்யும் வரை காத்திருக்கவும்",
    pay_success: "பணம் செலுத்துதல் வெற்றி! 🎉",
    pay_confirmed: "முன்பதிவு உறுதி செய்யப்பட்டது",
    pay_email_sent: "உறுதிப்படுத்தல் மின்னஞ்சல் அனுப்பப்பட்டுள்ளது:",
    pay_redirect: "டாஷ்போர்டுக்கு திருப்பி விடப்படுகிறது...",
    
    // Chatbot widget
    chat_widget_title: "ஈ-டொக்புக் உதவிப் போட்",
    chat_widget_placeholder: "என்னிடம் எதையும் கேளுங்கள்...",
    chat_widget_welcome: "வணக்கம்! நான் உங்கள் AI சுகாதார உதவியாளர். முன்பதிவு, செலவுகள், ரத்து செய்தல் அல்லது உங்கள் அறிகுறிகளைப் பற்றி என்னிடம் கேட்கலாம்!",
    nav_community: "நோயாளி மன்றம்",
    nav_live_chat: "நேரடி அரட்டை",
    comm_title: "நோயாளி சமூக மன்றங்கள்",
    comm_subtitle: "ஒரே மாதிரியான நோய் நிலை உள்ள பிற நோயாளிகளுடன் இணையுங்கள். அறிவுரைகள், தினசரி செயல்பாடுகளைப் பகிர்ந்து ஒருவருக்கொருவர் ஆதரவளிக்கவும்.",
    comm_write_post: "உங்கள் நாள், செயல்பாடுகள் அல்லது ஆலோசனைகளைப் பகிர்ந்து கொள்ளுங்கள்...",
    comm_btn_post: "மன்றத்தில் இடுகையிடுக",
    comm_like: "விருப்பம்",
    comm_comment: "கருத்து",
    comm_comments: "கருத்துக்கள்",
    comm_add_comment: "ஒரு கருத்தை எழுதுங்கள்...",
    comm_btn_comment: "அனுப்பு",
    comm_active_channel: "செயலில் உள்ள மன்றம்",
    comm_join_btn: "சமூக மன்றத்திற்குச் செல்லவும்",
    comm_search_placeholder: "இடுகைகளை உள்ளடக்கம் அல்லது ஆசிரியர் மூலம் தேடுங்கள்...",
    comm_tab_feed: "மன்ற இடுகைகள்",
    comm_tab_chat: "குழு அரட்டை",
    comm_chat_placeholder: "ஒரு செய்தியை தட்டச்சு செய்க..."
  },
  si: {
    logo: "ඊ-ඩොක්බුක්",
    nav_home: "මුල් පිටුව",
    nav_dashboard: "පුවරුව",
    nav_checker: "රෝග ලක්ෂණ පරීක්ෂකය",
    nav_login: "ලොග් වන්න",
    nav_logout: "ලොග් අවුට්",
    welcome: "සාදරයෙන් පිළිගනිමු",
    hero_title: "ස්මාර්ට් සෞඛ්‍ය සේවාවක් කරා",
    hero_subtitle: "AI මගින් ක්‍රියාත්මක වන රෝග ලක්ෂණ පරීක්ෂාව සහ ක්ෂණික වෛද්‍ය වෙන්කරවා ගැනීම. මිනිත්තු කිහිපයකින් විශේෂඥ වෛද්‍යවරුන් හමුවන්න.",
    btn_start_checker: "ආරම්භ කරන්න",
    btn_how_works: "ක්‍රියා කරන ආකාරය",
    step_1_title: "1. රෝග ලක්ෂණ විස්තර කරන්න",
    step_1_desc: "ඔබට දැනෙන ආකාරය විස්තරාත්මකව ටයිප් කරන්න. සිංහල, දෙමළ සහ ඉංග්‍රීසි භාෂා සහාය දක්වයි.",
    step_2_title: "2. AI රෝග විනිශ්චය",
    step_2_desc: "අපගේ යන්ත්‍ර ඉගෙනුම් ආකෘතිය රෝග ලක්ෂණ විශ්ලේෂණය කර රෝගය පුරෝකථනය කර විශේෂඥ ක්ෂේත්‍ර නිර්දේශ කරයි.",
    step_3_title: "3. වෙන්කරවා ගැනීම සහ උපදෙස්",
    step_3_desc: "නිර්දේශිත වෛද්‍යවරුන් අතරින් තෝරාගෙන, ආරක්ෂිතව ගෙවා, ක්ෂණිකව වෙන්කරවා ගැනීම තහවුරු කරන්න.",
    
    // Auth Page
    auth_welcome_back: "නැවත සාදරයෙන් පිළිගනිමු",
    auth_create_account: "ගිණුමක් සාදන්න",
    auth_email: "විද්‍යුත් තැපැල් ලිපිනය",
    auth_password: "මුරපදය",
    auth_name: "සම්පූර්ණ නම",
    auth_sign_in: "ලොග් වන්න",
    auth_sign_up: "ලියාපදිංචි වන්න",
    auth_no_account: "ගිණුමක් නොමැතිද? මෙතැනින් ලියාපදිංචි වන්න",
    auth_have_account: "දැනටමත් ගිණුමක් තිබේද? මෙතැනින් ලොග් වන්න",
    
    // Dashboard
    dash_title: "ඔබගේ සෞඛ්‍ය උපකරණ පුවරුව",
    dash_no_appointments: "ඔබට වෙන් කර ඇති හමුවීම් කිසිවක් නොමැත.",
    dash_new_booking: "නව හමුවීමක් වෙන් කරන්න",
    dash_table_id: "අංකය",
    dash_table_doctor: "වෛද්‍යවරයා",
    dash_table_specialty: "විශේෂඥතාවය",
    dash_table_condition: "රෝගී තත්ත්වය",
    dash_table_status: "ගෙවීම් තත්ත්වය",
    dash_table_date: "දිනය සහ වේලාව",
    dash_live_chat_title: "සජීවී සහාය කතාබහ",
    dash_live_chat_desc: "ක්ෂණික සහාය අවශ්‍යද නැතහොත් අවලංගු කිරීමට අවශ්‍යද? අපගේ සහාය කණ්ඩායම සමඟ කතාබස් කරන්න.",
    dash_btn_live_chat: "සජීවී කතාබහ අරඹන්න",
    
    // Symptom Checker
    check_title: "AI රෝග ලක්ෂණ විශ්ලේෂකය සහ වෛද්‍ය ගැලපුම",
    check_placeholder: "ඔබට දැනෙන ආකාරය විස්තර කරන්න (උදා. 'මට සන්ධි වේදනාව, මාංශ පේශි තද ගතිය සහ ඉදිමීම ඇත')",
    check_btn_analyze: "රෝග ලක්ෂණ විශ්ලේෂණය කරන්න",
    check_analyzing: "රෝග ලක්ෂණ විශ්ලේෂණය කරමින්...",
    check_report_title: "AI රෝග විනිශ්චය වාර්තාව",
    check_rec_specialist: "නිර්දේශිත විශේෂඥයා",
    check_predicted_disease: "පුරෝකථනය කළ රෝගය",
    check_advice: "සෞඛ්‍ය උපදෙස්",
    check_nhs_btn: "NHS මාර්ගෝපදේශ කියවන්න",
    check_doc_avail: "පවතින නිර්දේශිත විශේෂඥ වෛද්‍යවරුන්",
    check_fee: "උපදෙස් ගාස්තුව",
    check_rating: "ደረጃය",
    check_btn_book: "වෙන්කරවා ගන්න",
    
    // Payment
    pay_summary: "වෙන්කිරීමේ සාරාංශය",
    pay_patient: "රෝගියා",
    pay_doctor: "වෛද්‍යවරයා",
    pay_specialty: "විශේෂඥතාවය",
    pay_condition: "රෝගී තත්ත්වය",
    pay_total: "ගෙවිය යුතු මුළු මුදල",
    pay_card_details: "කාඩ්පත් විස්තර",
    pay_btn_pay: "ගෙවා වෙන්කිරීම තහවුරු කරන්න",
    pay_processing: "වෙන්කිරීම සකසමින් පවතී...",
    pay_wait: "කරුණාකර ඔබගේ වෙන්කිරීම තහවුරු කරන තෙක් රැඳී සිටින්න",
    pay_success: "ගෙවීම සාර්ථකයි! 🎉",
    pay_confirmed: "වෙන්කිරීම තහවුරු කරන ලදී",
    pay_email_sent: "තහවුරු කිරීමේ විද්‍යුත් තැපෑලක් යවා ඇත:",
    pay_redirect: "උපකරණ පුවරුව වෙත යොමු කරමින් පවතී...",
    
    // Chatbot widget
    chat_widget_title: "ඊ-ඩොක්බුක් සහායක බොට්",
    chat_widget_placeholder: "ඕනෑම දෙයක් අසන්න...",
    chat_widget_welcome: "ආයුබෝවන්! මම ඔබගේ AI සෞඛ්‍ය සහායකයා. වෙන් කිරීම්, ගාස්තු, අවලංගු කිරීම් හෝ ඔබගේ රෝග ලක්ෂණ ගැන මගෙන් විමසන්න!",
    nav_community: "රෝගී සංසදය",
    nav_live_chat: "සජීවී සහාය",
    comm_title: "රෝගී ප්‍රජා සංසද",
    comm_subtitle: "එකම රෝගී තත්ත්වයෙන් පෙළෙන වෙනත් රෝගීන් සමඟ සම්බන්ධ වන්න. උපදෙස්, දෛනික චර්යාවන් බෙදාහදා ගනිමින් එකිනෙකාට සහයෝගය දක්වන්න.",
    comm_write_post: "ඔබේ දවස, ක්‍රියාකාරකම් හෝ උපදෙස් බෙදා ගන්න...",
    comm_btn_post: "සංසදයට එක් කරන්න",
    comm_like: "කැමැත්ත",
    comm_comment: "අදහස",
    comm_comments: "අදහස්",
    comm_add_comment: "අදහසක් ලියන්න...",
    comm_btn_comment: "යවන්න",
    comm_active_channel: "සක්‍රීය සංසදය",
    comm_join_btn: "සංසදය වෙත පිවිසෙන්න",
    comm_search_placeholder: "අන්තර්ගතය හෝ කර්තෘ අනුව සොයන්න...",
    comm_tab_feed: "සංසද ලිපි",
    comm_tab_chat: "කණ්ඩායම් කතාබහ",
    comm_chat_placeholder: "පණිවිඩයක් ලියන්න..."
  }
};

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lang') || 'en';
  });

  const changeLanguage = (newLang) => {
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
