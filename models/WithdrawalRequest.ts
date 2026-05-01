import mongoose, { Document, Schema } from 'mongoose';

export interface IWithdrawalRequest extends Document {
  userId: mongoose.Types.ObjectId;
  amount: number;
  paymentMethod: {
    type: string; // 'UPI' or 'BANK'
    details: string; // UPI ID or Bank Account Details
  };
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const WithdrawalRequestSchema = new Schema<IWithdrawalRequest>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paymentMethod: {
    type: { type: String, enum: ['UPI', 'BANK'], required: true },
    details: { type: String, required: true }
  },
  status: { type: String, enum: ['PENDING', 'APPROVED', 'REJECTED'], default: 'PENDING' },
  adminNotes: { type: String }
}, { timestamps: true });

const WithdrawalRequest = mongoose.models.WithdrawalRequest || mongoose.model<IWithdrawalRequest>('WithdrawalRequest', WithdrawalRequestSchema);
export default WithdrawalRequest;