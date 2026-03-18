import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true }, // The tracking code (e.g. SAHIL10)
  tier: { type: String, default: 'Imperial Agent' }, // Junior, Imperial, Elite
  clicks: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 },
  commissionRate: { type: Number, default: 5 } // Default 5% commission
}, { timestamps: true });

export default mongoose.models.Agent || mongoose.model('Agent', AgentSchema);