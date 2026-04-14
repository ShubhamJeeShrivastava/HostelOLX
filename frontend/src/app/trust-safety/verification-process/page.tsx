import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Mail, UserCheck, AlertCircle } from 'lucide-react';

export default function VerificationProcess() {
  return (
    <div className="min-h-screen bg-[#F9F9F9] font-sans text-[#1A1C1C]">
      {/* Simple Header */}
      <header className="sticky top-0 z-50 bg-[#F9F9F9]/80 backdrop-blur-[20px] border-b border-[#E2E2E2]">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-[#5f5e5e] hover:text-[#1A1C1C] transition-colors font-medium text-sm">
            <ArrowLeft size={18} /> Back to Home
          </Link>
          <h1 className="text-xl font-bold text-[#006E17] tracking-tight">HostelOLX</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-16">
        <div className="mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#006E17]/10 text-[#006E17] rounded-full text-sm font-bold mb-6">
            <ShieldCheck size={16} /> Trust & Safety
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-[#1A1C1C]">
            Our Verification Process
          </h1>
          <p className="text-lg text-[#5f5e5e] leading-relaxed">
            To maintain a secure and closed marketplace, HostelOLX employs a strict verification system. No outsiders. Just verified students from your campus.
          </p>
        </div>

        <div className="space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-[#EEEEEE] shadow-[0_4px_16px_rgba(26,28,28,0.03)]">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#E8E8E8] rounded-xl text-[#006E17]">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">1. University Email Validation</h3>
                <p className="text-[#5f5e5e] leading-relaxed">
                  Every user must sign up using their official university-issued email address (e.g., student@pilani.bits-pilani.ac.in). We do not accept Gmail, Yahoo, or other public email domains.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-3xl border border-[#EEEEEE] shadow-[0_4px_16px_rgba(26,28,28,0.03)]">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#E8E8E8] rounded-xl text-[#006E17]">
                <UserCheck size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">2. ID Card Screening (Optional)</h3>
                <p className="text-[#5f5e5e] leading-relaxed">
                  For high-value items, sellers may be requested to upload a secure photo of their current student ID. This adds a "Verified Seller" badge to their profile, increasing buyer trust.
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#FFF4F4] p-8 rounded-3xl border border-[#FFE2E2] shadow-[0_4px_16px_rgba(187,2,12,0.03)]">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-[#FFE2E2] rounded-xl text-[#BB020C]">
                <AlertCircle size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-[#BB020C]">Zero Tolerance Policy</h3>
                <p className="text-[#BB020C]/80 leading-relaxed">
                  Any attempt to spoof emails or misrepresent campus affiliation will result in an immediate, permanent ban. We take the "closed campus" rule very seriously.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
