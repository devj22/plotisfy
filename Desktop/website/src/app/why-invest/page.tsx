import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import { INFRASTRUCTURE_HIGHLIGHTS } from "@/lib/data";
import { Plane, TrendingUp, Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Why Invest in Panvel & Khalapur Land | Plotsify",
  description: "Infrastructure tailwinds, appreciation history, and the investment case for land in Panvel and Khalapur, Maharashtra.",
};

export default function WhyInvestPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0D2F5B] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">Why Invest Here?</h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Panvel and Khalapur sit at the intersection of three of India's largest infrastructure projects. Here's the investment case.
            </p>
          </div>
        </section>

        {/* Infrastructure */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F3ED]">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-[#0D2F5B] text-2xl font-bold mb-8 text-center">Infrastructure Tailwinds</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {INFRASTRUCTURE_HIGHLIGHTS.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl border border-[#E2DDD6] p-6">
                  <span className="inline-block text-xs font-semibold text-[#2D7A4F] bg-[#2D7A4F]/10 px-2 py-1 rounded-full mb-4">
                    {item.impact}
                  </span>
                  <h3 className="text-[#0D2F5B] font-bold text-base mb-2">{item.title}</h3>
                  <p className="text-[#6B7B94] text-sm leading-relaxed mb-3">{item.description}</p>
                  <p className="text-xs text-[#B86A3C] font-medium">📍 {item.location}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sub-links */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white border-t border-[#E2DDD6]">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Why Panvel", href: "/locations/panvel", desc: "Near Navi Mumbai Airport — the biggest land play in Maharashtra." },
              { label: "Why Khalapur", href: "/locations/khalapur", desc: "Weekend home market booming on the Mumbai-Pune Expressway corridor." },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-start gap-4 p-5 rounded-2xl border border-[#E2DDD6] hover:border-[#0D2F5B]/30 hover:shadow-md transition-all group"
              >
                <div className="flex-1">
                  <h3 className="text-[#0D2F5B] font-bold mb-1 group-hover:text-[#B86A3C] transition-colors">{item.label}</h3>
                  <p className="text-[#6B7B94] text-sm">{item.desc}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-[#6B7B94] group-hover:text-[#0D2F5B] mt-0.5 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
