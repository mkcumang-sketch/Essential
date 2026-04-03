import { z } from 'zod';

// 🛡️ XSS SANITIZATION HELPER
// Strips HTML tags to prevent XSS attacks
const sanitizeString = (str: string): string => {
  return str
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

// 🛡️ CUSTOM SANITIZED STRING SCHEMA
const sanitizedString = (minLength: number = 1, maxLength: number = 500) => {
  return z.string()
    .min(minLength)
    .max(maxLength)
    .transform((val) => sanitizeString(val))
    .refine((val) => val.length >= minLength, {
      message: `Text must be at least ${minLength} characters after sanitization`
    });
};

// 🛡️ ENTERPRISE-GRADE VALIDATION SCHEMAS 🛡️

export const userRegistrationSchema = z.object({
  name: sanitizedString(2, 50),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain uppercase, lowercase, and number"),
  referredBy: z.string().max(20).optional().transform(val => val ? sanitizeString(val) : undefined),
  captchaToken: z.string().optional(),
  // 🍯 HONEYPOT FIELD: Should always be empty
  website: z.string().max(0).optional().refine(val => !val || val === '', {
    message: "Bot detected"
  })
});

export const userLoginSchema = z.object({
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone number"),
  password: z.string().min(1, "Password required"),
  captchaToken: z.string().optional(),
  // 🍯 HONEYPOT FIELD: Should always be empty
  website: z.string().max(0).optional().refine(val => !val || val === '', {
    message: "Bot detected"
  })
});

export const addressSchema = z.object({
  type: z.enum(["Home", "Office", "Other"]).default("Home"),
  address: sanitizedString(10, 200),
  isDefault: z.boolean().default(false)
});

export const referralApplySchema = z.object({
  referralCode: sanitizedString(5, 20)
});

export const wishlistSchema = z.object({
  productId: sanitizedString(1, 100)
});

export const adminUserUpdateSchema = z.object({
  userId: sanitizedString(1, 100),
  totalSpent: z.number().min(0, "Total spent must be positive").optional(),
  loyaltyTier: z.enum(["Silver Vault", "Gold Vault"]).optional()
});

export const productFilterSchema = z.object({
  searchQuery: sanitizedString(1, 100).optional(),
  categories: z.array(sanitizedString(1, 50)).optional(),
  brands: z.array(sanitizedString(1, 50)).optional(),
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

// 🛡️ HELPER: Sanitize any string input
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<style[^>]*>.*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};
