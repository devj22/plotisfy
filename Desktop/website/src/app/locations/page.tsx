import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import Link from "next/link";
import { MapPin, Plane, TrendingUp, ArrowRight } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Locations – Panvel & Khalapur - Khopoli | Plotzify",
  description:
    "Explore premium land investment locations — Panvel near Navi Mumbai Airport and Khalapur - Khopoli on the Mumbai-Pune Expressway corridor.",
};

const LOCATIONS = [
  {
    name: "Panvel",
    tagline: "Near Navi Mumbai International Airport",
    description:
      "Panvel is Maharashtra's fastest-growing investment corridor, driven by the upcoming Navi Mumbai International Airport, Atal Setu bridge, and rapid infrastructure expansion.",
    href: "/locations/panvel",
    highlights: [
      "25 min from Navi Mumbai Airport",
      "Connected via Atal Setu",
      "Upcoming metro & highways",
      "High appreciation potential",
    ],
    icon: "✈️",
    color: "bg-[#0D2F5B]",
  },
  {
    name: "Khalapur - Khopoli",
    tagline: "On the Mumbai-Pune Expressway Corridor",
    description:
      "Khalapur - Khopoli offers scenic valley plots at accessible prices. The Mumbai-Pune Expressway Missing Link project is cutting travel time and driving strong demand for weekend homes and farmhouses.",
    href: "/locations/khalapur",
    highlights: [
      "On Mumbai-Pune Expressway",
      "60 min from Mumbai",
      "Ideal for farmhouses & weekend homes",
      "Low price, high upside",
    ],
    icon: "🛣️",
    color: "bg-[#B86A3C]",
  },
];

export default function LocationsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F7F3ED]">
        {/* Hero */}
        <section className="bg-[#162338] py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              <MapPin className="w-3.5 h-3.5 text-[#B86A3C]" /> Maharashtra, India
            </div>
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
              Our <span className="text-[#B86A3C]">Locations</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Two of Maharashtra's most strategically positioned land investment corridors — both backed by major infrastructure projects.
            </p>
          </div>
        </section>

        {/* Location Cards */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-8">
          {LOCATIONS.map((loc) => (
            <div key={loc.name} className="bg-white rounded-2xl border border-[#E2DDD6] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-0">
                {/* Color sidebar */}
                <div className={`${loc.color} flex items-center justify-center p-8 md:w-32 text-5xl`}>
                  {loc.icon}
                </div>
                {/* Content */}
                <div className="p-6 md:p-8">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h2 className="text-[#0D2F5B] text-2xl font-bold">{loc.name}</h2>
                      <p className="text-[#B86A3C] text-sm font-semibold mt-0.5">{loc.tagline}</p>
                    </div>
                    <Link
                      href={loc.href}
                      className="flex-shrink-0 flex items-center gap-1.5 bg-[#0D2F5B] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-[#0a2347] transition-colors"
                    >
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <p className="text-[#6B7B94] text-sm leading-relaxed mb-5">{loc.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {loc.highlights.map((h) => (
                      <div key={h} className="flex items-center gap-2 text-xs text-[#162338] font-medium">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#B86A3C] flex-shrink-0" />
                        {h}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Sub-location links */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
          <h2 className="text-[#0D2F5B] font-bold text-xl mb-5">Explore by Area</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Near Navi Mumbai Airport", desc: "Plots within the airport influence zone", href: "/locations/navi-mumbai-airport", icon: <Plane className="w-5 h-5" /> },
              { label: "Near Mumbai-Pune Expressway", desc: "Land on the expressway growth corridor", href: "/locations/expressway", icon: <TrendingUp className="w-5 h-5" /> },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 bg-white rounded-xl p-4 border border-[#E2DDD6] hover:border-[#0D2F5B] hover:shadow-sm transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F7F3ED] flex items-center justify-center text-[#0D2F5B] group-hover:bg-[#0D2F5B] group-hover:text-white transition-colors flex-shrink-0">
                  {item.icon}
                </div>
                <div>
                  <p className="text-[#0D2F5B] font-semibold text-sm">{item.label}</p>
                  <p className="text-[#6B7B94] text-xs">{item.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#6B7B94] ml-auto flex-shrink-0" />
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
