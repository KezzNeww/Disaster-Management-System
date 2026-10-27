"""
Dataset Generator: Multi-Hazard Disaster Risk and Severity Dataset
Source Reference: Synthesized benchmark adhering to NOAA NCEI, FEMA National Risk Index (NRI),
and USGS Open Hazard Data standards.

This script creates a realistic dataset of 12,500 records representing telemetry
from environmental sensor networks, seismic monitors, meteorological stations,
and municipal infrastructure metrics across diverse geographical hazard zones.
"""

import numpy as np
import pandas as pd
import os

def generate_disaster_risk_dataset(output_path: str, n_samples: int = 12500, random_state: int = 42):
    np.random.seed(random_state)
    
    hazard_types = np.random.choice(
        ['Flood', 'Wildfire', 'Earthquake', 'Severe Storm'],
        size=n_samples,
        p=[0.35, 0.25, 0.20, 0.20]
    )
    
    # Initialize feature arrays
    rainfall_mm = np.zeros(n_samples)
    river_discharge = np.zeros(n_samples)
    soil_moisture = np.zeros(n_samples)
    ambient_temp = np.zeros(n_samples)
    wind_speed = np.zeros(n_samples)
    humidity = np.zeros(n_samples)
    seismic_mag = np.zeros(n_samples)
    fault_distance = np.random.exponential(scale=35.0, size=n_samples).clip(1.0, 150.0)
    slope_gradient = np.random.gamma(shape=2.5, scale=4.0, size=n_samples).clip(0.0, 45.0)
    vegetation_ndvi = np.random.uniform(0.08, 0.85, size=n_samples)
    population_density = np.random.lognormal(mean=6.5, sigma=1.2, size=n_samples).clip(20.0, 15000.0)
    infra_vulnerability = np.random.beta(a=2.0, b=3.0, size=n_samples).clip(0.05, 0.95)
    elevation = np.random.exponential(scale=300.0, size=n_samples).clip(2.0, 2600.0)
    distance_to_water = np.random.exponential(scale=8.0, size=n_samples).clip(0.1, 55.0)
    drainage_capacity = np.random.uniform(0.15, 0.95, size=n_samples)
    
    # Context-specific generation per hazard
    for i in range(n_samples):
        htype = hazard_types[i]
        if htype == 'Flood':
            rainfall_mm[i] = np.random.gamma(shape=4.0, scale=35.0)  # 0 to 350+
            river_discharge[i] = np.clip(rainfall_mm[i] * 5.5 + np.random.normal(120, 40), 20.0, 2400.0)
            soil_moisture[i] = np.clip(45.0 + rainfall_mm[i] * 0.22 + np.random.normal(0, 5), 20.0, 99.0)
            ambient_temp[i] = np.clip(np.random.normal(22.0, 6.0), 5.0, 38.0)
            wind_speed[i] = np.clip(np.random.normal(30.0, 15.0), 5.0, 95.0)
            humidity[i] = np.clip(65.0 + rainfall_mm[i] * 0.15 + np.random.normal(0, 5), 40.0, 99.0)
            seismic_mag[i] = np.clip(np.random.exponential(scale=0.8), 0.0, 3.2)
            
        elif htype == 'Wildfire':
            rainfall_mm[i] = np.clip(np.random.exponential(scale=4.0), 0.0, 25.0)
            river_discharge[i] = np.random.uniform(15.0, 180.0)
            soil_moisture[i] = np.random.uniform(5.0, 32.0)
            ambient_temp[i] = np.clip(np.random.normal(36.0, 5.5), 22.0, 48.0)
            wind_speed[i] = np.clip(np.random.gamma(shape=3.5, scale=12.0), 12.0, 110.0)
            humidity[i] = np.random.uniform(8.0, 38.0)
            seismic_mag[i] = np.clip(np.random.exponential(scale=0.5), 0.0, 2.5)
            
        elif htype == 'Earthquake':
            rainfall_mm[i] = np.clip(np.random.exponential(scale=15.0), 0.0, 80.0)
            river_discharge[i] = np.random.uniform(30.0, 350.0)
            soil_moisture[i] = np.random.uniform(15.0, 75.0)
            ambient_temp[i] = np.clip(np.random.normal(21.0, 8.0), 2.0, 40.0)
            wind_speed[i] = np.random.uniform(5.0, 45.0)
            humidity[i] = np.random.uniform(25.0, 85.0)
            seismic_mag[i] = np.clip(np.random.gamma(shape=3.0, scale=1.4), 1.5, 7.9)
            
        else: # Severe Storm
            rainfall_mm[i] = np.random.gamma(shape=3.5, scale=28.0)
            river_discharge[i] = np.random.uniform(60.0, 950.0)
            soil_moisture[i] = np.random.uniform(40.0, 90.0)
            ambient_temp[i] = np.clip(np.random.normal(19.0, 7.0), 4.0, 35.0)
            wind_speed[i] = np.clip(np.random.gamma(shape=4.5, scale=18.0), 35.0, 145.0)
            humidity[i] = np.random.uniform(70.0, 99.0)
            seismic_mag[i] = np.clip(np.random.exponential(scale=0.6), 0.0, 2.8)

    # Physical Risk Index calculation based on domain physics
    # Composite severity score [0.0 - 100.0]
    risk_scores = np.zeros(n_samples)
    
    for i in range(n_samples):
        ht = hazard_types[i]
        vuln = infra_vulnerability[i]
        pop_factor = np.log10(population_density[i]) / 4.2  # normalized roughly 0.3 - 1.0
        
        if ht == 'Flood':
            hazard_intensity = (
                (rainfall_mm[i] / 220.0) * 0.40 +
                (river_discharge[i] / 1500.0) * 0.30 +
                (soil_moisture[i] / 100.0) * 0.20 +
                (1.0 - (elevation[i] / 1000.0).clip(0, 1)) * 0.10
            )
            mitigation = drainage_capacity[i] * 0.25
            raw_score = (hazard_intensity * 0.65 + vuln * 0.20 + pop_factor * 0.15) * 100 - (mitigation * 15)
            
        elif ht == 'Wildfire':
            dryness = (1.0 - (humidity[i] / 100.0))
            heat = (ambient_temp[i] / 45.0).clip(0, 1)
            wind = (wind_speed[i] / 90.0).clip(0, 1)
            fuel = (1.0 - (soil_moisture[i] / 100.0)) * vegetation_ndvi[i]
            hazard_intensity = heat * 0.30 + dryness * 0.30 + wind * 0.25 + fuel * 0.15
            raw_score = (hazard_intensity * 0.70 + vuln * 0.15 + pop_factor * 0.15) * 100
            
        elif ht == 'Earthquake':
            proximity_term = (1.0 - (fault_distance[i] / 100.0).clip(0, 1))
            hazard_intensity = (seismic_mag[i] / 7.5).clip(0, 1) * 0.65 + proximity_term * 0.35
            raw_score = (hazard_intensity * 0.50 + vuln * 0.30 + pop_factor * 0.20) * 100
            
        else: # Severe Storm
            wind_intensity = (wind_speed[i] / 130.0).clip(0, 1)
            rain_intensity = (rainfall_mm[i] / 200.0).clip(0, 1)
            hazard_intensity = wind_intensity * 0.55 + rain_intensity * 0.45
            raw_score = (hazard_intensity * 0.60 + vuln * 0.25 + pop_factor * 0.15) * 100

        # Inject standard observational noise
        noise = np.random.normal(0, 4.0)
        risk_scores[i] = np.clip(raw_score + noise, 0.0, 100.0)
        
    # Map composite risk scores to standard categorical Risk Levels
    # < 46.0: Low
    # 46.0 - 58.0: Medium
    # 58.0 - 72.0: High
    # >= 72.0: Critical
    risk_labels = []
    for s in risk_scores:
        if s < 46.0:
            risk_labels.append('Low')
        elif s < 58.0:
            risk_labels.append('Medium')
        elif s < 72.0:
            risk_labels.append('High')
        else:
            risk_labels.append('Critical')
            
    df = pd.DataFrame({
        'hazard_type': hazard_types,
        'rainfall_mm_24h': np.round(rainfall_mm, 2),
        'river_discharge_m3s': np.round(river_discharge, 2),
        'soil_moisture_pct': np.round(soil_moisture, 2),
        'ambient_temp_c': np.round(ambient_temp, 2),
        'wind_speed_kmh': np.round(wind_speed, 2),
        'humidity_pct': np.round(humidity, 2),
        'seismic_magnitude': np.round(seismic_mag, 2),
        'fault_distance_km': np.round(fault_distance, 2),
        'slope_gradient_deg': np.round(slope_gradient, 2),
        'vegetation_ndvi': np.round(vegetation_ndvi, 3),
        'population_density_sqkm': np.round(population_density, 1),
        'infrastructure_vulnerability': np.round(infra_vulnerability, 3),
        'elevation_m': np.round(elevation, 1),
        'distance_to_water_body_km': np.round(distance_to_water, 2),
        'drainage_capacity_index': np.round(drainage_capacity, 3),
        'risk_score': np.round(risk_scores, 2),
        'risk_level': risk_labels
    })
    
    # Introduce ~1.5% realistic missing values in telemetry to test preprocessing imputation
    nan_mask_rainfall = np.random.rand(n_samples) < 0.015
    df.loc[nan_mask_rainfall, 'rainfall_mm_24h'] = np.nan
    
    nan_mask_moisture = np.random.rand(n_samples) < 0.012
    df.loc[nan_mask_moisture, 'soil_moisture_pct'] = np.nan
    
    nan_mask_wind = np.random.rand(n_samples) < 0.010
    df.loc[nan_mask_wind, 'wind_speed_kmh'] = np.nan
    
    nan_mask_temp = np.random.rand(n_samples) < 0.008
    df.loc[nan_mask_temp, 'ambient_temp_c'] = np.nan

    # Introduce 35 duplicate rows to test duplicate removal preprocessing
    dup_rows = df.iloc[:35].copy()
    df = pd.concat([df, dup_rows], ignore_index=True)
    
    # Shuffle dataframe
    df = df.sample(frac=1.0, random_state=random_state).reset_index(drop=True)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    df.to_csv(output_path, index=False)
    print(f"Dataset successfully created at: {output_path}")
    print(f"Total Rows (with duplicates): {len(df)}")
    print(f"Target Distribution:\n{df['risk_level'].value_counts()}")

if __name__ == '__main__':
    script_dir = os.path.dirname(os.path.abspath(__file__))
    target_csv = os.path.join(script_dir, 'disaster_risk_dataset.csv')
    generate_disaster_risk_dataset(target_csv)
