import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  phone: { type: String, required: true, unique: true },
  cartItems: { type: Array, default: [] },
  cartTotal: { type: Number, default: 0 },
  status: { type: String, default: 'ABANDONED', enum: ['PENDING', 'ABANDONED', 'OFFER_SENT', 'RECOVERED'] },
  discountCode: { type: String, default: '' },
  lastActive: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);