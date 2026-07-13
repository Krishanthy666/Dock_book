import joblib
import json

def test():
    # Load model and mapping
    try:
        model = joblib.load('symptom_model.joblib')
        with open('disease_mapping.json', 'r') as f:
            data = json.load(f)
            disease_to_specialist = data['disease_to_specialist']
            disease_to_advice = data['disease_to_advice']
    except Exception as e:
        print(f"Error loading model: {e}")
        return

    # Test cases
    test_symptoms = [
        "i felt joint pain stiffness",
        "i have fever and cough",
        "severe headache and feeling dizzy"
    ]

    for symptoms in test_symptoms:
        disease = model.predict([symptoms])[0]
        specialist = disease_to_specialist.get(disease, "Unknown Specialist")
        advice = disease_to_advice.get(disease, "No advice available")
        
        print(f"Symptoms: '{symptoms}'")
        print(f" -> Predicted Disease: {disease}")
        print(f" -> Recommended Specialist: {specialist}")
        print(f" -> Advice: {advice}")
        print("-" * 40)

if __name__ == "__main__":
    test()
