import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  products: [{ productId: String, quantity: Number, title: String }],
  totalAmount: Number,
  paymentStatus: { type: String, default: 'Pending' },
  // Naye Features
  orderStatus: { 
    type: String, 
    enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'], 
    default: 'Pending' 
  },
  warehouse: { type: String, default: 'Lucknow Main' }, 
  trackingId: String,
  referralCode: String // Referral tracking memory
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);