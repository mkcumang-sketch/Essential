import { z } from 'zod';

// 🛡️ ENTERPRISE-GRADE VALIDATION SCHEMAS 🛡️

export const userRegistrationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(50, "Name too long"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
  referredBy: z.string().optional(),
  captchaToken: z.string().optional()
});

export const userLoginSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  password: z.string().min(1, "Password required"),
  captchaToken: z.string().optional()
});

export const addressSchema = z.object({
  type: z.enum(["Home", "Office", "Other"]).default("Home"),
  address: z.string().min(10, "Address must be at least 10 characters").max(200, "Address too long"),
  isDefault: z.boolean().default(false)
});

export const referralApplySchema = z.object({
  referralCode: z.string().min(5, "Invalid referral code").max(20, "Invalid referral code")
});

export const wishlistSchema = z.object({
  productId: z.string().min(1, "Product ID required")
});

export const adminUserUpdateSchema = z.object({
  userId: z.string().min(1, "User ID required"),
  totalSpent: z.number().min(0, "Total spent must be positive").optional(),
  loyaltyTier: z.enum(["Silver Vault", "Gold Vault"]).optional()
});

export const productFilterSchema = z.object({
  searchQuery: z.string().optional(),
  categories: z.array(z.string()).optional(),
  brands: z.array(z.string()).optional(),
  priceRange: z.object({
    min: z.number().min(0).default(0),
    max: z.number().min(0).default(100000)
  }).optional(),
  availability: z.enum(["all", "in-stock", "out-of-stock"]).default("all"),
  sortOption: z.enum(["newest", "low-high", "high-low"]).default("newest")
});

// 🛡️ HELPER: Validate and return safe data or throw error
export const validateInput = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const errorMessages = result.error.errors.map(err => `${err.path.join('.')}: ${err.message}`).join(', ');
    throw new Error(`Validation failed: ${errorMessages}`);
  }
  return result.data;
};
