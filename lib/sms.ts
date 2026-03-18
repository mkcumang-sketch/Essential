// lib/sms.ts - Enterprise Messaging Wrapper
export async function sendRecoverySMS(phone: string, name: string, offerLink: string, discount: string) {
  const message = `Adab ${name}, ♞\n\nAppka pasandida asset vault mein intezar kar raha hai. Sirf aapke liye, humne ${discount} ka special allocation discount unlock kiya hai.\n\nIsey yahan se secure karein: ${offerLink}\n\n- Essential Rush Imperial`;

  // 🚨 Real World Integration (Example: Twilio / Msg91)
  try {
    const res = await fetch('https://api.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: {
        'authkey': process.env.MSG91_AUTH_KEY!,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        template_id: "RECOVERY_TEMPLATE_ID",
        short_url: "1",
        recipients: [{ mobiles: phone, name, discount, link: offerLink }]
      })
    });
    return res.ok;
  } catch (error) {
    console.error("SMS Gateway Timeout:", error);
    return false;
  }
}