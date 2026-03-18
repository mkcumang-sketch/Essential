import mongoose from 'mongoose';

const PricingRuleSchema = new mongoose.Schema({
  isAiPricingActive: { type: Boolean, default: true },
  maxMarkupPercent: { type: Number, default: 15 }, // Max price increase (e.g., +15%)
  maxDiscountPercent: { type: Number, default: 10 }, // Max price decrease (e.g., -10%)
  lowStockThreshold: { type: Number, default: 3 }, // Stock below this triggers markup
  trendingThreshold: { type: Number, default: 10 } // Sales above this triggers markup
}, { timestamps: true });

export default mongoose.models.PricingRule || mongoose.model('PricingRule', PricingRuleSchema);