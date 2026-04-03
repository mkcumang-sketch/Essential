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
    phone: { 
        type: String, 
        unique: true, 
        sparse: true,
        validate: {
            validator: function(v: string) {
                return /^[6-9]\d{9}$/.test(v);
            },
            message: 'Invalid Indian phone number format'
        }
    },
    password: { 
        type: String,
        minlength: [8, 'Password must be at least 8 characters'],
        select: false // Never return password by default
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
        uppercase: true,
        match: [/^[A-Z0-9]{4,8}$/, 'Referral code must be 4-8 uppercase alphanumeric characters']
    }, 
    referredBy: { 
        type: String,
        ref: 'User',
        index: true // Optimized for referral tree lookups
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
    wishlist: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
    }],
    recentlyViewed: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product' 
    }],
    
    // ELITE LOYALTY PROGRAM (Phase 2) 
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
    toJSON: { 
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    },
    toObject: { 
        virtuals: true,
        transform: function(doc, ret) {
            delete ret.password;
            delete ret.__v;
            return ret;
        }
    }
});

// PERFORMANCE INDEXES FOR 100K+ USERS 
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });
userSchema.index({ myReferralCode: 1 }, { unique: true, sparse: true });
userSchema.index({ referredBy: 1 }); // Optimized referral tree queries
userSchema.index({ role: 1 }); // Admin queries
userSchema.index({ createdAt: -1 }); // Recent users
userSchema.index({ totalSpent: -1 }); // Top spenders

// PRE-CREATE MIDDLEWARE FOR SECURITY 
userSchema.pre('save', function(next) {
    if (this.isModified('password') && this.password) {
        // Password will be hashed at the controller level
        // This is just a safety net
    }
    next();
});

userSchema.pre(/^find/, function(next) {
    // Automatically exclude sensitive fields from all queries
    this.select('-password -__v');
    next();
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;