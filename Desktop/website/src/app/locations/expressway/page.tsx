import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Land Near Mumbai-Pune Expressway | Plotsify",
  description: "Invest in land plots near the Mumbai-Pune Expressway in Khalapur. Ideal for weekend homes, farmhouses, and long-term investment.",
};

export default function ExpresswayPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-[#162338] py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              🛣️ Mumbai-Pune Expressway Corridor
            </div>
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
              Land Near Mumbai-Pune Expressway
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              The Mumbai-Pune Expressway Missing Link project cuts travel time by 20-25 minutes, making Khalapur a top pick for weekend home buyers and long-term investors.
            </p>
            <Link
              href="/properties?location=Khalapur"
              className="inline-flex items-center gap-2 mt-8 bg-[#B86A3C] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#9a5630] transition-colors"
            >
              View Expressway-Area Plots <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#F7F3ED]">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "60 Min from Mumbai", desc: "The Missing Link reduces Khalapur's drive time from Mumbai significantly." },
              { title: "Weekend Home Hub", desc: "Growing demand for farmhouses and eco-stays in scenic valley settings." },
              { title: "10-18% Appreciation", desc: "Historical land appreciation in expressway corridors of Raigad district." },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-[#E2DDD6] p-6 text-center">
                <h3 className="text-[#0D2F5B] font-bold text-xl mb-2">{item.title}</h3>
                <p className="text-[#6B7B94] text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="max-w-4xl mx-auto mt-8 text-center">
            <Link href="/locations/khalapur" className="text-[#0D2F5B] font-semibold hover:text-[#B86A3C] transition-colors flex items-center gap-1 justify-center">
              Explore all Khalapur listings <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
