'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, ShoppingCart, ShoppingBag, 
  MapPin, Clock, Star, ShieldCheck, 
  MessageSquare, Heart, AlertCircle, Share, 
  ChevronRight, ArrowRight, Book, Laptop, LampDesk, Verified
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import CampusDropdown from '@/components/CampusDropdown';
import { useSession, signOut } from 'next-auth/react';

export default function ItemDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const id = params?.id;
  
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`http://localhost:5000/api/items/${id}`)
      .then(res => {
        if (!res.ok) {
          setError('Item not found');
          setLoading(false);
          return null;
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          setItem(data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center font-bold text-[#006E17]">
        Loading item details...
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-[#F9F9F9] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-[#1A1C1C] mb-2">Item Not Found</h2>
        <p className="text-[#5f5e5e] mb-6">The listing you are looking for does not exist or has been removed.</p>
        <button onClick={() => router.push('/items')} className="px-6 py-2 bg-[#006E17] text-white rounded-xl font-bold">
          Back to Listings
        </button>
      </div>
    );
  }

  // Parse meta safely
  let meta: any = {};
  if (item.meta) {
    try {
      meta = typeof item.meta === 'string' ? JSON.parse(item.meta) : item.meta;
    } catch (e) {
      console.warn('Meta parsing failed');
    }
  }

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-[#1A1C1C] flex flex-col selection:bg-[#006E17]/20 selection:text-[#006E17]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F9F9F9]/80 backdrop-blur-[20px] pb-3 border-b border-[#E2E2E2]">
        <div className="max-w-7xl mx-auto px-4 pt-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold tracking-tight">Hostel<span className="text-[#BB020C]">OLX</span></Link>
            <div className="hidden md:block">
              <CampusDropdown />
            </div>
          </div>

          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Search size={18} className="text-[#5f5e5e]" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#BCCBB5]/40 rounded-xl focus:outline-none focus:border-[#006E17] transition-colors text-sm shadow-[0_1px_4px_rgba(26,28,28,0.02)] placeholder:text-[#5f5e5e] relative z-20"
                placeholder="Search for cycle, books, mattress..."
                onClick={() => router.push('/items')}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 border-l border-[#E2E2E2] pl-4">
            <button className="bg-[#BB020C] text-white px-5 py-2 rounded-xl font-bold text-sm shadow-[0_4px_12px_rgba(187,2,12,0.2)] hover:-translate-y-0.5 transition-transform">
              Sell
            </button>
            {session?.user ? (
              <button onClick={() => signOut()} className="bg-[#EEEEEE] text-[#1A1C1C] px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#E2E2E2] transition-colors">
                Logout
              </button>
            ) : (
              <Link href="/login" className="bg-[#EEEEEE] text-[#1A1C1C] px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#E2E2E2] transition-colors">
                Login
              </Link>
            )}
            <button className="p-2 text-[#1A1C1C] hover:bg-[#EEEEEE] rounded-xl transition-colors relative">
              <ShoppingCart size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#BB020C] rounded-full"></span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-[#5f5e5e] mb-6 whitespace-nowrap overflow-x-auto no-scrollbar font-medium">
          <Link href="/" className="hover:text-[#006E17] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <Link href="/items" className="hover:text-[#006E17] transition-colors">{item.seller_hostel || 'Hostel'}</Link>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="hover:text-[#006E17] transition-colors cursor-pointer">{item.category}</span>
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="text-[#1A1C1C] truncate">{item.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* LEFT COLUMN - ITEM */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Image Gallery */}
            <div className="relative w-full aspect-square md:aspect-[4/3] bg-white border border-[#EEEEEE] rounded-[24px] overflow-hidden flex items-center justify-center group">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              
              {/* Thumbnails Overlay (Mock since DB only has 1 image) */}
              <div className="absolute bottom-6 left-6 flex gap-3">
                {['Main', 'Back', 'Box'].map((label, idx) => (
                  <button 
                    key={label}
                    onClick={() => setActiveImage(idx)}
                    className={`w-16 h-16 rounded-xl flex items-center justify-center text-xs font-bold transition-all border ${
                      activeImage === idx 
                        ? 'bg-white border-[#006E17] text-[#006E17] shadow-lg scale-105' 
                        : 'bg-white/90 border-[#EEEEEE] text-[#5f5e5e] hover:bg-white'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#d1fae5] text-[#006E17]">
                  {item.type}
                </span>
                <span className="px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#1A1C1C] text-white">
                  {item.condition}
                </span>
                <span className="px-3 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-[#F0EEFF] text-[#5542F6]">
                  {item.category}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-[#1A1C1C]">
                {item.title}
              </h1>

              <div className="flex items-end gap-3 mt-1">
                <div className="text-[40px] leading-none font-black text-[#1A1C1C]">
                  {item.price === 0 ? 'Free' : `₹${item.price}`}
                </div>
                {item.is_negotiable && (
                  <div className="flex flex-col mb-1.5">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#d1fae5] text-[#006E17]">
                      Open to negotiate
                    </span>
                  </div>
                )}
              </div>
              
              <div className="text-sm font-medium text-[#5f5e5e] flex items-center gap-2 mt-4">
                <Clock className="w-4 h-4" /> Posted {(new Date(item.created_at)).toLocaleDateString()} 
                <span className="w-1 h-1 rounded-full bg-[#E2E2E2]"></span> 
                <MapPin className="w-4 h-4 ml-1" /> {item.seller_hostel}
              </div>
            </div>

            {/* Item Details Table */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1C1C] mb-4">Item Details</h3>
              <div className="bg-white border border-[#EEEEEE] rounded-[20px] overflow-hidden shadow-sm">
                <div className="divide-y divide-[#EEEEEE]">
                  {Object.entries({
                    ...(meta.brand && { 'Brand': meta.brand }),
                    ...(meta.model && { 'Model': meta.model }),
                    ...(meta.age && { 'Age': meta.age }),
                    'Condition': <span className="text-[#006E17] font-bold">{item.condition}</span>,
                    ...(meta.includes && { 'Includes': meta.includes }),
                    ...(meta.mrp && { 'MRP': meta.mrp }),
                    'Listing type': item.type,
                    'Hostel': item.seller_hostel,
                    'Listing ID': `#HOLX-${item.id?.toString().padStart(5, '0')}`,
                    'Status': item.status
                  }).map(([key, value], idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center py-4 px-6 hover:bg-[#F9F9F9] transition-colors">
                      <div className="sm:w-1/3 text-sm font-semibold text-[#5f5e5e]">{key}</div>
                      <div className="sm:w-2/3 text-sm font-bold text-[#1A1C1C] mt-1 sm:mt-0">{value as React.ReactNode}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            {(meta.description || item.description) && (
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1C1C] mb-4">Description</h3>
                <div className="bg-white border border-[#EEEEEE] rounded-[20px] p-6 text-sm leading-relaxed text-[#5f5e5e] shadow-sm">
                  {meta.description || item.description}
                </div>
              </div>
            )}

            {/* More from Hostel */}
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#1A1C1C] mb-4">More From {item.seller_hostel}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Micro Item 1 */}
                <div className="group rounded-[16px] border border-[#EEEEEE] bg-white overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                  <div className="h-32 bg-[#F9F9F9] flex items-center justify-center">
                    <Book className="w-8 h-8 text-[#006E17] opacity-60 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-4 border-t border-[#EEEEEE]">
                    <h4 className="text-sm font-bold text-[#1A1C1C] truncate">DS Notes (Han...</h4>
                    <p className="text-xs text-[#5f5e5e] mt-1 font-medium">Free · Lend</p>
                  </div>
                </div>
                {/* Micro Item 2 */}
                <div className="group rounded-[16px] border border-[#EEEEEE] bg-white overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                  <div className="h-32 bg-[#F9F9F9] flex items-center justify-center">
                    <Laptop className="w-8 h-8 text-[#5542F6] opacity-60 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-4 border-t border-[#EEEEEE]">
                    <h4 className="text-sm font-bold text-[#1A1C1C] truncate">Laptop Stand (...</h4>
                    <p className="text-xs text-[#5f5e5e] mt-1 font-medium">₹350 · Sell</p>
                  </div>
                </div>
                {/* Micro Item 3 */}
                <div className="group rounded-[16px] border border-[#EEEEEE] bg-white overflow-hidden hover:shadow-lg transition-all cursor-pointer">
                  <div className="h-32 bg-[#F9F9F9] flex items-center justify-center">
                    <LampDesk className="w-8 h-8 text-[#F59E0B] opacity-60 group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="p-4 border-t border-[#EEEEEE]">
                    <h4 className="text-sm font-bold text-[#1A1C1C] truncate">Table Lamp (L...</h4>
                    <p className="text-xs text-[#5f5e5e] mt-1 font-medium">₹150 · Sell</p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - STICKY SELLER INFO */}
          <div className="lg:col-span-4 relative">
            <div className="sticky top-24 space-y-6">
              
              {/* Seller Card */}
              <div className="bg-white border border-[#EEEEEE] rounded-[24px] p-6 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-[#E0E7FF] text-[#3730A3] font-bold text-xl flex items-center justify-center shrink-0">
                    {item.seller_name ? item.seller_name.substring(0, 2).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1C1C]">{item.seller_name}</h3>
                    <p className="text-sm text-[#5f5e5e] font-medium">{item.year_of_study} · {item.seller_college}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <div className="flex text-[#F59E0B]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.floor(item.trust_score || 0) ? 'fill-current' : 'text-[#EEEEEE]'}`} />
                    ))}
                  </div>
                  <span className="font-bold text-[#1A1C1C]">{item.trust_score || 'N/A'}</span>
                  <span className="text-sm text-[#5f5e5e] font-medium">· {item.deals_count || 0} deals completed</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-[#EEEEEE] text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-[#5f5e5e] font-medium">College</span>
                    <span className="font-bold text-[#1A1C1C] flex items-center gap-1.5">
                      {item.seller_college}
                      {item.verified_at && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wider bg-[#d1fae5] text-[#006E17]">
                          <Verified className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5f5e5e] font-medium">Hostel</span>
                    <span className="font-bold text-[#1A1C1C]">{item.seller_hostel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5f5e5e] font-medium">Member since</span>
                    <span className="font-bold text-[#1A1C1C]">Aug 2023</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#5f5e5e] font-medium">Response rate</span>
                    <span className="font-bold text-[#1A1C1C]">
                      {item.response_time_mins ? `~${Math.round(item.response_time_mins/60)} hrs avg` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button 
                  onClick={() => alert("Message Seller pressed")}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-[#006E17] text-white rounded-[16px] font-extrabold text-[15px] hover:bg-[#005a13] transition-all shadow-[0_4px_12px_rgba(0,110,23,0.2)]"
                >
                  Message Seller <ArrowRight className="w-5 h-5 -rotate-45" />
                </button>
                <button 
                  onClick={() => alert("Save Listing pressed")}
                  className="w-full py-4 bg-white border border-[#E2E2E2] text-[#1A1C1C] rounded-[16px] font-extrabold text-[15px] hover:border-[#006E17] hover:bg-[#F9F9F9] transition-all shadow-sm"
                >
                  Save Listing
                </button>
                <p className="text-center text-xs font-semibold text-[#5f5e5e] pt-1">
                  No phone numbers shared · In-app chat only
                </p>
              </div>

              {/* Quick Replies */}
              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-[#1A1C1C]">Quick replies to send</p>
                <div className="space-y-2">
                  {['Is this still available?', 'Can you negotiate?', 'Meet at common area?'].map(reply => (
                    <button 
                      key={reply}
                      onClick={() => alert(`Sent: ${reply}`)}
                      className="w-full flex items-center justify-between py-3 px-5 bg-white border border-[#EEEEEE] rounded-[16px] text-sm font-bold text-[#1A1C1C] hover:bg-[#F9F9F9] hover:border-[#CCCCCC] transition-colors shadow-sm"
                    >
                      {reply}
                      <ArrowRight className="w-4 h-4 -rotate-45 text-[#A3A3A3]" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Pickup Point */}
              {item.pickup_zone && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#1A1C1C] mb-3">Pickup Point</p>
                  <div className="bg-white border border-[#EEEEEE] p-5 rounded-[20px] shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 w-2.5 h-2.5 rounded-full bg-[#006E17] shrink-0"></div>
                      <div>
                        <h4 className="font-bold text-sm text-[#1A1C1C]">{item.pickup_zone}</h4>
                        <p className="text-xs mt-1 text-[#5f5e5e] font-medium leading-relaxed">
                          Seller prefers meeting in building common area or block corridor
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Warning */}
              {item.expires_at && (
                <div className="bg-white border border-[#EEEEEE] text-[#5f5e5e] p-4 rounded-[16px] flex gap-3 items-start shadow-sm">
                  <div className="mt-0.5 w-2 h-2 rounded-full bg-[#F59E0B] shrink-0"></div>
                  <p className="text-xs font-medium leading-relaxed">
                    Listing auto-expires {new Date(item.expires_at).toLocaleDateString()} · Seller will be notified to renew
                  </p>
                </div>
              )}

              {/* Safety Card */}
              <div className="bg-[#EEFCF4] border border-[#d1fae5] rounded-[24px] p-5 shadow-sm">
                <h4 className="font-bold text-[#006E17] mb-3 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-[#006E17]" />
                  Stay safe on HostelOLX
                </h4>
                <ul className="space-y-2.5">
                  {[
                    'Meet only in hostel common areas',
                    'Inspect item before paying',
                    'Use in-app chat — never share your number',
                    'Rate the deal after completion'
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs font-bold text-[#006E17]/80 leading-relaxed">
                      <svg className="w-4 h-4 text-[#006E17] shrink-0 fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* Footer Details */}
      <footer className="mt-auto bg-white border-t border-[#EEEEEE] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#5f5e5e] text-xs text-center md:text-left font-medium">
              © {new Date().getFullYear()} HostelOLX. Built with ❤️ by students, for students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
