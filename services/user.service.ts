import User from '@/models/usertemp';
import type { ApiResponse, IUser } from '@/types';

function leanUser(raw: unknown): IUser | null {
  if (raw == null || Array.isArray(raw)) return null;
  return raw as IUser;
}

// 🏆 ENTERPRISE USER SERVICE LAYER 🏆

class UserService {
  // 🛡️ SECURE USER FETCH WITH ZERO TRUST
  static async findUserById(userId: string): Promise<IUser | null> {
    const doc = await User.findById(userId)
      .select('-password -__v')
      .lean();
    return leanUser(doc);
  }

  static async findUserByPhone(phone: string): Promise<IUser | null> {
    const doc = await User.findOne({ phone })
      .select('-password -__v')
      .lean();
    return leanUser(doc);
  }

  static async findUserByEmail(email: string): Promise<IUser | null> {
    const doc = await User.findOne({ email })
      .select('-password -__v')
      .lean();
    return leanUser(doc);
  }

  static async findUserByReferralCode(referralCode: string): Promise<IUser | null> {
    const doc = await User.findOne({ myReferralCode: referralCode })
      .select('-password -__v')
      .lean();
    return leanUser(doc);
  }

  // 🏆 EMPIRE REWARDS BUSINESS LOGIC
  static async applyReferralReward(referrerId: string, refereeId: string): Promise<ApiResponse> {
    try {
      // 🛡️ PREVENT SELF-REFERRAL
      if (referrerId === refereeId) {
        return { success: false, error: "Cannot refer yourself" };
      }

      const [referrer, referee] = await Promise.all([
        this.findUserById(referrerId),
        this.findUserById(refereeId)
      ]);

      if (!referrer || !referee) {
        return { success: false, error: "Invalid users" };
      }

      // 🛡️ CHECK IF ALREADY REFERRED
      if (referee.referredBy) {
        return { success: false, error: "Already used a referral code" };
      }

      // 🏆 CREDIT REWARDS
      await Promise.all([
        User.findByIdAndUpdate(referrerId, {
          $inc: { walletPoints: 100, totalEarned: 100 },
          $push: {
            notifications: {
              title: "🎉 Referral Success!",
              desc: `${referee.name} used your referral code. +100 points earned!`,
              unread: true,
              time: new Date()
            }
          }
        }),
        User.findByIdAndUpdate(refereeId, {
          $set: { referredBy: referrerId },
          $push: {
            notifications: {
              title: "🎁 Welcome Bonus Applied!",
              desc: "₹500 discount applied to your account.",
              unread: true,
              time: new Date()
            }
          }
        })
      ]);

      return { 
        success: true, 
        message: "Referral rewards applied successfully",
        data: { discount: 500, referrerBonus: 100 }
      };

    } catch (error) {
      console.error("Referral Service Error:", error);
      return { success: false, error: "Failed to apply referral" };
    }
  }

  // 🏆 LOYALTY TIER CALCULATION
  static calculateLoyaltyTier(totalSpent: number): 'Silver Vault' | 'Gold Vault' {
    return totalSpent >= 50000 ? 'Gold Vault' : 'Silver Vault';
  }

  static async updateUserLoyaltyStatus(userId: string, totalSpent: number): Promise<ApiResponse> {
    try {
      const newTier = this.calculateLoyaltyTier(totalSpent);
      
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { 
          $set: { 
            totalSpent,
            loyaltyTier: newTier
          }
        },
        { new: true }
      ).select('-password -__v');

      if (!updatedUser) {
        return { success: false, error: "User not found" };
      }

      return { 
        success: true, 
        message: "Loyalty status updated",
        data: { user: updatedUser, tier: newTier }
      };

    } catch (error) {
      console.error("Loyalty Update Error:", error);
      return { success: false, error: "Failed to update loyalty status" };
    }
  }

  // 🏆 WALLET OPERATIONS
  static async updateWalletPoints(userId: string, points: number, operation: 'credit' | 'debit'): Promise<ApiResponse> {
    try {
      const updateField = '$inc';
      const updateValue = operation === 'credit' ? points : -points;

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { [updateField]: { walletPoints: updateValue } },
        { new: true }
      ).select('-password -__v');

      if (!updatedUser) {
        return { success: false, error: "User not found" };
      }

      // Check if wallet went negative after debit
      if (operation === 'debit' && updatedUser.walletPoints < 0) {
        // Reverse the debit if insufficient funds (basic rollback)
        await User.findByIdAndUpdate(userId, { $inc: { walletPoints: points } });
        return { success: false, error: "Insufficient wallet points" };
      }

      return { 
        success: true, 
        message: `Wallet ${operation === 'credit' ? 'credited' : 'debited'} successfully`,
        data: { newBalance: updatedUser.walletPoints }
      };

    } catch (error) {
      console.error("Wallet Update Error:", error);
      return { success: false, error: "Failed to update wallet" };
    }
  }

  // 🏆 ADDRESS MANAGEMENT
  static async addAddress(userId: string, addressData: any): Promise<ApiResponse> {
    try {
      const existingUser = await this.findUserById(userId);
      if (!existingUser) {
        return { success: false, error: "User not found" };
      }

      // 🛡️ SET AS DEFAULT IF FIRST ADDRESS
      if (!existingUser.addresses || existingUser.addresses.length === 0) {
        addressData.isDefault = true;
      }

      // 🛡️ UNSET OTHER DEFAULTS IF NEW DEFAULT
      if (addressData.isDefault) {
        // 🚀 FIXED: Use the Mongoose Model (User) instead of the local variable (existingUser)
        await User.updateMany(
          { _id: userId },
          { $set: { 'addresses.$[elem].isDefault': false } },
          { arrayFilters: [{ 'elem.isDefault': true }] }
        );
      }

      // 🚀 FIXED: Used 'User' model
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $push: { addresses: addressData } },
        { new: true }
      ).select('-password -__v');

      return { 
        success: true, 
        message: "Address added successfully",
        data: { user: updatedUser }
      };

    } catch (error) {
      console.error("Add Address Error:", error);
      return { success: false, error: "Failed to add address" };
    }
  }

  // 🏆 WISHLIST OPERATIONS
  static async toggleWishlist(userId: string, productId: string): Promise<ApiResponse> {
    try {
      const existingUser = await this.findUserById(userId);
      if (!existingUser) {
        return { success: false, error: "User not found" };
      }

      // Safely check if wishlist exists
      const isInWishlist = existingUser.wishlist && existingUser.wishlist.includes(productId);
      const updateOperation = isInWishlist ? '$pull' : '$push';

      // 🚀 FIXED: Used 'User' model
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { [updateOperation]: { wishlist: productId } },
        { new: true }
      ).select('-password -__v');

      return { 
        success: true, 
        message: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
        data: { inWishlist: !isInWishlist, user: updatedUser }
      };

    } catch (error) {
      console.error("Wishlist Toggle Error:", error);
      return { success: false, error: "Failed to update wishlist" };
    }
  }
}

export default UserService;