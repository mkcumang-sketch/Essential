import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  orderId: string;
  customer: any;
  items: any[];
  totalAmount: number;
  status: string;
  promoCode?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  paidAt?: Date;
  // 🚀 ADDED: Affiliate Agent Tracking
  agentRef?: string;
  agentCommission?: number;
}

const OrderSchema = new Schema<IOrder>({
  orderId: { type: String, required: true, unique: true },
  customer: { type: Object, required: true },
  items: { type: Schema.Types.Mixed, required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, default: 'PENDING' },
  promoCode: { type: String, default: null },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  paidAt: { type: Date },
  
  // 🚀 ADDED: Agent data for Admin Dashboard calculations
  agentRef: { type: String, default: null },
  agentCommission: { type: Number, default: 0 }
}, { timestamps: true, strict: false });

const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
export { Order };