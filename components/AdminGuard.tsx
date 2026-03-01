"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const adminEmail = "us7081569@gmail.com"; // Aapki email

  useEffect(() => {
    if (status === "loading") return;
    
    // Agar login nahi hai ya email match nahi karti -> Redirect
    if (!session || session.user?.email !== adminEmail) {
      // router.push("/"); // Login page par bhejne ke liye uncomment karein
      console.log("Access Denied: Not an Admin");
    }
  }, [session, status, router]);

  if (status === "loading") return <div className="p-10 text-center">Verifying Vault Access...</div>;

  // Agar sab sahi hai, toh content dikhao
  return <>{children}</>;
}