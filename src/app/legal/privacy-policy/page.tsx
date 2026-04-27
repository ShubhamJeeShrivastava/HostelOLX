import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPolicy() {
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
            <Lock size={16} /> Legal
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-[#1A1C1C]">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#b3b1b0] uppercase tracking-wider font-bold mb-8">
            Last Updated: April 2026
          </p>
        </div>

        <div className="prose prose-lg text-[#3d4a3a] max-w-none prose-headings:text-[#1A1C1C] prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-h2:mb-4">
          <p>
            Your privacy is critically important to us. At HostelOLX, we only ask you for personal information when we truly need it to provide a service to you, and we collect it by fair and lawful means, with your knowledge and consent.
          </p>

          <h2>Data We Collect</h2>
          <p>
            We collect your university email address during sign-up for verification purposes. If you use the optional "ID Verification" feature, your ID image is temporarily parsed securely for verification and not stored permanently on our active databases. We also store chat logs between buyers and sellers to ensure safety and mediate potential disputes.
          </p>

          <h2>How We Use Your Data</h2>
          <p>
            Your data is used exclusively to keep the marketplace closed and safe. We do not sell your personal data to advertisers. 
          </p>

          <h2>Data Retention</h2>
          <p>
            We retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use, or modification.
          </p>

          <h2>Your Rights</h2>
          <p>
            You are free to refuse our request for your personal information, with the understanding that we may be unable to provide you with some of our desired services. At any time, you may request full deletion of your account and associated data.
          </p>
        </div>
      </main>
    </div>
  );
}
