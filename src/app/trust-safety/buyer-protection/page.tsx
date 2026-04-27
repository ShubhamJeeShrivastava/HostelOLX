import React from 'react';
import Link from 'next/link';
import { ArrowLeft, HelpCircle, PackageX, ShieldBan, BadgeAlert } from 'lucide-react';

export default function BuyerProtection() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#006E17]/10 text-[#006E17] rounded-full text-sm font-bold mb-6">
            <HelpCircle size={16} /> Trust & Safety
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-[#1A1C1C]">
            Buyer Protection
          </h1>
          <p className="text-lg text-[#5f5e5e] leading-relaxed">
            Buy with confidence. While transactions happen face-to-face on campus, we provide the framework to ensure what you see is what you get.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="bg-white p-8 rounded-3xl border border-[#EEEEEE] shadow-[0_4px_16px_rgba(26,28,28,0.03)]">
            <div className="p-3 bg-[#E8E8E8] rounded-xl text-[#006E17] w-fit mb-4">
              <PackageX size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Item Misrepresentation</h3>
            <p className="text-[#5f5e5e] leading-relaxed text-sm">
              If an item significantly differs from its photo or description, you have the right to refuse the transaction during the meetup. Sellers who repeatedly misrepresent items will be flagged.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EEEEEE] shadow-[0_4px_16px_rgba(26,28,28,0.03)]">
            <div className="p-3 bg-[#E8E8E8] rounded-xl text-[#006E17] w-fit mb-4">
              <ShieldBan size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">No Advance Payments</h3>
            <p className="text-[#5f5e5e] leading-relaxed text-sm">
              We strongly advise against paying in advance. Always inspect the item in person before transferring money via UPI or cash. HostelOLX operates purely on a Meet & Inspect basis.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#EEEEEE] shadow-[0_4px_16px_rgba(26,28,28,0.03)] md:col-span-2">
            <div className="p-3 bg-[#FFE2E2] rounded-xl text-[#BB020C] w-fit mb-4">
              <BadgeAlert size={24} />
            </div>
            <h3 className="text-lg font-bold mb-2">Dispute Resolution</h3>
            <p className="text-[#5f5e5e] leading-relaxed text-sm">
              In the rare event of a dispute after purchase (e.g., a hidden defect), buyers can report the seller within 24 hours. Because all users are verified students from your campus, accountability remains high. Our support team can intervene if necessary to facilitate a return.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
