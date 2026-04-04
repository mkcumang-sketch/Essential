// 🎯 ENTERPRISE TYPESCRIPT INTERFACES 🎯

export interface IUser {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  role: 'USER' | 'SUPER_ADMIN';
  myReferralCode?: string;
  referredBy?: string;
  walletPoints: number;
  totalEarned: number;
  totalSpent: number;
  loyaltyTier: 'Silver Vault' | 'Gold Vault';
  addresses: IAddress[];
  wishlist: string[];
  recentlyViewed: string[];
  notifications: INotification[];
  loginHistory: ILoginHistory[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IAddress {
  type: 'Home' | 'Office' | 'Other';
  address: string;
  isDefault: boolean;
}

export interface INotification {
  title: string;
  desc: string;
  time: Date;
  unread: boolean;
}

export interface ILoginHistory {
  ip: string;
  device: string;
  date: Date;
}

export interface IProduct {
  _id: string;
  name: string;
  title: string;
  brand: string;
  category: string;
  price: number;
  offerPrice?: number;
  compareAtPrice?: number;
  stock: number;
  imageUrl?: string;
  images?: string[];
  description?: string;
  slug?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IOrder {
  _id: string;
  userId: string;
  products: IProduct[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: IAddress;
  paymentStatus: 'pending' | 'paid' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface IReview {
  _id: string;
  userId: string;
  productId: string;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: Date;
}

// 🎯 NEXTAUTH EXTENSIONS 🎯
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email?: string;
      phone?: string;
      image?: string | null;
      role: string;
      myReferralCode?: string;
      walletPoints: number;
      loyaltyTier: string;
    };
  }

  interface User {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    role: string;
    myReferralCode?: string;
    walletPoints: number;
    loyaltyTier: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    phone?: string;
    myReferralCode?: string;
    walletPoints: number;
    loyaltyTier: string;
  }
}

// 🎯 API RESPONSE TYPES 🎯
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// 🎯 ADMIN TYPES 🎯
export interface AdminDashboardData {
  users: IUser[];
  totalUsers: number;
  goldVaultMembers: number;
  totalRevenue: number;
}
