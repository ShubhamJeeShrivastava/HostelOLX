'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { 
  Search, MapPin, ShoppingCart, ShoppingBag, Filter, Book, Laptop, Sofa, Bike, 
  Shirt, PenTool, Home, MoreHorizontal, Sparkles, Clock
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
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

const getTypeStyle = (type: string | undefined) => {
  switch (type) {
    case 'Sell': return 'bg-[#d1fae5] text-[#006E17]';
    case 'Rent': return 'bg-[#d1fae5] text-[#006E17]';
    case 'Lend': return 'bg-[#d1fae5] text-[#006E17]';
    case 'Want': return 'bg-[#d1fae5] text-[#006E17]';
    default: return 'bg-[#d1fae5] text-[#006E17]';
  }
};

function ItemsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialSearch = searchParams.get('search') || '';
  
  const [items, setItems] = useState<{ id: string; title: string; condition: string; price: number; image: string; sellerHostel: string; postedAt: string; type: string; category?: string; }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>('All');
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<typeof items>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync Input with URL Query Param
  useEffect(() => {
    setSearchQuery(initialSearch);
  }, [initialSearch]);

  // Main Page Fetching based on URL parameters
  useEffect(() => {
    const url = initialSearch
      ? `http://localhost:5000/api/items?search=${encodeURIComponent(initialSearch)}`
      : 'http://localhost:5000/api/items';

    setIsLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.warn('Error fetching items', err);
        setIsLoading(false);
        setItems([]);
      });
  }, [initialSearch]);

  // Dropdown Auto-Complete Debounce Effect
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      setIsSearching(true);
      fetch(`http://localhost:5000/api/items?search=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => {
          setSearchResults(data.slice(0, 5));
          setIsSearching(false);
        })
        .catch(err => {
          console.error(err);
          setIsSearching(false);
        });
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const visibleItems =
    selectedCategory === 'All'
      ? items
      : items.filter((p) => (p.category ? p.category === selectedCategory : true));

  const handleSearchSubmit = (query: string) => {
    setShowSuggestions(false);
    if (!query.trim()) {
      router.push(`/items`);
    } else {
      router.push(`/items?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-[#1A1C1C] flex flex-col selection:bg-[#006E17]/20 selection:text-[#006E17]">
      {/* Reusable Header from Home with Active Search Wiring */}
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
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit(searchQuery);
                  }
                }}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#BCCBB5]/40 rounded-xl focus:outline-none focus:border-[#006E17] transition-colors text-sm shadow-[0_1px_4px_rgba(26,28,28,0.02)] placeholder:text-[#5f5e5e] relative z-20"
                placeholder="Search for cycle, books, mattress..."
              />
              
              {showSuggestions && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E2E2E2] rounded-xl shadow-lg overflow-hidden z-50">
                  {isSearching ? (
                    <div className="p-4 text-center text-sm text-[#5f5e5e]">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((result) => (
                        <div 
                          key={result.id} 
                          className="px-4 py-3 hover:bg-[#F9F9F9] cursor-pointer flex items-center gap-3 transition-colors border-b border-[#F0F0F0] last:border-b-0"
                          onClick={() => handleSearchSubmit(result.title)}
                        >
                          <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-[#EEEEEE]">
                            <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-[#1A1C1C] truncate">{result.title}</h4>
                            <p className="text-xs text-[#5f5e5e] truncate">{result.category} • ₹{result.price}</p>
                          </div>
                        </div>
                      ))}
                      <div 
                        className="px-4 py-2 bg-[#F9F9F9] text-center text-sm font-bold text-[#006E17] hover:bg-[#EEEEEE] cursor-pointer transition-colors"
                        onClick={() => handleSearchSubmit(searchQuery)}
                      >
                        See all results for "{searchQuery}"
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-center text-sm text-[#5f5e5e]">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
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

        {/* Filters/Categories List */}
        <div className="max-w-7xl mx-auto px-4 mt-8">
          <div className="flex items-center gap-3 pb-4 overflow-x-auto no-scrollbar">
            {CATEGORIES.map((category) => {
              const Icon = CATEGORY_ICON_COMPONENTS[category] ?? MoreHorizontal;
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={[
                    'group shrink-0 rounded-[20px] border transition-all active:scale-95 flex flex-col items-center justify-center text-center p-3 w-[116px] h-[116px]',
                    isSelected
                      ? 'bg-white border-[#006E17] shadow-sm'
                      : 'bg-white border-[#EEEEEE] hover:border-[#CCCCCC] hover:shadow-sm',
                  ].join(' ')}
                >
                  <div
                    className={[
                      'w-12 h-12 flex items-center justify-center rounded-[16px] mb-3 transition-colors',
                      isSelected
                        ? 'bg-[#006E17] text-white'
                        : 'bg-[#F2F9F4] text-[#006E17] group-hover:bg-[#E8F5EB]',
                    ].join(' ')}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span 
                    className={[
                      'text-[11px] leading-tight font-bold tracking-tight px-1',
                      isSelected ? 'text-[#1A1C1C]' : 'text-[#5f5e5e] group-hover:text-[#1A1C1C]'
                    ].join(' ')}
                  >
                    {category}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#1A1C1C]">
              {initialSearch ? `Search Results for "${initialSearch}"` : 'All Listings'}
            </h1>
            <p className="text-sm text-[#5f5e5e] mt-1">
              Showing {visibleItems.length} result{visibleItems.length !== 1 && 's'}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E2E2E2] rounded-xl text-sm font-semibold hover:bg-[#F9F9F9] transition-colors shadow-sm">
            <Filter size={16} /> Filters
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-[#5f5e5e]">Loading results...</div>
        ) : visibleItems.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {visibleItems.map((product) => (
              <div
                key={product.id}
                className="group bg-white border border-[#EEEEEE] rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
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

                  <button onClick={() => router.push(`/items/${product.id}`)} className="w-full py-2.5 bg-[#F9F9F9] hover:bg-[#006E17] hover:text-white text-[#1A1C1C] font-bold text-sm rounded-xl transition-all active:scale-95">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-[#EEEEEE] shadow-sm">
            <Search className="w-12 h-12 text-[#b3b1b0] mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#1A1C1C] mb-2">No Results Found</h3>
            <p className="text-[#5f5e5e] max-w-sm mx-auto">
              We couldn't find any items matching your search. Try different keywords or browse all categories.
            </p>
            <button 
              onClick={() => handleSearchSubmit('')}
              className="mt-6 px-6 py-2.5 bg-[#006E17] text-white font-bold rounded-xl hover:bg-[#005a13] transition-colors shadow-md hover:shadow-lg active:scale-95"
            >
              Clear Search
            </button>
          </div>
        )}
      </main>

      <footer className="mt-auto bg-white border-t border-[#EEEEEE] pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="bg-[#006E17] p-1.5 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold tracking-tight text-[#1A1C1C]">
                  Hostel<span className="text-[#BB020C]">OLX</span>
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

export default function ItemsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center font-bold text-[#006E17]">Loading directory...</div>}>
      <ItemsContent />
    </Suspense>
  );
}
