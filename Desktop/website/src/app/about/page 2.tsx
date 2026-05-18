import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, Phone } from "lucide-react";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import Navbar from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "About Plotsify – Premium Land Investment Platform",
  description:
    "Plotsify is Maharashtra's transparent land investment platform focused on Panvel and Khalapur.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0D2F5B] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
              About <span className="text-[#B86A3C]">Plotsify</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
              We built Plotsify to make land buying clearer and more trustworthy. Our focus is simple:
              verified opportunities, transparent information, and action-oriented guidance.
            </p>
          </div>
        </section>

        <section className="py-14 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-[#0D2F5B] text-2xl font-bold mb-3">Let&apos;s Talk Land</h2>
            <p className="text-[#6B7B94] mb-6">
              Whether you are a first-time buyer or seasoned investor, our team can help you evaluate
              opportunities in Panvel and Khalapur.
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
