"""
Data Preprocessing Module for Disaster Risk Prediction
=====================================================

This module handles complete end-to-end data preparation:
1. Missing Value Imputation (Median for numerical telemetry)
2. Duplicate Record Removal
3. Categorical Feature Encoding (One-Hot Encoding for hazard_type)
4. Numerical Feature Standardization (StandardScaler fitted strictly on training fold)
5. Target Label Encoding ('Low', 'Medium', 'High', 'Critical' ordered mapping)
6. Stratified 80/20 Train-Test Splitting with random_state=42
"""

import os
import joblib
import numpy as np
import pandas as pd
from typing import Tuple, Dict, Any
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder

# Ordered target classes for consistent clinical/operational risk ranking
TARGET_CLASSES = ['Low', 'Medium', 'High', 'Critical']
CATEGORICAL_COLS = ['hazard_type']
NUMERICAL_COLS = [
    'rainfall_mm_24h',
    'river_discharge_m3s',
    'soil_moisture_pct',
    'ambient_temp_c',
    'wind_speed_kmh',
    'humidity_pct',
    'seismic_magnitude',
    'fault_distance_km',
    'slope_gradient_deg',
    'vegetation_ndvi',
    'population_density_sqkm',
    'infrastructure_vulnerability',
    'elevation_m',
    'distance_to_water_body_km',
    'drainage_capacity_index'
]
TARGET_COL = 'risk_level'


def load_dataset(file_path: str) -> pd.DataFrame:
    """Load raw dataset from CSV file."""
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"Dataset file not found at: {file_path}")
    df = pd.read_csv(file_path)
    print(f"[PREPROCESS] Loaded raw dataset: {df.shape[0]} records, {df.shape[1]} columns.")
    return df


def clean_dataset(df: pd.DataFrame) -> pd.DataFrame:
    """
    Step 1 & 2: Deduplication and Missing Value Imputation.
    - Removes exact duplicate records to prevent evaluation contamination.
    - Imputes missing telemetry values using median per hazard type (domain-aware).
    """
    initial_count = len(df)
    
    # 1. Remove duplicate records
    df = df.drop_duplicates().copy()
    duplicates_removed = initial_count - len(df)
    print(f"[PREPROCESS] Step 1 - Deduplication: Removed {duplicates_removed} duplicate rows. Remaining: {len(df)}")
    
    # 2. Impute missing numerical values
    missing_before = df[NUMERICAL_COLS].isna().sum().sum()
    print(f"[PREPROCESS] Step 2 - Missing Values: Detected {missing_before} missing telemetry data points.")
    
    # Impute missing numerical values using median grouped by hazard_type for physical consistency
    for col in NUMERICAL_COLS:
        if df[col].isna().sum() > 0:
            median_val = df[col].median()
            df[col] = df[col].fillna(df.groupby('hazard_type')[col].transform('median'))
            # Fallback for any remaining NaNs
            df[col] = df[col].fillna(median_val)
            print(f"             - Imputed column '{col}' with hazard-conditioned median.")
            
    # Remove continuous risk_score column if present to prevent target leakage
    if 'risk_score' in df.columns:
        df = df.drop(columns=['risk_score'])
        print("[PREPROCESS] Dropped raw 'risk_score' to guarantee zero target leakage.")
        
    return df


def encode_and_split(
    df: pd.DataFrame,
    test_size: float = 0.2,
    random_state: int = 42
) -> Dict[str, Any]:
    """
    Step 3, 4 & 5: Feature Encoding, Standardization, and Train/Test Split.
    
    Returns:
        dict containing:
        - X_train, X_test (standardized arrays)
        - y_train, y_test (encoded class integers)
        - feature_names (list of transformed feature names)
        - scaler (fitted StandardScaler)
        - label_encoder (fitted LabelEncoder)
        - hazard_categories (categories for hazard_type)
    """
    # 1. Separate features and target
    X_raw = df[CATEGORICAL_COLS + NUMERICAL_COLS].copy()
    y_raw = df[TARGET_COL].copy()
    
    # 2. One-Hot Encode categorical features
    # Use drop_first=False so each hazard type gets an explicit indicator
    hazard_dummies = pd.get_dummies(X_raw['hazard_type'], prefix='hazard', dtype=float)
    X_processed = pd.concat([hazard_dummies, X_raw[NUMERICAL_COLS]], axis=1)
    feature_names = list(X_processed.columns)
    
    # 3. Deterministic sequential encoding: 0: Low, 1: Medium, 2: High, 3: Critical
    label_mapping = {cls: idx for idx, cls in enumerate(TARGET_CLASSES)}
    inverse_mapping = {idx: cls for idx, cls in enumerate(TARGET_CLASSES)}
    y_encoded = y_raw.map(label_mapping).values.astype(int)
    
    print(f"[PREPROCESS] Step 3 - Categorical Encoding: Transformed into {len(feature_names)} engineered features.")
    print(f"[PREPROCESS] Step 4 - Target Encoding: Classes mapped to {label_mapping}")
    
    # 4. Stratified Train-Test Split (80% Train, 20% Test)
    X_train_df, X_test_df, y_train, y_test = train_test_split(
        X_processed,
        y_encoded,
        test_size=test_size,
        random_state=random_state,
        stratify=y_encoded
    )
    print(f"[PREPROCESS] Step 5 - Train-Test Split (80/20, random_state={random_state}):")
    print(f"             - Training set: {X_train_df.shape[0]} samples")
    print(f"             - Testing set : {X_test_df.shape[0]} samples")
    
    # 5. Fit StandardScaler strictly on training set to avoid data leakage
    scaler = StandardScaler()
    
    # Scale only numerical columns, leave one-hot binary columns as 0.0/1.0
    num_indices = [feature_names.index(c) for c in NUMERICAL_COLS]
    
    X_train = X_train_df.values.copy()
    X_test = X_test_df.values.copy()
    
    X_train[:, num_indices] = scaler.fit_transform(X_train[:, num_indices])
    X_test[:, num_indices] = scaler.transform(X_test[:, num_indices])
    print("[PREPROCESS] Step 6 - Numerical Standardization: Fitted StandardScaler strictly on X_train.")
    
    return {
        'X_train': X_train,
        'X_test': X_test,
        'y_train': y_train,
        'y_test': y_test,
        'feature_names': feature_names,
        'scaler': scaler,
        'label_mapping': label_mapping,
        'inverse_mapping': inverse_mapping,
        'num_indices': num_indices,
        'target_classes': TARGET_CLASSES
    }


def save_preprocessed_artifacts(artifacts: Dict[str, Any], output_dir: str):
    """Save scalers, feature metadata, and processed sets for standalone verification."""
    os.makedirs(output_dir, exist_ok=True)
    
    # Save preprocessing transformers
    preprocessor_payload = {
        'scaler': artifacts['scaler'],
        'label_mapping': artifacts['label_mapping'],
        'inverse_mapping': artifacts['inverse_mapping'],
        'feature_names': artifacts['feature_names'],
        'num_indices': artifacts['num_indices'],
        'target_classes': artifacts['target_classes'],
        'numerical_cols': NUMERICAL_COLS,
        'categorical_cols': CATEGORICAL_COLS
    }
    joblib.dump(preprocessor_payload, os.path.join(output_dir, 'preprocessor.pkl'))
    
    # Save numpy datasets
    np.save(os.path.join(output_dir, 'X_train.npy'), artifacts['X_train'])
    np.save(os.path.join(output_dir, 'X_test.npy'), artifacts['X_test'])
    np.save(os.path.join(output_dir, 'y_train.npy'), artifacts['y_train'])
    np.save(os.path.join(output_dir, 'y_test.npy'), artifacts['y_test'])
    print(f"[PREPROCESS] Saved all preprocessed datasets & preprocessor.pkl to: {output_dir}")


def run_pipeline(dataset_path: str, output_dir: str) -> Dict[str, Any]:
    """Execute full preprocessing pipeline."""
    df_raw = load_dataset(dataset_path)
    df_clean = clean_dataset(df_raw)
    artifacts = encode_and_split(df_clean, test_size=0.2, random_state=42)
    save_preprocessed_artifacts(artifacts, output_dir)
    return artifacts


if __name__ == '__main__':
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    data_file = os.path.join(base_dir, 'dataset', 'disaster_risk_dataset.csv')
    out_dir = os.path.join(base_dir, 'dataset', 'processed')
    run_pipeline(data_file, out_dir)
