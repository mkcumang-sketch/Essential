import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { _id: "1", name: "Arthur P.", city: "Monaco", text: "The allocation process was incredibly smooth." }
  ]);
}