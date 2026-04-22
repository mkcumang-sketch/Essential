"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AgentTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      // 🚀 MAGIC: Save agent referral code in a cookie for 30 days!
      const date = new Date();
      date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
      document.cookie = `essential_agent_ref=${ref};expires=${date.toUTCString()};path=/`;
      console.log("Agent tracking active for:", ref);
    }
  }, [searchParams]);

  return null; // Ye screen par kuch nahi dikhayega, background mein kaam karega
}