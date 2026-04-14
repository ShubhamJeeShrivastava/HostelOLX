import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPinned } from 'lucide-react';

export default function CampusGuidelines() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-[#1A1C1C]">
      <header className="sticky top-0 z-50 bg-[#F9F9F9]/80 backdrop-blur-[20px] border-b border-[#E2E2E2]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#5f5e5e] hover:text-[#1A1C1C] transition-colors font-medium text-sm">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <h1 className="text-xl font-bold text-[#006E17] tracking-tight">HostelOLX</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8E8E8] text-[#5f5e5e] rounded-full text-sm font-bold mb-6">
            <MapPinned size={16} /> Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-[#1A1C1C]">
            Campus Guidelines
          </h1>
          <p className="text-lg text-[#5f5e5e] leading-relaxed">
            Every campus operates slightly differently. These are the general guidelines to ensure HostelOLX remains highly reputable within your university's ecosystem.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-[#EEEEEE] shadow-[0_4px_16px_rgba(26,28,28,0.03)] border-l-4 border-l-[#006E17]">
            <h3 className="text-xl font-bold mb-3">Hostel Security & Visitation</h3>
            <p className="text-[#5f5e5e] leading-relaxed">
              When meeting up to exchange items, respect hostel visitation hours. If cross-hostel entry is restricted at your campus, arrange meetups at centralized locations like the Student Activity Center (SAC) or main cafeteria. Do not smuggle buyers into restricted areas.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-[#EEEEEE] shadow-[0_4px_16px_rgba(26,28,28,0.03)] border-l-4 border-l-[#006E17]">
            <h3 className="text-xl font-bold mb-3">Appropriate Listings</h3>
            <p className="text-[#5f5e5e] leading-relaxed">
              Before listing an item, ensure it complies with your university's resident rules. For example, some campuses ban heavy electrical appliances (like induction stoves or heaters) in dorms. Assisting peers in passing down forbidden items may lead to account suspension.
            </p>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-[#EEEEEE] shadow-[0_4px_16px_rgba(26,28,28,0.03)] border-l-4 border-l-[#006E17]">
            <h3 className="text-xl font-bold mb-3">Respecting Seniors & Juniors</h3>
            <p className="text-[#5f5e5e] leading-relaxed">
              HostelOLX facilitates interactions across all years. Maintain professionalism and mutual respect whether you are negotiating with a freshman or a senior. Aggressive bargaining or pulling rank is against our community ethos.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
