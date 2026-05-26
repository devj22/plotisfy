import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Plotzify",
  description: "Terms and conditions for using Plotzify's land investment platform.",
};

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-[#F7F3ED] min-h-screen">
        <div className="bg-[#0D2F5B] py-12 px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-white text-3xl font-bold">Terms of Service</h1>
            <p className="text-white/60 text-sm mt-2">Last updated: January 2025</p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl border border-[#E2DDD6] p-8 space-y-6 text-[#162338]">
            {[
              {
                title: "Acceptance of Terms",
                body: "By using Plotzify's website, you agree to these terms. If you do not agree, please do not use our services.",
              },
              {
                title: "Property Information",
                body: "All property information on Plotzify is provided in good faith. We verify listings before publishing, but buyers should conduct independent due diligence before making any investment decision.",
              },
              {
                title: "No Investment Advice",
                body: "Information on this website is for informational purposes only and does not constitute financial or investment advice. Past appreciation in any area does not guarantee future returns.",
              },
              {
                title: "User Conduct",
                body: "You agree not to misuse this website, submit false information, or attempt to access any restricted area of the platform.",
              },
              {
                title: "Intellectual Property",
                body: "All content on this website, including text, images, and logos, is the property of Plotzify and may not be reproduced without prior written permission.",
              },
              {
                title: "Limitation of Liability",
                body: "Plotzify is not liable for any loss or damage arising from reliance on information provided on this website. All land transactions are the sole responsibility of the buyer and seller.",
              },
              {
                title: "Governing Law",
                body: "These terms are governed by the laws of Maharashtra, India. Any disputes will be subject to the jurisdiction of courts in Mumbai.",
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
