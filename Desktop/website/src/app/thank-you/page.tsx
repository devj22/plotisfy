import Link from "next/link";
import { CheckCircle, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You | Plotzify",
  description: "Thanks for reaching out to Plotzify. Our team will contact you shortly.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/thank-you" },
};

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-[#F7F3ED] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-white rounded-2xl border border-[#E2DDD6] p-8 text-center shadow-sm">
        <div className="w-16 h-16 bg-[#2D7A4F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-[#2D7A4F]" />
        </div>
        <h1 className="text-[#0D2F5B] font-bold text-2xl mb-2">Thank You!</h1>
        <p className="text-[#6B7B94] text-sm mb-6">
          We&apos;ve received your enquiry. Our team will get back to you within 2 hours.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://wa.me/918169693894"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#1db955] transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
          </a>
          <a
            href="tel:+918169693894"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0D2F5B] text-white font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-[#0a2347] transition-colors"
          >
            <Phone className="w-4 h-4" /> Call Us
          </a>
        </div>
        <Link
          href="/"
          className="inline-block mt-6 text-[#6B7B94] text-sm hover:text-[#0D2F5B] transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
