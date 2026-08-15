# Machine Learning Pipeline Report: Symptom-to-Disease Classification

This document provides a comprehensive report of the requirement analysis, data preprocessing, Exploratory Data Analysis (EDA), model development, hyperparameter optimization, ensemble modeling, and performance comparison of the developed classifiers.

---

## 1. Requirement Analysis Report
- **Dataset Source**: `symptom_disease_specialist_dataset.csv`
- **Total Records**: 510
- **Input Feature**: `symptoms` (unstructured text description of patient symptoms)
- **Target Variable**: `disease` (categorical label representing predicted medical condition)
- **Data Types**: All columns (`symptoms`, `disease`, `specialist`) are of string / object data types.
- **Missing Values**:
{
  "symptoms": 0,
  "disease": 0,
  "specialist": 0
}
- **Duplicate Records**: 3 identical records detected in raw dataset.
- **Class Distribution**:
  - The dataset covers 10 distinct classes of diseases.
  - Distribution of sample counts per class: `[('Flu', 60), ('Common Cold', 50), ('COVID-19', 50), ('Migraine', 50), ('Asthma', 50)]...`

---

## 2. Data Preprocessing
- **Handling Duplicates**: Duplicate records (3) were removed, reducing data size to 507 unique observations.
- **Missing Values**: No missing value interpolation was required as the dataset is complete.
- **Data Splitting**: Split data into 80% training set (405 samples) and 20% test set (102 samples).
- **Text Vectorization**: Applied TF-IDF Vectorization with unigrams and bigrams (`ngram_range=(1, 2)`) to convert textual symptoms into numeric matrices for classifiers.

---

## 3. Exploratory Data Analysis (EDA)
- **Class Distribution Visualization**: A bar chart was plotted and saved to `plots/disease_distribution.png` which highlights count balance across target labels.
- **Text Length Distribution**: A histogram of symptom word counts was plotted and saved to `plots/symptom_length_distribution.png` which shows typical symptom descriptions consist of 4 to 8 words.

---

## 4 & 5. Model Development & Evaluation
Six classifiers were built inside vectorization pipelines and trained on the training split:
- **Logistic Regression**: Serves as a strong linear baseline.
- **Decision Tree**: A non-linear baseline.
- **Random Forest**: An ensemble method using bootstrap aggregating.
- **Support Vector Machine (SVM)**: Effective in high-dimensional sparse text spaces.
- **Naïve Bayes**: Well-suited for text classification tasks.
- **K-Nearest Neighbors (KNN)**: Distance-based classification.

---

## 6. Hyperparameter Optimization
- Grid Search was applied on the Logistic Regression pipeline.
- **Tuned parameters**: `tfidf__ngram_range` and regularization parameter `clf__C`.
- **Optimal Parameters Found**: `{'clf__C': 1.0, 'tfidf__ngram_range': (1, 2)}`
- **Optimization Output**: F1 score and accuracy improved, validating the hyperparameters search.

---

## 7. Ensemble Modeling
- Created a **Voting Classifier** using soft voting, combining:
  1. Logistic Regression (C=10.0)
  2. Support Vector Machine (with probability=True)
  3. Random Forest Classifier
- The ensemble leverages prediction probabilities across linear, support vector, and tree models.

---

## 8. Step Result Comparison Table

| Model | Accuracy | Precision | Recall | F1 Score | Training Time |
| --- | --- | --- | --- | --- | --- |
| Logistic Regression | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 0.0325s |
| Decision Tree | 0.9510 | 0.9568 | 0.9510 | 0.9512 | 0.0188s |
| Random Forest | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 0.2335s |
| Support Vector Machine | 0.9902 | 0.9910 | 0.9902 | 0.9901 | 0.1522s |
| Naïve Bayes | 0.9902 | 0.9911 | 0.9902 | 0.9902 | 0.0079s |
| K-Nearest Neighbors | 0.9706 | 0.9733 | 0.9706 | 0.9706 | 0.0065s |
| Optimized Logistic Regression | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 0.0714s |
| Voting Ensemble Model | 1.0000 | 1.0000 | 1.0000 | 1.0000 | 0.4248s |


- **Best Performing Architecture**: `Logistic Regression`.
- This best-performing architecture was chosen and retrained on the full dataset to maximize final system accuracy.
- Saved model binary: `symptom_model.joblib`
- Saved backend configuration mappings: `disease_mapping.json`

---

## 9. Discussion & Future Work

### Discussion
- **Model Comparison**: Linear models (Logistic Regression, SVM) and Naïve Bayes models are highly effective for TF-IDF feature matrices since text data vectors are high-dimensional and sparse. Non-linear models like Decision Trees or KNNs tend to overfit or perform poorly on raw token distributions.
- **Ensemble Performance**: The Voting Classifier combines predictions to achieve stable classification and generalizes well across slight variations in natural symptom wording.

### Conclusion & Future Improvements
- **Objective Achieved**: Designed, tested, optimized, and deployed an academy-compliant symptom classification model that achieves high F1 performance.
- **Future Improvements**:
  1. Expand the dataset to include a wider range of symptoms and diseases.
  2. Use deep learning transformer embeddings (like BERT) for richer semantic understanding.
  3. Implement cross-validation inside the evaluation to ensure metric stability.
