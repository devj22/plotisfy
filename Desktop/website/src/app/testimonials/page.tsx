import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import { TESTIMONIALS } from "@/lib/data";
import { Star, Quote } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials – What Our Buyers Say | Plotsify",
  description: "Read verified testimonials from Plotsify buyers who invested in land in Panvel and Khalapur, Maharashtra.",
};

export default function TestimonialsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0D2F5B] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">What Our Buyers Say</h1>
            <p className="text-white/70 text-lg">Real experiences from verified land investors across Maharashtra.</p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F3ED]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-white rounded-2xl border border-[#E2DDD6] p-6">
                <Quote className="w-8 h-8 text-[#B86A3C]/30 mb-4" />
                <p className="text-[#162338] text-sm leading-relaxed mb-6">{t.content}</p>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#B86A3C] fill-current" />
                  ))}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0D2F5B] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-[#162338] font-semibold text-sm">{t.name}</p>
                    <p className="text-[#6B7B94] text-xs">{t.location}</p>
                    {t.propertyPurchased && (
                      <p className="text-[#B86A3C] text-xs mt-0.5">{t.propertyPurchased}</p>
                    )}
                  </div>
                </div>
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
