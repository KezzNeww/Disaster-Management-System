import { Schema, model, Document } from 'mongoose';

export interface IPrediction extends Document {
  disasterId: Schema.Types.ObjectId;
  modelIdentifier: string;
  confidenceScore: number;
  vectors: Array<{
    timestamp: Date;
    predictedSeverityScore: number;
    spreadVelocityKmH: number;
  }>;
  recommendedSafeZones: Array<{
    name: string;
    capacity: number;
    coordinates: { latitude: number; longitude: number };
  }>;
}

const predictionSchema = new Schema<IPrediction>(
  {
    disasterId: { type: Schema.Types.ObjectId, ref: 'Disaster', required: true },
    modelIdentifier: { type: String, required: true },
    confidenceScore: { type: Number, required: true },
    vectors: [
      {
        timestamp: { type: Date, required: true },
        predictedSeverityScore: { type: Number, required: true },
        spreadVelocityKmH: { type: Number, required: true },
      },
    ],
    recommendedSafeZones: [
      {
        name: { type: String, required: true },
        capacity: { type: Number, required: true },
        coordinates: {
          latitude: { type: Number, required: true },
          longitude: { type: Number, required: true },
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Prediction = model<IPrediction>('Prediction', predictionSchema);
