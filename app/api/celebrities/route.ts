import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json([
    { _id: "1", name: "Roger Federer", watch: "Rolex Daytona", img: "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?q=80&w=800" }
  ]);
}