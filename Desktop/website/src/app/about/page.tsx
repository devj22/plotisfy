import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import { TESTIMONIALS, FAQS } from "@/lib/data";
import { Star, Quote, BookOpen, HelpCircle, Phone, MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Plotzify – Premium Land Investment Platform",
  description:
    "Plotzify is Maharashtra's most transparent land investment platform. We verify every listing, explain every investment, and guide every buyer.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-[#0D2F5B] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
              About <span className="text-[#B86A3C]">Plotzify</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
              We built Plotzify because we believed land investment in Maharashtra deserved a
              better, more transparent platform — one that helps buyers understand the why, not just
              the what.
            </p>
          </div>
        </section>

        {/* Mission */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  emoji: "🔍",
                  title: "Verify First",
                  desc: "Every property is personally verified by our team before listing. We check 7/12, property card, encumbrance, and physical access.",
                },
                {
                  emoji: "📖",
                  title: "Explain the Why",
                  desc: "We don't just list what. We explain why each location is attractive, what drives value, and what the risks are.",
                },
                {
                  emoji: "🤝",
                  title: "Zero Pressure",
                  desc: "We operate on trust. No fake urgency, no commission-driven pushes. We help buyers make the right decision, even if it's not with us.",
                },
              ].map((item) => (
                <div key={item.title} className="text-center">
                  <div className="text-4xl mb-4">{item.emoji}</div>
                  <h3 className="text-[#0D2F5B] font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-[#6B7B94] text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="bg-[#F7F3ED] py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: "50+", label: "Verified Listings" },
              { value: "200+", label: "Happy Investors" },
              { value: "₹120Cr+", label: "Land Transacted" },
              { value: "2", label: "Prime Locations" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-[#B86A3C] text-3xl font-bold">{stat.value}</div>
                <div className="text-[#6B7B94] text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-[#0D2F5B] text-2xl font-bold mb-3">Let's Talk Land</h2>
            <p className="text-[#6B7B94] mb-6">
              Whether you're a first-time buyer, an NRI investor, or a seasoned land investor, we are
              here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:+919820000000"
                className="flex items-center justify-center gap-2 bg-[#0D2F5B] text-white font-semibold px-6 py-3 rounded-xl"
              >
                <Phone className="w-4 h-4" /> Call Us
              </a>
              <a
                href="https://wa.me/919820000000"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </a>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 border border-[#0D2F5B] text-[#0D2F5B] font-semibold px-6 py-3 rounded-xl hover:bg-[#0D2F5B] hover:text-white transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
