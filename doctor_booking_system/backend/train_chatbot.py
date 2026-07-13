import joblib
import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline

# =============================================
#  EXPANDED TRAINING DATA — 200+ examples
# =============================================
training_data = [
    # ─── Greetings ───
    ("hello", "greeting"),
    ("hi", "greeting"),
    ("hey", "greeting"),
    ("good morning", "greeting"),
    ("good afternoon", "greeting"),
    ("good evening", "greeting"),
    ("anyone there", "greeting"),
    ("hi there", "greeting"),
    ("howdy", "greeting"),
    ("greetings", "greeting"),
    ("hello doc", "greeting"),
    ("hey there", "greeting"),
    ("hi bot", "greeting"),
    ("hello assistant", "greeting"),
    ("is anyone available", "greeting"),

    # ─── About eDocBook ───
    ("what is edocbook", "about"),
    ("tell me about this app", "about"),
    ("what does this application do", "about"),
    ("who built this", "about"),
    ("what is the purpose of edocbook", "about"),
    ("what can this app do", "about"),
    ("describe this platform", "about"),
    ("what services do you offer", "about"),
    ("what is this website about", "about"),
    ("explain edocbook to me", "about"),
    ("is this a medical app", "about"),
    ("is edocbook reliable", "about"),

    # ─── How it works ───
    ("how does this work", "how_works"),
    ("how do i use this", "how_works"),
    ("how can i analyze symptoms", "how_works"),
    ("where do i type my symptoms", "how_works"),
    ("is the symptom checker free", "how_works"),
    ("how to get started", "how_works"),
    ("walk me through the process", "how_works"),
    ("what steps do i follow", "how_works"),
    ("guide me through the app", "how_works"),
    ("explain how the symptom checker works", "how_works"),
    ("what happens after i enter my symptoms", "how_works"),
    ("how accurate is the ai", "how_works"),
    ("how does the ml model work", "how_works"),
    ("what technology does edocbook use", "how_works"),

    # ─── Booking ───
    ("how do i book a doctor", "booking"),
    ("how to make an appointment", "booking"),
    ("can i book a specialist", "booking"),
    ("where is the doctor list", "booking"),
    ("how to consult a doctor", "booking"),
    ("can i schedule an appointment online", "booking"),
    ("how to select a doctor", "booking"),
    ("how do i choose a specialist", "booking"),
    ("book appointment now", "booking"),
    ("i want to book a doctor", "booking"),
    ("find me a doctor", "booking"),
    ("show available doctors", "booking"),
    ("can i see all doctors", "booking"),
    ("i need an appointment urgently", "booking"),
    ("same day appointment", "booking"),
    ("how to book cardiologist", "booking"),
    ("how to book neurologist", "booking"),

    # ─── Payment ───
    ("how do i pay", "payment"),
    ("what payment methods are accepted", "payment"),
    ("can i pay by card", "payment"),
    ("is payment secure", "payment"),
    ("how does payment work", "payment"),
    ("do you accept credit cards", "payment"),
    ("do you accept debit cards", "payment"),
    ("is stripe used for payment", "payment"),
    ("how to pay for appointment", "payment"),
    ("is payment online", "payment"),
    ("what is the payment process", "payment"),
    ("can i pay after the appointment", "payment"),
    ("is there a payment gateway", "payment"),
    ("how safe is my card info", "payment"),
    ("do you store my card details", "payment"),
    ("payment failed what to do", "payment"),
    ("my payment was declined", "payment"),
    ("i was charged but booking failed", "payment"),
    ("can i get a receipt", "payment"),
    ("do you send payment confirmation", "payment"),
    ("will i get an email after payment", "payment"),
    ("how do i know payment was successful", "payment"),
    ("can i pay later", "payment"),

    # ─── Cost ───
    ("how much does it cost", "cost"),
    ("what is the fee", "cost"),
    ("is it expensive", "cost"),
    ("do i need to pay to register", "cost"),
    ("what are the consultation charges", "cost"),
    ("what is doctor fee", "cost"),
    ("how much is a consultation", "cost"),
    ("is registration free", "cost"),
    ("is the symptom checker paid", "cost"),
    ("how much does a specialist charge", "cost"),
    ("are there hidden charges", "cost"),
    ("what is the price of booking", "cost"),
    ("how much for a cardiologist", "cost"),
    ("is it affordable", "cost"),

    # ─── Cancel / Reschedule ───
    ("how to cancel appointment", "cancel_appointment"),
    ("i want to cancel my booking", "cancel_appointment"),
    ("can i reschedule", "cancel_appointment"),
    ("how to change my appointment", "cancel_appointment"),
    ("i need to postpone my appointment", "cancel_appointment"),
    ("is there a cancellation fee", "cancel_appointment"),
    ("can i get a refund", "cancel_appointment"),
    ("how to get a refund", "cancel_appointment"),
    ("refund policy", "cancel_appointment"),
    ("cancel and get money back", "cancel_appointment"),
    ("i no longer need the appointment", "cancel_appointment"),
    ("delete my booking", "cancel_appointment"),
    ("how long before i can cancel", "cancel_appointment"),

    # ─── Symptoms General ───
    ("what symptoms should i enter", "symptoms_general"),
    ("how to describe my symptoms", "symptoms_general"),
    ("i have a fever", "symptoms_general"),
    ("i feel sick", "symptoms_general"),
    ("what does a rash mean", "symptoms_general"),
    ("i have chest pain", "symptoms_general"),
    ("i have a bad headache", "symptoms_general"),
    ("i feel tired all the time", "symptoms_general"),
    ("i have shortness of breath", "symptoms_general"),
    ("i have stomach pain", "symptoms_general"),
    ("my joints are hurting", "symptoms_general"),
    ("i feel dizzy", "symptoms_general"),
    ("i have a sore throat", "symptoms_general"),
    ("i keep coughing", "symptoms_general"),
    ("i have high blood pressure", "symptoms_general"),
    ("i have nausea", "symptoms_general"),
    ("i am losing weight", "symptoms_general"),
    ("i have blurred vision", "symptoms_general"),

    # ─── Live / Human Chat ───
    ("i want to talk to a human", "live_chat"),
    ("can i speak to someone", "live_chat"),
    ("connect me to a real person", "live_chat"),
    ("i need human support", "live_chat"),
    ("talk to agent", "live_chat"),
    ("can i chat with a doctor", "live_chat"),
    ("live chat", "live_chat"),
    ("i need help from a real person", "live_chat"),
    ("connect me to support", "live_chat"),
    ("i want a live agent", "live_chat"),
    ("speak to staff", "live_chat"),
    ("customer support", "live_chat"),
    ("i need support", "live_chat"),

    # ─── Doctor Availability ───
    ("is the doctor available", "doctor_availability"),
    ("when is the doctor free", "doctor_availability"),
    ("what are the consultation hours", "doctor_availability"),
    ("can i see a doctor today", "doctor_availability"),
    ("when can i see a specialist", "doctor_availability"),
    ("is dr smith available", "doctor_availability"),
    ("doctor schedule", "doctor_availability"),
    ("working hours", "doctor_availability"),
    ("does the clinic open on weekends", "doctor_availability"),
    ("how many doctors are available", "doctor_availability"),

    # ─── Prescription ───
    ("can i get a prescription", "prescription"),
    ("how to get medicine prescribed", "prescription"),
    ("will the doctor prescribe medication", "prescription"),
    ("can i get an online prescription", "prescription"),
    ("prescription refill", "prescription"),
    ("i need my medication renewed", "prescription"),
    ("do you provide prescription services", "prescription"),
    ("digital prescription", "prescription"),

    # ─── Follow Up ───
    ("i want a follow up appointment", "follow_up"),
    ("how to schedule follow up", "follow_up"),
    ("i visited before and need to come back", "follow_up"),
    ("same doctor follow up", "follow_up"),
    ("revisit appointment", "follow_up"),
    ("need second consultation", "follow_up"),
    ("recurring appointment", "follow_up"),

    # ─── Test Results ───
    ("where are my test results", "test_results"),
    ("how to view lab reports", "test_results"),
    ("when will i get my blood test results", "test_results"),
    ("how to download my reports", "test_results"),
    ("my results are not showing", "test_results"),
    ("how to access my health records", "test_results"),
    ("can i see my medical history", "test_results"),

    # ─── Insurance ───
    ("do you accept insurance", "insurance"),
    ("is this covered by insurance", "insurance"),
    ("does my health insurance work here", "insurance"),
    ("can i use my medical insurance", "insurance"),
    ("what insurance plans do you accept", "insurance"),
    ("is nhs covered", "insurance"),
    ("does edocbook work with private insurance", "insurance"),

    # ─── Privacy & Data ───
    ("is my data safe", "privacy"),
    ("how is my information used", "privacy"),
    ("do you sell my data", "privacy"),
    ("what is your privacy policy", "privacy"),
    ("gdpr compliance", "privacy"),
    ("data protection", "privacy"),
    ("who can see my medical data", "privacy"),
    ("is this hipaa compliant", "privacy"),

    # ─── Emergency ───
    ("i am having a heart attack", "emergency"),
    ("it is an emergency", "emergency"),
    ("i am bleeding severely", "emergency"),
    ("chest pain help", "emergency"),
    ("call an ambulance", "emergency"),
    ("i cannot breathe", "emergency"),
    ("severe headache suddenly", "emergency"),
    ("i think i am dying", "emergency"),
    ("i lost consciousness", "emergency"),
    ("i had a seizure", "emergency"),
    ("stroke symptoms", "emergency"),
    ("help me immediately", "emergency"),
    ("this is urgent medical help needed", "emergency"),

    # ─── Thanks ───
    ("thanks", "thanks"),
    ("thank you", "thanks"),
    ("awesome thanks", "thanks"),
    ("perfect thank you", "thanks"),
    ("great thanks", "thanks"),
    ("that was helpful", "thanks"),
    ("i appreciate it", "thanks"),
    ("thanks for the help", "thanks"),
    ("cheers", "thanks"),
    ("you are amazing", "thanks"),
]

X_train = [item[0] for item in training_data]
y_train = [item[1] for item in training_data]

# =============================================
#  RESPONSES
# =============================================
responses = {
    "greeting": [
        "Hello! I'm your eDocBook AI Assistant. How can I help you today? 😊",
        "Hi there! Need help with bookings, symptoms, or payments? Just ask!",
        "Hey! I'm here to help you navigate eDocBook. What can I do for you?",
    ],
    "about": [
        "eDocBook is an intelligent healthcare platform that uses machine learning to analyze your symptoms, match you with top-rated specialists, and let you book appointments — all online!",
        "We're eDocBook — a modern health portal that removes the guesswork from healthcare. Describe your symptoms, get an AI diagnosis, and book the right doctor in minutes.",
    ],
    "how_works": [
        "It's simple! 1️⃣ Go to the Symptom Checker. 2️⃣ Describe how you feel. 3️⃣ Our AI predicts your condition & recommends a specialist. 4️⃣ Choose a doctor & pay online. Done!",
        "Head to the Symptom Checker, type your symptoms, and our ML model will predict the condition, show NHS links, and display matching doctors for you to book.",
    ],
    "booking": [
        "To book, first run a symptom analysis in the Symptom Checker. We'll show matching specialists. Click 'Book Appointment' on any doctor, complete the secure payment, and you're done!",
        "Once our AI recommends a specialty, matching doctors appear. Click 'Book', enter your card details for the secure payment, and your appointment is confirmed with an email receipt!",
    ],
    "payment": [
        "We use Stripe for secure online payments 💳. Your card details are encrypted and never stored on our servers. You'll get a confirmation email after every successful payment.",
        "Payments are processed securely via Stripe. We accept all major credit and debit cards. You'll receive a booking confirmation email right after payment succeeds.",
        "If your payment failed, please check your card details and try again. If you were charged but the booking failed, the amount will be refunded automatically within 5-7 business days.",
    ],
    "cost": [
        "Registration and symptom checking are completely FREE! Doctor consultation fees vary (typically $90–$250) and are shown on each doctor's profile before you book.",
        "Symptom assessments are 100% free. Doctor fees are listed on their cards — you'll see the exact cost before confirming your booking.",
    ],
    "cancel_appointment": [
        "To cancel an appointment, please go to your Dashboard and contact our support team via Live Chat. Cancellations made 24+ hours in advance are fully refunded.",
        "Refund policy: Cancellations 24+ hours before the appointment receive a full refund. Less than 24 hours may incur a small fee. Contact our live chat support for help.",
    ],
    "symptoms_general": [
        "Please use the Symptom Checker on the main app page — describe your symptoms in detail (e.g., 'I have a severe headache, nausea, and light sensitivity') for the best AI analysis.",
        "I can't provide a direct diagnosis, but our AI symptom checker can! Head to the Symptom Checker page, describe what you're feeling, and get an instant prediction with NHS-verified advice.",
    ],
    "live_chat": [
        "I'll connect you to our live support team! 💬 Please click the 'Live Chat' button on your Dashboard to start a real-time conversation with our support staff.",
        "Need a human? Head to your Dashboard and click 'Live Chat with Support' to chat with our team in real-time via our secure messaging system.",
    ],
    "doctor_availability": [
        "Doctor availability is shown in real-time on the Symptom Checker page after your analysis. All listed doctors are currently accepting appointments.",
        "You can check available doctors on the Symptom Checker page. All doctors listed there are available for booking right now.",
    ],
    "prescription": [
        "Prescriptions are handled directly by the doctors during or after your consultation. Our platform facilitates the booking — prescription details will be shared by the doctor.",
        "Our doctors can provide digital prescriptions after your consultation. Please book an appointment first and discuss your medication needs with the doctor.",
    ],
    "follow_up": [
        "To schedule a follow-up, go to the Symptom Checker, search for the same specialist, and book again. Mention in your symptoms that this is a follow-up visit.",
        "For follow-up appointments, simply book again from the Symptom Checker. You can request the same doctor by looking for their name in the specialist list.",
    ],
    "test_results": [
        "Test results and health records are managed by your doctor's practice. Please contact them directly or check your Dashboard for any updates shared by your care team.",
        "Currently, lab results are shared by your doctor directly. Future updates to eDocBook will include a health records section in your Dashboard.",
    ],
    "insurance": [
        "eDocBook accepts direct online payments via Stripe. Insurance reimbursements depend on your provider — we can supply a detailed receipt for your insurance claim.",
        "We currently process payments directly. Please check with your insurance provider about reimbursement — we'll email you a full payment receipt you can submit.",
    ],
    "privacy": [
        "Your privacy is our top priority 🔒. Your data is encrypted, never sold to third parties, and used only to improve your healthcare experience. See our full Privacy Policy on the site.",
        "We comply with GDPR and data protection laws. Your medical data is securely stored and only accessible by you and your assigned doctors. We never sell personal data.",
    ],
    "emergency": [
        "⚠️ If this is a medical emergency, please call emergency services IMMEDIATELY — 999 (UK) or 911 (US). This AI assistant cannot provide emergency medical care.",
        "🚨 EMERGENCY: Please call 999 (UK) or 911 (US) RIGHT NOW. Do not wait — get to your nearest A&E or call an ambulance immediately. eDocBook is not an emergency service.",
    ],
    "thanks": [
        "You're very welcome! Let me know if you need anything else. 😊",
        "Happy to help! Have a wonderful and healthy day! 🌟",
        "Anytime! Stay safe and take care of yourself. 💙",
    ],
    "fallback": [
        "I'm not sure I understand. I can help with: bookings, payments, symptoms, cancellations, doctor availability, or live chat support. Could you rephrase?",
        "Sorry, I didn't quite catch that. Try asking about 'how to book a doctor', 'payment methods', 'how to cancel', or 'talk to a human'.",
    ]
}

# =============================================
#  BUILD & TRAIN PIPELINE
# =============================================
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        lowercase=True,
        stop_words='english',
        ngram_range=(1, 2),   # unigrams + bigrams for better accuracy
        max_features=5000
    )),
    ('clf', LogisticRegression(C=10.0, max_iter=500))
])

pipeline.fit(X_train, y_train)

# =============================================
#  SAVE MODEL & RESPONSES
# =============================================
joblib.dump(pipeline, "chatbot_model.joblib")
with open("chatbot_responses.json", "w") as f:
    json.dump(responses, f, indent=4)

print(f"✅ Chatbot model trained with {len(X_train)} examples across {len(set(y_train))} intents!")
print(f"   Intents: {sorted(set(y_train))}")
