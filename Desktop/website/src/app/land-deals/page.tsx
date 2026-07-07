"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import Link from "next/link";
import { Tag, Clock, ArrowRight, MessageCircle, Phone, Flame } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface Deal {
  id: string;
  title: string;
  description: string;
  propertySlug: string;
  originalPrice: number;
  dealPrice: number;
  validUntil: string | null;
  image: string | null;
  badge: string;
  published: boolean;
  featured: boolean;
}

export default function LandDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/land-deals?published=true")
      .then((r) => r.json())
      .then((data) => setDeals(Array.isArray(data) ? data : []))
      .catch(() => setDeals([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F7F3ED]">
        {/* Hero */}
        <section className="bg-[#B86A3C] py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/15 border border-white/25 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              <Flame className="w-3.5 h-3.5 text-white" /> Limited Time Offers
            </div>
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
              Land <span className="text-white/80">Deals</span>
            </h1>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              Exclusive limited-time deals on verified land plots in Panvel &amp; Khalapur - Khopoli. Act fast — these won't last.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-20 text-[#6B7B94]">Loading deals...</div>
          ) : deals.length === 0 ? (
            <ComingSoonState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {deals.map((deal) => (
                <DealCard key={deal.id} deal={deal} />
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}

function DealCard({ deal }: { deal: Deal }) {
  const discount = deal.originalPrice > 0
    ? Math.round(((deal.originalPrice - deal.dealPrice) / deal.originalPrice) * 100)
    : 0;
  const isExpired = deal.validUntil && new Date(deal.validUntil) < new Date();
  const daysLeft = deal.validUntil
    ? Math.max(0, Math.ceil((new Date(deal.validUntil).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E2DDD6] shadow-sm hover:shadow-md transition-shadow group relative">
      {/* Discount ribbon */}
      {discount > 0 && (
        <div className="absolute top-3 right-3 z-10 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
          -{discount}%
        </div>
      )}

      {/* Image */}
      <div className="relative h-44 bg-[#F7F3ED] overflow-hidden">
        {deal.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={deal.image} alt={deal.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag className="w-12 h-12 text-[#E2DDD6]" />
          </div>
        )}
        {deal.badge && (
          <div className="absolute top-3 left-3">
            <span className="flex items-center gap-1 bg-[#B86A3C] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              <Flame className="w-3 h-3" /> {deal.badge}
            </span>
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-[#0D2F5B] font-bold text-base mb-2 leading-snug">{deal.title}</h3>
        {deal.description && (
          <p className="text-[#6B7B94] text-xs mb-3 line-clamp-2">{deal.description}</p>
        )}

        {/* Price */}
        {deal.dealPrice > 0 && (
          <div className="mb-3">
            <div className="flex items-baseline gap-2">
              <span className="text-[#0D2F5B] font-bold text-xl">{formatPrice(deal.dealPrice)}</span>
              {deal.originalPrice > 0 && (
                <span className="text-[#6B7B94] text-sm line-through">{formatPrice(deal.originalPrice)}</span>
              )}
            </div>
            {discount > 0 && (
              <span className="text-red-500 text-xs font-semibold">Save {formatPrice(deal.originalPrice - deal.dealPrice)}</span>
            )}
          </div>
        )}

        {/* Expiry */}
        {daysLeft !== null && !isExpired && (
          <div className="flex items-center gap-1.5 mb-3 text-xs font-medium text-[#B86A3C]">
            <Clock className="w-3.5 h-3.5" />
            {daysLeft === 0 ? "Expires today!" : `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`}
          </div>
        )}
        {isExpired && (
          <p className="text-xs text-red-400 font-medium mb-3">This deal has expired</p>
        )}

        {/* CTAs */}
        <div className="flex gap-2">
          <a
            href={`https://wa.me/918169693894?text=Hi%2C%20I%20am%20interested%20in%20the%20deal%3A%20${encodeURIComponent(deal.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#B86A3C] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#9a5630] transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Grab Deal
          </a>
          <a
            href="tel:+918169693894"
            className="flex items-center justify-center gap-1.5 border border-[#E2DDD6] text-[#0D2F5B] text-sm font-semibold px-3 py-2.5 rounded-xl hover:bg-[#F7F3ED] transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
        {deal.propertySlug && (
          <Link
            href={`/properties/${deal.propertySlug}`}
            className="flex items-center justify-center gap-1 text-xs text-[#0D2F5B] font-medium mt-2 hover:text-[#B86A3C] transition-colors"
          >
            View Property <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}

function ComingSoonState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-[#B86A3C]/8 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Tag className="w-10 h-10 text-[#B86A3C]/40" />
      </div>
      <h2 className="text-[#0D2F5B] text-2xl font-bold mb-2">Deals Coming Soon</h2>
      <p className="text-[#6B7B94] text-base max-w-md mb-8">
        We are negotiating exclusive deals on premium land plots. Join our WhatsApp to be the first to hear about limited-time offers.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="https://wa.me/918169693894?text=Hi%2C%20please%20notify%20me%20about%20upcoming%20land%20deals"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1eb558] transition-colors"
        >
          <MessageCircle className="w-4 h-4" /> Get Notified on WhatsApp
        </a>
        <Link
          href="/properties"
          className="flex items-center gap-2 border-2 border-[#0D2F5B] text-[#0D2F5B] font-bold px-6 py-3 rounded-xl hover:bg-[#0D2F5B] hover:text-white transition-colors"
        >
          Browse All Plots <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
