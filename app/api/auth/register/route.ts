import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { validateInput } from '@/lib/validation';
import { userRegistrationSchema } from '@/lib/validation';
import { ApiResponse } from '@/types';
import { sendWelcomeEmail } from '@/lib/mail';

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
    try {
        await connectDB();
        
        // ENTERPRISE INPUT VALIDATION
        const body = await req.json();
        const validatedData = validateInput(userRegistrationSchema, body);
        
        const { name, phone, password, referredBy, captchaToken } = validatedData;

        // DUPLICATE USER CHECKS
        const [existingPhone, existingEmail] = await Promise.all([
            User.findOne({ phone }).select('_id').select('-password -__v'),
            User.findOne({ email: `${phone}@essential-guest.com` }).select('_id').select('-password -__v')
        ]);

        if (existingPhone) {
            return NextResponse.json({ 
                success: false, 
                error: "Phone number is already registered." 
            }, { status: 400 });
        }

        if (existingEmail) {
            return NextResponse.json({ 
                success: false, 
                error: "Account already exists with this phone number." 
            }, { status: 400 });
        }

        // RECAPTCHA VERIFICATION (PRODUCTION)
        if (process.env.NODE_ENV === 'production') {
            try {
                const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${captchaToken}`;
                const captchaRes = await fetch(verifyUrl, { method: 'POST' });
                const captchaData = await captchaRes.json();
                
                if (!captchaData.success || captchaData.score < 0.5) {
                    return NextResponse.json({ 
                        success: false, 
                        error: "Security verification failed." 
                    }, { status: 400 });
                }
            } catch (err) {
                console.error("reCAPTCHA Error:", err);
                return NextResponse.json({ 
                    success: false, 
                    error: "Security service unavailable." 
                }, { status: 503 });
            }
        }

        // REFERRAL CODE VALIDATION
        let referredByUser = null;
        if (referredBy) {
            referredByUser = await User.findOne({ myReferralCode: referredBy }).select('_id name').select('-password -__v');
            if (!referredByUser) {
                return NextResponse.json({ 
                    success: false, 
                    error: "Invalid referral code." 
                }, { status: 400 });
            }
        }

        // SECURE PASSWORD HASHING
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // ENTERPRISE REFERRAL CODE GENERATOR
        const randomStr = Math.floor(1000 + Math.random() * 9000);
        const namePrefix = name.replace(/[^a-zA-Z]/g, '').substring(0, 3).toUpperCase();
        const myReferralCode = `ESS-${namePrefix}${randomStr}`;

        // SECURE USER CREATION
        const fallbackEmail = `${phone}@essential-guest.com`;
        
        const newUser = await User.create({
            name: name.trim(),
            phone,
            email: fallbackEmail,
            password: hashedPassword,
            role: 'USER',
            myReferralCode, 
            referredBy: referredByUser?._id || null, 
            walletPoints: referredByUser ? 50 : 0, // Welcome bonus for referred users
            totalEarned: 0
        });

        // PROCESS REFERRAL REWARDS IF APPLICABLE
        if (referredByUser) {
            await User.findByIdAndUpdate(referredByUser._id, {
                $inc: { walletPoints: 100, totalEarned: 100 },
                $push: {
                    notifications: {
                        title: "",
                        desc: `${name} joined using your referral code. +100 points earned!`,
                        unread: true,
                        time: new Date()
                    }
                }
            });
        }

        // WELCOME NOTIFICATION
        await User.findByIdAndUpdate(newUser._id, {
            $push: {
                notifications: {
                    title: "",
                    desc: referredByUser 
                        ? "Your account is ready! ₹500 welcome bonus applied." 
                        : "Your account is ready! Start shopping now.",
                    unread: true,
                    time: new Date()
                }
            }
        });

        // SEND WELCOME EMAIL
        try {
            await sendWelcomeEmail(fallbackEmail, name, myReferralCode);
            if (process.env.NODE_ENV === 'development') {
                console.log('✅ Welcome email sent to:', fallbackEmail);
            }
        } catch (emailError) {
            if (process.env.NODE_ENV === 'development') {
                console.error('❌ Welcome email failed:', emailError);
            }
            // Don't fail registration if email fails
        }

        return NextResponse.json({ 
            success: true, 
            message: "Vault Access Granted.",
            data: {
                userId: newUser._id,
                referralCode: myReferralCode,
                welcomeBonus: referredByUser ? 50 : 0
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error("Registration Error:", error);
        
        // DATABASE DUPLICATE ERROR HANDLING
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return NextResponse.json({ 
                success: false, 
                error: `${field} already exists.` 
            }, { status: 409 });
        }

        // VALIDATION ERROR HANDLING
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err: any) => err.message);
            return NextResponse.json({ 
                success: false, 
                error: validationErrors.join(', ') 
            }, { status: 400 });
        }

        return NextResponse.json({ 
            success: false, 
            error: "Registration failed. Please try again." 
        }, { status: 500 });
    }
}