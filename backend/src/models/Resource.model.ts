import { Schema, model, Document } from 'mongoose';

export interface IResource extends Document {
  callsign: string;
  type: 'DRONE_FLEET' | 'MEDICAL_TEAM' | 'EVACUATION_FLEET' | 'SUPPLY_AIRDROP' | 'SEARCH_AND_RESCUE';
  status: 'IDLE' | 'DEPLOYED' | 'EN_ROUTE' | 'REFUELING' | 'MAINTENANCE';
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  assignedIncidentId?: Schema.Types.ObjectId;
  batteryOrFuelPercent: number;
  personnelCount: number;
}

const resourceSchema = new Schema<IResource>(
  {
    callsign: { type: String, required: true, unique: true },
    type: {
      type: String,
      required: true,
      enum: ['DRONE_FLEET', 'MEDICAL_TEAM', 'EVACUATION_FLEET', 'SUPPLY_AIRDROP', 'SEARCH_AND_RESCUE'],
    },
    status: {
      type: String,
      enum: ['IDLE', 'DEPLOYED', 'EN_ROUTE', 'REFUELING', 'MAINTENANCE'],
      default: 'IDLE',
    },
    currentLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    assignedIncidentId: { type: Schema.Types.ObjectId, ref: 'Incident' },
    batteryOrFuelPercent: { type: Number, default: 100 },
    personnelCount: { type: Number, default: 1 },
  },
  {
    timestamps: true,
  }
);

export const Resource = model<IResource>('Resource', resourceSchema);
