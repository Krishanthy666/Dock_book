from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import json
import os

SQLALCHEMY_DATABASE_URL = "sqlite:///./doctors.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String) # For demo, plain text. Use bcrypt in prod.
    is_admin = Column(Boolean, default=False)
    appointments = relationship("Appointment", back_populates="user")

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    specialty = Column(String, index=True)
    fee = Column(Float)
    rating = Column(Float)
    district = Column(String, index=True, nullable=True)
    hospital = Column(String, nullable=True)
    appointments = relationship("Appointment", back_populates="doctor")

class Appointment(Base):
    __tablename__ = "appointments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    doctor_id = Column(Integer, ForeignKey("doctors.id"))
    disease = Column(String)
    symptoms = Column(String)
    payment_status = Column(String, default="pending")  # pending | paid | failed
    stripe_payment_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="appointments")
    doctor = relationship("Doctor", back_populates="appointments")

class DiseaseInfo(Base):
    __tablename__ = "disease_info"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    specialist = Column(String)
    advice = Column(String)
    typical_symptoms = Column(String, nullable=True)
    nhs_url = Column(String)

class ChannelPost(Base):
    __tablename__ = "channel_posts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    user_name = Column(String)
    disease_name = Column(String, index=True)
    content = Column(String)
    likes_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChannelComment(Base):
    __tablename__ = "channel_comments"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("channel_posts.id"))
    user_id = Column(Integer)
    user_name = Column(String)
    content = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class PostLike(Base):
    __tablename__ = "post_likes"

    id = Column(Integer, primary_key=True, index=True)
    post_id = Column(Integer, ForeignKey("channel_posts.id"))
    user_id = Column(Integer)

class GroupChatMessage(Base):
    __tablename__ = "group_chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    disease_name = Column(String, index=True)
    user_id = Column(Integer)
    user_name = Column(String)
    message = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

class SymptomAnalysisLog(Base):
    __tablename__ = "symptom_analysis_logs"

    id = Column(Integer, primary_key=True, index=True)
    symptoms = Column(String)
    predicted_disease = Column(String, index=True)
    specialist = Column(String)
    lang = Column(String, default="en")
    created_at = Column(DateTime, default=datetime.utcnow)

def generate_srilankan_doctors():
    districts = [
        "Colombo", "Gampaha", "Kalutara", "Kandy", "Matale", "Nuwara Eliya", 
        "Galle", "Matara", "Hambantota", "Jaffna", "Kilinochchi", "Mannar", 
        "Vavuniya", "Mullaitivu", "Batticaloa", "Trincomalee", "Ampara", 
        "Kurunegala", "Puttalam", "Anuradhapura", "Polonnaruwa", "Badulla", 
        "Moneragala", "Ratnapura", "Kegalle"
    ]
    
    specialties = [
        "General Practitioner", "Pulmonologist", "Neurologist", 
        "Endocrinologist", "Cardiologist", "Gastroenterologist", 
        "Nephrologist", "Rheumatologist"
    ]

    sinhala_names = [
        "Dr. Nuwan Perera", "Dr. Chaminda Silva", "Dr. Lasantha Fernando", "Dr. Priyantha Jayawardena",
        "Dr. Sajith Gunawardena", "Dr. Ruwan Rajapaksa", "Dr. Duminda Senanayake", "Dr. Harsha Ranasinghe",
        "Dr. Kanishka Wickremasinghe", "Dr. Nalin Balasuriya", "Dr. Asela Pathirana", "Dr. Kasun Rathnayake",
        "Dr. Lahiru Weerasinghe", "Dr. Prabath Kumarage", "Dr. Suren Herath", "Dr. Thusitha Siriwardena",
        "Dr. Roshan Samaraweera", "Dr. Dinesh Karunaratne", "Dr. Mahesh Peiris", "Dr. Vajira Wijewardene"
    ]
    
    tamil_names = [
        "Dr. S. Sathusan", "Dr. R. Rajanikanth", "Dr. K. Sivaraman", "Dr. T. Kanagasingam",
        "Dr. M. Tharmarajah", "Dr. V. Shanmugam", "Dr. B. Balasubramaniam", "Dr. P. Paramsothy",
        "Dr. G. Vigneshwaran", "Dr. A. Mahendran", "Dr. N. Ramanathan", "Dr. S. Sivakumar",
        "Dr. K. Arumugam", "Dr. J. Krishnakumar", "Dr. P. Murugan", "Dr. T. Ganeshan",
        "Dr. S. Selvarajah", "Dr. V. Sivanathan", "Dr. K. Sivalingam", "Dr. M. Nadarajah"
    ]
    
    tamil_districts = {"Jaffna", "Kilinochchi", "Mannar", "Vavuniya", "Mullaitivu", "Batticaloa", "Trincomalee"}
    
    mock_doctors = []
    for district in districts:
        is_tamil = district in tamil_districts
        for specialty in specialties:
            hash_idx_1 = (districts.index(district) * len(specialties) + specialties.index(specialty)) * 2
            hash_idx_2 = hash_idx_1 + 1
            
            if is_tamil:
                name1 = tamil_names[hash_idx_1 % len(tamil_names)]
                name2 = tamil_names[hash_idx_2 % len(tamil_names)]
            else:
                name1 = sinhala_names[hash_idx_1 % len(sinhala_names)]
                name2 = sinhala_names[hash_idx_2 % len(sinhala_names)]
                
            hospital1 = f"{district} General Hospital"
            hospital2 = f"{district} Cooperative Hospital" if districts.index(district) % 2 == 0 else f"{district} Base Hospital"
            
            fee1 = 80.0 + (hash_idx_1 % 5) * 15.0
            fee2 = 75.0 + (hash_idx_2 % 5) * 15.0
            
            rating1 = round(4.2 + (hash_idx_1 % 9) * 0.1, 1)
            rating2 = round(4.1 + (hash_idx_2 % 9) * 0.1, 1)
            
            mock_doctors.append(Doctor(
                name=name1,
                specialty=specialty,
                fee=fee1,
                rating=rating1,
                district=district,
                hospital=hospital1
            ))
            
            mock_doctors.append(Doctor(
                name=name2,
                specialty=specialty,
                fee=fee2,
                rating=rating2,
                district=district,
                hospital=hospital2
            ))
    return mock_doctors

def init_db():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    
    # Check if is_admin column exists in users, and alter if not
    try:
        from sqlalchemy import text
        with engine.begin() as conn:
            cursor = conn.execute(text("PRAGMA table_info(users)"))
            columns = [row[1] for row in cursor]
            if "is_admin" not in columns:
                conn.execute(text("ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT 0"))
    except Exception as e:
        print(f"Error checking/adding column is_admin: {e}")

    # Check if district/hospital columns exist in doctors, and alter if not
    try:
        from sqlalchemy import text
        with engine.begin() as conn:
            cursor = conn.execute(text("PRAGMA table_info(doctors)"))
            columns = [row[1] for row in cursor]
            if "district" not in columns:
                conn.execute(text("ALTER TABLE doctors ADD COLUMN district VARCHAR(100) DEFAULT 'Colombo'"))
            if "hospital" not in columns:
                conn.execute(text("ALTER TABLE doctors ADD COLUMN hospital VARCHAR(200) DEFAULT 'Colombo General Hospital'"))
    except Exception as e:
        print(f"Error checking/adding columns to doctors table: {e}")

    # Seed admin user if not exists
    try:
        admin_user = db.query(User).filter(User.email == "admin@edocbook.com").first()
        if not admin_user:
            admin_user = User(
                name="System Admin",
                email="admin@edocbook.com",
                password="adminpassword",
                is_admin=True
            )
            db.add(admin_user)
            db.commit()
    except Exception as e:
        print(f"Error seeding admin user: {e}")
    
    # Seed mock doctors if empty or old structure
    needs_reseeding = False
    try:
        if db.query(Doctor).count() < 50 or db.query(Doctor).filter(Doctor.district == None).count() > 0:
            needs_reseeding = True
    except Exception:
        needs_reseeding = True

    if needs_reseeding:
        try:
            db.query(Doctor).delete()
            db.commit()
            
            mock_doctors = generate_srilankan_doctors()
            db.add_all(mock_doctors)
            db.commit()
            print(f"Successfully seeded {len(mock_doctors)} Sri Lankan doctors across all 25 districts!")
        except Exception as e:
            print(f"Error seeding Sri Lankan doctors: {e}")
        
    # Seed disease info from json if empty
    if db.query(DiseaseInfo).count() == 0:
        try:
            with open("disease_mapping.json", "r") as f:
                data = json.load(f)
                disease_to_specialist = data.get("disease_to_specialist", {})
                disease_to_advice = data.get("disease_to_advice", {})
                disease_to_typical_symptoms = data.get("disease_to_typical_symptoms", {})
                
                disease_records = []
                for disease, specialist in disease_to_specialist.items():
                    advice = disease_to_advice.get(disease, "Please consult a doctor.")
                    typical = disease_to_typical_symptoms.get(disease, "")
                    nhs_url = f"https://www.nhs.uk/conditions/{disease.lower().replace(' ', '-')}/"
                    
                    record = DiseaseInfo(
                        name=disease,
                        specialist=specialist,
                        advice=advice,
                        typical_symptoms=typical,
                        nhs_url=nhs_url
                    )
                    disease_records.append(record)
                
                db.add_all(disease_records)
                db.commit()
        except Exception as e:
            print(f"Error seeding disease info: {e}")

    db.close()
