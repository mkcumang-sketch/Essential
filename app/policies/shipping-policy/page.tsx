'use client';
import { motion } from 'framer-motion';
import { Truck, MapPin, PackageCheck, AlertCircle } from 'lucide-react';

export default function ShippingProtocol() {
  const regions = [
    { name: 'Kanpur / Lucknow', time: '24-48 Hours', type: 'Local Priority' },
    { name: 'North India', time: '2-4 Business Days', type: 'Regional Transit' },
    { name: 'Pan India', time: '5-7 Business Days', type: 'Global Network' }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white p-10 md:p-24">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-5xl mx-auto">
        <header className="mb-20">
          <h1 className="text-5xl font-serif italic text-[#D4AF37] mb-4">Dispatch Protocol</h1>
          <p className="text-[10px] font-black uppercase tracking-[5px] text-gray-500">Global Logistics | Essential Rush</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {regions.map((r, i) => (
            <div key={i} className="bg-[#0A0A0A] border border-[#D4AF37]/20 p-8 rounded-[30px] hover:border-[#D4AF37] transition-all">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#D4AF37] mb-2">{r.type}</p>
              <h4 className="text-xl font-serif mb-4">{r.name}</h4>
              <p className="text-3xl font-serif italic text-white">{r.time}</p>
            </div>
          ))}
        </div>

        <div className="bg-[#111] p-10 rounded-[40px] border border-white/5 flex items-start gap-8">
          <div className="p-4 bg-[#D4AF37]/10 rounded-2xl text-[#D4AF37]"><PackageCheck size={30}/></div>
          <div>
            <h4 className="text-xl font-serif italic mb-2">Secure Packaging Guarantee</h4>
            <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
              Every asset is vacuum-sealed and protected in a discreet, tamper-proof container. 
              We utilize private logistics partners to ensure your requisition arrives in mint condition. 
              <span className="text-[#D4AF37] block mt-4 font-black uppercase text-[10px] tracking-widest italic">A mandatory unboxing video is required for insurance claims.</span>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}