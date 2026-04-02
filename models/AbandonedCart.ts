import mongoose from "mongoose";

const abandonedSchema = new mongoose.Schema(
  {
    name: { type: String, default: "Vault Client" },
    email: { type: String, default: "", index: true },
    phone: { type: String, default: "", index: true },
    cartTotal: { type: Number, default: 0 },
    items: { type: Array, default: [] },
    status: {
      type: String,
      default: "ABANDONED",
      enum: ["ABANDONED", "OFFER_SENT", "RECOVERED"],
    },
    lastInteraction: { type: Date, default: Date.now },
  },
  { timestamps: true, strict: false }
);

export const AbandonedCart = mongoose.models.AbandonedCart || mongoose.model("AbandonedCart", abandonedSchema);