import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10 px-6 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
        
        {/* Newsletter Section */}
        <div className="md:col-span-2">
            <h2 className="text-4xl font-serif text-white mb-4 italic">Stay Updated.</h2>
            <p className="text-gray-500 mb-8 uppercase tracking-widest text-[10px]">Sign up for new watches and exclusive sales.</p>
            <div className="flex border-b border-white/20 pb-2 max-w-md">
                <input type="email" placeholder="Your Email" className="bg-transparent flex-1 outline-none text-sm text-white" />
                <button className="text-[10px] font-bold tracking-[3px] uppercase text-white hover:text-[#D4AF37] transition-colors">Sign Up</button>
            </div>
        </div>
        
        {/* Legal Links */}
        <div>
            <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-[4px] mb-6">Legal</h4>
            <div className="flex flex-col gap-3 text-xs text-gray-300">
                <Link href="/policies/terms-condition" className="hover:text-[#D4AF37] transition-colors">Terms and condition</Link>
                <Link href="/policies/refund-policy" className="hover:text-[#D4AF37] transition-colors">Refund Policy</Link>
                <Link href="/policies/shipping-policy" className="hover:text-[#D4AF37] transition-colors">Shipping</Link>
                <Link href="/policies/privacy-policy" className="hover:text-[#D4AF37] transition-colors">Privacy Policy</Link>
            </div>
        </div>
        
        {/* Contact Info */}
        <div>
            <h4 className="text-[10px] text-gray-500 font-bold uppercase tracking-[4px] mb-6">Contact</h4>
            <p className="text-xs text-gray-300 mb-2">Essential Rush Pvt Ltd</p>
            <p className="text-xs text-gray-400">support@essentialrush.com</p>
        </div>

      </div>
      <div className="text-center border-t border-white/5 pt-8 text-[9px] text-gray-600 tracking-[5px] uppercase">
        © 2026 Essential Rush. All Rights Reserved.
      </div>
    </footer>
  );
}