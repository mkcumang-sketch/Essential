import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, 
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  items: { type: Array, required: true }, 
  subTotal: { type: Number, default: 0 },
  taxAmount: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  discountApplied: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['PENDING', 'PROCESSING', 'DISPATCHED', 'TRANSIT', 'DELIVERED', 'CANCELLED'],
    default: 'PROCESSING' 
  },
  paymentStatus: { type: String, default: 'PENDING' },
  paymentMethod: { type: String, default: 'WIRE_TRANSFER' },
  
  // Godmode Tracking Info
  location: { type: String, default: 'Vault Headquarters, CH' }, 
  eta: { type: String, default: 'Pending Assessment' },
  affiliateCode: { type: String, default: null } 
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);