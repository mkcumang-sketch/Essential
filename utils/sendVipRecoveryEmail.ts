import { Resend } from "resend";

function escapeHtml(input: unknown) {
  return String(input ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendVipRecoveryEmail(params: {
  to: string;
  customerName?: string;
  link: string;
}) {
  const { to, customerName, link } = params;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) throw new Error("RESEND_API_KEY is missing");

  const from = process.env.RESEND_FROM_EMAIL || "Essential Store <onboarding@resend.dev>";
  const safeName = escapeHtml(customerName || "Friend");
  const safeLink = escapeHtml(link);

  const subject = `Essential Rush | Finish your order`;

  const resend = new Resend(resendApiKey);

  return resend.emails.send({
    from,
    to: [to],
    subject,
    html: `
      <div style="font-family: Georgia, serif; background:#050505; padding:48px 16px; color:#ffffff;">
        <div style="max-width:680px; margin:0 auto; background:rgba(0,0,0,0.65); border:1px solid rgba(212,175,55,0.35); border-radius:18px; overflow:hidden;">
          <div style="padding:28px 26px; background:linear-gradient(135deg, rgba(212,175,55,0.22), rgba(0,0,0,0)); border-bottom:1px solid rgba(255,255,255,0.08);">
            <div style="font-weight:900; letter-spacing:6px; text-transform:uppercase; font-size:22px; color:#D4AF37;">
              Essential Rush
            </div>
            <div style="margin-top:10px; color:rgba(255,255,255,0.78); font-size:12px; letter-spacing:3px; text-transform:uppercase;">
              Your saved cart
            </div>
          </div>

          <div style="padding:30px 26px;">
            <div style="font-size:18px; font-weight:700; color:#ffffff; margin-bottom:10px;">
              Dear ${safeName},
            </div>

            <div style="font-size:14px; line-height:1.7; color:rgba(255,255,255,0.82); margin-bottom:22px;">
              You left items in your cart. Tap the link to go back and finish checkout:
              <a href="${safeLink}" style="color:#D4AF37; font-weight:800; text-decoration:none;">${safeLink}</a>
            </div>

            <div style="margin:26px 0 10px 0;">
              <a href="${safeLink}" style="display:inline-block; background:#D4AF37; color:#000; text-decoration:none; padding:14px 18px; border-radius:999px; font-weight:900; text-transform:uppercase; letter-spacing:2px; font-size:12px;">
                Complete your order
              </a>
            </div>

            <div style="margin-top:18px; font-size:12px; color:rgba(255,255,255,0.65); line-height:1.6; font-style:italic;">
              Questions? Reply to this email or message us on WhatsApp—we are happy to help.
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

