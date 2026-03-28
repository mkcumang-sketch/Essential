import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
// UPDATE THIS IMPORT PATH TO MATCH YOUR PROJECT STRUCTURE
// import Order from "@/models/Order"; 
// import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req: Request) {
    try {
        // Mocking the check for code simplicity, replace with real auth check
        // const session = await getServerSession(authOptions);
        const session: any = { user: { role: 'SUPER_ADMIN', email: 'admin@essentialrush.com' } }; // REMOVE THIS LINE IN PROD

        if (!session) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        // 🚨 CRITICAL FIX: ROLE BASED ACCESS CONTROL
        let orders: any[]= [];
        if (session.user.role === 'SUPER_ADMIN') {
            // If admin, fetch all orders from database
            // orders = await Order.find({}).sort({ createdAt: -1 }); 
            orders = []; // Replace with actual DB query
        } else {
            // If customer, fetch ONLY their orders using their email
            // orders = await Order.find({ 'customer.email': session.user.email }).sort({ createdAt: -1 });
            orders = []; // Replace with actual DB query
        }

        return NextResponse.json({ success: true, data: orders });
    } catch (error) {
        console.error("Order Fetch Error:", error);
        return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        // const session = await getServerSession(authOptions);
        const session: any = { user: { role: 'SUPER_ADMIN' } }; // REMOVE THIS IN PROD
        
        if (!session || session.user.role !== 'SUPER_ADMIN') {
            return NextResponse.json({ error: "Unauthorized. Admin only." }, { status: 403 });
        }

        const body = await req.json();
        const { id } = body;

        if (!id) return NextResponse.json({ error: "Order ID required" }, { status: 400 });

        // Execute Delete in Database
        // await Order.findByIdAndDelete(id);

        return NextResponse.json({ success: true, message: "Order Deleted Permanently" });
    } catch (error) {
        console.error("Order Delete Error:", error);
        return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 });
    }
}