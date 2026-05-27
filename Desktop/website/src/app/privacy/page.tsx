import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Plotzify",
  description: "Privacy policy for Plotzify – how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F7F3ED] min-h-screen">
        <div className="bg-[#0D2F5B] py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-white text-3xl font-bold">Privacy Policy</h1>
            <p className="text-white/60 text-sm mt-2">Last updated: January 2025</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-12 prose prose-sm">
          <div className="bg-white rounded-2xl border border-[#E2DDD6] p-8 space-y-6 text-[#162338]">
            {[
              {
                title: "Information We Collect",
                body: "We collect information you provide directly — such as your name, phone number, and email when you submit an enquiry or book a site visit. We also collect usage data automatically through analytics tools.",
              },
              {
                title: "How We Use Your Information",
                body: "We use your information to respond to your enquiries, send property updates you have requested, and improve our services. We do not sell your personal data to third parties.",
              },
              {
                title: "Data Storage",
                body: "Your data is stored securely on servers in India. We retain it only as long as necessary to fulfil the purposes described in this policy.",
              },
              {
                title: "Cookies",
                body: "We use cookies for analytics and to improve your browsing experience. You can disable cookies in your browser settings at any time.",
              },
              {
                title: "Your Rights",
                body: "You have the right to access, correct, or delete your personal data. Contact us at Plotzify@gmail.com to make a request.",
              },
              {
                title: "Contact",
                body: "For privacy-related questions, email us at Plotzify@gmail.com or call +91 81696 93894.",
              },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="text-[#0D2F5B] font-bold text-lg mb-2">{section.title}</h2>
                <p className="text-[#6B7B94] text-sm leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
