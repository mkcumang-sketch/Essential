import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db"; // Aapka standard db connection import
import User from "@/models/User";
import { Order } from "@/models/Order";
import AccountClient from "@/components/AccountClient";

export default async function PremiumAccountDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await connectDB();

  // 🆔 1. IDENTITY GLUE: Fetching DB User for loyalty data
  const uid = (session.user as any).id;
  const dbUser = await User.findById(uid).lean() as any;

  // 🔍 2. ROBUST ORDER QUERY (The Identity Fix)
  // Hum User ID, Email aur Phone teeno se search kar rahe hain taaki Guest checkout orders bhi dikhen
  const userEmail = session.user?.email;
  const userPhone = (session.user as any).phone;

  const query: any = {
    $or: [
      { userId: uid },
      { "customer.email": userEmail },
      { "customerEmail": userEmail }, // Backup field for email
      { "shippingAddress.email": userEmail } // Security glue
    ]
  };

  // Agar user ke session mein phone number hai, toh usse bhi search karo
  if (userPhone) {
    query.$or.push({ "customer.phone": userPhone });
    query.$or.push({ "customerPhone": userPhone });
  }

  // 📦 3. FETCH ORDERS
  const orders = await Order.find(query)
    .sort({ createdAt: -1 })
    .lean() as any[];

  // 📊 4. SERIALIZE DASHBOARD DATA
  const dashData = {
    walletPoints: dbUser?.walletPoints || 0,
    totalSpent: orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0),
    loyaltyTier: dbUser?.loyaltyTier || "Silver Vault",
    myReferralCode: dbUser?.myReferralCode || "VAULT-VIP",
    // Ensure all MongoDB Objects are converted to strings for the client
    orders: orders.map(o => ({ 
      ...o, 
      _id: o._id.toString(),
      createdAt: o.createdAt?.toISOString() 
    }))
  };

  return (
    <AccountClient 
      initialData={dashData} 
      session={JSON.parse(JSON.stringify(session))} 
    />
  );
}