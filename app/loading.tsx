export default function Loading() {
  return (
    <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center">
      <div className="w-12 h-12 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-[#D4AF37] font-serif tracking-[0.3em] text-xs uppercase animate-pulse">
        Initializing Vault
      </p>
    </div>
  );
}