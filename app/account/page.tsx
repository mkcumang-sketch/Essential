import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { Order } from "@/models/Order";
import AccountClient from "@/components/AccountClient";

export default async function PremiumAccountDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  await connectDB();

  // Direct DB Fetching (Server-Side)
  const uid = (session.user as any).id;
  const dbUser = await User.findById(uid).lean() as any;
  const orders = await Order.find({ "customer.email": session.user?.email })
    .sort({ createdAt: -1 })
    .lean() as any[];

  const dashData = {
    walletPoints: dbUser?.walletPoints || 0,
    totalSpent: orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0),
    loyaltyTier: dbUser?.loyaltyTier || "Silver Vault",
    myReferralCode: dbUser?.myReferralCode || "VAULT-VIP",
    orders: orders.map(o => ({ ...o, _id: o._id.toString() }))
  };

  return <AccountClient initialData={dashData} session={JSON.parse(JSON.stringify(session))} />;
}
