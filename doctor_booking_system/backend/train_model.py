import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
import joblib
import json
import os

def train_and_export():
    dataset_path = "/home/sathusan/Documents/Ai Doc Book/symptom_disease_specialist_dataset.csv"
    if not os.path.exists(dataset_path):
        print(f"Dataset not found at {dataset_path}")
        return

    df = pd.read_csv(dataset_path)

    # We will predict the disease based on symptoms
    X = df['symptoms']
    y = df['disease']

    # Create a mapping from disease to specialist
    disease_to_specialist = df.set_index('disease')['specialist'].to_dict()

    # Define simple general advice based on disease
    # We can hardcode some advice based on the unique diseases
    unique_diseases = df['disease'].unique()
    disease_to_advice = {
        "Flu": "Rest, drink plenty of fluids, and consider over-the-counter pain relievers.",
        "Common Cold": "Stay hydrated, rest, and use throat lozenges if needed.",
        "COVID-19": "Isolate yourself, wear a mask, and seek emergency care if you have trouble breathing.",
        "Migraine": "Rest in a quiet, dark room. Apply a cold compress to your head.",
        "Asthma": "Use your prescribed inhaler and avoid known triggers.",
        "Diabetes": "Monitor your blood sugar levels and adhere to your dietary plan.",
        "Hypertension": "Reduce sodium intake, manage stress, and monitor your blood pressure.",
        "Food Poisoning": "Stay hydrated with water or electrolyte solutions. Eat bland foods.",
        "Kidney Infection": "Drink plenty of water and complete any prescribed antibiotic courses.",
        "Arthritis": "Engage in gentle exercises and use hot/cold therapy for joint pain."
    }

    # Fill in any missing diseases with generic advice
    for disease in unique_diseases:
        if disease not in disease_to_advice:
            disease_to_advice[disease] = "Please consult a healthcare professional for specific advice."

    # Create a pipeline
    model = Pipeline([
        ('tfidf', TfidfVectorizer(ngram_range=(1, 2))),
        ('clf', LogisticRegression(random_state=42))
    ])

    print("Training model...")
    model.fit(X, y)
    print("Training complete.")

    # Save the model and mappings
    joblib.dump(model, 'symptom_model.joblib')
    
    with open('disease_mapping.json', 'w') as f:
        json.dump({
            'disease_to_specialist': disease_to_specialist,
            'disease_to_advice': disease_to_advice
        }, f, indent=4)

    print("Model and mappings saved to disk.")

if __name__ == "__main__":
    train_and_export()
