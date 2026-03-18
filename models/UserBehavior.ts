import mongoose from 'mongoose';

const UserBehaviorSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true }, // works for guests & logged-in users
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  
  // Scoring Maps: { "productId": score }
  productScores: { type: Map, of: Number, default: {} },
  
  // Category affinity: { "Investment Grade": score }
  categoryScores: { type: Map, of: Number, default: {} },
  
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  cartAbandons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

export default mongoose.models.UserBehavior || mongoose.model('UserBehavior', UserBehaviorSchema);