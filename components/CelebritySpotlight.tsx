"use client";
import { motion } from "framer-motion";

export default function CelebritySpotlight({ celebrities }: { celebrities: any[] }) {
  // Safe check taaki empty database par crash na ho
  const celebs = celebrities?.length > 0 ? celebrities : [
    { name: "Shah Rukh Khan", watch: "Patek Philippe Nautilus", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=2574" },
    { name: "Ranbir Kapoor", watch: "Rolex Daytona", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=2670" }
  ];

  return (
    <section className="py-32 bg-[#050505] px-6 md:px-12">
      <div className="max-w-[1800px] mx-auto">
        <header className="mb-16 text-center">
          <h2 className="text-gold-500 font-bold uppercase tracking-[0.5em] text-[10px] mb-4">On the wrist</h2>
          <h3 className="text-white font-serif italic text-5xl md:text-7xl tracking-tighter">Stars and their watches</h3>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {celebs.map((celeb, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="relative aspect-[3/4] overflow-hidden group rounded-2xl"
            >
              {/* Celebrity Image */}
              <img 
                src={celeb.image} 
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out" 
                alt={celeb.name}
              />
              
              {/* Luxury Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

              {/* Text Info */}
              <div className="absolute bottom-0 left-0 p-8 w-full translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <p className="text-gold-500 font-bold uppercase text-[10px] tracking-[0.3em] mb-2">{celeb.watchModel || celeb.watch}</p>
                <h4 className="text-white font-serif italic text-3xl md:text-4xl">{celeb.name}</h4>
                <div className="w-0 group-hover:w-20 h-[1px] bg-gold-500 mt-4 transition-all duration-700 delay-100" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}