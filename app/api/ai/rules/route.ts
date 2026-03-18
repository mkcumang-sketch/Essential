import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PricingRule from '@/models/PricingRule';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    let rules = await PricingRule.findOne({});
    if (!rules) rules = await PricingRule.create({});
    return NextResponse.json({ success: true, data: rules });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    let rules = await PricingRule.findOne({});
    
    if (rules) {
      rules = await PricingRule.findByIdAndUpdate(rules._id, { $set: body }, { new: true });
    } else {
      rules = await PricingRule.create(body);
    }
    
    return NextResponse.json({ success: true, data: rules });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}