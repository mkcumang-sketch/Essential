"use client";
import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AffiliateTrackerContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      // 1. Save to localStorage for checkout
      localStorage.setItem("essential_affiliate_ref", ref);
      
      // 2. Call the tracking API to increment clicks
      fetch("/api/agents/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: ref }),
      }).catch(err => console.error("Affiliate tracking failed:", err));

      console.log("Affiliate tracking active for:", ref);
    }
  }, [searchParams]);

  return null;
}

export default function AffiliateTracker() {
  return (
    <Suspense fallback={null}>
      <AffiliateTrackerContent />
    </Suspense>
  );
}