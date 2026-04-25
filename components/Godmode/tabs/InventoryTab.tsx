"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Layout, X, Trash2, Save, ImageIcon, AlignJustify, ShieldCheck } from 'lucide-react';
import SeoPanel from '../SeoPanel';
import ImageSeoPanel from '../ImageSeoPanel';

interface InventoryTabProps {
    categories: string[];
    newCategory: string;
    setNewCategory: (val: string) => void;
    setCategories: (cats: string[]) => void;
    watchForm: any;
    setWatchForm: (form: any) => void;
    handleSaveProduct: () => void;
    liveWatches: any[];
    handleDeleteProduct: (id: string) => void;
    PremiumUploadNode: React.ComponentType<{ placeholder?: string; onUploadSuccess: (url: string) => void }>;
}

export default function InventoryTab({
    categories,
    newCategory,
    setNewCategory,
    setCategories,
    watchForm,
    setWatchForm,
    handleSaveProduct,
    liveWatches,
    handleDeleteProduct,
    PremiumUploadNode,
}: InventoryTabProps) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} key="inv" className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-5 space-y-8 h-max sticky top-0 w-full">

                <div className="bg-[#111] p-6 md:p-8 rounded-[20px] md:rounded-[30px] border border-white/10">
                    <h3 className="text-white text-base md:text-lg font-bold mb-4 flex items-center gap-2"><Layout size={18} className="text-[#D4AF37]" /> Manage Categories</h3>
                    <div className="flex gap-2 md:gap-3 mb-4">
                        <input value={newCategory} onChange={e => setNewCategory(e.target.value)} className="flex-1 min-h-[44px] bg-black border border-white/20 p-3 rounded-xl text-xs md:text-sm text-white outline-none focus:border-[#D4AF37]" placeholder="New category..." />
                        <button onClick={() => { if (newCategory) { setCategories([...categories, newCategory]); setNewCategory(""); } }} className="px-6 min-h-[44px] bg-[#D4AF37] text-black font-bold text-xs rounded-xl hover:bg-white transition-all">Add</button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {categories.map((cat, i) => (
                            <div key={i} className="flex items-center gap-2 bg-black px-3 py-2 rounded-lg border border-white/20">
                                <span className="text-[10px] md:text-xs text-gray-300">{cat}</span>
                                <button onClick={() => setCategories(categories.filter(c => c !== cat))} className="text-red-400 hover:text-red-500 min-h-[44px] min-w-[20px] flex items-center justify-center"><X size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#111] p-6 md:p-8 rounded-[20px] md:rounded-[30px] border border-white/10 shadow-lg relative overflow-hidden">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-6">Add a product</h3>
                    <div className="space-y-4 md:space-y-5 relative z-10">
                        <input value={watchForm.name} onChange={(e) => setWatchForm({ ...watchForm, name: e.target.value })} className="w-full min-h-[44px] bg-black border border-white/20 p-4 rounded-xl text-xs md:text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="Product Name (e.g. Royal Oak)" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                value={watchForm.brand}
                                onChange={(e) => setWatchForm({ ...watchForm, brand: e.target.value })}
                                className="w-full min-h-[44px] bg-black border border-white/20 p-4 rounded-xl text-xs md:text-sm outline-none focus:border-[#D4AF37] text-white"
                                placeholder="Brand Name"
                            />
                            <input
                                value={watchForm.category}
                                onChange={(e) => setWatchForm({ ...watchForm, category: e.target.value })}
                                className="w-full min-h-[44px] bg-black border border-white/20 p-4 rounded-xl text-xs md:text-sm outline-none focus:border-[#D4AF37] text-white"
                                placeholder="Category Name"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div><label className="text-[10px] md:text-xs text-gray-500 mb-1 block">Display Order</label><input type="number" value={watchForm.priority} onChange={(e) => setWatchForm({ ...watchForm, priority: Number(e.target.value) })} className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="100" /></div>
                            <div><label className="text-[10px] md:text-xs text-gray-500 mb-1 block">Product Badge</label><input value={watchForm.badge} onChange={(e) => setWatchForm({ ...watchForm, badge: e.target.value })} className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="e.g. Limited" /></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-white/10 py-5">
                            <div><label className="text-[10px] md:text-xs text-gray-500 mb-1 block">Base Price (₹)</label><input value={watchForm.price} onChange={(e) => setWatchForm({ ...watchForm, price: e.target.value })} type="number" className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm outline-none focus:border-[#D4AF37] text-white" /></div>
                            <div><label className="text-[10px] md:text-xs text-[#00F0FF] mb-1 block">Sale Price (₹)</label><input value={watchForm.offerPrice} onChange={(e) => setWatchForm({ ...watchForm, offerPrice: e.target.value })} type="number" className="w-full min-h-[44px] bg-black border border-[#00F0FF]/30 p-3 rounded-lg text-xs md:text-sm outline-none focus:border-[#00F0FF] text-white" /></div>
                            <div><label className="text-[10px] md:text-xs text-gray-500 mb-1 block">Available Stock</label><input value={watchForm.stock} onChange={(e) => setWatchForm({ ...watchForm, stock: e.target.value })} type="number" className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm outline-none focus:border-[#D4AF37] text-white" /></div>
                        </div>

                        <div className="space-y-6 pt-4 border-t border-white/10">
                            <div className="flex justify-between items-center border-b border-white/10 pb-2">
                                <label className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
                                    <ImageIcon size={16} /> Add photos or video
                                </label>
                            </div>

                            <div className="bg-[#1a1a1a] p-4 md:p-5 rounded-xl border border-white/10 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                                <div className="flex-1 w-full">
                                    <label className="text-[10px] md:text-xs text-gray-400 block mb-4 font-bold uppercase tracking-widest text-center md:text-left">Main Product Image</label>
                                    <div className="flex justify-center md:justify-start">
                                        <PremiumUploadNode
                                            placeholder="Main Image"
                                            onUploadSuccess={(url: string) => setWatchForm({ ...watchForm, imageUrl: url })}
                                        />
                                    </div>
                                </div>
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-2 border-dashed border-white/20 flex items-center justify-center bg-black shrink-0 relative group">
                                    {watchForm.imageUrl ? (
                                        <>
                                            <img src={watchForm.imageUrl} alt="Main Preview" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => setWatchForm({ ...watchForm, imageUrl: '' })}
                                                className="absolute inset-0 bg-red-600/80 text-white opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1 text-[10px] font-bold uppercase min-h-[44px]"
                                            >
                                                <Trash2 size={16} /> Remove
                                            </button>
                                        </>
                                    ) : (
                                        <span className="text-[10px] md:text-xs text-gray-600 font-bold uppercase">No Source</span>
                                    )}
                                </div>
                            </div>

                            <div className="bg-[#1a1a1a] p-4 md:p-5 rounded-xl border border-white/10 w-full overflow-x-auto">
                                <label className="text-[10px] md:text-xs text-gray-400 block mb-4 font-bold uppercase tracking-widest text-center md:text-left">Additional Gallery (Max 6)</label>

                                <div className="flex flex-row md:flex-wrap gap-4 items-center w-max md:w-full pb-2 md:pb-0">
                                    {watchForm.images.filter((img: string) => typeof img === 'string' && img.trim() !== '').map((img: string, i: number) => (
                                        <div key={i} className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden relative group border border-white/20 shadow-lg shrink-0">
                                            <img src={img} className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => setWatchForm({ ...watchForm, images: watchForm.images.filter((_: string, idx: number) => idx !== i) })}
                                                className="absolute top-1 right-1 min-h-[30px] min-w-[30px] flex items-center justify-center bg-red-600 rounded-lg text-white opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={14} />
                                            </button>
                                        </div>
                                    ))}

                                    {watchForm.images.filter((img: string) => typeof img === 'string' && img.trim() !== '').length < 6 && (
                                        <div className="scale-75 md:scale-90 origin-left shrink-0">
                                            <PremiumUploadNode
                                                placeholder="Add Details"
                                                onUploadSuccess={(url: string) => {
                                                    const newGallery = [...watchForm.images.filter((x: string) => typeof x === 'string' && x.trim() !== '')];
                                                    newGallery.push(url);
                                                    setWatchForm({ ...watchForm, images: newGallery });
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                                <div><label className="text-[10px] md:text-xs text-gray-500 mb-1 block">Cinematic Video URL</label><input value={watchForm.videoUrl} onChange={(e) => setWatchForm({ ...watchForm, videoUrl: e.target.value })} className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm outline-none text-white focus:border-[#D4AF37]" placeholder="Paste Video URL" /></div>
                                <div><label className="text-[10px] md:text-xs text-gray-500 mb-1 block">3D Model Link (Optional)</label><input value={watchForm.model3DUrl} onChange={(e) => setWatchForm({ ...watchForm, model3DUrl: e.target.value })} className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm outline-none text-white focus:border-[#D4AF37]" placeholder="Paste 3D File URL" /></div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-white/10 pb-2 gap-2">
                                <label className="text-xs md:text-sm font-bold text-white flex items-center gap-2"><AlignJustify size={16} /> Specifications</label>
                                <button onClick={() => setWatchForm({ ...watchForm, amazonDetails: [...watchForm.amazonDetails, { key: '', value: '' }] })} className="text-[#D4AF37] min-h-[44px] text-[10px] md:text-xs font-bold hover:text-white px-4 py-2 bg-[#D4AF37]/10 rounded-lg transition-colors w-full md:w-auto">+ Add Row</button>
                            </div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar pr-2 w-full overflow-x-hidden">
                                {watchForm.amazonDetails.map((detail: { key: string, value: string }, i: number) => (
                                    <div key={i} className="flex flex-col md:flex-row gap-2 md:gap-3 items-center w-full bg-black/30 p-2 md:p-0 rounded-xl">
                                        <input
                                            value={detail.key}
                                            onChange={e => { const n = [...watchForm.amazonDetails]; n[i].key = e.target.value; setWatchForm({ ...watchForm, amazonDetails: n }); }}
                                            className="w-full md:w-1/3 min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm outline-none focus:border-[#D4AF37] text-white"
                                            placeholder="e.g. Dial Color"
                                        />
                                        <input
                                            value={detail.value}
                                            onChange={e => { const n = [...watchForm.amazonDetails]; n[i].value = e.target.value; setWatchForm({ ...watchForm, amazonDetails: n }); }}
                                            className="w-full md:flex-1 min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm outline-none focus:border-[#D4AF37] text-white"
                                            placeholder="e.g. Matte Black"
                                        />
                                        <button
                                            onClick={() => { const n = watchForm.amazonDetails.filter((_: any, idx: number) => idx !== i); setWatchForm({ ...watchForm, amazonDetails: n }); }}
                                            className="w-full md:w-auto text-red-500 p-3 min-h-[44px] bg-red-500/10 hover:bg-red-500 hover:text-white rounded-lg transition-colors flex justify-center items-center"
                                        >
                                            <X size={16} /> <span className="md:hidden ml-2 text-xs font-bold uppercase">Remove Row</span>
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <label className="text-[10px] md:text-xs text-gray-500 mb-2 block font-bold uppercase tracking-widest">Quick Tags</label>
                                <input value={watchForm.seoTags} onChange={(e) => setWatchForm({ ...watchForm, seoTags: e.target.value })} className="w-full min-h-[44px] bg-black border border-white/20 p-4 rounded-lg text-xs md:text-sm outline-none focus:border-[#D4AF37] text-white" placeholder="luxury, watch, automatic..." />
                            </div>

                            <div>
                                <label className="text-[10px] md:text-xs text-gray-500 mb-2 block font-bold uppercase tracking-widest">Detailed Description</label>
                                <textarea value={watchForm.description} onChange={(e) => setWatchForm({ ...watchForm, description: e.target.value })} rows={4} className="w-full bg-black border border-white/20 p-4 rounded-xl text-xs md:text-sm outline-none focus:border-[#D4AF37] text-white custom-scrollbar leading-relaxed" placeholder="Describe the masterpiece..." />
                            </div>
                        </div>

                        <div className="mt-8 p-4 md:p-6 bg-black/40 border border-[#D4AF37]/30 rounded-2xl shadow-inner relative overflow-hidden">
                            <div className="absolute -right-10 -top-10 opacity-5 pointer-events-none"><ShieldCheck size={120} className="text-[#D4AF37]" /></div>
                            <h3 className="text-base md:text-lg font-serif font-bold mb-4 md:mb-6 flex items-center gap-2 text-white relative z-10">
                                <ShieldCheck size={20} className="text-[#D4AF37]" /> Price and VIP code
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 relative z-10">
                                <div className="p-3 md:p-4 bg-black rounded-xl border border-white/10">
                                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex justify-between">
                                        VIP product code <span className="text-gray-500 font-mono">(optional)</span>
                                    </label>
                                    <input value={watchForm.vipVaultKey} onChange={(e) => setWatchForm({ ...watchForm, vipVaultKey: e.target.value.toUpperCase() })} className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm font-mono outline-none focus:border-[#D4AF37] uppercase text-[#D4AF37]" placeholder="e.g. ROLEXVIP" />
                                </div>
                                <div className="p-3 md:p-4 bg-black rounded-xl border border-white/10">
                                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">VIP discount (₹)</label>
                                    <input type="number" value={watchForm.vipDiscount} onChange={(e) => setWatchForm({ ...watchForm, vipDiscount: e.target.value })} className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm font-mono outline-none focus:border-[#D4AF37] text-white" placeholder="5000" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
                                <div className="p-3 md:p-4 bg-black rounded-xl border border-white/10">
                                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Transit Fee (₹)</label>
                                    <input type="number" value={watchForm.transitFee} onChange={(e) => setWatchForm({ ...watchForm, transitFee: e.target.value })} className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm font-mono outline-none focus:border-[#D4AF37] text-white" placeholder="0 for Free" />
                                </div>
                                <div className="p-3 md:p-4 bg-black rounded-xl border border-white/10">
                                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block">Tax Bracket (GST %)</label>
                                    <select value={watchForm.taxPercentage} onChange={(e) => setWatchForm({ ...watchForm, taxPercentage: e.target.value })} className="w-full min-h-[44px] bg-black border border-white/20 p-3 rounded-lg text-xs md:text-sm font-mono outline-none focus:border-[#D4AF37] text-white appearance-none">
                                        <option className="bg-black" value="0">0% (Exempt)</option>
                                        <option className="bg-black" value="3">3% (Bullion)</option>
                                        <option className="bg-black" value="12">12%</option>
                                        <option className="bg-black" value="18">18% (Standard)</option>
                                        <option className="bg-black" value="28">28% (Luxury)</option>
                                    </select>
                                </div>
                                <div className="p-3 md:p-4 bg-black rounded-xl border border-white/10 flex flex-col justify-center items-center cursor-pointer transition-all hover:border-[#D4AF37]/50" onClick={() => setWatchForm({ ...watchForm, taxInclusive: !watchForm.taxInclusive })}>
                                    <label className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 block text-center">Tax Configuration</label>
                                    <div className={`px-2 py-3 md:py-2 min-h-[44px] flex items-center justify-center rounded-lg text-[9px] font-bold uppercase tracking-widest transition-colors w-full text-center ${watchForm.taxInclusive ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                        {watchForm.taxInclusive ? 'Inclusive' : 'Exclusive'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10 space-y-8 w-full overflow-hidden">
                            <SeoPanel entityData={watchForm} setEntityData={setWatchForm} />
                            <ImageSeoPanel entityData={watchForm} setEntityData={setWatchForm} />
                        </div>

                        <button onClick={handleSaveProduct} className="w-full py-4 md:py-5 min-h-[50px] bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-all mt-4 flex justify-center items-center gap-2 text-xs md:text-sm"><Save size={18} /> Push to Live Inventory</button>
                    </div>
                </div>
            </div>

            <div className="xl:col-span-7 w-full max-w-[100vw]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/10 pb-4 gap-3">
                    <h3 className="text-xl md:text-2xl font-serif text-white">Live Assets</h3>
                    <span className="text-[10px] md:text-xs font-bold bg-[#D4AF37]/20 text-[#D4AF37] px-4 py-2 rounded-lg">{liveWatches.length} Active</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 pb-20 w-full">
                    {liveWatches.length === 0 ? <p className="col-span-1 md:col-span-2 text-center text-gray-600 py-20 font-bold uppercase tracking-widest text-xs md:text-sm">No products yet</p> : liveWatches.map((watch: any, idx: number) => (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} key={watch._id || idx} className="bg-[#111] p-4 md:p-6 rounded-[20px] border border-white/10 flex flex-col justify-between group hover:border-[#D4AF37]/50 transition-all shadow-lg relative overflow-hidden w-full">
                            <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-20">
                                {watch.badge && <span className="bg-[#D4AF37] text-black text-[8px] md:text-[10px] font-bold px-2 py-1 rounded uppercase">{watch.badge}</span>}
                                {watch.stock < 3 && <span className="bg-red-500 text-white text-[8px] md:text-[10px] font-bold px-2 py-1 rounded uppercase">Low: {watch.stock}</span>}
                            </div>
                            <div className="h-40 md:h-48 bg-black rounded-xl flex items-center justify-center p-4 relative mb-4 border border-white/10 w-full">
                                <img src={watch.imageUrl || (watch.images && watch.images[0])} className="h-full w-full object-contain transition-transform group-hover:scale-105 duration-500" />
                            </div>
                            <div className="flex-1 flex flex-col w-full">
                                <p className="text-[10px] md:text-xs text-[#D4AF37] font-bold uppercase mb-1">{watch.brand}</p>
                                <h4 className="text-base md:text-lg font-bold text-white mb-2 line-clamp-1">{watch.name}</h4>
                                <div className="flex justify-between items-end border-t border-white/10 pt-4 mt-auto">
                                    <div><p className="text-[10px] md:text-xs text-gray-500 mb-1">Price</p><p className="text-lg md:text-xl font-bold text-green-400">₹{Number(watch.offerPrice || watch.price).toLocaleString('en-IN')}</p></div>
                                    <button onClick={() => handleDeleteProduct(watch._id)} className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center bg-red-500/20 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}