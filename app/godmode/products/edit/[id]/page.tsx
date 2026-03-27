"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, RefreshCcw, ShieldCheck } from 'lucide-react';
import SeoPanel from '@/components/admin/SeoPanel';
import ImageSeoPanel from '@/components/admin/ImageSeoPanel';

export default function EditProductSeoPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params?.id as string;

    const [productData, setProductData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // 1. Fetch the specific product details
    useEffect(() => {
        if (!productId) return;
        const fetchProduct = async () => {
            try {
                // Adjust this endpoint if your fetch single product API is different
                const res = await fetch(`/api/products?id=${productId}`);
                const data = await res.json();
                
                // Handling whether your API returns a single object or an array
                const product = Array.isArray(data.data) 
                    ? data.data.find((p: any) => p._id === productId) 
                    : data.product || data.data;

                if (product) {
                    // Ensure SEO object exists so panels don't crash
                    if (!product.seo) product.seo = { metaTitle: '', metaDescription: '', focusKeyword: '', slug: '', noindex: false, imageAltTexts: {} };
                    setProductData(product);
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    // 2. Save the updated SEO tags to the database
    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ seo: productData.seo })
            });

            if (res.ok) {
                alert("SEO Settings Updated Successfully!");
                router.push('/godmode'); // Send back to Godmode dashboard
            } else {
                alert("Failed to save changes. Make sure your Update API is ready.");
            }
        } catch (error) {
            alert("Network Error!");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="h-screen bg-[#050505] flex items-center justify-center text-[#D4AF37]"><RefreshCcw className="animate-spin" size={30}/></div>;
    if (!productData) return <div className="h-screen bg-[#050505] flex items-center justify-center text-red-500">Product not found.</div>;

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans">
            
            <button onClick={() => router.back()} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white mb-8 transition-colors">
                <ArrowLeft size={16} /> Back to Dashboard
            </button>

            <header className="mb-10 pb-6 border-b border-white/10 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-serif text-white mb-2">Edit Asset: {productData.name}</h1>
                    <p className="text-[10px] uppercase tracking-widest text-gray-500 flex items-center gap-2">
                        <ShieldCheck size={14} className="text-[#D4AF37]"/> ID: {productId}
                    </p>
                </div>
                <button onClick={handleSaveChanges} disabled={isSaving} className="px-8 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-white transition-all flex items-center gap-2 disabled:opacity-50">
                    {isSaving ? <RefreshCcw size={16} className="animate-spin"/> : <Save size={16}/>} Save Changes
                </button>
            </header>

            {/* 🌟 RENDER SEO PANELS HERE 🌟 */}
            <main className="max-w-[1200px] space-y-10">
                <SeoPanel entityData={productData} setEntityData={setProductData} />
                <ImageSeoPanel entityData={productData} setEntityData={setProductData} />
            </main>

        </div>
    );
}