'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Search } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function CampusDropdown() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [colleges, setColleges] = useState<{ id: string; name: string }[]>([]);
  const [selectedCampus, setSelectedCampus] = useState('Loading...');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = !!session?.user;

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/colleges')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setColleges(data);
          if (data.length > 0) {
            if (session?.user && (session.user as any).college_id) {
               const userCollegeId = String((session.user as any).college_id);
               const matched = data.find((c: any) => String(c.id) === userCollegeId);
               if (matched) {
                 setSelectedCampus(matched.name);
               } else {
                 setSelectedCampus(data[0].name);
               }
            } else {
              // Unauthenticated view sets default or last selected (placeholder)
              setSelectedCampus(data[0].name);
            }
          } else {
            setSelectedCampus('No campuses available');
          }
        } else {
          setColleges([]);
          setSelectedCampus('Campus Unavailable');
        }
      })
      .catch(err => {
        console.error('Failed to fetch colleges', err);
        setColleges([]);
        setSelectedCampus('Campus Unavailable');
      });
  }, [session]);

  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className={`flex items-center gap-2 bg-[#E8E8E8] px-3 py-1.5 rounded-xl transition-colors ${
          isAuthenticated ? 'cursor-default opacity-90' : 'cursor-pointer hover:bg-[#E2E2E2]'
        }`}
        onClick={() => !isAuthenticated && setIsOpen(!isOpen)}
      >
        <MapPin size={18} className="text-[#006E17]" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase text-[#5f5e5e] leading-none">Your Campus</span>
          <span className="text-sm font-semibold flex items-center gap-1 select-none">
            {selectedCampus} {!isAuthenticated && <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />}
          </span>
        </div>
      </div>

      {isOpen && !isAuthenticated && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-[0_8px_30px_rgba(26,28,28,0.12)] border border-[#EEEEEE] overflow-hidden z-50">
          {/* Search Input */}
          <div className="p-3 border-b border-[#EEEEEE] bg-[#F9F9F9]">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#b3b1b0]" />
              <input
                type="text"
                placeholder="Search campus..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#E2E2E2] rounded-lg text-sm focus:outline-none focus:border-[#006E17] transition-colors placeholder:text-[#b3b1b0]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          {/* List of Colleges */}
          <div className="max-h-60 overflow-y-auto no-scrollbar py-2">
            {filteredColleges.length > 0 ? (
              filteredColleges.map((college) => (
                <div
                  key={college.id}
                  className={`px-4 py-2 text-sm cursor-pointer hover:bg-[#F3F3F3] transition-colors ${
                    selectedCampus === college.name ? 'text-[#006E17] font-semibold bg-[#F9F9F9]' : 'text-[#3d4a3a]'
                  }`}
                  onClick={() => {
                    setSelectedCampus(college.name);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                >
                  {college.name}
                </div>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-[#b3b1b0] text-center">
                No campus found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
