"use server";

import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function deleteAbandonedCart(id: string) {
  try {
    // 1. Database se judo
    await connectDB();

    // 2. Model Load karo (Agar tera model ka naam kuch aur hai jaise 'Lead', toh yahan change kar lena)
    const AbandonedCart = mongoose.models.AbandonedCart || mongoose.model('AbandonedCart', new mongoose.Schema({}, { strict: false }));

    // 3. Database se hamesha ke liye uda do (Permanent Purge)
    const deletedCart = await AbandonedCart.findByIdAndDelete(id);

    if (!deletedCart) {
      return { success: false, message: "Cart pehle hi delete ho chuka hai ya mila nahi." };
    }

    // 4. Cache Buster - Next.js ko batao ki naya data fetch kare
    revalidatePath("/admin/abandoned-carts");

    return { 
        success: true, 
        message: "Target destroyed successfully." 
    };

  } catch (error) {
    console.error("Vault Purge Error:", error);
    return { 
        success: false, 
        message: "Server Error: Database se udane mein problem aayi." 
    };
  }
}