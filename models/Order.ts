import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  customer: { type: Object, required: true },
  items: { type: Array, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'PENDING' },
  promoCode: { type: String, default: null }
}, { timestamps: true, strict: false });

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export { Order };