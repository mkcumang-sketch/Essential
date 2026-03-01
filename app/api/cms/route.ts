import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const content = await prisma.siteContent.findUnique({ where: { section: "hero" } });
    return NextResponse.json({ success: true, data: content?.data || {} });
  } catch (e) { return NextResponse.json({ success: false }, { status: 500 }); }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await prisma.siteContent.upsert({
      where: { section: "hero" },
      update: { data: body },
      create: { section: "hero", data: body }
    });
    return NextResponse.json({ success: true });
  } catch (e) { return NextResponse.json({ success: false }, { status: 500 }); }
}