"use client";

import Link from "next/link";
import { Phone, MessageCircle, Calendar, FileText } from "lucide-react";

export default function MobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-[#E2DDD6] shadow-2xl">
      <div className="grid grid-cols-4 divide-x divide-[#E2DDD6]">
        <a
          href="tel:+918169693894"
          className="flex flex-col items-center gap-1 py-3 text-[#0D2F5B] hover:bg-[#F7F3ED] transition-colors active:bg-[#E2DDD6]"
        >
          <Phone className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Call</span>
        </a>
        <a
          href="https://wa.me/918169693894?text=Hi%2C%20I%20am%20interested%20in%20plots%20in%20Panvel%2FKhalapur"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-3 text-[#25D366] hover:bg-[#F7F3ED] transition-colors active:bg-[#E2DDD6]"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[10px] font-semibold text-[#0D2F5B]">WhatsApp</span>
        </a>
        <Link
          href="/book-site-visit"
          className="flex flex-col items-center gap-1 py-3 text-[#B86A3C] hover:bg-[#F7F3ED] transition-colors active:bg-[#E2DDD6]"
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px] font-semibold text-[#0D2F5B]">Site Visit</span>
        </Link>
        <Link
          href="/contact#enquire"
          className="flex flex-col items-center gap-1 py-3 bg-[#0D2F5B] text-white hover:bg-[#0a2347] transition-colors active:bg-[#162338]"
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] font-semibold">Enquire</span>
        </Link>
      </div>
    </div>
  );
}
