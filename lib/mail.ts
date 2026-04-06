import { Resend } from 'resend';

// 📧 ENTERPRISE EMAIL SERVICE
const resend = new Resend(process.env.RESEND_API_KEY);

// 🎉 WELCOME EMAIL FUNCTION
export const sendWelcomeEmail = async (userEmail: string, userName: string, referralCode?: string) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'noreply@essentialrush.com',
            to: userEmail,
            subject: 'Welcome to Essential Rush!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAFA;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #D4AF37; font-size: 32px; margin-bottom: 10px;">🎊 Welcome to Essential Rush</h1>
                        <h2 style="color: #333; font-size: 24px; font-weight: bold;">Your account is ready</h2>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                            Dear <strong>${userName}</strong>,
                        </p>
                        
                        <p style="color: #333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                            Thanks for signing up. You can now shop, save a wishlist, and track orders in one place.
                        </p>
                        
                        ${referralCode ? `
                        <div style="background: #F8F9FA; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
                            <p style="color: #333; font-size: 14px; margin: 0;">
                                <strong>🎁 Your Referral Code:</strong> ${referralCode}
                            </p>
                            <p style="color: #666; font-size: 12px; margin-top: 10px;">
                                Share it with friends. You both can earn rewards when they join.
                            </p>
                        </div>
                        ` : ''}
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="https://essentialrush.com/shop" 
                               style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                                🛍 Start shopping
                            </a>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px;">
                            This email was sent by Essential Rush. Please do not reply to this address.
                        </p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Welcome email failed:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Welcome email error:', error);
        return { success: false, error: 'We could not send the welcome email.' };
    }
};

// 🏆 REFERRAL REWARD EMAIL FUNCTION
export const sendReferralRewardEmail = async (referrerEmail: string, referrerName: string, refereeName: string, rewardAmount: number = 100) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'noreply@essentialrush.com',
            to: referrerEmail,
            subject: `You earned ${rewardAmount} referral points!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAFA;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #D4AF37; font-size: 32px; margin-bottom: 10px;">🎉 Referral reward</h1>
                        <h2 style="color: #333; font-size: 24px; font-weight: bold;">You earned ${rewardAmount} points!</h2>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        <p style="color: #333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                            Hi <strong>${referrerName}</strong>,
                        </p>
                        
                        <p style="color: #333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                            Your friend <strong>${refereeName}</strong> signed up with your referral code.
                        </p>
                        
                        <div style="background: #E8F5E8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
                            <p style="color: #333; font-size: 14px; margin: 0;">
                                <strong>🏆 Your reward:</strong> ${rewardAmount} points
                            </p>
                            <p style="color: #666; font-size: 12px; margin-top: 10px;">
                                We added them to your wallet. Use them as a discount on your next order.
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="https://essentialrush.com/account" 
                               style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                                🏆 Open your account
                            </a>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px;">
                            This email was sent by Essential Rush. Please do not reply to this address.
                        </p>
                    </div>
                </div>
            `
        });

        if (error) {
            console.error('Referral reward email failed:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Referral reward email error:', error);
        return { success: false, error: 'We could not send the referral email.' };
    }
};

// 🛍️ ORDER CONFIRMATION EMAIL FUNCTION
export const sendOrderConfirmationEmail = async (email: string, orderData: any) => {
    const { orderId, customerName, totalAmount, items } = orderData;
    
    const itemsHtml = items.map((item: any) => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px 0;">
                <p style="margin: 0; font-weight: bold; color: #000;">${item.name}</p>
                <p style="margin: 0; font-size: 12px; color: #666;">Qty: ${item.qty}</p>
            </td>
            <td style="padding: 12px 0; text-align: right; font-weight: bold;">₹${Number(item.price).toLocaleString('en-IN')}</td>
        </tr>
    `).join('');

    const html = `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e0e0e0; color: #333;">
            <h1 style="text-align: center; text-transform: uppercase; letter-spacing: 5px; margin-bottom: 40px; font-weight: 900;">Essential</h1>
            <div style="text-align: center; margin-bottom: 40px;">
                <h2 style="font-style: italic; margin-bottom: 10px;">Order Confirmed</h2>
                <p style="color: #888; font-size: 14px; text-transform: uppercase; letter-spacing: 2px;">Receipt: ${orderId}</p>
            </div>
            <p>Dear ${customerName},</p>
            <p>Your acquisition has been securely logged. Our master horologists are now preparing your timepiece for insured transit.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                <thead>
                    <tr style="border-bottom: 2px solid #000;">
                        <th style="text-align: left; padding-bottom: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Asset</th>
                        <th style="text-align: right; padding-bottom: 10px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Value</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
                <tfoot>
                    <tr>
                        <td style="padding-top: 20px; font-weight: 900; text-transform: uppercase;">Total Value</td>
                        <td style="padding-top: 20px; text-align: right; font-weight: 900; font-size: 20px;">₹${Number(totalAmount).toLocaleString('en-IN')}</td>
                    </tr>
                </tfoot>
            </table>

            <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; margin-top: 40px; font-size: 13px; line-height: 1.6;">
                <p style="margin: 0; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px;">Next Steps</p>
                <p style="margin: 0;">You will receive a tracking signature via email once the asset leaves our vault. Please ensure someone is available to provide a secure hand-off signature.</p>
            </div>

            <div style="text-align: center; margin-top: 60px; font-size: 11px; color: #aaa; text-transform: uppercase; letter-spacing: 2px;">
                Essential Rush &middot; Fine Horology &middot; Global Vault
            </div>
        </div>
    `;

    try {
        const { data, error } = await resend.emails.send({
            from: 'Essential Rush <concierge@essentialrush.com>',
            to: [email],
            subject: `Order Confirmed: ${orderId} | Essential`,
            html: html
        });

        if (error) {
            console.error('Order confirmation email failed:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Order confirmation email error:', error);
        return { success: false, error: 'We could not send the order confirmation email.' };
    }
};

// 🛡️ EMAIL VALIDATION HELPER
export const validateEmailConfig = () => {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('Email is not set up yet (missing RESEND_API_KEY).');
    }
    return true;
};
