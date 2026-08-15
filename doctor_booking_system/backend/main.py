from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
import joblib
import json
import os
import random
import numpy as np
import stripe
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import Optional
from datetime import datetime, timedelta

# In-memory storage for registrations waiting for OTP verification
pending_registrations = {}  # email -> {name, password, otp, expires_at}

from database import SessionLocal, init_db, Doctor, Appointment, User, DiseaseInfo, ChannelPost, ChannelComment, PostLike, GroupChatMessage, SymptomAnalysisLog
from translator import translate_to_english, translate_from_english

# ─── Config ───
STRIPE_SECRET_KEY = "sk_test_51TZ9OHCbniPMzR40vt9CAM58BfDnC4m4vd0uVOzhSrauErxt8ZPv82SHkwg0p16FvLv9c5HKhlZBCDbOFNmJqTiA00FxjqOwk0"
stripe.api_key = STRIPE_SECRET_KEY

MAILTRAP_HOST = "sandbox.smtp.mailtrap.io"
MAILTRAP_PORT = 587
MAILTRAP_USER = "f6955b6caa58d9"
MAILTRAP_PASS = "f321e554bde0ea"
MAILTRAP_FROM = "noreply@mediQ.com"

app = FastAPI(title="eDocBook API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Load ML Models on startup ───
AVAILABLE_MODELS = {
    "Logistic Regression": "symptom_model_logistic_regression.joblib",
    "Decision Tree": "symptom_model_decision_tree.joblib",
    "Random Forest": "symptom_model_random_forest.joblib",
    "Support Vector Machine": "symptom_model_support_vector_machine.joblib",
    "Naïve Bayes": "symptom_model_naive_bayes.joblib",
    "K-Nearest Neighbors": "symptom_model_k_nearest_neighbors.joblib",
    "Optimized Logistic Regression": "symptom_model_optimized_logistic_regression.joblib",
    "Voting Ensemble Model": "symptom_model_voting_ensemble_model.joblib"
}
loaded_models = {}
active_model_name = "Logistic Regression"
model = None
chatbot_model = None
chatbot_responses = {}

@app.on_event("startup")
def startup_event():
    init_db()
    global model, chatbot_model, chatbot_responses, active_model_name
    
    # Read active model from model_comparison.json if it exists
    try:
        if os.path.exists("model_comparison.json"):
            with open("model_comparison.json", "r") as f:
                comp_data = json.load(f)
                active_model_name = comp_data.get("active_model", "Logistic Regression")
    except Exception as e:
        print(f"Error reading model comparison json for active_model: {e}")

    for name, filename in AVAILABLE_MODELS.items():
        try:
            if os.path.exists(filename):
                loaded_models[name] = joblib.load(filename)
                print(f"✅ Loaded model: {name}")
            elif name == "Logistic Regression" and os.path.exists("symptom_model.joblib"):
                loaded_models[name] = joblib.load("symptom_model.joblib")
                print(f"✅ Loaded fallback model: {name}")
        except Exception as e:
            print(f"❌ Error loading model {name}: {e}")

    # Set the global model reference to the active model
    model = loaded_models.get(active_model_name)
    if model is None and len(loaded_models) > 0:
        active_model_name = list(loaded_models.keys())[0]
        model = loaded_models[active_model_name]
        print(f"⚠️ Fallback active model set to: {active_model_name}")

    try:
        chatbot_model = joblib.load("chatbot_model.joblib")
        with open("chatbot_responses.json", "r") as f:
            chatbot_responses = json.load(f)
    except Exception as e:
        print(f"Error loading chatbot model: {e}")

# ─── DB Dependency ───
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ─── Email Helper ───
def send_confirmation_email(to_email: str, patient_name: str, doctor_name: str,
                             specialty: str, disease: str, fee: float,
                             appointment_id: int, payment_id: str):
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"✅ eDocBook — Appointment Confirmed #{appointment_id}"
        msg["From"] = MAILTRAP_FROM
        msg["To"] = to_email

        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f1a; color: #e2e8f0; margin: 0; padding: 0; }}
            .container {{ max-width: 600px; margin: 40px auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 20px; overflow: hidden; border: 1px solid rgba(139,92,246,0.3); }}
            .header {{ background: linear-gradient(135deg, #8b5cf6, #06b6d4); padding: 40px 30px; text-align: center; }}
            .header h1 {{ color: white; margin: 0; font-size: 28px; letter-spacing: -0.5px; }}
            .header p {{ color: rgba(255,255,255,0.85); margin: 8px 0 0; font-size: 16px; }}
            .body {{ padding: 36px 30px; }}
            .greeting {{ font-size: 18px; color: #e2e8f0; margin-bottom: 20px; }}
            .card {{ background: rgba(255,255,255,0.04); border: 1px solid rgba(139,92,246,0.2); border-radius: 14px; padding: 24px; margin: 16px 0; }}
            .card-row {{ display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }}
            .card-row:last-child {{ border-bottom: none; }}
            .label {{ color: #94a3b8; font-size: 13px; }}
            .value {{ color: #e2e8f0; font-weight: 600; font-size: 14px; }}
            .fee-row {{ background: rgba(16,185,129,0.1); border: 1px solid rgba(16,185,129,0.3); border-radius: 10px; padding: 16px 20px; display: flex; justify-content: space-between; margin-top: 16px; }}
            .fee-label {{ color: #6ee7b7; font-size: 14px; }}
            .fee-value {{ color: #10b981; font-weight: 700; font-size: 20px; }}
            .badge {{ display: inline-block; background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid rgba(16,185,129,0.4); border-radius: 20px; padding: 6px 16px; font-size: 13px; font-weight: 600; margin-bottom: 20px; }}
            .footer {{ padding: 24px 30px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }}
            .footer p {{ color: #475569; font-size: 12px; margin: 4px 0; }}
            .ref {{ color: #64748b; font-size: 11px; margin-top: 12px; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚕️ eDocBook</h1>
              <p>Your appointment has been confirmed!</p>
            </div>
            <div class="body">
              <p class="greeting">Hello, <strong>{patient_name}</strong>! 👋</p>
              <span class="badge">✅ Payment Successful — Appointment Confirmed</span>
              <p style="color:#94a3b8; font-size:14px; margin-bottom:24px;">
                Your appointment has been booked and payment processed successfully. Here are your booking details:
              </p>
              <div class="card">
                <div class="card-row">
                  <span class="label">Booking ID</span>
                  <span class="value">#{appointment_id}</span>
                </div>
                <div class="card-row">
                  <span class="label">Doctor</span>
                  <span class="value">{doctor_name}</span>
                </div>
                <div class="card-row">
                  <span class="label">Specialty</span>
                  <span class="value">{specialty}</span>
                </div>
                <div class="card-row">
                  <span class="label">Condition (AI Prediction)</span>
                  <span class="value">{disease}</span>
                </div>
                <div class="card-row">
                  <span class="label">Patient</span>
                  <span class="value">{patient_name}</span>
                </div>
              </div>
              <div class="fee-row">
                <span class="fee-label">Total Paid</span>
                <span class="fee-value">${fee:.2f}</span>
              </div>
              <p class="ref">Payment Reference: {payment_id}</p>
              <p style="color:#64748b; font-size:13px; margin-top:24px;">
                Your doctor will be in touch to confirm the exact appointment time. If you have any questions, 
                please use the Live Chat feature on your eDocBook Dashboard.
              </p>
            </div>
            <div class="footer">
              <p>© 2024 eDocBook — Intelligent Healthcare Platform</p>
              <p>This is an automated email. Please do not reply directly.</p>
            </div>
          </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(html_body, "html"))
        
        with smtplib.SMTP(MAILTRAP_HOST, MAILTRAP_PORT) as server:
            server.starttls()
            server.login(MAILTRAP_USER, MAILTRAP_PASS)
            server.sendmail(MAILTRAP_FROM, to_email, msg.as_string())
            
        print(f"✅ Confirmation email sent to {to_email}")
    except Exception as e:
        print(f"❌ Email sending failed: {e}")

# ─── Schemas ───

class SymptomInput(BaseModel):
    symptoms: str
    lang: Optional[str] = "en"
class AnalysisResult(BaseModel):
    disease: str
    disease_raw: str
    specialist: str
    specialist_translated: str
    advice: str
    typical_symptoms: Optional[str] = ""
    nhs_url: str

class BookingInput(BaseModel):
    user_id: int
    doctor_id: int
    disease: str
    symptoms: str

class BookWithPaymentInput(BaseModel):
    user_id: int
    doctor_id: int
    disease: str
    symptoms: str
    payment_intent_id: str

class CreatePaymentIntentInput(BaseModel):
    amount_cents: int  # e.g., 10000 for $100.00
    doctor_name: str

class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class VerifyOTPInput(BaseModel):
    email: str
    otp: str

class ChatInput(BaseModel):
    message: str
    lang: Optional[str] = "en"

class PostCreateInput(BaseModel):
    user_id: int
    user_name: str
    content: str

class CommentCreateInput(BaseModel):
    user_id: int
    user_name: str
    content: str

class PostLikeInput(BaseModel):
    user_id: int

class ChatMessageCreateInput(BaseModel):
    user_id: int
    user_name: str
    message: str

# ─── Routes ───

@app.post("/register")
def register_user(user: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(name=user.name, email=user.email, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "User created successfully", "user_id": new_user.id, "name": new_user.name, "email": new_user.email}

def send_otp_email(to_email: str, otp: str, user_name: str):
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"🔑 eDocBook — Registration OTP Code"
        msg["From"] = MAILTRAP_FROM
        msg["To"] = to_email

        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {{ font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f1a; color: #e2e8f0; margin: 0; padding: 0; }}
            .container {{ max-width: 500px; margin: 40px auto; background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 20px; overflow: hidden; border: 1px solid rgba(139,92,246,0.3); }}
            .header {{ background: linear-gradient(135deg, #8b5cf6, #06b6d4); padding: 30px; text-align: center; }}
            .header h1 {{ color: white; margin: 0; font-size: 24px; letter-spacing: -0.5px; }}
            .body {{ padding: 30px; text-align: center; }}
            .greeting {{ font-size: 16px; color: #e2e8f0; margin-bottom: 20px; text-align: left; }}
            .otp-code {{ display: inline-block; background: rgba(139,92,246,0.15); color: #8b5cf6; border: 1px dashed rgba(139,92,246,0.5); border-radius: 10px; padding: 12px 30px; font-size: 32px; font-weight: 700; letter-spacing: 4px; margin: 20px 0; }}
            .footer {{ padding: 20px; text-align: center; border-top: 1px solid rgba(255,255,255,0.05); }}
            .footer p {{ color: #475569; font-size: 12px; margin: 4px 0; }}
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>⚕️ eDocBook Verification</h1>
            </div>
            <div class="body">
              <p class="greeting">Hello, <strong>{user_name}</strong>! 👋</p>
              <p style="color:#94a3b8; font-size:14px; margin-bottom:20px; text-align: left;">
                Thank you for registering on eDocBook. Please use the following One-Time Password (OTP) to complete your registration. This code is valid for 10 minutes.
              </p>
              <div class="otp-code">{otp}</div>
              <p style="color:#64748b; font-size:13px; margin-top:20px; text-align: left;">
                If you did not request this code, you can safely ignore this email.
              </p>
            </div>
            <div class="footer">
              <p>© 2024 eDocBook — Intelligent Healthcare Platform</p>
            </div>
          </div>
        </body>
        </html>
        """
        msg.attach(MIMEText(html_body, "html"))
        
        with smtplib.SMTP(MAILTRAP_HOST, MAILTRAP_PORT) as server:
            server.starttls()
            server.login(MAILTRAP_USER, MAILTRAP_PASS)
            server.sendmail(MAILTRAP_FROM, to_email, msg.as_string())
            
        print(f"✅ OTP email sent to {to_email}")
    except Exception as e:
        print(f"❌ OTP email sending failed: {e}")

@app.post("/register/request-otp")
def request_otp(user: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Generate 6-digit OTP
    otp = str(random.randint(100000, 999999))
    expires_at = datetime.utcnow() + timedelta(minutes=10)
    
    # Save in memory
    pending_registrations[user.email] = {
        "name": user.name,
        "password": user.password,
        "otp": otp,
        "expires_at": expires_at
    }
    
    # Print to console for easy developer verification
    print(f"\n=============================================")
    print(f"[OTP DEBUG] Verification OTP for {user.email}: {otp}")
    print(f"=============================================\n")
    
    # Send email
    send_otp_email(user.email, otp, user.name)
    
    return {"message": "OTP sent successfully"}

@app.post("/register/verify-otp")
def verify_otp(data: VerifyOTPInput, db: Session = Depends(get_db)):
    pending = pending_registrations.get(data.email)
    if not pending:
        raise HTTPException(status_code=400, detail="No pending registration request found for this email")
    
    if datetime.utcnow() > pending["expires_at"]:
        pending_registrations.pop(data.email, None)
        raise HTTPException(status_code=400, detail="OTP has expired. Please request a new one.")
        
    if pending["otp"] != data.otp:
        raise HTTPException(status_code=400, detail="Invalid OTP code")
        
    # Check again if user was registered in the meantime
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        pending_registrations.pop(data.email, None)
        raise HTTPException(status_code=400, detail="Email already registered")
        
    new_user = User(name=pending["name"], email=data.email, password=pending["password"])
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Clean up pending
    pending_registrations.pop(data.email, None)
    
    return {
        "message": "User created successfully", 
        "user_id": new_user.id, 
        "name": new_user.name, 
        "email": new_user.email,
        "is_admin": getattr(new_user, "is_admin", False)
    }

@app.post("/login")
def login_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or db_user.password != user.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "message": "Login successful", 
        "user_id": db_user.id, 
        "name": db_user.name, 
        "email": db_user.email,
        "is_admin": getattr(db_user, "is_admin", False)
    }

@app.post("/analyze-symptoms", response_model=AnalysisResult)
def analyze_symptoms(symptom_data: SymptomInput, db: Session = Depends(get_db)):
    if model is None:
        raise HTTPException(status_code=500, detail="ML Model not loaded")
    
    lang = symptom_data.lang or "en"
    print(f"DEBUG: lang received: {lang}, raw symptoms: {symptom_data.symptoms}")
    english_symptoms = translate_to_english(symptom_data.symptoms, lang)
    print(f"DEBUG: english symptoms: {english_symptoms}")
    
    predicted_disease = model.predict([english_symptoms])[0]
    disease_info = db.query(DiseaseInfo).filter(DiseaseInfo.name == predicted_disease).first()
    if disease_info:
        specialist = disease_info.specialist
        advice = disease_info.advice
        typical_symptoms = disease_info.typical_symptoms or ""
        nhs_url = disease_info.nhs_url
    else:
        specialist = "General Practitioner"
        advice = "Please consult a healthcare professional."
        typical_symptoms = ""
        nhs_url = "https://www.nhs.uk/"

    # Translate the outputs back to user's selected language
    translated_disease = translate_from_english(predicted_disease, lang)
    translated_specialist = translate_from_english(specialist, lang)
    translated_advice = translate_from_english(advice, lang)
    translated_typical = translate_from_english(typical_symptoms, lang)
    print(f"DEBUG: translated disease: {translated_disease}, specialist: {translated_specialist}, advice: {translated_advice}")

    # Log analysis request to database
    try:
        log_entry = SymptomAnalysisLog(
            symptoms=symptom_data.symptoms,
            predicted_disease=predicted_disease,
            specialist=specialist,
            lang=lang
        )
        db.add(log_entry)
        db.commit()
    except Exception as e:
        print(f"Error saving symptom analysis log: {e}")

    return {
        "disease": translated_disease,
        "disease_raw": predicted_disease,
        "specialist": specialist,
        "specialist_translated": translated_specialist,
        "advice": translated_advice,
        "typical_symptoms": translated_typical,
        "nhs_url": nhs_url
    }

class SelectModelInput(BaseModel):
    model_name: str

class TestModelsInput(BaseModel):
    symptoms: str

@app.get("/model-info")
def get_model_info():
    try:
        if os.path.exists("model_comparison.json"):
            with open("model_comparison.json", "r") as f:
                comp_data = json.load(f)
                comp_data["active_model"] = active_model_name
                active_metrics = next((m for m in comp_data.get("models", []) if m["name"] == active_model_name), None)
                if active_metrics:
                    comp_data["model_name"] = active_model_name
                    comp_data["accuracy"] = active_metrics["accuracy"]
                    comp_data["f1_score"] = active_metrics["f1_score"]
                    comp_data["version"] = "1.0.0"
                return comp_data
    except Exception as e:
        print(f"Error reading model comparison: {e}")
    
    return {
        "active_model": active_model_name,
        "model_name": active_model_name,
        "accuracy": 1.0,
        "f1_score": 1.0,
        "version": "1.0.0",
        "models": []
    }

@app.post("/select-model")
def select_model(data: SelectModelInput):
    global model, active_model_name
    name = data.model_name
    if name not in loaded_models:
        raise HTTPException(status_code=400, detail=f"Model '{name}' is not loaded or does not exist")
    
    active_model_name = name
    model = loaded_models[name]
    
    try:
        if os.path.exists("model_comparison.json"):
            with open("model_comparison.json", "r") as f:
                comp_data = json.load(f)
            comp_data["active_model"] = name
            with open("model_comparison.json", "w") as f:
                json.dump(comp_data, f, indent=4)
    except Exception as e:
        print(f"Error persisting active model selection: {e}")
        
    return {"message": "Active model updated successfully", "active_model": active_model_name}

@app.post("/admin/test-models")
def test_all_models(data: TestModelsInput, db: Session = Depends(get_db)):
    results = {}
    english_symptoms = translate_to_english(data.symptoms, "en")
    for name, clf in loaded_models.items():
        try:
            pred = clf.predict([english_symptoms])[0]
            disease_info = db.query(DiseaseInfo).filter(DiseaseInfo.name == pred).first()
            specialist = disease_info.specialist if disease_info else "General Practitioner"
            results[name] = {
                "disease": pred,
                "specialist": specialist
            }
        except Exception as e:
            results[name] = {
                "disease": f"Error: {e}",
                "specialist": "N/A"
            }
    return results

@app.get("/admin/symptom-logs")
def get_symptom_logs(db: Session = Depends(get_db)):
    logs = db.query(SymptomAnalysisLog).order_by(SymptomAnalysisLog.created_at.desc()).limit(100).all()
    return [
        {
            "id": log.id,
            "symptoms": log.symptoms,
            "predicted_disease": log.predicted_disease,
            "specialist": log.specialist,
            "lang": log.lang,
            "created_at": log.created_at.isoformat() if log.created_at else None
        }
        for log in logs
    ]

@app.get("/doctors")
def get_doctors(specialty: str = None, district: str = None, db: Session = Depends(get_db)):
    query = db.query(Doctor)
    if specialty:
        query = query.filter(Doctor.specialty == specialty)
    if district:
        # Filter by district first
        results = query.filter(Doctor.district == district).all()
        if results:
            return results
    return query.all()

@app.post("/create-payment-intent")
def create_payment_intent(data: CreatePaymentIntentInput):
    try:
        intent = stripe.PaymentIntent.create(
            amount=data.amount_cents,
            currency="usd",
            metadata={"doctor_name": data.doctor_name},
            automatic_payment_methods={"enabled": True},
        )
        return {"client_secret": intent.client_secret, "payment_intent_id": intent.id}
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e.user_message))

@app.post("/book-with-payment")
def book_with_payment(booking: BookWithPaymentInput, db: Session = Depends(get_db)):
    # Verify Stripe PaymentIntent
    try:
        intent = stripe.PaymentIntent.retrieve(booking.payment_intent_id)
        if intent.status != "succeeded":
            raise HTTPException(status_code=402, detail=f"Payment not completed. Status: {intent.status}")
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e.user_message))

    doctor = db.query(Doctor).filter(Doctor.id == booking.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    user = db.query(User).filter(User.id == booking.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_appointment = Appointment(
        user_id=booking.user_id,
        doctor_id=booking.doctor_id,
        disease=booking.disease,
        symptoms=booking.symptoms,
        payment_status="paid",
        stripe_payment_id=booking.payment_intent_id
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    
    # Send confirmation email
    send_confirmation_email(
        to_email=user.email,
        patient_name=user.name,
        doctor_name=doctor.name,
        specialty=doctor.specialty,
        disease=booking.disease,
        fee=doctor.fee,
        appointment_id=new_appointment.id,
        payment_id=booking.payment_intent_id
    )
    
    return {
        "message": "Appointment booked and payment confirmed!",
        "appointment_id": new_appointment.id,
        "payment_status": "paid"
    }

@app.post("/book")
def book_appointment(booking: BookingInput, db: Session = Depends(get_db)):
    """Legacy booking endpoint (no payment)"""
    doctor = db.query(Doctor).filter(Doctor.id == booking.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    user = db.query(User).filter(User.id == booking.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    new_appointment = Appointment(
        user_id=booking.user_id,
        doctor_id=booking.doctor_id,
        disease=booking.disease,
        symptoms=booking.symptoms,
        payment_status="pending"
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    
    return {"message": "Appointment booked successfully!", "appointment_id": new_appointment.id}

@app.get("/my-appointments/{user_id}")
def get_my_appointments(user_id: int, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).filter(Appointment.user_id == user_id).order_by(Appointment.created_at.desc()).all()
    
    result = []
    for appt in appointments:
        doctor = db.query(Doctor).filter(Doctor.id == appt.doctor_id).first()
        result.append({
            "id": appt.id,
            "doctor_name": doctor.name if doctor else "Unknown",
            "specialty": doctor.specialty if doctor else "",
            "disease": appt.disease,
            "payment_status": appt.payment_status or "pending",
            "date": appt.created_at.strftime("%Y-%m-%d %H:%M") if appt.created_at else "Unknown"
        })
    return result

@app.get("/admin/appointments")
def admin_get_all_appointments(db: Session = Depends(get_db)):
    appointments = db.query(Appointment).order_by(Appointment.created_at.desc()).all()
    result = []
    for appt in appointments:
        doctor = db.query(Doctor).filter(Doctor.id == appt.doctor_id).first()
        user = db.query(User).filter(User.id == appt.user_id).first()
        result.append({
            "id": appt.id,
            "patient_name": user.name if user else "Unknown",
            "patient_email": user.email if user else "",
            "user_id": appt.user_id,
            "doctor_name": doctor.name if doctor else "Unknown",
            "specialty": doctor.specialty if doctor else "",
            "disease": appt.disease,
            "payment_status": appt.payment_status or "pending",
            "date": appt.created_at.strftime("%Y-%m-%d %H:%M") if appt.created_at else "Unknown"
        })
    return result

@app.get("/admin/patients")
def admin_get_all_patients(db: Session = Depends(get_db)):
    users = db.query(User).filter(User.is_admin == False).all()
    result = []
    for u in users:
        appt_count = db.query(Appointment).filter(Appointment.user_id == u.id).count()
        result.append({
            "id": u.id,
            "name": u.name,
            "email": u.email,
            "appointments_count": appt_count
        })
    return result

@app.get("/admin/stats")
def admin_get_stats(db: Session = Depends(get_db)):
    total_appts = db.query(Appointment).count()
    
    # Calculate revenue based on paid appointments
    paid_appts = db.query(Appointment).filter(Appointment.payment_status == "paid").all()
    total_revenue = 0.0
    for appt in paid_appts:
        doctor = db.query(Doctor).filter(Doctor.id == appt.doctor_id).first()
        if doctor:
            total_revenue += doctor.fee

    # Symptom checker usage count
    total_analyses = db.query(SymptomAnalysisLog).count()
    
    # Disease distributions (from symptom checker logs)
    disease_counts = {}
    analyses = db.query(SymptomAnalysisLog.predicted_disease).all()
    for (disease,) in analyses:
        if disease:
            disease_counts[disease] = disease_counts.get(disease, 0) + 1
        
    # Appointment specialty distributions
    specialty_counts = {}
    for appt in db.query(Appointment).all():
        doctor = db.query(Doctor).filter(Doctor.id == appt.doctor_id).first()
        if doctor:
            specialty_counts[doctor.specialty] = specialty_counts.get(doctor.specialty, 0) + 1

    return {
        "total_appointments": total_appts,
        "total_revenue": total_revenue,
        "total_analyses": total_analyses,
        "disease_distribution": disease_counts,
        "specialty_distribution": specialty_counts
    }

@app.post("/chat")
def chat_bot(chat_input: ChatInput):
    if chatbot_model is None or not chatbot_responses:
        raise HTTPException(status_code=500, detail="Chatbot model not loaded")
    
    lang = chat_input.lang or "en"
    english_msg = translate_to_english(chat_input.message, lang)
    
    msg = english_msg.strip().lower()
    if not msg:
        raise HTTPException(status_code=400, detail="Empty message")
    
    probs = chatbot_model.predict_proba([msg])[0]
    max_prob_idx = np.argmax(probs)
    max_prob = probs[max_prob_idx]
    
    if max_prob < 0.30:
        intent = "fallback"
    else:
        intent = chatbot_model.classes_[max_prob_idx]
        
    responses_list = chatbot_responses.get(intent, chatbot_responses["fallback"])
    response = random.choice(responses_list)
    
    # Translate response back to user's selected language
    translated_response = translate_from_english(response, lang)
    
    return {"response": translated_response, "intent": intent, "confidence": float(max_prob)}

# ─── Community Forum Endpoints ───

@app.get("/channels/{disease_name}/posts")
def get_channel_posts(disease_name: str, db: Session = Depends(get_db)):
    posts = db.query(ChannelPost).filter(ChannelPost.disease_name == disease_name).order_by(ChannelPost.created_at.desc()).all()
    
    result = []
    for post in posts:
        comments = db.query(ChannelComment).filter(ChannelComment.post_id == post.id).order_by(ChannelComment.created_at.asc()).all()
        result.append({
            "id": post.id,
            "user_id": post.user_id,
            "user_name": post.user_name,
            "disease_name": post.disease_name,
            "content": post.content,
            "likes_count": post.likes_count,
            "created_at": post.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "comments": [{
                "id": c.id,
                "user_id": c.user_id,
                "user_name": c.user_name,
                "content": c.content,
                "created_at": c.created_at.strftime("%Y-%m-%d %H:%M:%S")
            } for c in comments]
        })
    return result

@app.post("/channels/{disease_name}/posts")
def create_channel_post(disease_name: str, post_data: PostCreateInput, db: Session = Depends(get_db)):
    new_post = ChannelPost(
        user_id=post_data.user_id,
        user_name=post_data.user_name,
        disease_name=disease_name,
        content=post_data.content
    )
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    return {"message": "Post created successfully", "post_id": new_post.id}

@app.post("/channels/posts/{post_id}/like")
def like_channel_post(post_id: int, like_data: PostLikeInput, db: Session = Depends(get_db)):
    post = db.query(ChannelPost).filter(ChannelPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Check if this user already liked this post
    existing_like = db.query(PostLike).filter(PostLike.post_id == post_id, PostLike.user_id == like_data.user_id).first()
    if existing_like:
        return {"message": "Already liked", "likes_count": post.likes_count}
    
    new_like = PostLike(post_id=post_id, user_id=like_data.user_id)
    db.add(new_like)
    post.likes_count += 1
    db.commit()
    return {"message": "Post liked successfully", "likes_count": post.likes_count}

@app.post("/channels/posts/{post_id}/comments")
def create_post_comment(post_id: int, comment_data: CommentCreateInput, db: Session = Depends(get_db)):
    post = db.query(ChannelPost).filter(ChannelPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    new_comment = ChannelComment(
        post_id=post_id,
        user_id=comment_data.user_id,
        user_name=comment_data.user_name,
        content=comment_data.content
    )
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return {"message": "Comment added successfully", "comment_id": new_comment.id}

@app.get("/channels/{disease_name}/chat")
def get_group_chat_messages(disease_name: str, db: Session = Depends(get_db)):
    messages = db.query(GroupChatMessage).filter(GroupChatMessage.disease_name == disease_name).order_by(GroupChatMessage.created_at.desc()).limit(50).all()
    messages.reverse()
    return [{
        "id": m.id,
        "disease_name": m.disease_name,
        "user_id": m.user_id,
        "user_name": m.user_name,
        "message": m.message,
        "created_at": m.created_at.strftime("%H:%M")
    } for m in messages]

@app.post("/channels/{disease_name}/chat")
def post_group_chat_message(disease_name: str, msg_data: ChatMessageCreateInput, db: Session = Depends(get_db)):
    new_msg = GroupChatMessage(
        disease_name=disease_name,
        user_id=msg_data.user_id,
        user_name=msg_data.user_name,
        message=msg_data.message
    )
    db.add(new_msg)
    db.commit()
    db.refresh(new_msg)
    return {"message": "Message sent successfully", "message_id": new_msg.id}
