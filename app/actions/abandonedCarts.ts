"use server";

import connectDB from "@/lib/mongodb";
import { AbandonedCart } from "@/models/AbandonedCart";
import { revalidatePath } from "next/cache";

export async function deleteAbandonedCart(id: string) {
  if (!id) {
    return { success: false, error: "Missing Cart ID" };
  }

  try {
    // 1. Establish strict DB connection
    await connectDB();

    // 2. Perform the deletion and store the result
    const deletedCart = await AbandonedCart.findByIdAndDelete(id);

    // 3. Verify if it was actually deleted
    if (!deletedCart) {
      return { success: false, error: "Cart not found or already deleted by another admin" };
    }

    // 4. THE CACHE NUKE (Removed "page" restrictor to force clear everything)
    revalidatePath("/admin/abandoned-carts");
    revalidatePath("/admin", "layout");

    // 5. Success flag for frontend Optimistic UI
    return { success: true, message: "Purged successfully" };

  } catch (error: any) {
    // Catch any DB crash or ObjectId format errors
    console.error("🔴 Vault Deletion Crash:", error.message);
    return { success: false, error: "Backend Database Error" };
  }
}