import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import ContactForm from "./ContactForm";
import TrackedContactLink from "@/components/ui/TrackedContactLink";
import { Phone, Mail, MapPin } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Plotzify – Talk to Our Land Investment Team",
  description: "Get in touch with Plotzify. Call, WhatsApp, or email us to discuss land investment opportunities in Panvel and Khalapur - Khopoli.",
  alternates: { canonical: "/contact" },
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
                { icon: Phone, label: "Phone / WhatsApp", value: "+91 81696 93894", href: "tel:+918169693894" },
                { icon: Mail, label: "Email", value: "Plotzify@gmail.com", href: "mailto:Plotzify@gmail.com" },
                { icon: MapPin, label: "Coverage Area", value: "Panvel & Khalapur - Khopoli, Maharashtra", href: null },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#0D2F5B]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-[#0D2F5B]" />
                  </div>
                  <div>
                    <p className="text-[#6B7B94] text-xs font-medium uppercase tracking-wider">{item.label}</p>
                    {item.href ? (
                      item.href.startsWith("tel:") ? (
                        <TrackedContactLink href={item.href} className="text-[#162338] font-semibold hover:text-[#0D2F5B]">{item.value}</TrackedContactLink>
                      ) : (
                        <a href={item.href} className="text-[#162338] font-semibold hover:text-[#0D2F5B]">{item.value}</a>
                      )
                    ) : (
                      <p className="text-[#162338] font-semibold">{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <TrackedContactLink
                  href="https://wa.me/918169693894"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#1db955] transition-colors"
                >
                  💬 Chat on WhatsApp
                </TrackedContactLink>
              </div>
            </div>

            {/* Client form */}
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
