'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Camera, Trash, ArrowRight, Info, MapPin } from 'lucide-react';

const CATEGORIES = [
  'Electronics', 'Cycles & Transport', 'Books & Notes', 
  'Room Essentials', 'Furniture & Appliances', 'Clothing & Gear', 
  'Stationery', 'Others'
];
const CONDITIONS = ['New', 'Like New', 'Good', 'Fair', 'Needs Repair'];
const TYPES = ['Sell', 'Rent', 'Lend'];

export default function EditPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;

  const [formData, setFormData] = useState({
    title: '',
    price: '',
    condition: 'Good',
    category: 'Electronics',
    type: 'Sell',
    is_negotiable: false,
    description: ''
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorLine, setErrorLine] = useState('');

  // Protect route & fetch target data
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    if (status === 'authenticated' && id) {
       fetchItem();
    }
  }, [status, router, id]);

  const fetchItem = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/items/${id}`);
      if (!res.ok) throw new Error('Item not found');
      const data = await res.json();
      
      let metaDesc = '';
      if (data.meta) {
         try {
           const parsed = typeof data.meta === 'string' ? JSON.parse(data.meta) : data.meta;
           metaDesc = parsed.description || '';
         } catch(e){}
      }

      setFormData({
        title: data.title,
        price: data.price.toString(),
        condition: data.condition,
        category: data.category,
        type: data.type,
        is_negotiable: data.is_negotiable,
        description: metaDesc
      });
      setImagePreview(data.image);
    } catch (e) {
      console.error(e);
      setErrorLine('Unable to find this item.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const checked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      setErrorLine('Please fill out the required fields.');
      return;
    }
    
    setIsSubmitting(true);
    setErrorLine('');

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('price', formData.price);
    submitData.append('condition', formData.condition);
    submitData.append('category', formData.category);
    submitData.append('type', formData.type);
    submitData.append('is_negotiable', String(formData.is_negotiable));
    submitData.append('description', formData.description);
    
    if (imageFile) {
      submitData.append('images', imageFile);
    }

    try {
      const token = (session?.user as any)?.backendToken;
      const res = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to update listing');
      }

      router.push('/profile');
    } catch (err: any) {
      setErrorLine(err.message || 'An error occurred while updating your listing.');
      setIsSubmitting(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center font-bold">Loading...</div>;
  }

  if (status === 'unauthenticated') return null;

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-[#1A1C1C]">
      <header className="sticky top-0 z-50 bg-[#F9F9F9]/80 backdrop-blur-[20px] pb-3 border-b border-[#E2E2E2]">
        <div className="max-w-7xl mx-auto px-4 pt-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold tracking-tight">Hostel<span className="text-[#BB020C]">OLX</span></Link>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/profile" className="text-sm font-bold text-[#5f5e5e] hover:text-[#1A1C1C] transition-colors">Cancel</Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto w-full px-4 py-8">
        <h1 className="text-3xl font-extrabold text-[#1A1C1C] mb-8">Edit your Ad</h1>

        {errorLine && (
           <div className="mb-6 p-4 rounded-xl bg-[#BB020C]/10 text-[#BB020C] font-semibold text-sm border border-[#BB020C]/20 flex items-start gap-2">
             <Info className="w-5 h-5 shrink-0" />
             {errorLine}
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-6 rounded-[24px] border border-[#EEEEEE] shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#1A1C1C] border-b border-[#EEEEEE] pb-4">Include some Details</h2>
            
            <div>
              <label className="block text-sm font-bold text-[#1A1C1C] mb-2">Ad Title *</label>
              <input 
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={70}
                required
                className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#E2E2E2] rounded-xl focus:outline-none focus:border-[#006E17] transition-colors text-sm"
              />
              <p className="text-xs text-[#5f5e5e] font-medium mt-1 text-right">{formData.title.length} / 70</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A1C1C] mb-2">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={4000}
                rows={4}
                className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#E2E2E2] rounded-xl focus:outline-none focus:border-[#006E17] transition-colors text-sm resize-none"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-[#1A1C1C] mb-2">Category *</label>
                <select name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#E2E2E2] rounded-xl focus:outline-none focus:border-[#006E17] transition-colors text-sm appearance-none font-medium">
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#1A1C1C] mb-2">Condition *</label>
                <select name="condition" value={formData.condition} onChange={handleChange} className="w-full px-4 py-3 bg-[#F9F9F9] border border-[#E2E2E2] rounded-xl focus:outline-none focus:border-[#006E17] transition-colors text-sm appearance-none font-medium">
                  {CONDITIONS.map(cond => (
                    <option key={cond} value={cond}>{cond}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1A1C1C] mb-2">Listing Type *</label>
              <div className="flex flex-wrap gap-3">
                {TYPES.map(type => (
                  <button 
                    key={type}
                    type="button"
                    onClick={() => setFormData(prev => ({...prev, type}))}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all border ${
                      formData.type === type 
                        ? 'bg-[#d1fae5] border-[#006E17] text-[#006E17]' 
                        : 'bg-white border-[#E2E2E2] text-[#5f5e5e] hover:border-[#CCCCCC]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-[#EEEEEE] shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-[#1A1C1C] border-b border-[#EEEEEE] pb-4">Set a Price</h2>
            <div className="relative max-w-sm">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1A1C1C] border-r border-[#E2E2E2] pr-3 font-bold">₹</span>
              <input 
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full pl-14 pr-4 py-3 bg-[#F9F9F9] border border-[#E2E2E2] rounded-xl focus:outline-none focus:border-[#006E17] transition-colors text-sm font-bold"
              />
            </div>
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <input 
                type="checkbox" 
                name="is_negotiable"
                checked={formData.is_negotiable} 
                onChange={handleChange}
                className="w-4 h-4 rounded text-[#006E17] border-[#E2E2E2] focus:ring-[#006E17]" 
              />
              <span className="text-sm font-bold text-[#1A1C1C]">Price is negotiable</span>
            </label>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-[#EEEEEE] shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-[#1A1C1C] border-b border-[#EEEEEE] pb-4">Upload a Photo</h2>
            {imagePreview ? (
              <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-[#E2E2E2] group">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={removeImage}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#BB020C] hover:scale-110 transition-transform">
                    <Trash className="w-4 h-4" />
                  </div>
                </button>
              </div>
            ) : (
               <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#E2E2E2] bg-[#F9F9F9] hover:bg-[#F2F2F2] transition-colors rounded-2xl cursor-pointer">
                 <div className="flex flex-col items-center justify-center pt-5 pb-6">
                   <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm text-[#006E17]">
                     <Camera className="w-5 h-5" />
                   </div>
                   <p className="mb-1 text-sm font-bold text-[#1A1C1C]">Click to upload new photo</p>
                 </div>
                 <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleImageChange} />
               </label>
            )}
          </div>

          <div className="pt-6 border-t border-[#E2E2E2] flex items-center justify-end gap-4">
             <Link href="/profile">
               <button type="button" className="px-6 py-3 rounded-xl font-bold text-sm text-[#1A1C1C] hover:bg-[#EEEEEE] transition-colors">
                 Discard
               </button>
             </Link>
             <button 
               type="submit" 
               disabled={isSubmitting}
               className="px-8 py-3 rounded-xl font-extrabold text-sm text-white bg-[#006E17] hover:bg-[#005a13] shadow-[0_4px_12px_rgba(0,110,23,0.2)] hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
             >
               {isSubmitting ? 'Updating...' : 'Update Ad'}
             </button>
          </div>
        </form>
      </main>
    </div>
  );
}
