"use server";
import connectDB from "@/lib/mongodb";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

// Simple Schema for CMS
const AboutSchema = new mongoose.Schema({
  title: String,
  description: String,
  history: String,
  imageUrl: String,
});
const AboutModel = mongoose.models.About || mongoose.model("About", AboutSchema);

export async function updateAboutPage(data: any) {
  await connectDB();
  await AboutModel.findOneAndUpdate({}, data, { upsert: true });
  revalidatePath("/about");
  return { success: true };
}

export async function getAboutData() {
  await connectDB();
  const data = await AboutModel.findOne().lean();
  return JSON.parse(JSON.stringify(data));
}