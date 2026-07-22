"use client";

import { usePathname } from "next/navigation";
import { reportConversion } from "@/lib/gtag";

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href="https://wa.me/918169693894?text=Hi%2C%20I%20am%20interested%20in%20plots%20in%20Panvel%2FKhalapur - Khopoli"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => reportConversion()}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 z-[60] flex items-center gap-2.5 bg-[#25D366] text-white font-semibold pl-2 pr-4 py-2 rounded-full shadow-[0_4px_24px_rgba(37,211,102,0.45)] hover:bg-[#1eb558] hover:scale-105 transition-all duration-200"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/whatsapp-icon.png"
        alt="WhatsApp"
        width={36}
        height={36}
        className="flex-shrink-0 rounded-full"
      />
      <span className="text-sm">WhatsApp Us</span>
    </a>
  );
}
