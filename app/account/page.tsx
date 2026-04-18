import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db"; // Aapka standard db connection import
import User from "@/models/user";
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
  
  // 🚀 FIXED: Removed .lean() so we can modify and save the user
  let dbUser = await User.findById(uid); 

  // 🌟 THE FIX: UNIQUE REFERRAL CODE GENERATOR 🌟
  // Agar user ke paas pehle se code nahi hai, toh turant naya banao!
  if (dbUser && !dbUser.myReferralCode) {
      // First name nikal ke uppercase karega (e.g., "Umang Sharma" -> "UMANG")
      const firstName = (dbUser.name || "VIP").split(" ")[0].toUpperCase().replace(/[^A-Z]/g, '');
      const randomNum = Math.floor(1000 + Math.random() * 9000); // 4 digit random number
      
      dbUser.myReferralCode = `${firstName}-${randomNum}`; // Example: UMANG-4592
      await dbUser.save(); // Database mein hamesha ke liye save kar diya
      console.log(`Generated new unique code for ${dbUser.email}: ${dbUser.myReferralCode}`);
  }

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
    
    // 🚀 FIXED: Ab yahan se tera ASLI aur UNIQUE code frontend pe jayega
    myReferralCode: dbUser?.myReferralCode, 
    
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