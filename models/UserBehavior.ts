import mongoose from 'mongoose';

const UserBehaviorSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true }, // works for guests & logged-in users
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  
  // Scoring Maps: { "productId": score }
  productScores: { type: Map, of: Number, default: {} },
  
  // Category affinity: { "Investment Grade": score }
  categoryScores: { type: Map, of: Number, default: {} },
  
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  
  // 🚀 FIX: Isko 'Array' kiya taaki Quantity aur Price bhi save ho sake
  cartAbandons: { type: Array, default: [] },
  
  // 🚀 ADDED: Agent Tracking (Kis agent ka link click karke cart banaya)
  agentRef: { type: String, default: null } 
}, { timestamps: true });

const UserBehavior = mongoose.models.UserBehavior || mongoose.model('UserBehavior', UserBehaviorSchema);
export { UserBehavior };