import mongoose from "mongoose";

const abandonedSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Vault Client" },
    email: { type: String, default: "", index: true },
    phone: { type: String, default: "", index: true },
    userId: { type: String, default: "", index: true, sparse: true },
    cartTotal: { type: Number, default: 0 },
    items: { type: Array, default: [] },
    status: {
      type: String,
      default: "ABANDONED",
      enum: ["ABANDONED", "OFFER_SENT", "RECOVERED", "EXPIRED"],
    },
    lastInteraction: { type: Date, default: Date.now },
    recoveryCode: { type: String },
    recoveryEmailSent: { type: Boolean, default: false },
    recoveryEmailSentAt: { type: Date },
    recoverySMSCount: { type: Number, default: 0 },
    lastRecoveryAt: { type: Date },
  },
  { timestamps: true, strict: false }
);

export const AbandonedCart = mongoose.models.AbandonedCart || mongoose.model("AbandonedCart", abandonedSchema);