"""
Inference Module for Disaster Risk Prediction
=============================================

Provides programmatic single-record and batch prediction using the trained
Random Forest model and saved preprocessing pipeline.
"""

import os
import joblib
import pandas as pd
import numpy as np
from typing import Dict, Any, Union, List


class DisasterRiskPredictor:
    def __init__(self, model_path: str = None):
        if model_path is None:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
            model_path = os.path.join(base_dir, 'models', 'risk_model.pkl')
            
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")
            
        self.bundle = joblib.load(model_path)
        self.model = self.bundle['model']
        self.preprocessor = self.bundle['preprocessor']
        self.scaler = self.preprocessor['scaler']
        self.feature_names = self.bundle['feature_names']
        self.target_classes = self.bundle['target_classes']
        self.inverse_mapping = self.bundle['inverse_mapping']
        self.num_indices = self.preprocessor['num_indices']
        self.numerical_cols = self.preprocessor['numerical_cols']
        
    def predict_one(self, sample_dict: Dict[str, Any]) -> Dict[str, Any]:
        """Run prediction on a single incident telemetry dictionary."""
        df_single = pd.DataFrame([sample_dict])
        return self.predict_batch(df_single)[0]
        
    def predict_batch(self, df_input: pd.DataFrame) -> List[Dict[str, Any]]:
        """Run prediction on a batch DataFrame."""
        df = df_input.copy()
        
        # 1. Fill missing values with defaults if present
        for col in self.numerical_cols:
            if col not in df.columns:
                df[col] = 0.0
            else:
                df[col] = df[col].fillna(0.0)
                
        # 2. One-hot encode hazard_type to match trained schema
        hazard_types = ['hazard_Earthquake', 'hazard_Flood', 'hazard_Severe Storm', 'hazard_Wildfire']
        for col in hazard_types:
            df[col] = 0.0
            
        if 'hazard_type' in df.columns:
            for idx, htype in enumerate(df['hazard_type']):
                col_name = f"hazard_{htype}"
                if col_name in df.columns:
                    df.loc[idx, col_name] = 1.0
                    
        # 3. Assemble feature array matching trained order
        X_df = df[self.feature_names].astype(float)
        X_mat = X_df.values.copy()
        
        # 4. Standardize numerical features
        X_mat[:, self.num_indices] = self.scaler.transform(X_mat[:, self.num_indices])
        
        # 5. Predict class and probabilities
        preds = self.model.predict(X_mat)
        probs = self.model.predict_proba(X_mat)
        
        results = []
        for i in range(len(preds)):
            pred_class_idx = preds[i]
            pred_class_label = self.inverse_mapping[pred_class_idx]
            prob_dict = {
                self.target_classes[c_idx]: round(float(probs[i][c_idx]), 4)
                for c_idx in range(len(self.target_classes))
            }
            results.append({
                'predicted_risk_level': pred_class_label,
                'confidence': round(float(probs[i][pred_class_idx]), 4),
                'class_probabilities': prob_dict
            })
            
        return results


if __name__ == '__main__':
    predictor = DisasterRiskPredictor()
    
    # Demonstration sample: Severe Flood scenario
    sample_flood = {
        'hazard_type': 'Flood',
        'rainfall_mm_24h': 210.5,
        'river_discharge_m3s': 1680.0,
        'soil_moisture_pct': 92.5,
        'ambient_temp_c': 24.0,
        'wind_speed_kmh': 45.0,
        'humidity_pct': 94.0,
        'seismic_magnitude': 0.2,
        'fault_distance_km': 65.0,
        'slope_gradient_deg': 12.0,
        'vegetation_ndvi': 0.45,
        'population_density_sqkm': 4200.0,
        'infrastructure_vulnerability': 0.78,
        'elevation_m': 45.0,
        'distance_to_water_body_km': 1.2,
        'drainage_capacity_index': 0.35
    }
    
    print("\n[PREDICTION DEMO]")
    res = predictor.predict_one(sample_flood)
    print("Input Telemetry: Severe Monsoon Flood Event")
    print(f"Predicted Risk Level : {res['predicted_risk_level']}")
    print(f"Prediction Confidence: {res['confidence']*100:.1f}%")
    print(f"Full Probabilities   : {res['class_probabilities']}")
