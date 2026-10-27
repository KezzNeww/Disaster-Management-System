"""
Model Training & Hyperparameter Tuning Module
=============================================

This module trains a RandomForestClassifier for Disaster Risk Prediction:
- Loads preprocessed training features and labels
- Configures hyperparameter search space across tree depth, estimators, split/leaf criteria
- Executes 5-fold cross-validated hyperparameter tuning using RandomizedSearchCV
- Evaluates and selects the optimal estimator
- Serializes the tuned model to 'models/risk_model.pkl'
"""

import os
import json
import time
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import RandomizedSearchCV, StratifiedKFold
from typing import Dict, Any


def load_training_data(data_dir: str):
    """Load preprocessed training arrays and preprocessor metadata."""
    x_train_path = os.path.join(data_dir, 'X_train.npy')
    y_train_path = os.path.join(data_dir, 'y_train.npy')
    prep_path = os.path.join(data_dir, 'preprocessor.pkl')
    
    if not os.path.exists(x_train_path) or not os.path.exists(y_train_path):
        raise FileNotFoundError(f"Training data not found in {data_dir}. Run preprocess.py first.")
        
    X_train = np.load(x_train_path)
    y_train = np.load(y_train_path)
    preprocessor = joblib.load(prep_path)
    
    print(f"[TRAIN] Loaded X_train: {X_train.shape}, y_train: {y_train.shape}")
    return X_train, y_train, preprocessor


def tune_and_train_model(
    X_train: np.ndarray,
    y_train: np.ndarray,
    feature_names: list,
    random_state: int = 42
) -> Dict[str, Any]:
    """
    Execute hyperparameter tuning via RandomizedSearchCV with 5-Fold Stratified CV.
    """
    print("\n" + "="*60)
    print("STARTING RANDOM FOREST HYPERPARAMETER TUNING")
    print("="*60)
    
    # Base classifier
    rf_base = RandomForestClassifier(
        random_state=random_state,
        n_jobs=-1,
        class_weight='balanced'
    )
    
    # Search grid
    param_distributions = {
        'n_estimators': [100, 150, 200, 250],
        'max_depth': [12, 16, 20, 25, None],
        'min_samples_split': [2, 5, 8],
        'min_samples_leaf': [1, 2, 4],
        'max_features': ['sqrt', 'log2'],
        'criterion': ['gini', 'entropy']
    }
    
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=random_state)
    
    search = RandomizedSearchCV(
        estimator=rf_base,
        param_distributions=param_distributions,
        n_iter=15,
        cv=cv,
        scoring='f1_macro',
        verbose=1,
        random_state=random_state,
        n_jobs=-1
    )
    
    start_time = time.time()
    search.fit(X_train, y_train)
    elapsed_time = round(time.time() - start_time, 2)
    
    print("\n" + "="*60)
    print("HYPERPARAMETER TUNING COMPLETE")
    print("="*60)
    print(f"Total Tuning Duration : {elapsed_time} seconds")
    print(f"Best 5-Fold Macro F1  : {search.best_score_:.4f}")
    print(f"Optimal Hyperparameters:")
    for param, val in search.best_params_.items():
        print(f"  - {param}: {val}")
        
    best_model = search.best_estimator_
    
    # Calculate MDI feature importances
    importances = best_model.feature_importances_
    sorted_idx = np.argsort(importances)[::-1]
    
    print("\nTop 5 Most Significant Telemetry Predictors:")
    for rank, idx in enumerate(sorted_idx[:5], start=1):
        print(f"  {rank}. {feature_names[idx]:<30} : {importances[idx]:.4f}")
        
    return {
        'model': best_model,
        'best_params': search.best_params_,
        'best_cv_score': float(search.best_score_),
        'tuning_duration_seconds': elapsed_time,
        'feature_importances': {feature_names[i]: float(importances[i]) for i in sorted_idx}
    }


def save_trained_model(
    model_artifacts: Dict[str, Any],
    preprocessor: Dict[str, Any],
    output_dir: str
):
    """
    Save best model as risk_model.pkl and export training summary metrics.
    """
    os.makedirs(output_dir, exist_ok=True)
    
    # 1. Save standard standalone model
    model_path = os.path.join(output_dir, 'risk_model.pkl')
    
    # Package model alongside metadata for self-contained, seamless production loading
    bundle = {
        'model': model_artifacts['model'],
        'preprocessor': preprocessor,
        'feature_names': preprocessor['feature_names'],
        'target_classes': preprocessor['target_classes'],
        'label_mapping': preprocessor['label_mapping'],
        'inverse_mapping': preprocessor['inverse_mapping'],
        'best_hyperparameters': model_artifacts['best_params'],
        'cv_macro_f1': model_artifacts['best_cv_score']
    }
    joblib.dump(bundle, model_path)
    print(f"\n[SAVE] Best model bundle successfully saved to: {model_path}")
    
    # 2. Save training summary metadata
    summary_path = os.path.join(output_dir, 'training_summary.json')
    summary_data = {
        'algorithm': 'RandomForestClassifier',
        'hyperparameter_search': 'RandomizedSearchCV (5-Fold Stratified)',
        'best_parameters': model_artifacts['best_params'],
        'best_cross_val_macro_f1': model_artifacts['best_cv_score'],
        'training_duration_seconds': model_artifacts['tuning_duration_seconds'],
        'feature_names': preprocessor['feature_names'],
        'feature_importances': model_artifacts['feature_importances']
    }
    with open(summary_path, 'w') as f:
        json.dump(summary_data, f, indent=4)
    print(f"[SAVE] Training metadata summary saved to: {summary_path}")


def main():
    base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    data_dir = os.path.join(base_dir, 'dataset', 'processed')
    models_dir = os.path.join(base_dir, 'models')
    
    X_train, y_train, preprocessor = load_training_data(data_dir)
    results = tune_and_train_model(
        X_train,
        y_train,
        feature_names=preprocessor['feature_names'],
        random_state=42
    )
    save_trained_model(results, preprocessor, models_dir)


if __name__ == '__main__':
    main()
