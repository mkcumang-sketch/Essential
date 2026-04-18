import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import { Order } from '@/models/Order';
import user from '@/models/user';
import nodemailer from 'nodemailer';
import { z } from 'zod';

const invoiceSchema = z.object({
  orderId: z.string().min(1, 'Order ID is required'),
  forceRegenerate: z.boolean().optional(),
});

async function generateInvoiceHTML(order: any, user: any) {
  const itemsHTML = order.items?.map((item: any, idx: number) => `
    <tr>
      <td style="padding: 16px 0; border-bottom: 1px solid #e5e5e5;">
        <p style="margin: 0; font-weight: 600; color: #000; font-size: 14px;">${idx + 1}. ${item.name || 'Luxury Timepiece'}</p>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">Qty: ${item.qty || 1}</p>
      </td>
      <td style="padding: 16px 0; border-bottom: 1px solid #e5e5e5; text-align: right; font-weight: 600; color: #000;">
        ₹${Number(item.price || 0).toLocaleString('en-IN')}
      </td>
    </tr>
  `).join('') || '';

  const shipping = order.shippingData || {};
  const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', { 
    day: 'numeric', month: 'long', year: 'numeric' 
  }) : new Date().toLocaleDateString('en-IN');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Invoice - ${order.orderId}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F5F5F5; font-family: 'Segoe UI', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F5F5F5; padding: 40px 0;">
      <tr>
        <td>
          <table width="650" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
            <!-- Header -->
            <tr>
              <td style="background: linear-gradient(135deg, #0A0A0A 0%, #1a1a1a 100%); padding: 40px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td>
                      <h1 style="margin: 0; font-size: 28px; font-weight: 900; color: #D4AF37; letter-spacing: 6px; text-transform: uppercase;">Essential Rush</h1>
                      <p style="margin: 8px 0 0 0; font-size: 11px; color: #888; letter-spacing: 2px; text-transform: uppercase;">Fine Horology & Luxury Timepieces</p>
                    </td>
                    <td style="text-align: right;">
                      <p style="margin: 0; font-size: 24px; font-weight: 700; color: #ffffff; font-family: Georgia, serif; font-style: italic;">INVOICE</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Invoice Details -->
            <tr>
              <td style="padding: 40px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <tr>
                    <td width="50%" valign="top">
                      <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; color: #999; letter-spacing: 2px; text-transform: uppercase;">Bill To</p>
                      <p style="margin: 0; font-size: 16px; font-weight: 600; color: #000;">${user?.name || shipping.name || 'Valued Customer'}</p>
                      <p style="margin: 4px 0 0 0; font-size: 14px; color: #666;">${user?.email || shipping.email || ''}</p>
                      ${user?.phone || shipping.phone ? `<p style="margin: 4px 0 0 0; font-size: 14px; color: #666;">${user.phone || shipping.phone}</p>` : ''}
                    </td>
                    <td width="50%" valign="top" style="text-align: right;">
                      <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; color: #999; letter-spacing: 2px; text-transform: uppercase;">Invoice Details</p>
                      <p style="margin: 0; font-size: 14px; color: #333;"><strong>Invoice #:</strong> ${order.orderId}</p>
                      <p style="margin: 4px 0 0 0; font-size: 14px; color: #333;"><strong>Date:</strong> ${orderDate}</p>
                      <p style="margin: 4px 0 0 0; font-size: 14px; color: #333;"><strong>Status:</strong> <span style="color: #D4AF37; font-weight: 700;">${order.status || 'PAID'}</span></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Line Items -->
            <tr>
              <td style="padding: 0 40px;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  <thead>
                    <tr style="border-bottom: 2px solid #000;">
                      <th style="text-align: left; padding: 16px 0; font-size: 11px; font-weight: 700; color: #999; letter-spacing: 2px; text-transform: uppercase;">Description</th>
                      <th style="text-align: right; padding: 16px 0; font-size: 11px; font-weight: 700; color: #999; letter-spacing: 2px; text-transform: uppercase;">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${itemsHTML}
                  </tbody>
                </table>
              </td>
            </tr>
            
            <!-- Total -->
            <tr>
              <td style="padding: 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%); border-radius: 12px; padding: 24px;">
                  <tr>
                    <td style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Subtotal</td>
                    <td style="text-align: right; font-size: 16px; font-weight: 600; color: #333;">₹${Number(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                  </tr>
                  <tr>
                    <td style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px; padding-top: 12px;">Shipping</td>
                    <td style="text-align: right; font-size: 16px; font-weight: 600; color: #333; padding-top: 12px;">Complimentary</td>
                  </tr>
                  <tr style="border-top: 2px solid #D4AF37;">
                    <td style="padding-top: 16px; font-size: 14px; font-weight: 700; color: #000; text-transform: uppercase; letter-spacing: 2px;">Total Paid</td>
                    <td style="padding-top: 16px; text-align: right; font-size: 28px; font-weight: 700; color: #D4AF37;">₹${Number(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                  </tr>
                </table>
              </td>
            </tr>
            
            <!-- Shipping Address -->
            ${shipping.address ? `
            <tr>
              <td style="padding: 0 40px 40px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background: #fafafa; border-radius: 12px; padding: 24px;">
                  <tr>
                    <td>
                      <p style="margin: 0 0 8px 0; font-size: 11px; font-weight: 700; color: #999; letter-spacing: 2px; text-transform: uppercase;">Shipping Address</p>
                      <p style="margin: 0; font-size: 14px; color: #333;">${shipping.name || ''}</p>
                      <p style="margin: 4px 0 0 0; font-size: 14px; color: #666;">${shipping.address || ''}</p>
                      <p style="margin: 4px 0 0 0; font-size: 14px; color: #666;">${[shipping.city, shipping.state, shipping.pincode].filter(Boolean).join(', ')}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            ` : ''}
            
            <!-- Footer -->
            <tr>
              <td style="background: #0A0A0A; padding: 32px 40px; text-align: center;">
                <p style="margin: 0 0 8px 0; font-size: 12px; color: #D4AF37; font-weight: 600; letter-spacing: 2px;">Thank you for choosing Essential Rush</p>
                <p style="margin: 0; font-size: 11px; color: #666;">This is a computer-generated invoice. No signature required.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
}

async function sendInvoiceEmail(order: any, userEmail: string, userName: string) {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('Email not configured - skipping invoice email');
    return { success: false, error: 'Email not configured' };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const invoiceHTML = await generateInvoiceHTML(order, { name: userName, email: userEmail });

  const mailOptions = {
    from: `"Essential Rush" <${process.env.SMTP_USER}>`,
    to: userEmail,
    subject: `Invoice: ${order.orderId} | Essential Rush`,
    html: invoiceHTML,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error: any) {
    console.error('Invoice email failed:', error);
    return { success: false, error: error.message };
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const validation = invoiceSchema.safeParse(json);
    
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      );
    }
    
    const { orderId, forceRegenerate } = validation.data;

    await connectDB();
    
    const order: any = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    let user: any = null;
    let userEmail = order.shippingData?.email;
    let userName = order.shippingData?.name || 'Valued Customer';

    if (order.userId) {
      user = await user.findById(order.userId);
      if (user) {
        userEmail = user.email || userEmail;
        userName = user.name || userName;
      }
    }

    if (!userEmail) {
      return NextResponse.json(
        { success: false, error: 'No email address found for order' },
        { status: 400 }
      );
    }

    const result = await sendInvoiceEmail(order, userEmail, userName);

    if (result.success || forceRegenerate) {
      await Order.findByIdAndUpdate(order._id, {
        $set: { invoiceSentAt: new Date() }
      });
    }

    return NextResponse.json({
      success: true,
      message: result.success ? 'Invoice sent successfully' : result.error,
      email: userEmail,
    });
  } catch (error: any) {
    console.error('Invoice API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process invoice' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID required' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const order: any = await Order.findOne({ orderId });
    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    const invoiceHTML = await generateInvoiceHTML(order, {
      name: order.shippingData?.name,
      email: order.shippingData?.email,
    });

    return new Response(invoiceHTML, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error: any) {
    console.error('Invoice GET error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}