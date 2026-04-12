"use server";

import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function deleteAbandonedCart(id: string) {
  try {
    await connectDB();

    const AbandonedCart = mongoose.models.AbandonedCart || mongoose.model('AbandonedCart', new mongoose.Schema({}, { strict: false }));

    const deletedCart = await AbandonedCart.findByIdAndDelete(id);

    if (!deletedCart) {
      return { success: false, message: "Cart already deleted or not found." };
    }

    revalidatePath("/admin/abandoned-carts");

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