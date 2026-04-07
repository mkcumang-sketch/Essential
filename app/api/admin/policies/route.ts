import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Policy } from '@/models/Policy';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
    try {
        await connectDB();
        const policies = await Policy.find({}).sort({ title: 1 });
        return NextResponse.json({ success: true, data: policies });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        await connectDB();
        const body = await req.json();
        const { title, slug, content } = body;

        if (!title || !slug || !content) {
            return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
        }

        const policy = await Policy.findOneAndUpdate(
            { slug },
            { title, content, lastUpdated: new Date() },
            { upsert: true, new: true }
        );

        return NextResponse.json({ success: true, data: policy });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });

        await connectDB();
        await Policy.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Policy deleted" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
