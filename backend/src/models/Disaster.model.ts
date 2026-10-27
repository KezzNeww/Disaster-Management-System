import { Schema, model, Document } from 'mongoose';

export interface IDisaster extends Document {
  title: string;
  type: 'EARTHQUAKE' | 'FLOOD' | 'WILDFIRE' | 'CYCLONE' | 'TSUNAMI' | 'LANDSLIDE';
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  status: 'ACTIVE' | 'CONTAINED' | 'RESOLVED' | 'MONITORING';
  location: {
    region: string;
    country: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  impact: {
    affectedPopulationEstimate: number;
    areaRadiusKm: number;
    infrastructureRiskScore: number;
  };
  aiRiskConfidenceScore: number;
  detectedAt: Date;
  lastTelemetryUpdate: Date;
}

const disasterSchema = new Schema<IDisaster>(
  {
    title: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ['EARTHQUAKE', 'FLOOD', 'WILDFIRE', 'CYCLONE', 'TSUNAMI', 'LANDSLIDE'],
    },
    severity: {
      type: String,
      required: true,
      enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
      default: 'MODERATE',
    },
    status: {
      type: String,
      required: true,
      enum: ['ACTIVE', 'CONTAINED', 'RESOLVED', 'MONITORING'],
      default: 'ACTIVE',
    },
    location: {
      region: { type: String, required: true },
      country: { type: String, required: true },
      coordinates: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
      },
    },
    impact: {
      affectedPopulationEstimate: { type: Number, default: 0 },
      areaRadiusKm: { type: Number, default: 0 },
      infrastructureRiskScore: { type: Number, default: 0 },
    },
    aiRiskConfidenceScore: { type: Number, default: 0 },
    detectedAt: { type: Date, default: Date.now },
    lastTelemetryUpdate: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Disaster = model<IDisaster>('Disaster', disasterSchema);
