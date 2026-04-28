'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, MapPin, Search, Plus, Trash2, Edit, ChevronRight } from 'lucide-react';
import CampusDropdown from '@/components/CampusDropdown';

export default function ProfileDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    if (status === 'authenticated') {
      fetchUserItems();
    }
  }, [status, router]);

  const fetchUserItems = async () => {
    try {
      const token = (session?.user as any)?.backendToken;
      const res = await fetch('http://localhost:5000/api/users/me/items', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setItems(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing permanently?')) return;
    try {
      const token = (session?.user as any)?.backendToken;
      const res = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        setItems(prev => prev.filter(item => item.id !== id));
      } else {
        alert('Failed to delete item.');
      }
    } catch (e) {
      console.error(e);
      alert('An error occurred.');
    }
  };

  if (status === 'loading' || loading) {
    return <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center font-bold">Loading dashboard...</div>;
  }

  if (status === 'unauthenticated') return null;

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-[#1A1C1C]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#F9F9F9]/80 backdrop-blur-[20px] pb-3 border-b border-[#E2E2E2]">
        <div className="max-w-7xl mx-auto px-4 pt-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold tracking-tight">Hostel<span className="text-[#BB020C]">OLX</span></Link>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/" className="text-sm font-bold text-[#5f5e5e] hover:text-[#1A1C1C] transition-colors">Home</Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto w-full px-4 py-8">
        
        {/* Profile Card */}
        <div className="bg-white p-6 rounded-[24px] border border-[#EEEEEE] shadow-sm flex flex-col md:flex-row items-center gap-6 mb-8">
           <div className="w-20 h-20 rounded-full bg-[#E0E7FF] text-[#3730A3] font-bold text-3xl flex items-center justify-center shrink-0">
             {session?.user?.name ? session.user.name.substring(0, 2).toUpperCase() : 'U'}
           </div>
           <div className="text-center md:text-left flex-1">
             <h1 className="text-2xl font-extrabold text-[#1A1C1C]">{session?.user?.name}</h1>
             <p className="text-[#5f5e5e] font-medium">{session?.user?.email}</p>
           </div>
           <div className="flex gap-4 w-full md:w-auto">
             <div className="bg-[#F9F9F9] p-4 rounded-xl flex-1 md:w-32 text-center border border-[#EEEEEE]">
               <h3 className="text-2xl font-black text-[#006E17]">{items.length}</h3>
               <p className="text-xs uppercase font-bold tracking-wider text-[#5f5e5e] mt-1">Active Ads</p>
             </div>
           </div>
        </div>

        {/* Listings Section */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#1A1C1C]">My Listings</h2>
          <Link href="/sell" className="flex items-center gap-2 bg-[#BB020C] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-[0_4px_12px_rgba(187,2,12,0.2)] hover:-translate-y-0.5 transition-transform">
             <Plus className="w-4 h-4" /> Post Ad
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="bg-white border border-[#EEEEEE] rounded-[24px] py-16 flex flex-col items-center justify-center shadow-sm">
             <Package className="w-12 h-12 text-[#CCCCCC] mb-4" />
             <h3 className="text-[#1A1C1C] font-bold text-lg">No listings yet</h3>
             <p className="text-[#5f5e5e] text-sm mt-1 mb-6">You haven't posted anything for sale.</p>
             <Link href="/sell" className="px-6 py-2.5 bg-[#006E17] text-white font-bold rounded-xl text-sm">
               Start Selling
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item, idx) => (
              <div key={idx} className="bg-white border border-[#EEEEEE] rounded-[20px] p-4 flex gap-4 hover:shadow-md transition-shadow">
                 <Link href={`/items/${item.id}`} className="flex-1 flex gap-4">
                   <div className="w-24 h-24 rounded-xl bg-[#F9F9F9] overflow-hidden shrink-0 border border-[#E2E2E2]">
                     <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 flex flex-col pt-1">
                     <div className="flex justify-between items-start">
                       <div>
                         <span className="text-[10px] uppercase font-bold tracking-wider text-[#5f5e5e]">{item.category}</span>
                         <h3 className="font-bold text-[#1A1C1C] text-base leading-tight mt-0.5 line-clamp-1 group-hover:text-[#006E17] transition-colors">{item.title}</h3>
                       </div>
                       <span className="font-black text-[#1A1C1C]">₹{item.price}</span>
                     </div>
                   </div>
                 </Link>
                   
                 <div className="pt-4 flex gap-2 border-t border-[#EEEEEE] mt-3">
                   <Link href={`/edit/${item.id}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#F9F9F9] border border-[#EEEEEE] text-[#1A1C1C] font-bold text-xs rounded-lg hover:bg-[#E2E2E2] transition-colors">
                     <Edit className="w-3.5 h-3.5" /> Edit
                   </Link>
                   <button onClick={() => deleteItem(String(item.id))} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#BB020C]/10 border border-[#BB020C]/20 text-[#BB020C] font-bold text-xs rounded-lg hover:bg-[#BB020C] hover:text-white transition-colors">
                     <Trash2 className="w-3.5 h-3.5" /> Delete
                   </button>
                 </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}
