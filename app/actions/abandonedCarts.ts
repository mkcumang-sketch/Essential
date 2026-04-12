"use server";

import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function deleteAbandonedCart(id: string) {
  try {
    await connectDB();

    // Model load karo (Agar collection ka naam kuch aur hai toh yahan badal dena)
    const AbandonedCart = mongoose.models.AbandonedCart || mongoose.model('AbandonedCart', new mongoose.Schema({}, { strict: false }));

    // 🚀 FIX: Ensure ID is strictly converted to MongoDB ObjectId
    const objectId = new mongoose.Types.ObjectId(id);

    const deletedCart = await AbandonedCart.findByIdAndDelete(objectId);

    if (!deletedCart) {
      return { success: false, message: "Cart already deleted or not found in database." };
    }

    // Cache clear karo taaki UI turant update ho
    revalidatePath("/admin/abandoned-carts");
    revalidatePath("/godmode"); // Godmode ka cache bhi clear karo

    return { 
        success: true, 
        message: "Target destroyed successfully." 
    };

  } catch (error) {
    console.error("Vault Purge Error:", error);
    return { 
        success: false, 
        message: "Server Error: Database deletion failed." 
    };
  }
}