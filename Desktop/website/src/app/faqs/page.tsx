"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import { FAQS } from "@/lib/data";
import { ChevronDown } from "lucide-react";

export default function FaqsPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0D2F5B] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
            <p className="text-white/70 text-lg">Everything you need to know before investing in land.</p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F3ED]">
          <div className="max-w-3xl mx-auto space-y-3">
            {FAQS.map((faq) => (
              <div key={faq.id} className="bg-white rounded-xl border border-[#E2DDD6]">
                <button
                  onClick={() => setOpen(open === faq.id ? null : faq.id)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-[#162338] font-semibold text-sm">{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-[#6B7B94] flex-shrink-0 transition-transform ${open === faq.id ? "rotate-180" : ""}`} />
                </button>
                {open === faq.id && (
                  <div className="px-5 pb-4 text-[#6B7B94] text-sm leading-relaxed border-t border-[#F7F3ED]">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
