import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-[#1A1C1C]">
      <header className="sticky top-0 z-50 bg-[#F9F9F9]/80 backdrop-blur-[20px] border-b border-[#E2E2E2]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#5f5e5e] hover:text-[#1A1C1C] transition-colors font-medium text-sm">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Hostel<span className="text-[#BB020C]">OLX</span></h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#E8E8E8] text-[#5f5e5e] rounded-full text-sm font-bold mb-6">
            <BookOpen size={16} /> Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-[#1A1C1C]">
            Terms of Service
          </h1>
          <p className="text-sm text-[#b3b1b0] uppercase tracking-wider font-bold mb-8">
            Last Updated: April 2026
          </p>
        </div>

        <div className="prose prose-lg text-[#3d4a3a] max-w-none prose-headings:text-[#1A1C1C] prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4">
          <p>
            Welcome to HostelOLX. By accessing or using our platform, you agree to be bound by these Terms of Service. This platform is strictly designed for currently enrolled university students to buy, sell, and rent items within their respective campus boundaries.
          </p>

          <h2>1. Eligibility & Accounts</h2>
          <p>
            You must be a current student possessing a valid university-issued email address. You agree to provide accurate registration information. Account sharing is strictly prohibited. If we find that an account belongs to a non-student or an expelled individual, we retain the right to terminate access immediately.
          </p>

          <h2>2. Permitted Listings</h2>
          <p>
            Items listed on HostelOLX must be legal, safe, and appropriate for campus living. Examples include books, cycles, electronics, and hostel furniture. Prohibited items include but are not limited to: illegal substances, weapons, alcohol, stolen goods, and anything restricted by your specific university's administration code of conduct.
          </p>

          <h2>3. User Conduct</h2>
          <p>
            You agree to interact with peers respectfully. Harassment, spam, or scamming behavior will not be tolerated. Since HostelOLX facilitates physical meetups, your safety and the safety of others are paramount. Meet only in public campus areas like common rooms, cafeterias, or libraries.
          </p>

          <h2>4. Platform Liability</h2>
          <p>
            HostelOLX provides the digital infrastructure to connect buyers and sellers. We do not own, inspect, or guarantee the condition of the items listed. All transactions are peer-to-peer. You acknowledge that HostelOLX is not liable for failed transactions, misrepresented items, or incidents occurring during the physical exchange.
          </p>
        </div>
      </main>
    </div>
  );
}
