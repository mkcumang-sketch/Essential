import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white text-black pt-20 pb-10 border-t border-gray-100 font-sans">
      <div className="max-w-[1600px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
        
        {/* Brand Section (4 Cols) */}
        <div className="md:col-span-4 space-y-6">
          <h2 className="text-3xl font-serif font-bold tracking-tighter uppercase">Essential Rush</h2>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
            India's premier destination for authenticated luxury timepieces. We bridge the gap between heritage and modernity.
          </p>
          <div className="flex gap-4">
            {[Instagram, Facebook, Twitter, Mail].map((Icon, i) => (
              <a key={i} href="#" className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Links Section (2 Cols each) */}
        <div className="md:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8">Shop</h3>
          <ul className="space-y-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
            <li><Link href="/collection" className="hover:text-black hover:underline transition-all">New Arrivals</Link></li>
            <li><Link href="/collection" className="hover:text-black hover:underline transition-all">Best Sellers</Link></li>
            <li><Link href="/collection?brand=Rolex" className="hover:text-black hover:underline transition-all">Rolex</Link></li>
            <li><Link href="/collection?brand=Patek" className="hover:text-black hover:underline transition-all">Patek Philippe</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8">Company</h3>
          <ul className="space-y-4 text-xs font-medium text-gray-600 uppercase tracking-wider">
            <li><Link href="/about" className="hover:text-black hover:underline transition-all">Our Story</Link></li>
            <li><Link href="/contact" className="hover:text-black hover:underline transition-all">Contact Us</Link></li>
            <li><Link href="/authenticity" className="hover:text-black hover:underline transition-all">Authenticity</Link></li>
            <li><Link href="/admin" className="hover:text-black hover:underline transition-all">Admin Access</Link></li>
          </ul>
        </div>

        {/* Newsletter (4 Cols) */}
        <div className="md:col-span-4">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-8">Newsletter</h3>
          <p className="text-gray-500 text-xs mb-6">Subscribe to receive updates, access to exclusive deals, and more.</p>
          <form className="flex border-b border-black pb-2">
            <input 
              type="email" 
              placeholder="ENTER YOUR EMAIL" 
              className="w-full bg-transparent outline-none text-xs font-bold uppercase tracking-widest placeholder:text-gray-400"
            />
            <button className="text-xs font-bold uppercase tracking-widest hover:text-gold-500 transition-colors">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest px-6 md:px-12">
        <p>© 2026 Essential Rush. All Rights Reserved.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Shipping & Returns</span>
        </div>
      </div>
    </footer>
  );
}