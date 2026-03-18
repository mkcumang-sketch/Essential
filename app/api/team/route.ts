import { connectDB } from "@/lib/db";
import { Team } from "@/models/Enterprise";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const team = await Team.find({});
    return NextResponse.json(team, { status: 200 });
  } catch (error) {
    return NextResponse.json([], { status: 200 });
  }
}