import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center text-[#050505] font-sans p-6 text-center">
      <h1 className="text-[150px] font-serif italic font-black text-gray-200 leading-none">404</h1>
      <h2 className="text-3xl font-serif italic mb-4 relative z-10 -mt-10">Area Restricted.</h2>
      <p className="text-gray-500 font-black uppercase tracking-widest text-[10px] mb-10">
        The asset or section you are looking for does not exist in our registry.
      </p>
      <Link 
        href="/" 
        className="bg-[#050505] text-[#D4AF37] px-10 py-4 rounded-full font-black uppercase tracking-[4px] text-[10px] hover:bg-[#D4AF37] hover:text-black transition-all flex items-center gap-3"
      >
        <ArrowLeft size={16} /> Return to Vault
      </Link>
    </div>
  );
}