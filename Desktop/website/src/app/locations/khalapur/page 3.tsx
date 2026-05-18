import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import PropertyCard from "@/components/properties/PropertyCard";
import { INFRASTRUCTURE_HIGHLIGHTS } from "@/lib/data";
import { getPropertiesByLocation } from "@/lib/cms";
import { MapPin, TrendingUp, CheckCircle, ArrowRight, Trees } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Plots in Khalapur – Land Near Mumbai-Pune Expressway",
  description:
    "Verified land plots in Khalapur, Maharashtra. Near Mumbai-Pune Expressway, ideal for weekend homes, farmhouses, and investment. Clear titles.",
};

export default async function KhalapurPage() {
  const props = await getPropertiesByLocation("Khalapur");

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#162338] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <MapPin className="w-3.5 h-3.5 text-[#B86A3C]" /> Raigad District · Maharashtra
            </div>
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
              Land Plots in <span className="text-[#B86A3C]">Khalapur</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Khalapur offers scenic valley land at a fraction of Panvel prices. With the Mumbai-Pune
              Expressway Missing Link slashing travel time, this quiet location is becoming
              Mumbai's favourite weekend home destination.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <span className="flex items-center gap-2 bg-white/10 text-white text-sm px-3 py-1.5 rounded-lg">
                🛣️ On Expressway Corridor
              </span>
              <span className="flex items-center gap-2 bg-white/10 text-white text-sm px-3 py-1.5 rounded-lg">
                <CheckCircle className="w-4 h-4 text-[#2D7A4F]" /> 60 min from Mumbai
              </span>
              <span className="flex items-center gap-2 bg-white/10 text-white text-sm px-3 py-1.5 rounded-lg">
                🌿 Ideal for Farmhouses
              </span>
            </div>
          </div>
        </section>

        <section className="py-12 bg-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-[#0D2F5B] text-2xl font-bold text-center mb-8">
              The Expressway Advantage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6 max-w-2xl mx-auto">
              {INFRASTRUCTURE_HIGHLIGHTS.filter((h) => h.location === "Khalapur").map((item) => (
                <div key={item.id} className="bg-[#F7F3ED] rounded-2xl p-6 border border-[#E2DDD6]">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#162338] rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                      🛣️
                    </div>
                    <div>
                      <div className="text-xs text-[#B86A3C] font-semibold uppercase tracking-wide mb-1">
                        {item.source}
                      </div>
                      <h3 className="text-[#0D2F5B] font-bold mb-2">{item.title}</h3>
                      <p className="text-[#6B7B94] text-sm leading-relaxed">{item.description}</p>
                      <a
                        href={item.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#0D2F5B] font-medium hover:text-[#B86A3C] mt-3 inline-block"
                      >
                        Official Source ↗
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-14 bg-[#F7F3ED] px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-[#0D2F5B] text-2xl font-bold">
                  Available Plots in Khalapur ({props.length})
                </h2>
                <p className="text-[#6B7B94] text-sm mt-1">All listings are verified by our team</p>
              </div>
              <Link
                href="/properties?location=khalapur"
                className="hidden sm:flex items-center gap-1.5 text-[#0D2F5B] font-semibold text-sm hover:text-[#B86A3C]"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {props.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
