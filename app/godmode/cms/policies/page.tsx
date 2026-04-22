"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Trash2, 
  Save, 
  Search, 
  FileText, 
  Bold, 
  Italic, 
  List, 
  Heading1, 
  Heading2,
  Link as LinkIcon,
  ChevronRight,
  Eye
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PoliciesCMS() {
  const router = useRouter();
  const [policies, setPolicies] = useState<any[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: ''
  });

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await fetch('/api/Godmode/policies');
      const data = await res.json();
      if (data.success) {
        setPolicies(data.data);
      }
    } catch (error) {
      toast.error("Failed to load policies");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPolicy = (policy: any) => {
    setSelectedPolicy(policy);
    setFormData({
      title: policy.title,
      slug: policy.slug,
      content: policy.content
    });
    setIsEditing(true);
    if (editorRef.current) {
      editorRef.current.innerHTML = policy.content;
    }
  };

  const handleCreateNew = () => {
    setSelectedPolicy(null);
    setFormData({ title: '', slug: '', content: '' });
    setIsEditing(true);
    if (editorRef.current) {
      editorRef.current.innerHTML = '';
    }
  };

  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }));
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.slug) {
      toast.error("Title and Slug are required");
      return;
    }

    const content = editorRef.current?.innerHTML || '';
    
    try {
      const res = await fetch('/api/Godmode/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, content })
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Policy saved successfully");
        fetchPolicies();
        setIsEditing(false);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("Failed to save policy");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this policy?")) return;

    // Optimistic UI update
    const previousPolicies = [...policies];
    setPolicies(policies.filter(p => p._id !== id));

    try {
      const res = await fetch(`/api/Godmode/policies?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success("Policy deleted");
        router.refresh();
        if (selectedPolicy?._id === id) setIsEditing(false);
      } else {
        setPolicies(previousPolicies);
        toast.error(data.error || "Delete failed");
      }
    } catch (error) {
      setPolicies(previousPolicies);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-black italic tracking-tighter">Policies CMS</h1>
          <p className="text-gray-500 text-sm mt-1">Manage legal documents and platform protocols.</p>
        </div>
        {!isEditing && (
          <button 
            onClick={handleCreateNew}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg"
          >
            <Plus size={16} /> Create New Policy
          </button>
        )}
      </header>

      {isEditing ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Document Title</label>
                  <input 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="e.g. Privacy Policy"
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-black transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">URL Slug</label>
                  <input 
                    type="text" 
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})}
                    placeholder="privacy-policy"
                    className="w-full bg-gray-50 border border-gray-100 p-4 rounded-2xl outline-none focus:border-black transition-all font-mono text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-2">Content Editor</label>
                <div className="border border-gray-100 rounded-3xl overflow-hidden">
                  <div className="bg-gray-50 p-2 border-b border-gray-100 flex flex-wrap gap-1">
                    <ToolbarButton icon={<Bold size={16}/>} onClick={() => execCommand('bold')} tooltip="Bold" />
                    <ToolbarButton icon={<Italic size={16}/>} onClick={() => execCommand('italic')} tooltip="Italic" />
                    <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
                    <ToolbarButton icon={<Heading1 size={16}/>} onClick={() => execCommand('formatBlock', 'H1')} tooltip="H1" />
                    <ToolbarButton icon={<Heading2 size={16}/>} onClick={() => execCommand('formatBlock', 'H2')} tooltip="H2" />
                    <div className="w-px h-6 bg-gray-200 mx-1 self-center" />
                    <ToolbarButton icon={<List size={16}/>} onClick={() => execCommand('insertUnorderedList')} tooltip="Bullet List" />
                    <ToolbarButton icon={<LinkIcon size={16}/>} onClick={() => {
                      const url = prompt("Enter URL:");
                      if (url) execCommand('createLink', url);
                    }} tooltip="Link" />
                  </div>
                  <div 
                    ref={editorRef}
                    contentEditable
                    className="min-h-[400px] p-8 outline-none prose prose-sm max-w-none focus:bg-white transition-colors"
                    onInput={() => setFormData(prev => ({ ...prev, content: editorRef.current?.innerHTML || '' }))}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm">
              <h3 className="text-lg font-serif font-black italic mb-6">Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={handleSave}
                  className="w-full bg-black text-white p-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-[#D4AF37] hover:text-black transition-all shadow-lg"
                >
                  <Save size={18} /> Save Changes
                </button>
                <button 
                  onClick={() => setIsEditing(false)}
                  className="w-full bg-gray-50 text-gray-500 p-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 hover:bg-gray-100 hover:text-black transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>

            <div className="bg-[#D4AF37]/5 border border-[#D4AF37]/20 rounded-[2rem] p-8">
              <h3 className="text-[#D4AF37] text-[10px] font-black uppercase tracking-widest mb-4">Pro Tip</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Use H1 for section titles and H2 for subsections. This ensures the best experience for your clients in the frontend vault.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-48 bg-white border border-gray-100 rounded-[2rem] animate-pulse" />
            ))
          ) : policies.length > 0 ? (
            policies.map((policy) => (
              <div 
                key={policy._id}
                className="group bg-white border border-gray-200 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:border-black transition-all duration-500 relative flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-gray-50 rounded-2xl text-black group-hover:bg-black group-hover:text-white transition-colors">
                    <FileText size={24} />
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleSelectPolicy(policy)}
                      className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg"
                    >
                      <Eye size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(policy._id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <h3 className="text-xl font-serif font-black italic tracking-tighter mb-2">{policy.title}</h3>
                <p className="text-[10px] font-mono text-gray-400 uppercase tracking-widest">/{policy.slug}</p>
                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    Last Updated: {new Date(policy.lastUpdated).toLocaleDateString()}
                  </span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-black transform translate-x-0 group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center bg-white border border-dashed border-gray-200 rounded-[3rem]">
              <p className="text-gray-400 font-serif italic text-lg">No policies found. Start by creating one.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ToolbarButton({ icon, onClick, tooltip }: any) {
  return (
    <button 
      type="button"
      onMouseDown={(e) => {
        e.preventDefault(); // Prevent focus loss from editor
        onClick();
      }}
      className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-gray-500 hover:text-black"
      title={tooltip}
    >
      {icon}
    </button>
  );
}
