import React from 'react';
import Link from 'next/link';
import { ArrowLeft, PhoneCall, Mail, MessageSquare } from 'lucide-react';

export default function ContactSupport() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#006E17]/10 text-[#006E17] rounded-full text-sm font-bold mb-6">
            <PhoneCall size={16} /> Trust & Safety
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-[#1A1C1C]">
            Contact Support
          </h1>
          <p className="text-lg text-[#5f5e5e] leading-relaxed">
            Need help? Experiencing a bug? Or have a dispute to resolve? We're here for you.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Email Support Card */}
          <div className="bg-white p-8 rounded-3xl border border-[#EEEEEE] shadow-[0_4px_16px_rgba(26,28,28,0.03)] hover:border-[#006E17]/50 transition-colors cursor-pointer group">
            <div className="p-3 bg-[#E8E8E8] group-hover:bg-[#006E17]/10 rounded-xl text-[#1A1C1C] group-hover:text-[#006E17] w-fit mb-6 transition-colors">
              <Mail size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Email Us</h3>
            <p className="text-[#5f5e5e] text-sm mb-4">
              For general queries, bug reports, and non-urgent account issues.
            </p>
            <span className="text-[#006E17] font-bold">support@hostelolx.com</span>
          </div>

          {/* Quick Chat Support */}
          <div className="bg-white p-8 rounded-3xl border border-[#EEEEEE] shadow-[0_4px_16px_rgba(26,28,28,0.03)] hover:border-[#006E17]/50 transition-colors cursor-pointer group">
            <div className="p-3 bg-[#E8E8E8] group-hover:bg-[#006E17]/10 rounded-xl text-[#1A1C1C] group-hover:text-[#006E17] w-fit mb-6 transition-colors">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Live Chat</h3>
            <p className="text-[#5f5e5e] text-sm mb-4">
              Instantly connect with a campus moderator for dispute resolutions.
            </p>
            <span className="text-[#006E17] font-bold">Start Conversation &rarr;</span>
          </div>
        </div>
      </main>
    </div>
  );
}
