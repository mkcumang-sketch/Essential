import { Resend } from 'resend';

// 📧 ENTERPRISE EMAIL SERVICE
const resend = new Resend(process.env.RESEND_API_KEY);

// 🎉 WELCOME EMAIL FUNCTION
export const sendWelcomeEmail = async (userEmail: string, userName: string, referralCode?: string) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'noreply@essentialrush.com',
            to: userEmail,
            subject: '🎊 Welcome to Essential Rush - Your Vault Access is Ready!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAFA;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #D4AF37; font-size: 32px; margin-bottom: 10px;">🎊 Welcome to Essential Rush</h1>
                        <h2 style="color: #333; font-size: 24px; font-weight: bold;">Your Vault Access is Ready!</h2>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        <p style="color: #666; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                            Dear <strong>${userName}</strong>,
                        </p>
                        
                        <p style="color: #333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                            Thank you for joining Essential Rush! Your premium vault account has been successfully created.
                        </p>
                        
                        ${referralCode ? `
                        <div style="background: #F8F9FA; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
                            <p style="color: #333; font-size: 14px; margin: 0;">
                                <strong>🎁 Your Referral Code:</strong> ${referralCode}
                            </p>
                            <p style="color: #666; font-size: 12px; margin-top: 10px;">
                                Share this code with friends to earn rewards when they sign up!
                            </p>
                        </div>
                        ` : ''}
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="https://essentialrush.com/shop" 
                               style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                                🛍 Start Shopping
                            </a>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px;">
                            This is an automated message from Essential Rush. Please do not reply to this email.
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
        return { success: false, error: 'Failed to send welcome email' };
    }
};

// 🏆 REFERRAL REWARD EMAIL FUNCTION
export const sendReferralRewardEmail = async (referrerEmail: string, referrerName: string, refereeName: string, rewardAmount: number = 100) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'noreply@essentialrush.com',
            to: referrerEmail,
            subject: `🎉 Referral Success! You Earned ${rewardAmount} Points!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #FAFAFA;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #D4AF37; font-size: 32px; margin-bottom: 10px;">🎉 Referral Success!</h1>
                        <h2 style="color: #333; font-size: 24px; font-weight: bold;">You've Earned ${rewardAmount} Points!</h2>
                    </div>
                    
                    <div style="background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                        <p style="color: #333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                            Congratulations <strong>${referrerName}</strong>!
                        </p>
                        
                        <p style="color: #333; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                            Your friend <strong>${refereeName}</strong> has successfully signed up using your referral code.
                        </p>
                        
                        <div style="background: #E8F5E8; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #D4AF37;">
                            <p style="color: #333; font-size: 14px; margin: 0;">
                                <strong>🏆 Reward Earned:</strong> ${rewardAmount} points
                            </p>
                            <p style="color: #666; font-size: 12px; margin-top: 10px;">
                                Points have been added to your wallet. Use them for discounts on your next purchase!
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="https://essentialrush.com/account" 
                               style="background: #D4AF37; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">
                                🏆 View Your Rewards
                            </a>
                        </div>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px;">
                            This is an automated message from Essential Rush. Please do not reply to this email.
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
        return { success: false, error: 'Failed to send referral reward email' };
    }
};

// 🛡️ EMAIL VALIDATION HELPER
export const validateEmailConfig = () => {
    if (!process.env.RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is required for email functionality');
    }
    return true;
};
