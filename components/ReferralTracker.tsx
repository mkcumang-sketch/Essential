"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function ReferralTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref"); // URL se ?ref=amit nikalo
    
    if (ref) {
      // 1. Browser mein save kar lo (taaki checkout tak yaad rahe)
      localStorage.setItem("staff_ref", ref);

      // 2. Server ko batao ki ek visitor aaya hai
      fetch("/api/staff/track-visit", {
        method: "POST",
        body: JSON.stringify({ refCode: ref }),
      });
    }
  }, [searchParams]);

  return null; // Ye screen par kuch nahi dikhayega
}