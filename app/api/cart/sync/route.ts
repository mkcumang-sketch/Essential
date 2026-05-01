export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route'; 
import connectDB from '@/lib/mongodb';
import { UserBehavior } from '@/models/UserBehavior'; // 🚀 Naya model import kiya


// GET: Frontend ko purani cart wapas dene ke liye
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, items: [] }, {
                headers: { 
                    'Cache-Control': 'no-store, max-age=0, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
        }

        await connectDB();
        // 🚀 FETCH FROM USER BEHAVIOR
        const behavior: any = await UserBehavior.findOne({ userId: session.user.id }).lean();

        if (!behavior) {
            return NextResponse.json({ success: true, items: [] }, {
                headers: { 
                    'Cache-Control': 'no-store, max-age=0, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                }
            });
        }

        // Return cartAbandons array
        return NextResponse.json({ success: true, items: behavior.cartAbandons || [] }, {
            headers: { 
                'Cache-Control': 'no-store, max-age=0, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            } 
        });
    } catch (error) {
        console.error("GET Cart Error:", error);
        return NextResponse.json({ success: false, items: [] }, { status: 500 });
    }
}

// POST: Frontend se naya data DB mein save karne ke liye
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ success: false, message: "Login required" }, { status: 401 });
        }

        await connectDB();
        const { items } = await req.json();
        const userId = session.user.id;

        // 🚀 SMART FIX: Agar behavior pehli baar ban raha hai toh sessionId dena zaroori hai
        const fallbackSessionId = `user_${userId}`; 

        await UserBehavior.findOneAndUpdate(
            { userId: userId },
            { 
                $set: { cartAbandons: items || [] }, // Cart items update karo
                $setOnInsert: { sessionId: fallbackSessionId } // Agar document nahi hai, toh ye session ID daal do
            },
            { new: true, upsert: true } 
        );

        return NextResponse.json({ success: true, message: "Cart synced to UserBehavior!" });

    } catch (error: any) {
        console.error("POST Cart Error:", error.message);
        return NextResponse.json({ success: false, message: "Server Database Error" }, { status: 500 });
    }
}