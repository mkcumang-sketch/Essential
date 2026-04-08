import { connectDB } from "@/lib/db";
import { Lead, ActivityLog } from "@/models/Enterprise";
import { NextResponse } from "next/server";
import { revalidatePath } from 'next/cache';

/**
 * CRM IDENTITY CONTROLLER v4.0
 * Manages Client Identity Verification & Acquisition Intent Tracking
 */

// 1. GET: Fetch Registry Leads (Admin Node Only)
export async function GET() {
  try {
    await connectDB();

    // Fetching all leads sorted by most recent interaction
    const leads = await Lead.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(leads);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. POST: Secure Lead Capture (Frontend Entry)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Verification: Legal Name and Secure Line are mandatory
    if (!body.name || !body.phone) {
      return NextResponse.json({ 
        success: false, 
        error: "Please enter your name and phone number." 
      }, { status: 400 });
    }

    const newLead = await Lead.create({
      name: body.name,
      phone: body.phone,
      product: body.product || "General Vault Access",
      status: 'New'
    });

    // Logging the acquisition intent for enterprise audit
    await ActivityLog.create({
      action: "CLIENT_REGISTRY_ENTRY",
      details: `Identity verified for ${body.name}. Intent: ${body.product || 'General'}`,
      target: "CRM_NODE"
    });

    return NextResponse.json({ 
      success: true, 
      message: "Thanks! We got your details.", 
      data: newLead 
    }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. PATCH: Status Synchronization (Admin Dashboard)
export async function PATCH(req: Request) {
  try {
    await connectDB();
    const { id, status } = await req.json();

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Lead ID and status are required." }, { status: 400 });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: { status: status } },
      { new: true }
    );

    await ActivityLog.create({
      action: "CLIENT_STATUS_UPDATE",
      details: `Lead status for ${updatedLead.name} changed to ${status}.`,
      target: "CRM_NODE"
    });

    return NextResponse.json({ success: true, data: updatedLead });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 4. DELETE: Secure Registry Purge
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Lead ID missing." }, { status: 400 });
    }

    const deleted = await Lead.findByIdAndDelete(id);

    revalidatePath('/', 'layout');

    if (deleted) {
      await ActivityLog.create({
        action: "CLIENT_REGISTRY_PURGE",
        details: `Registry entry for ${deleted.name} purged by admin.`,
        target: "CRM_NODE"
      });
    }

    return NextResponse.json({ success: true, message: "Lead removed." });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}