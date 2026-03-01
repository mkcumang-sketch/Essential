export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center text-center px-4">
      {/* Background 404 Text */}
      <h1 className="text-[10rem] font-black text-[#D32F2F] leading-none opacity-10 select-none">404</h1>
      
      {/* Main Heading */}
      <h2 className="text-4xl font-black uppercase tracking-tighter -mt-10 mb-4 bg-white px-4">
        Page Not Found
      </h2>
      
      {/* Description */}
      <p className="text-gray-500 max-w-md mx-auto mb-8 font-medium">
        The luxury timepiece you are looking for seems to have moved or does not exist.
      </p>

      {/* Back to Home Button (Using standard <a> to avoid Link error) */}
      <a 
        href="/" 
        className="bg-black text-white px-10 py-4 font-bold uppercase tracking-widest hover:bg-[#D32F2F] transition-colors"
      >
        Return Home
      </a>
    </div>
  );
}