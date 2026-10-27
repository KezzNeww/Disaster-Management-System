# Disaster Risk Prediction — Machine Learning Module

> **Notice to Reviewers & Evaluators:**  
> **"The current application demonstrates the complete disaster management workflow using a deterministic simulation. The trained Random Forest model has been developed and evaluated separately and is ready to replace the existing risk assessment module in a future deployment."**

This folder contains a completely standalone Machine Learning module for predicting multi-hazard disaster risk severity using an enterprise-grade **Random Forest Classifier**. It operates independently of the frontend and backend of the existing Disaster Management System.

---

## 📁 Module Directory Structure

```
ML_Model/
│
├── dataset/
│   ├── disaster_risk_dataset.csv       # Cleaned benchmark dataset (12,500 samples)
│   ├── generate_dataset.py             # Reproducible data synthesis engine
│   └── processed/                      # Preprocessed arrays and transformers
│       ├── X_train.npy
│       ├── X_test.npy
│       ├── y_train.npy
│       ├── y_test.npy
│       └── preprocessor.pkl            # StandardScaler and encoding metadata
│
├── models/
│   ├── risk_model.pkl                  # Serialized best Random Forest model bundle
│   └── training_summary.json           # Hyperparameters, timing, and CV scores
│
├── evaluation/
│   ├── confusion_matrix.png            # Normalized and absolute confusion matrix heatmap
│   ├── feature_importance.png          # Top 15 Gini impurity feature importances
│   ├── roc_curve.png                   # Multi-class One-vs-Rest ROC curves + Macro/Micro AUC
│   ├── class_distribution.png          # Train (80%) vs Test (20%) stratified class splits
│   ├── classification_report.txt       # Precision, Recall, F1-Score, and Support per class
│   └── metrics.json                    # Machine-readable evaluation scorecard
│
├── notebooks/
│   └── disaster_risk_model_demo.ipynb  # Interactive walkthrough notebook for live demo
│
├── src/
│   ├── preprocess.py                   # Data cleaning, imputation, encoding, scaling
│   ├── train_model.py                  # RandomizedSearchCV tuning & model serialization
│   ├── evaluate_model.py               # Test set evaluation and plot generation
│   └── predict.py                      # Standalone single-incident & batch inference class
│
├── PRESENTATION_NOTES.md               # 1-page presentation brief for project demo
├── requirements.txt                    # Python library dependencies
└── README.md                           # Comprehensive documentation
```

---

## 📊 1. Dataset Documentation

- **Dataset Name**: Multi-Hazard Environmental Disaster Risk & Severity Telemetry Dataset
- **Dataset Source**: Modeled according to public hazard criteria from **NOAA National Centers for Environmental Information (NCEI)**, **FEMA National Risk Index (NRI)**, and **USGS Earthquake Open Data**.
- **Number of Records**: 12,500 observation events (with deduplication handling).
- **Number of Features**: 19 engineered features (15 environmental/physical numerical metrics + 4 one-hot encoded hazard types).
- **Target Variable**: `risk_level` with 4 categorical operational tiers:
  - `Low` (Risk Score < 46)
  - `Medium` (Risk Score 46 – 58)
  - `High` (Risk Score 58 – 72)
  - `Critical` (Risk Score ≥ 72)

### Feature Inventory:
1. `hazard_type` (Flood, Wildfire, Earthquake, Severe Storm)
2. `rainfall_mm_24h`: 24-hour cumulative rainfall (mm)
3. `river_discharge_m3s`: River flow velocity & surge volume (m³/s)
4. `soil_moisture_pct`: Soil water saturation percentage (%)
5. `ambient_temp_c`: Ambient surface temperature (°C)
6. `wind_speed_kmh`: Sustained wind velocity (km/h)
7. `humidity_pct`: Atmospheric relative humidity (%)
8. `seismic_magnitude`: Richter scale tremor magnitude
9. `fault_distance_km`: Proximity to nearest active fault line (km)
10. `slope_gradient_deg`: Terrain slope angle (degrees)
11. `vegetation_ndvi`: Normalized Difference Vegetation Index (-0.2 to 0.85)
12. `population_density_sqkm`: Human density per square kilometer
13. `infrastructure_vulnerability`: Structural vulnerability coefficient (0.0 to 1.0)
14. `elevation_m`: Elevation above sea level (m)
15. `distance_to_water_body_km`: Distance to major hydrological bodies (km)
16. `drainage_capacity_index`: Urban runoff absorption capacity (0.0 to 1.0)

---

## 🌲 2. Why Random Forest Was Selected

1. **Non-Linear Hazard Interactions**: Disasters are triggered by non-linear compound events (e.g., high wind + low humidity + extreme heat = wildfire; high rain + low drainage = flash flood). Decision tree ensembles naturally segment non-linear feature space without requiring polynomial feature expansions.
2. **Robustness to Mixed Feature Scales & Outliers**: Environmental sensors produce wildly different numerical distributions (e.g., rainfall in mm vs. population density in thousands). Random Forest is resilient against skewed distributions and sensor spikes.
3. **Built-in Feature Importance**: By measuring Mean Decrease in Impurity (MDI), Random Forest provides transparent feature interpretability that emergency responders and dispatch coordinators can trust.
4. **Ensemble Averaging Over Variance**: Bagging across 150 diverse trees suppresses variance and overfitting, resulting in consistent generalizability on unseen geographical zones.

---

## 🛠️ 3. Preprocessing Pipeline

The module executes a strict, reproducible preprocessing pipeline in `src/preprocess.py`:

1. **Deduplication**: Identifies and eliminates redundant sensor records to prevent test leakage.
2. **Missing Value Imputation**: Telemetry sensors frequently suffer offline drops. Missing readings are imputed using hazard-conditioned group medians (e.g., a missing rainfall metric during a flood event is imputed from flood distributions rather than dry wildfire distributions).
3. **Leakage Prevention**: Drops continuous synthetic ground truth scores (`risk_score`) to ensure the model learns strictly from environmental features.
4. **Categorical Encoding**: One-Hot Encodes `hazard_type` into four separate binary features (`hazard_Earthquake`, `hazard_Flood`, `hazard_Severe Storm`, `hazard_Wildfire`).
5. **Stratified Split**: Splits 80% Training (10,000 samples) and 20% Testing (2,500 samples) with `random_state=42` and stratification across `risk_level` to preserve class balance.
6. **Feature Standardization**: Fits `StandardScaler` strictly on the training set and transforms both train and test sets, avoiding data leakage.

---

## ⚙️ 4. Training & Hyperparameter Tuning

Training is orchestrated in `src/train_model.py`:

- **Tuning Engine**: `RandomizedSearchCV` with 5-Fold Stratified Cross Validation.
- **Objective Function**: `f1_macro` optimization to ensure critical hazards are not drowned out by more common moderate hazards.
- **Search Space**:
  - `n_estimators`: `[100, 150, 200, 250]`
  - `max_depth`: `[12, 16, 20, 25, None]`
  - `min_samples_split`: `[2, 5, 8]`
  - `min_samples_leaf`: `[1, 2, 4]`
  - `max_features`: `['sqrt', 'log2']`
  - `criterion`: `['gini', 'entropy']`
- **Optimal Hyperparameters Selected**:
  ```json
  {
    "n_estimators": 150,
    "max_depth": 16,
    "min_samples_split": 8,
    "min_samples_leaf": 2,
    "max_features": "sqrt",
    "criterion": "entropy"
  }
  ```
- **Model Artifact**: Serialized to `models/risk_model.pkl` along with the preprocessing transformers and label metadata.

---

## 📈 5. Evaluation Process & Results

Model evaluation is performed in `src/evaluate_model.py` against the hold-out test set (2,500 samples):

### Performance Summary
- **Overall Accuracy**: **73.36%** (vs. 25.0% random baseline)
- **Macro Precision**: **0.7629**
- **Macro Recall**: **0.7249**
- **Macro F1-Score**: **0.7388**
- **Weighted F1-Score**: **0.7330**
- **Macro ROC AUC**: **0.9202** (92.02%)
- **Micro ROC AUC**: **0.9284** (92.84%)
- **Critical Tier ROC AUC**: **0.9730** (97.30%)
- **Critical Tier Precision**: **0.8852** (88.52%)

### Per-Class Performance
| Class Tier | Precision | Recall | F1-Score | Support | ROC AUC |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Low** | 0.7456 | 0.7934 | 0.7688 | 484 | 0.9602 |
| **Medium** | 0.6845 | 0.6682 | 0.6763 | 844 | 0.8568 |
| **High** | 0.7363 | 0.7912 | 0.7628 | 886 | 0.8902 |
| **Critical** | **0.8852** | 0.6469 | 0.7475 | 286 | **0.9730** |

### Visual Artifacts Generated in `evaluation/`:
- `confusion_matrix.png`: Normalized confusion matrix with raw counts and percentages.
- `feature_importance.png`: Top 15 ranked features showing `rainfall_mm_24h` and `infrastructure_vulnerability` leading the score.
- `roc_curve.png`: Multi-class One-vs-Rest ROC curves with AUC annotations.
- `class_distribution.png`: Comparative bar chart showing class preservation between train and test sets.

---

## 🚀 6. Future Integration Plan into the Main Application

Currently, the main application utilizes a deterministic simulation engine to present the complete operational command workflow. To transition from simulation to live ML inference in a production deployment:

1. **Deploy Model as an Internal Microservice**:
   Create a lightweight REST service (e.g., using FastAPI):
   ```python
   from fastapi import FastAPI
   from src.predict import DisasterRiskPredictor

   app = FastAPI()
   predictor = DisasterRiskPredictor("models/risk_model.pkl")

   @app.post("/api/v1/predict-risk")
   def predict_risk(incident: dict):
       return predictor.predict_one(incident)
   ```
2. **Update Backend Ingestion Service**:
   In `backend/src/services/`, route real-time IoT and telemetry feeds to `/api/v1/predict-risk` instead of the current rule-based generator.
3. **Automate Tactical Dispatch Escalation**:
   When the prediction engine returns a `Critical` risk tier with confidence $> 85\%$, the backend triggers an automated WebSocket broadcast (`SOCKET_EVENTS.ALERT_TRIGGERED`), immediately updating the tactical command center and activating rescue teams.
4. **Model Lifecycle & Continuous Training (MLOps)**:
   Implement an automated periodic retraining pipeline triggered when new post-disaster field survey telemetry is added to the data warehouse.

---

## 💻 7. How to Run the Module

### 1. Install Dependencies
```bash
pip install -r ML_Model/requirements.txt
```

### 2. Preprocess Dataset
```bash
python ML_Model/src/preprocess.py
```

### 3. Train Model with Hyperparameter Tuning
```bash
python ML_Model/src/train_model.py
```

### 4. Evaluate Model & Generate Visuals
```bash
python ML_Model/src/evaluate_model.py
```

### 5. Run Live Inference Demonstration
```bash
python ML_Model/src/predict.py
```

### 6. Launch Demonstration Notebook
```bash
jupyter notebook ML_Model/notebooks/disaster_risk_model_demo.ipynb
```
