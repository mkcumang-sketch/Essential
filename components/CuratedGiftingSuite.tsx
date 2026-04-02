"use client";

import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Sparkles, Gift, X } from "lucide-react";

type WatchItem = {
  id: string;
  name: string;
  brand?: string;
  imageUrl?: string;
  image?: string;
  offerPrice?: number;
  price?: number;
};

export default function CuratedGiftingSuite({
  watches,
  isLight,
  onToast,
}: {
  watches: WatchItem[];
  isLight: boolean;
  onToast?: (msg: string) => void;
}) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [note, setNote] = useState("");

  const selectedWatches = useMemo(() => {
    const set = new Set(selectedIds);
    return watches.filter((w) => set.has(w.id));
  }, [selectedIds, watches]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      // Keep it exclusive: max 6 items in one gift bundle
      if (prev.length >= 6) return prev;
      return [...prev, id];
    });
  };

  const confirmBundle = () => {
    if (selectedWatches.length === 0) return onToast?.("Select at least one timepiece.");
    const trimmed = note.trim();
    if (trimmed.length < 6) return onToast?.("Add a premium note (at least 6 characters).");
    onToast?.("Gifting bundle prepared. Your note is ready.");
  };

  const cardBase =
    "rounded-[26px] border transition-all duration-1000";
  const cardBg = isLight
    ? "bg-white/80 border-black/10 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.35),0_0_26px_rgba(212,175,55,0.18)]"
    : "bg-white/5 border-white/10 hover:shadow-[0_0_0_1px_rgba(212,175,55,0.35),0_0_26px_rgba(212,175,55,0.18)]";
  const textClass = isLight ? "text-black" : "text-white";
  const mutedText = isLight ? "text-gray-600" : "text-gray-400";

  if (watches.length === 0) {
    return (
      <motion.section
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative overflow-hidden"
      >
        <div className={`${cardBg} ${cardBase} p-8 md:p-10`}>
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isLight ? "bg-black/5 border border-black/10" : "bg-black/30 border border-white/10"
              }`}
            >
              <Sparkles size={22} className={isLight ? "text-[#D4AF37]" : "text-[#D4AF37]"} />
            </div>
            <div>
              <h3 className={`text-xl font-serif font-bold uppercase tracking-[5px] ${textClass}`}>
                Curated Gifting Suite
              </h3>
              <p className={`${mutedText} text-sm mt-1`}>Acquire timepieces to start building gifting bundles.</p>
            </div>
          </div>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="relative overflow-hidden"
    >
      <div className={`${cardBg} ${cardBase} p-8 md:p-10`}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isLight ? "bg-black/5 border border-black/10" : "bg-black/30 border border-white/10"
              }`}
            >
              <Sparkles size={22} className={isLight ? "text-[#D4AF37]" : "text-[#D4AF37]"} />
            </div>
            <div>
              <h3 className={`text-xl font-serif font-bold uppercase tracking-[5px] ${textClass}`}>
                Curated Gifting Suite
              </h3>
              <p className={`${mutedText} text-sm mt-1`}>
                Bundle timepieces with a custom premium note.
              </p>
            </div>
          </div>

          <div className={`flex items-center gap-2 ${mutedText} text-[10px] font-black uppercase tracking-[4px]`}>
            <Gift size={14} />
            {selectedWatches.length}/6 selected
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {watches.slice(0, 12).map((w) => {
            const active = selectedIds.includes(w.id);
            const price = Number(w.offerPrice ?? w.price ?? 0);
            const cover = w.imageUrl || w.image;

            return (
              <motion.button
                key={w.id}
                type="button"
                onClick={() => toggleSelect(w.id)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 1.0, ease: "easeOut" }}
                className={`${cardBase} p-4 text-left ${
                  active
                    ? isLight
                      ? "bg-[#D4AF37]/15 border-[#D4AF37]/50"
                      : "bg-[#D4AF37]/20 border-[#D4AF37]/50"
                    : cardBg
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-black/20 border border-white/10">
                    {cover ? (
                      <Image
                        src={cover}
                        alt={w.name}
                        fill
                        sizes="56px"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                        —
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className={`text-[10px] font-black uppercase tracking-[4px] truncate ${mutedText}`}>
                      {w.brand || "Essential"}
                    </div>
                    <div className={`text-sm font-bold font-serif truncate ${textClass}`}>
                      {w.name}
                    </div>
                    <div className={`${mutedText} text-[11px] font-black mt-1`}>
                      ₹{price.toLocaleString("en-IN")}
                    </div>
                  </div>
                </div>

                {active && (
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase tracking-[4px] ${textClass}`}>
                      Selected
                    </span>
                    <span className={isLight ? "text-black" : "text-white"}>
                      <X size={14} />
                    </span>
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`${cardBase} ${cardBg} p-6`}>
            <label className={`${mutedText} text-[10px] font-black uppercase tracking-[4px]`} htmlFor="gift-note">
              Premium Note
            </label>
            <textarea
              id="gift-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write a heartfelt note for your recipient..."
              className={`mt-3 w-full min-h-[120px] resize-none rounded-[18px] border px-4 py-4 outline-none ${
                isLight ? "bg-white border-black/10 text-black" : "bg-black/30 border-white/10 text-white"
              } focus:border-[#D4AF37]/60`}
            />
            <div className={`${mutedText} text-xs mt-3`}>
              {note.trim().length}/240 characters
            </div>
          </div>

          <div className={`${cardBase} ${cardBg} p-6`}>
            <div className={`${mutedText} text-[10px] font-black uppercase tracking-[4px]`}>
              Bundle Preview
            </div>

            <div className="mt-4 flex items-center justify-between gap-4">
              <div className={`${textClass} font-bold`}>
                <span className="text-2xl font-serif">{selectedWatches.length}</span>
                <span className={`${mutedText} text-sm ml-2`}>items</span>
              </div>
              <div className={`${mutedText} text-[10px] font-black uppercase tracking-[4px]`}>
                #EssentialVault
              </div>
            </div>

            <div className={`${mutedText} text-sm mt-5 leading-relaxed`}>
              {note.trim()
                ? `“${note.trim().slice(0, 180)}${note.trim().length > 180 ? "…" : ""}”`
                : "Add your premium note to preview the gifting message."}
            </div>

            <button
              type="button"
              onClick={confirmBundle}
              className={`mt-6 w-full py-4 rounded-full text-[11px] font-black uppercase tracking-[5px] transition-all duration-500 shadow-lg ${
                isLight
                  ? "bg-black text-white hover:bg-[#D4AF37] hover:text-black border border-black/20"
                  : "bg-[#D4AF37] text-black hover:bg-white hover:text-black border border-[#D4AF37]/50"
              }`}
            >
              Prepare Gift Bundle
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

