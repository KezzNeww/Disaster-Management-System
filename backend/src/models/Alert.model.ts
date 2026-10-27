import { Schema, model, Document } from 'mongoose';

export interface IAlert extends Document {
  disasterId?: Schema.Types.ObjectId;
  title: string;
  message: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  channels: Array<'SMS' | 'CAP_BROADCAST' | 'SIREN' | 'IN_APP'>;
  broadcastStatus: 'QUEUED' | 'TRANSMITTING' | 'SENT' | 'FAILED';
  dispatchedAt: Date;
}

const alertSchema = new Schema<IAlert>(
  {
    disasterId: { type: Schema.Types.ObjectId, ref: 'Disaster' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    severity: {
      type: String,
      enum: ['INFO', 'WARNING', 'CRITICAL'],
      default: 'WARNING',
    },
    channels: [{ type: String, enum: ['SMS', 'CAP_BROADCAST', 'SIREN', 'IN_APP'] }],
    broadcastStatus: {
      type: String,
      enum: ['QUEUED', 'TRANSMITTING', 'SENT', 'FAILED'],
      default: 'QUEUED',
    },
    dispatchedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

export const Alert = model<IAlert>('Alert', alertSchema);
