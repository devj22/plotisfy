import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import { Plane, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Land Near Navi Mumbai Airport | Plotzify",
  description: "Invest in land plots near the upcoming Navi Mumbai International Airport. Verified listings with clear titles and road access.",
};

export default function NaviMumbaiAirportPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#0D2F5B] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <Plane className="w-3.5 h-3.5" />
              Navi Mumbai International Airport
            </div>
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
              Land Near Navi Mumbai Airport
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              The upcoming Navi Mumbai International Airport is one of the biggest infrastructure investments in India's western corridor. Land in its radius is appreciating rapidly.
            </p>
            <Link
              href="/properties?location=Panvel"
              className="inline-flex items-center gap-2 mt-8 bg-[#B86A3C] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#9a5630] transition-colors"
            >
              View Airport-Area Plots <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F3ED]">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "60M Pax Capacity", desc: "Planned capacity makes it one of Asia's largest airport projects." },
              { title: "~1,160 Hectares", desc: "Massive land footprint driving demand in the surrounding 20 km radius." },
              { title: "CIDCO Approved", desc: "Government-backed project on schedule for phased operations." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-[#E2DDD6] p-6 text-center">
                <h3 className="text-[#0D2F5B] font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-[#6B7B94] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="max-w-4xl mx-auto mt-8 text-center">
            <Link href="/locations/panvel" className="text-[#0D2F5B] font-semibold hover:text-[#B86A3C] transition-colors flex items-center gap-1 justify-center">
              Explore all Panvel listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
