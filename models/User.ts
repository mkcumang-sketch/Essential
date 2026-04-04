import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    type: { type: String, default: 'Home', enum: ['Home', 'Office', 'Other'] },
    address: { type: String, required: true, minlength: 10, maxlength: 200 },
    isDefault: { type: Boolean, default: false }
});

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Name is required'], 
        minlength: [2, 'Name must be at least 2 characters'],
        maxlength: [50, 'Name cannot exceed 50 characters'],
        trim: true
    },
    email: { 
        type: String, 
        unique: true, 
        sparse: true,
        lowercase: true,
        trim: true
    },
    image: { type: String }, // Google Profile Picture ke liye
    phone: { 
        type: String, 
        unique: true, 
        sparse: true, // Zaroori: Taaki bina phone waale multiple Google users save ho sakein
        validate: {
            validator: function(v: string) {
                // Agar phone number nahi hai (Google login), toh validation skip karo
                if (!v || v.startsWith('GOOG-')) return true; 
                return /^[6-9]\d{9}$/.test(v);
            },
            message: 'Invalid Indian phone number format'
        }
    },
    password: { 
        type: String,
        // Password optional rakha hai Google users ke liye
        minlength: [8, 'Password must be at least 8 characters'],
        select: false 
    }, 
    role: { 
        type: String, 
        enum: ['USER', 'SUPER_ADMIN'],
        default: 'USER' 
    }, 
    
    // EMPIRE REWARDS ENGINE 
    myReferralCode: { 
        type: String, 
        unique: true, 
        sparse: true,
        uppercase: true
    }, 
    referredBy: { 
        type: String,
        ref: 'User',
        index: true 
    }, 
    walletPoints: { 
        type: Number, 
        default: 0,
        min: [0, 'Wallet points cannot be negative']
    }, 
    totalEarned: { 
        type: Number, 
        default: 0,
        min: [0, 'Total earned cannot be negative']
    }, 
    
    // PREMIUM ACCOUNT FEATURES 
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    
    // ELITE LOYALTY PROGRAM
    totalSpent: { 
        type: Number, 
        default: 0,
        min: [0, 'Total spent cannot be negative']
    },
    loyaltyTier: { 
        type: String, 
        enum: ['Silver Vault', 'Gold Vault'],
        default: 'Silver Vault' 
    },
    notifications: [{
        title: { type: String, required: true },
        desc: { type: String, required: true },
        time: { type: Date, default: Date.now },
        unread: { type: Boolean, default: true }
    }],
    loginHistory: [{
        ip: { type: String, required: true },
        device: { type: String, required: true },
        date: { type: Date, default: Date.now }
    }]
}, { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// 🚀 CLEAN INDEXES (Duplicate warnings hata di hain)
// Indexes ab sirf yahan define hain, fields ke andar se hata diye gaye hain taaki conflict na ho
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });
userSchema.index({ myReferralCode: 1 }, { unique: true, sparse: true });
userSchema.index({ createdAt: -1 });

// PRE-QUERY MIDDLEWARE
// PRE-QUERY MIDDLEWARE
userSchema.pre(/^find/, function(this: any, next) {
    this.select('-__v');
    next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;