import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
// ... baaki imports

export async function DELETE(
  request: Request,
  // 🚨 FIX 1: params ko Promise type dena padega
  { params }: { params: Promise<{ id: string }> } 
) {
    try {
        // 🚨 FIX 2: params ko await karna mandatory hai
        const resolvedParams = await params; 
        const id = resolvedParams.id;

        if (mongoose.connection.readyState < 1) {
            await mongoose.connect(process.env.MONGODB_URI as string);
        }

        const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({}, { strict: false }));
        
        await User.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "User deleted successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

// 🚨 YAAD RAKHNA: Agar is file mein GET, PATCH ya PUT functions bhi hain, 
// unhe bhi isi tarah 'Promise' aur 'await' ke saath update karna padega.