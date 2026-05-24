import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import { Phone, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Plotsify – Talk to Our Land Investment Team",
  description: "Get in touch with Plotsify. Call, WhatsApp, or email us to discuss land investment opportunities in Panvel and Khalapur.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0D2F5B] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">Get in Touch</h1>
            <p className="text-white/70 text-lg">Our team responds within 2 hours. No pressure, just facts.</p>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F3ED]">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Info */}
            <div className="space-y-6">
              <h2 className="text-[#0D2F5B] text-2xl font-bold">Contact Information</h2>
              {[
                { icon: Phone, label: "Phone / WhatsApp", value: "+91 98200 00000", href: "tel:+919820000000" },
                { icon: Mail, label: "Email", value: "hello@plotsify.com", href: "mailto:hello@plotsify.com" },
                { icon: MapPin, label: "Coverage Area", value: "Panvel & Khalapur, Maharashtra", href: null },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0D2F5B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-[#0D2F5B]" />
                  </div>
                  <div>
                    <p className="text-[#6B7B94] text-xs font-medium uppercase tracking-wider">{item.label}</p>
                    {item.href ? (
                      <a href={item.href} className="text-[#162338] font-semibold hover:text-[#0D2F5B]">{item.value}</a>
                    ) : (
                      <p className="text-[#162338] font-semibold">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <a
                  href="https://wa.me/919820000000"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1db955] transition-colors"
                >
                  💬 Chat on WhatsApp
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-2xl border border-[#E2DDD6] p-6">
              <h2 className="text-[#0D2F5B] font-bold text-lg mb-5">Send us a message</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#162338] mb-1.5">Name</label>
                    <input type="text" placeholder="Your name" className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#162338] mb-1.5">Phone</label>
                    <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#162338] mb-1.5">Email</label>
                  <input type="email" placeholder="your@email.com" className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#162338] mb-1.5">Message</label>
                  <textarea rows={4} placeholder="Tell us what you're looking for..." className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] resize-none" />
                </div>
                <button type="submit" className="w-full bg-[#0D2F5B] text-white font-semibold py-3 rounded-xl hover:bg-[#0a2347] transition-colors">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
