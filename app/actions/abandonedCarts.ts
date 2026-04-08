"use server";

import connectDB from "@/lib/mongodb";
import { AbandonedCart } from "@/models/AbandonedCart";
import { revalidatePath } from "next/cache";

export async function deleteAbandonedCart(id: string) {
  if (!id) return { success: false, error: "Missing id" };
  await connectDB();
  await AbandonedCart.findByIdAndDelete(id);
  revalidatePath("/admin/abandoned-carts", "page");
  revalidatePath("/admin", "layout");
  return { success: true };
}

