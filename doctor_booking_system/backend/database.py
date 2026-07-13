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
    appointments = relationship("Appointment", back_populates="user")

class Doctor(Base):
    __tablename__ = "doctors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    specialty = Column(String, index=True)
    fee = Column(Float)
    rating = Column(Float)
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

def init_db():
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    
    # Seed mock doctors if empty
    if db.query(Doctor).count() == 0:
        mock_doctors = [
            Doctor(name="Dr. Smith", specialty="General Practitioner", fee=100.0, rating=4.8),
            Doctor(name="Dr. Johnson", specialty="General Practitioner", fee=90.0, rating=4.5),
            Doctor(name="Dr. Williams", specialty="Pulmonologist", fee=150.0, rating=4.9),
            Doctor(name="Dr. Brown", specialty="Neurologist", fee=200.0, rating=4.7),
            Doctor(name="Dr. Jones", specialty="Endocrinologist", fee=130.0, rating=4.6),
            Doctor(name="Dr. Garcia", specialty="Cardiologist", fee=250.0, rating=4.9),
            Doctor(name="Dr. Miller", specialty="Gastroenterologist", fee=140.0, rating=4.4),
            Doctor(name="Dr. Davis", specialty="Nephrologist", fee=180.0, rating=4.8),
            Doctor(name="Dr. Rodriguez", specialty="Rheumatologist", fee=160.0, rating=4.7),
        ]
        db.add_all(mock_doctors)
        db.commit()
        
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
