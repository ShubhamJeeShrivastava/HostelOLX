'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, ShoppingCart, User, ChevronDown, Bookmark, ShieldCheck, HelpCircle, PhoneCall, Mail, Camera, Handshake } from 'lucide-react';
import Link from 'next/link';
import CampusDropdown from '@/components/CampusDropdown';

export default function Home() {
  const [items, setItems] = useState<{ id: number; title: string; condition: string; price: number; originalPrice: number; discount: string; image: string; seller: string; tag: string; }[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => {
        console.warn('Backend not detected, falling back to mock UI data.');
        // Fallback to mock data if backend is not running
        setItems([
          {
            id: 1,
            title: 'Single Bed Mattress',
            condition: 'Used - Good',
            price: 800,
            originalPrice: 2500,
            discount: '70% OFF',
            image: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
            seller: 'Rahul (3rd Year)',
            tag: 'Har Din Sasta!'
          },
          {
            id: 2,
            title: 'Hero Cycle',
            condition: 'Like New',
            price: 1500,
            originalPrice: 3500,
            discount: '40% OFF',
            image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
            seller: 'Priya (4th Year)',
            tag: 'Add'
          },
          {
            id: 3,
            title: 'Engineering Physics',
            condition: 'New',
            price: 250,
            originalPrice: 500,
            discount: '50% OFF',
            image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60',
            seller: 'Amit (2nd Year)',
            tag: 'Har Din Sasta!'
          }
        ]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-[#1A1C1C]">
      {/* Header - Zepto Style */}
      <header className="sticky top-0 z-50 bg-[#F9F9F9]/80 backdrop-blur-[20px] pb-3 border-b border-[#E2E2E2]">
        <div className="max-w-7xl mx-auto px-4 pt-4 flex items-center justify-between gap-6">
          {/* Logo & Location */}
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold text-[#006E17] tracking-tight">HostelOLX</h1>
            
            <div className="hidden md:block">
              <CampusDropdown />
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-[#5f5e5e]" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#BCCBB5]/40 rounded-xl focus:outline-none focus:border-[#006E17] transition-colors text-sm shadow-[0_1px_4px_rgba(26,28,28,0.02)] placeholder:text-[#5f5e5e]"
                placeholder="Search for cycle, books, mattress..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 border-l border-[#E2E2E2] pl-4">
            <button className="bg-[#BB020C] text-white px-5 py-2 rounded-xl font-bold text-sm shadow-[0_4px_12px_rgba(187,2,12,0.2)] hover:-translate-y-0.5 transition-transform">
              Sell
            </button>
            <Link href="/login" className="bg-[#EEEEEE] text-[#1A1C1C] px-4 py-2 rounded-xl font-bold text-sm hover:bg-[#E2E2E2] transition-colors">
              Login
            </Link>
            <button className="p-2 text-[#1A1C1C] hover:bg-[#EEEEEE] rounded-xl transition-colors relative">
              <ShoppingCart size={22} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#BB020C] rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 mt-4 flex items-center gap-8 overflow-x-auto no-scrollbar">
          {['All Categories', 'Buy', 'Rent', 'Lend'].map((tab, idx) => (
            <button
              key={tab}
              className={`pb-2 text-sm font-semibold whitespace-nowrap ${
                idx === 0
                  ? 'text-[#006E17] border-b-2 border-[#006E17]'
                  : 'text-[#5f5e5e] hover:text-[#1A1C1C]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-16 sm:py-24 px-4 shadow-[0_2px_8px_rgba(26,28,28,0.02)] relative overflow-hidden">
        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-[#2ECC40]/10 rounded-full blur-[80px]"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 bg-[#F3F3F3] text-[#006E17] text-xs font-bold uppercase tracking-wider rounded-full mb-6 border border-[#BCCBB5]/30">
            For BITS Pilani
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 text-[#1A1C1C]">
            Bech de, <span className="text-[#006E17]">apno ke beech</span>
          </h2>
          <p className="text-lg md:text-xl text-[#3d4a3a] max-w-2xl mx-auto font-medium">
            The closed college marketplace. Strictly within your hostel. No outsiders, no noise.
          </p>
        </div>
      </section>

      {/* Main content grid */}
      <main className="max-w-7xl mx-auto px-4 pt-16 pb-12">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold">Trending in your campus</h3>
          <button className="text-[#006E17] font-semibold text-sm hover:underline">View All</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-[0_4px_16px_rgba(26,28,28,0.04)] border border-[#EEEEEE] group hover:border-[#BCCBB5]/50 transition-colors"
            >
              {/* Image Container */}
              <div className="relative w-full aspect-[4/3] rounded-lg mb-4 bg-[#F3F3F3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-0 left-0 bg-[#2ECC40] text-white text-[10px] font-bold px-2 py-1 rounded-br-lg rounded-tl-lg shadow-sm">
                  {item.discount}
                </div>
              </div>

              {/* Card Meta */}
              <div className="flex justify-between items-start mb-2">
                <span className="text-[11px] font-bold text-[#006E17] uppercase tracking-wider bg-[#F3F3F3] px-2 py-0.5 rounded-md">
                  {item.condition}
                </span>
                <button className="text-[#b3b1b0] hover:text-[#BB020C] transition-colors">
                  <Bookmark size={18} />
                </button>
              </div>

              <h4 className="font-semibold text-[15px] mb-1 line-clamp-1">{item.title}</h4>
              <p className="text-xs text-[#5f5e5e] mb-3 flex flex-col gap-0.5">
                <span>By {item.seller}</span>
              </p>

              {/* Price & Action */}
              <div className="flex items-end justify-between mt-auto">
                <div className="flex flex-col">
                  <span className="text-xs text-[#b3b1b0] line-through font-medium">₹{item.originalPrice}</span>
                  <span className="text-lg font-bold text-[#1A1C1C]">₹{item.price}</span>
                </div>
                
                <button className="bg-gradient-to-r from-[#006E17] to-[#2ECC40] text-white font-bold text-sm px-5 py-1.5 rounded-full border border-[#BB020C]/20 shadow-[0_2px_8px_rgba(0,110,23,0.2)] hover:shadow-[0_4px_12px_rgba(0,110,23,0.3)] transition-all">
                  {item.tag}
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* How It Works Section */}
      <section className="bg-[#F3F3F3] lg:bg-transparent py-12 border-t border-[#EEEEEE]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-[#1A1C1C]">How HostelOLX Works</h3>
            <p className="text-[#5f5e5e] mt-2 max-w-xl mx-auto">Built for students, simplifying campus life in 3 strict, secure, and hassle-free steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {[
              {
                icon: <Mail size={32} className="text-[#006E17]" />,
                title: "1. Verify Your College",
                desc: "Sign up using your college email id. This keeps the marketplace strictly exclusive and safe for your campus peers."
              },
              {
                icon: <Camera size={32} className="text-[#006E17]" />,
                title: "2. Snap & List",
                desc: "Sell, rent, or lend your existing items in seconds. Provide standard details like condition and set a fair price."
              },
              {
                icon: <Handshake size={32} className="text-[#006E17]" />,
                title: "3. Meet Safely",
                desc: "Negotiate securely and meet up right at your hostel common room or campus cafe to finalize the exchange."
              }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center p-8 bg-white rounded-3xl border border-[#EEEEEE] shadow-[0_4px_16px_rgba(26,28,28,0.03)] hover:-translate-y-1 transition-transform">
                <div className="w-16 h-16 rounded-2xl bg-[#006E17]/10 flex items-center justify-center mb-6">
                  {step.icon}
                </div>
                <h4 className="text-lg font-bold mb-3 text-[#1A1C1C]">{step.title}</h4>
                <p className="text-sm text-[#5f5e5e] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#EEEEEE] mt-12">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-2xl font-bold text-[#006E17] tracking-tight mb-4">HostelOLX</h1>
            <p className="text-sm text-[#5f5e5e] max-w-sm mb-6 leading-relaxed">
              We started with a simple belief: students shouldn't have to deal with strangers, haggling, and scams across the city just to buy a used mattress. Keep it in the campus. Keep it safe.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Trust & Safety</h4>
            <ul className="space-y-3 text-sm text-[#5f5e5e]">
              <li><Link href="/trust-safety/verification-process" className="flex w-fit items-center gap-2 hover:text-[#1A1C1C] transition-colors"><ShieldCheck size={16} /> Verification Process</Link></li>
              <li><Link href="/trust-safety/buyer-protection" className="flex w-fit items-center gap-2 hover:text-[#1A1C1C] transition-colors"><HelpCircle size={16} /> Buyer Protection</Link></li>
              <li><Link href="/trust-safety/contact-support" className="flex w-fit items-center gap-2 hover:text-[#1A1C1C] transition-colors"><PhoneCall size={16} /> Contact Support</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-[#5f5e5e]">
              <li><Link href="/legal/terms-of-service" className="hover:text-[#1A1C1C] transition-colors inline-block w-fit">Terms of Service</Link></li>
              <li><Link href="/legal/privacy-policy" className="hover:text-[#1A1C1C] transition-colors inline-block w-fit">Privacy Policy</Link></li>
              <li><Link href="/legal/campus-guidelines" className="hover:text-[#1A1C1C] transition-colors inline-block w-fit">Campus Guidelines</Link></li>
            </ul>
          </div>
        </div>
        <div className="bg-[#F3F3F3] text-center py-4 text-xs text-[#5f5e5e] font-medium">
          © {new Date().getFullYear()} HostelOLX. Built by students, for students.
        </div>
      </footer>
    </div>
  );
}
