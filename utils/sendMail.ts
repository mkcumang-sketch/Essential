import nodemailer from 'nodemailer';

export const sendMail = async (
    toEmail: string, 
    subject: string, 
    messageData: any, 
    recipientType: 'ADMIN' | 'CUSTOMER'
) => {
    try {
        // 🚨 SENDER LOGIN (Using your 16-digit App Password)
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL, // Jisse mail jayegi (e.g., us7081569@gmail.com)
                pass: process.env.SMTP_PASSWORD, // 16-digit App Password
            },
        });

        const title = recipientType === 'ADMIN' ? 'NEW ACQUISITION ALERT' : 'ORDER CONFIRMATION';
        const greeting = recipientType === 'ADMIN' 
            ? 'A new acquisition has been secured. Please process the shipment.' 
            : `Dear ${messageData.name}, thank you for your acquisition.`;

        // 💎 PREMIUM DARK HTML EMAIL TEMPLATE
        const htmlTemplate = `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: auto; background-color: #050505; color: #ffffff; border: 1px solid #D4AF37; border-radius: 15px; overflow: hidden;">
            <div style="background-color: #000000; padding: 30px; text-align: center; border-bottom: 1px solid #333;">
                <h1 style="margin: 0; color: #D4AF37; font-size: 28px; letter-spacing: 5px; text-transform: uppercase;">Essential</h1>
                <p style="margin: 5px 0 0 0; color: #888; font-family: monospace; font-size: 12px; letter-spacing: 2px;">${title}</p>
            </div>
            
            <div style="padding: 40px 30px;">
                <h2 style="margin-top: 0; font-size: 20px; border-bottom: 1px solid #222; padding-bottom: 10px;">${subject}</h2>
                
                <p style="color: #ccc; font-size: 14px; line-height: 1.6;">${greeting}</p>
                
                <div style="background-color: #111; padding: 20px; border-radius: 10px; border-left: 3px solid #D4AF37; margin: 20px 0;">
                    <p style="margin: 0 0 10px 0;"><strong>Customer Name:</strong> <span style="color: #00F0FF;">${messageData.name}</span></p>
                    <p style="margin: 0 0 10px 0;"><strong>Total Value:</strong> <span style="color: #4ade80;">₹${messageData.amount}</span></p>
                    <p style="margin: 0 0 10px 0;"><strong>Phone:</strong> ${messageData.phone}</p>
                    <p style="margin: 0;"><strong>Location:</strong> ${messageData.city}</p>
                </div>
                
                ${recipientType === 'ADMIN' ? 
                `<a href="${process.env.NEXTAUTH_URL}/godmode" style="display: inline-block; background-color: #D4AF37; color: #000; padding: 12px 25px; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 2px; border-radius: 5px; margin-top: 10px;">Open Godmode Dashboard</a>` 
                : 
                `<p style="color: #888; font-size: 12px; margin-top: 20px; font-style: italic;">Your asset is being prepared for secure transit. We will notify you once it is dispatched.</p>`}
            </div>
            
            <div style="background-color: #000; padding: 20px; text-align: center; border-top: 1px solid #222;">
                <p style="margin: 0; color: #666; font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Strictly Confidential | Essential Fine Horology</p>
            </div>
        </div>
        `;

        const mailOptions = {
            from: `"Essential Vault" <${process.env.SMTP_EMAIL}>`, // Sender id
            to: toEmail, // Jisko mail jayegi (Can be comma separated for multiple admins)
            subject: `[Essential] ${subject}`,
            html: htmlTemplate,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error("Email Failed:", error);
        return false;
    }
};