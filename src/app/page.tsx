'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, ShoppingCart, User, ChevronDown, Bookmark, ShieldCheck, 
  HelpCircle, PhoneCall, Mail, Camera, Handshake, Book, Laptop, Sofa, Bike, 
  Shirt, PenTool, Home, MoreHorizontal, Sparkles, ArrowRight, MessageSquare, 
  ShoppingBag, Clock
} from 'lucide-react';
import Link from 'next/link';
import CampusDropdown from '@/components/CampusDropdown';

const CATEGORIES = [
  'All',
  'Books & Notes',
  'Electronics',
  'Furniture & Appliances',
  'Cycles & Transport',
  'Clothing & Gear',
  'Stationery',
  'Room Essentials',
];

export default function HomePage() {
  const [items, setItems] = useState<{ id: string; title: string; condition: string; price: number; image: string; sellerHostel: string; postedAt: string; type: string; category?: string; }[]>([]);
  const [isCategoryDockCompact, setIsCategoryDockCompact] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>('All');

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        setIsCategoryDockCompact(window.scrollY > 160);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/items')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => {
        console.warn('Backend not detected, falling back to mock UI data.');
        setItems([
          {
            id: '1',
            title: 'Engineering Physics Textbook',
            price: 250,
            condition: 'Good',
            image: 'https://picsum.photos/seed/book1/400/400',
            sellerHostel: 'Hostel A',
            postedAt: '2 hours ago',
            type: 'Sell',
            category: 'Books & Notes',
          },
          {
            id: '2',
            title: 'Electric Kettle - 1.5L',
            price: 600,
            condition: 'Like New',
            image: 'https://picsum.photos/seed/kettle/400/400',
            sellerHostel: 'Hostel B',
            postedAt: '5 hours ago',
            type: 'Sell',
            category: 'Electronics',
          },
          {
            id: '3',
            title: 'Study Table Lamp',
            price: 150,
            condition: 'Fair',
            image: 'https://picsum.photos/seed/lamp/400/400',
            sellerHostel: 'Hostel A',
            postedAt: '1 day ago',
            type: 'Sell',
            category: 'Room Essentials',
          },
          {
            id: '4',
            title: 'Bicycle for Semester',
            price: 500,
            condition: 'Good',
            image: 'https://picsum.photos/seed/bike/400/400',
            sellerHostel: 'Hostel C',
            postedAt: '3 hours ago',
            type: 'Rent',
            category: 'Cycles & Transport',
          },
          {
            id: '5',
            title: 'Scientific Calculator (FX-991EX)',
            price: 800,
            condition: 'Like New',
            image: 'https://picsum.photos/seed/calc/400/400',
            sellerHostel: 'Hostel B',
            postedAt: '10 mins ago',
            type: 'Sell',
            category: 'Electronics',
          },
          {
            id: '6',
            title: 'Lab Coat - Size L',
            price: 200,
            condition: 'Good',
            image: 'https://picsum.photos/seed/coat/400/400',
            sellerHostel: 'Hostel A',
            postedAt: '6 hours ago',
            type: 'Sell',
            category: 'Clothing & Gear',
          },
          {
            id: '7',
            title: 'Dumbbells Set (5kg x 2)',
            price: 400,
            condition: 'Good',
            image: 'https://picsum.photos/seed/gym/400/400',
            sellerHostel: 'Hostel D',
            postedAt: '12 hours ago',
            type: 'Sell',
            category: 'Clothing & Gear',
          },
          {
            id: '8',
            title: 'Data Structures Notes (Handwritten)',
            price: 0,
            condition: 'Good',
            image: 'https://picsum.photos/seed/notes/400/400',
            sellerHostel: 'Hostel B',
            postedAt: '1 hour ago',
            type: 'Lend',
            category: 'Books & Notes',
          },
        ]);
      });
  }, []);

  const CATEGORY_ICON_COMPONENTS: Record<string, React.ElementType> = {
    'All': Sparkles,
    'Books & Notes': Book,
    'Electronics': Laptop,
    'Furniture & Appliances': Sofa,
    'Cycles & Transport': Bike,
    'Clothing & Gear': Shirt,
    'Stationery': PenTool,
    'Room Essentials': Home,
  };

  const CATEGORY_SHORT_LABEL: Record<(typeof CATEGORIES)[number], string> = {
    All: 'All',
    'Books & Notes': 'Books',
    Electronics: 'Electro',
    'Furniture & Appliances': 'Furni',
    'Cycles & Transport': 'Cycles',
    'Clothing & Gear': 'Cloth',
    Stationery: 'Statn',
    'Room Essentials': 'Room',
  };

  const visibleItems =
    selectedCategory === 'All'
      ? items
      : items.filter((p) => (p.category ? p.category === selectedCategory : true));

  const STEPS = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Verify with College Email',
      description: 'Sign up using your .ac.in or .edu.in email to join your hostel community.',
      color: 'bg-[#006E17]/10 text-[#006E17]',
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: 'Browse Trusted Listings',
      description: 'See items only from verified residents of your hostel. No outside noise.',
      color: 'bg-[#006E17]/10 text-[#006E17]',
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: 'Chat & Negotiate',
      description: 'In-app chat keeps your phone number private. Quick, safe communication.',
      color: 'bg-[#006E17]/10 text-[#006E17]',
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      title: 'Meet & Deal',
      description: 'Meet at a safe campus spot like the mess or common area to finish the deal.',
      color: 'bg-[#006E17]/10 text-[#006E17]',
    },
  ];

  const getTypeStyle = (type: string | undefined) => {
    // Mapped completely to green per user request
    switch (type) {
      case 'Sell': return 'bg-[#d1fae5] text-[#006E17]'; // Emerald 100 bg
      case 'Rent': return 'bg-[#d1fae5] text-[#006E17]';
      case 'Lend': return 'bg-[#d1fae5] text-[#006E17]';
      case 'Want': return 'bg-[#d1fae5] text-[#006E17]';
      default: return 'bg-[#d1fae5] text-[#006E17]';
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-[#1A1C1C] selection:bg-[#006E17]/20 selection:text-[#006E17]">
      {/* Header - Configured exactly like existing, clean layout */}
      <header className="sticky top-0 z-50 bg-[#F9F9F9]/80 backdrop-blur-[20px] pb-3 border-b border-[#E2E2E2]">
        <div className="max-w-7xl mx-auto px-4 pt-4 flex items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <h1 className="text-2xl font-bold tracking-tight">Hostel<span className="text-[#fc5e03]">OLX</span></h1>
            <div className="hidden md:block">
              <CampusDropdown />
            </div>
          </div>

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

        {/* Compact Categories (Zepto-like) - appears only after scroll */}
        <div className="max-w-7xl mx-auto px-4">
          <div
            className={[
              'mt-2 overflow-x-auto no-scrollbar',
              'transition-[max-height,opacity,transform] duration-300 ease-out will-change-[transform]',
              isCategoryDockCompact ? 'max-h-20 opacity-100 translate-y-0' : 'max-h-0 opacity-0 -translate-y-1 pointer-events-none',
            ].join(' ')}
            aria-label="Categories"
            aria-hidden={!isCategoryDockCompact}
          >
            <div className="flex items-center gap-2 pb-2">
              {CATEGORIES.map((category) => {
                const Icon = CATEGORY_ICON_COMPONENTS[category] ?? MoreHorizontal;
                return (
                  <button
                    key={category}
                    title={category}
                    aria-label={category}
                    onClick={() => setSelectedCategory(category)}
                    className={[
                      'group shrink-0 rounded-2xl border shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2',
                      'px-3 h-10',
                      selectedCategory === category
                        ? 'bg-[#006E17]/10 border-[#006E17]/25 text-[#006E17]'
                        : 'bg-white border-[#EEEEEE] text-[#1A1C1C] hover:shadow-md hover:border-[#006E17]/20',
                    ].join(' ')}
                  >
                    <div
                      className={[
                        'w-7 h-7 flex items-center justify-center rounded-xl transition-colors',
                        selectedCategory === category
                          ? 'bg-[#006E17] text-white'
                          : 'bg-[#006E17]/5 text-[#006E17] group-hover:bg-[#006E17] group-hover:text-white',
                      ].join(' ')}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-extrabold tracking-tight">
                      {CATEGORY_SHORT_LABEL[category]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Clean Hero Section */}
        <section className="relative overflow-hidden bg-white pt-12 pb-16 sm:pt-16 sm:pb-24 border-b border-[#E2E2E2]">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-[#006E17]/5 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-[#BB020C]/5 rounded-full blur-3xl -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-[#1A1C1C] mb-6">
              Buy, Sell & Rent <br className="hidden sm:block" />
              <span className="text-[#006E17]">Within Your Hostel</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg sm:text-lg text-[#5f5e5e] mb-12">
              The hyper-focused marketplace for students. No strangers, no scams. 
              Just your campus community.
            </p>

            {/* Big Categories Grid (original) - collapses away when dock appears */}
            <div
              className={[
                'transition-[max-height,opacity,transform] duration-300 ease-out will-change-[transform]',
                isCategoryDockCompact ? 'max-h-0 opacity-0 scale-[0.98] pointer-events-none' : 'max-h-[520px] opacity-100 scale-100',
              ].join(' ')}
              aria-hidden={isCategoryDockCompact}
            >
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 sm:gap-6">
                {CATEGORIES.map((category) => {
                  const Icon = CATEGORY_ICON_COMPONENTS[category] ?? MoreHorizontal;
                  return (
                    <button
                      key={category}
                      className="group flex flex-col items-center gap-3 p-4 bg-white border border-[#EEEEEE] rounded-2xl shadow-sm hover:shadow-md hover:border-[#006E17]/20 transition-all active:scale-95"
                    >
                      <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#006E17]/5 text-[#006E17] group-hover:bg-[#006E17] group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-semibold text-[#5f5e5e] group-hover:text-[#006E17] transition-colors">
                        {category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Listings - Exact frontend-2 implementation */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <div className="flex items-center gap-2 text-[#006E17] font-bold text-sm uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4" />
                <span>Fresh from your hostel</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A1C1C]">Featured Listings</h2>
            </div>
            <button className="flex items-center gap-2 text-[#006E17] font-bold hover:gap-3 transition-all">
              View all listings <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {visibleItems.map((product) => (
              <div
                key={product.id}
                className="group bg-white border border-[#EEEEEE] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-[#F9F9F9]">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getTypeStyle(product.type)}`}>
                      {product.type}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-[#1A1C1C] backdrop-blur-sm">
                      {product.condition}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-[15px] font-bold text-[#1A1C1C] line-clamp-1 group-hover:text-[#006E17] transition-colors">
                      {product.title}
                    </h3>
                  </div>
                  
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-lg font-extrabold text-[#1A1C1C]">
                      {product.price === 0 ? 'Free' : `₹${product.price}`}
                    </span>
                    {product.type === 'Rent' && <span className="text-xs text-[#5f5e5e] font-medium">/ sem</span>}
                  </div>

                  <div className="space-y-2 mb-5">
                    <div className="flex items-center gap-1.5 text-[#5f5e5e] text-xs font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{product.sellerHostel}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#b3b1b0] text-[10px] font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Posted {product.postedAt}</span>
                    </div>
                  </div>

                  <button className="w-full py-2.5 bg-[#F9F9F9] hover:bg-[#006E17] hover:text-white text-[#1A1C1C] font-bold text-sm rounded-xl transition-all active:scale-95">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <button className="px-8 py-3.5 bg-white border border-[#EEEEEE] hover:border-[#006E17] hover:text-[#006E17] text-[#1A1C1C] font-bold rounded-2xl transition-all shadow-sm active:scale-95 text-sm">
              Load More Items
            </button>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-20 bg-[#006E17] text-white overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-10 left-10 w-64 h-64 border-4 border-white rounded-full" />
            <div className="absolute bottom-10 right-10 w-96 h-96 border-4 border-white rounded-full" />
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight tracking-tight">
                  Trustworthy inside your campus walls
                </h2>
                <div className="space-y-8">
                  {[
                    { title: 'Zero Strangers', desc: 'Every user is verified with a college email. You only deal with people you might see in the mess.' },
                    { title: 'No Phone Exposure', desc: 'Communicate safely through our in-app chat. No spam calls or privacy concerns.' },
                    { title: 'Campus-Only Logistics', desc: 'Forget shipping or long travels. Meet at the hostel gate or common area.' },
                  ].map((item, i) => (
                    <div key={i} className="flex gap-5">
                      <div className="shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg border border-white/10">
                        {i + 1}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1.5">{item.title}</h3>
                        <p className="text-[#a4d4ab] leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="hidden lg:block relative">
                <div className="bg-white/5 backdrop-blur-lg p-8 rounded-[40px] border border-white/10 relative z-10 translate-x-8">
                  <div className="aspect-[4/3] bg-[#005211] rounded-3xl flex items-center justify-center overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Trust" 
                      className="w-full h-full object-cover opacity-40 mix-blend-overlay"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-white p-6 rounded-3xl shadow-2xl text-[#006E17] text-center transform hover:scale-105 transition-transform duration-300">
                        <ShieldCheck className="w-12 h-12 mx-auto mb-4" />
                        <div className="text-4xl font-black mb-1">4.9/5</div>
                        <div className="text-xs font-bold uppercase tracking-widest opacity-70">Trust Score</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#1A1C1C] mb-4 tracking-tight">How HostelOLX Works</h2>
              <p className="text-[#5f5e5e] max-w-2xl mx-auto text-lg">
                Built by students, for students. We've removed the friction of generic marketplaces.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {STEPS.map((step, index) => (
                <div key={index} className="relative p-8 bg-[#F9F9F9] border border-[#EEEEEE] rounded-3xl hover:border-[#006E17]/20 transition-colors text-center group">
                  <div className={`w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-2xl ${step.color} group-hover:scale-110 transition-transform`}>
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-bold text-[#1A1C1C] mb-3">{step.title}</h3>
                  <p className="text-[#5f5e5e] text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#EEEEEE] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#006E17] p-1.5 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-[#1A1C1C]">
                  Hostel<span className="text-[#fc5e03]">OLX</span>
                </span>
              </div>
              <p className="text-[#5f5e5e] text-sm leading-relaxed mb-6">
                The hyper-focused marketplace built exclusively for hostel students. 
                Buy, sell, rent, and lend within your own campus walls.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-[#b3b1b0] hover:text-[#006E17] font-medium text-sm transition-colors">Twitter</a>
                <a href="#" className="text-[#b3b1b0] hover:text-[#006E17] font-medium text-sm transition-colors">Instagram</a>
                <a href="#" className="text-[#b3b1b0] hover:text-[#006E17] font-medium text-sm transition-colors">GitHub</a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#1A1C1C] mb-6">Marketplace</h4>
              <ul className="space-y-4 text-sm text-[#5f5e5e]">
                <li><a href="#" className="hover:text-[#006E17] transition-colors">All Listings</a></li>
                <li><a href="#" className="hover:text-[#006E17] transition-colors">Books & Notes</a></li>
                <li><a href="#" className="hover:text-[#006E17] transition-colors">Electronics</a></li>
                <li><a href="#" className="hover:text-[#006E17] transition-colors">Cycles & Transport</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#1A1C1C] mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-[#5f5e5e]">
                <li><a href="#" className="hover:text-[#006E17] transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-[#006E17] transition-colors">Safety Guidelines</a></li>
                <li><a href="#" className="hover:text-[#006E17] transition-colors">Trust Score</a></li>
                <li><a href="#" className="hover:text-[#006E17] transition-colors">Contact Us</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#1A1C1C] mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-[#5f5e5e]">
                <li><a href="#" className="hover:text-[#006E17] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#006E17] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#006E17] transition-colors">Campus Rules</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#EEEEEE] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#b3b1b0] text-xs text-center md:text-left font-medium">
              © {new Date().getFullYear()} HostelOLX. Built with ❤️ by students, for students.
            </p>
            <div className="flex gap-6 text-xs text-[#b3b1b0] font-medium">
              <a href="#" className="hover:text-[#1A1C1C] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#1A1C1C] transition-colors">Terms</a>
              <a href="#" className="hover:text-[#1A1C1C] transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
