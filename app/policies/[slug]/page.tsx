export default function DynamicPolicyPage({ pageData }) {
  return (
    // 🚨 !bg-[#050505] force karega ki poora page top-to-bottom dark rahe
    <main className="min-h-screen bg-[#050505] !bg-[#050505] w-full pt-32 pb-24 text-[#b3b3b3]">
      
      {/* 🚨 max-w-5xl text ko padhne layak rakhega, par images ko failne ki jagah dega */}
      <div className="w-full max-w-5xl mx-auto px-4 md:px-8">
        
        {/* MAGIC CLASS: luxury-content */}
        <div 
          className="luxury-content w-full" 
          dangerouslySetInnerHTML={{ __html: pageData.content }} 
        />
        
      </div>
    </main>
  );
}