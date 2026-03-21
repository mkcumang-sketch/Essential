import mongoose from 'mongoose';

const AgentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  code: { type: String, required: true, unique: true }, // Referral Code
  tier: { type: String, default: 'Imperial Agent' },
  commissionRate: { type: Number, default: 5 },
  clicks: { type: Number, default: 0 },
  sales: { type: Number, default: 0 },
  revenue: { type: Number, default: 0 }
}, { timestamps: true, strict: false });

const Agent = mongoose.models.Agent || mongoose.model('Agent', AgentSchema);
export { Agent };