import { Resend } from "resend";

function escapeHtml(input: unknown) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendOrderConfirmationEmail(params: {
  to: string;
  customerName?: string;
  orderId?: string;
  amount?: number;
  subject?: string;
}) {
  const {
    to,
    customerName,
    orderId,
    amount,
    subject,
  } = params;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY is missing");
  }

  const from = process.env.RESEND_FROM_EMAIL || "Essential Store <onboarding@resend.dev>";
  const safeName = escapeHtml(customerName || "Friend");
  const safeSubject = escapeHtml(subject || "Your order is confirmed — Essential Rush");
  const safeOrderId = escapeHtml(orderId || "");
  const safeAmount = escapeHtml(typeof amount === "number" ? amount : 0);

  const resend = new Resend(resendApiKey);

  return resend.emails.send({
    from,
    to: [to],
    subject: safeSubject,
    html: `
      <div style="font-family: Georgia, serif; background:#050505; padding:48px 16px; color:#ffffff;">
        <div style="max-width:680px; margin:0 auto; background:rgba(0,0,0,0.65); border:1px solid rgba(212,175,55,0.35); border-radius:18px; overflow:hidden;">
          <div style="padding:28px 26px; background:linear-gradient(135deg, rgba(212,175,55,0.22), rgba(0,0,0,0)); border-bottom:1px solid rgba(255,255,255,0.08);">
            <div style="font-weight:800; letter-spacing:6px; text-transform:uppercase; font-size:22px; color:#D4AF37;">
              Essential Rush
            </div>
            <div style="margin-top:10px; color:rgba(255,255,255,0.78); font-size:12px; letter-spacing:3px; text-transform:uppercase;">
              Order confirmed
            </div>
          </div>

          <div style="padding:30px 26px;">
            <div style="font-size:18px; font-weight:700; color:#ffffff; margin-bottom:10px;">
              Dear ${safeName},
            </div>
            <div style="font-size:14px; line-height:1.7; color:rgba(255,255,255,0.82); margin-bottom:22px;">
              We got your order. Our team is packing your watch and will ship it soon.
            </div>

            <div style="background:rgba(255,255,255,0.03); border:1px solid rgba(212,175,55,0.25); border-radius:14px; padding:18px 16px; margin:22px 0;">
              <div style="font-size:11px; letter-spacing:3px; text-transform:uppercase; color:rgba(255,255,255,0.65); font-weight:800; margin-bottom:10px;">
                Order Summary
              </div>
              <div style="font-size:14px; color:#ffffff; margin:6px 0;">
                <span style="color:rgba(255,255,255,0.65); font-weight:700;">Order ID:</span>
                <span style="color:#D4AF37; font-weight:800;">${safeOrderId ? safeOrderId.slice(-12) : "—"}</span>
              </div>
              <div style="font-size:14px; color:#ffffff; margin:6px 0;">
                <span style="color:rgba(255,255,255,0.65); font-weight:700;">Total Amount:</span>
                <span style="color:#ffffff; font-weight:800;">₹${safeAmount}</span>
              </div>
            </div>

            <div style="font-size:13px; line-height:1.7; color:rgba(255,255,255,0.8); margin-top:10px;">
              We will email you again when your watch ships.
            </div>

            <div style="margin-top:26px; padding-top:18px; border-top:1px solid rgba(255,255,255,0.08);">
              <div style="display:inline-block; padding:12px 16px; border-radius:999px; background:#D4AF37; color:#000; font-weight:900; letter-spacing:2px; text-transform:uppercase; font-size:12px;">
                Getting ready to ship
              </div>
            </div>
          </div>

          <div style="padding:18px 26px; background:#000000; border-top:1px solid rgba(255,255,255,0.06);">
            <div style="text-align:center; color:rgba(255,255,255,0.45); font-size:10px; letter-spacing:4px; text-transform:uppercase;">
              © ${new Date().getFullYear()} Essential Rush. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    `,
  });
}

