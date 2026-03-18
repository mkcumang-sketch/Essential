import { connectDB } from "@/lib/db";
import { Role, HomepageSection } from "@/models/Enterprise";
import { NextResponse } from "next/server";

export async function POST() {
  await connectDB();
  
  // 1. Initialize Root Roles
  const roles = [
    { name: "SuperAdmin", permissions: ["*"] },
    { name: "Manager", permissions: ["product.view", "order.edit"] }
  ];
  await Role.bulkWrite(roles.map(r => ({
    updateOne: { filter: { name: r.name }, update: r, upsert: true }
  })));

  // 2. Initialize Empty Homepage Framework
  const sections = [
    { title: "Main Hero", type: "Hero", order: 1 },
    { title: "Trending Now", type: "ProductGrid", order: 2 }
  ];
  await HomepageSection.bulkWrite(sections.map(s => ({
    updateOne: { filter: { type: s.type }, update: s, upsert: true }
  })));

  return NextResponse.json({ message: "Enterprise Mainframe Initialized" });
}