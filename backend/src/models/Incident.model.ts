import { Schema, model, Document } from 'mongoose';

export interface IIncident extends Document {
  disasterId: Schema.Types.ObjectId;
  headline: string;
  priority: 'P1_CRITICAL' | 'P2_HIGH' | 'P3_ELEVATED' | 'P4_ROUTINE';
  severity: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  reportingAgency: string;
  verified: boolean;
  actionTaken?: string;
}

const incidentSchema = new Schema<IIncident>(
  {
    disasterId: { type: Schema.Types.ObjectId, ref: 'Disaster' },
    headline: { type: String, required: true },
    priority: {
      type: String,
      enum: ['P1_CRITICAL', 'P2_HIGH', 'P3_ELEVATED', 'P4_ROUTINE'],
      default: 'P2_HIGH',
    },
    severity: {
      type: String,
      enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'],
      default: 'HIGH',
    },
    reportingAgency: { type: String, required: true },
    verified: { type: Boolean, default: false },
    actionTaken: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Incident = model<IIncident>('Incident', incidentSchema);
