"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  MapPin,
  Maximize2,
  CheckCircle,
  Phone,
  MessageCircle,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Share2,
  Bookmark,
  Shield,
  TrendingUp,
  Navigation,
  Lock,
  X,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import PropertyCard from "@/components/properties/PropertyCard";
import { Property } from "@/types";
import { formatPrice, formatArea } from "@/lib/utils";

const PRICE_KEY = "plotzify_price_unlocked";

export default function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [similar, setSimilar] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [priceUnlocked, setPriceUnlocked] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem(PRICE_KEY)) {
      setPriceUnlocked(true);
    }
  }, []);

  useEffect(() => {
    fetch(`/api/properties/by-slug/${slug}`)
      .then(async (r) => {
        if (r.status === 404) { setNotFound(true); return; }
        const data = await r.json();
        setProperty(data);
        fetch(`/api/properties?published=true`)
          .then((r2) => r2.json())
          .then((all: Property[]) => {
            setSimilar(all.filter((p) => p.id !== data.id && p.location === data.location).slice(0, 3));
          })
          .catch(() => {});
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  function handlePriceUnlock() {
    localStorage.setItem(PRICE_KEY, "1");
    setPriceUnlocked(true);
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7F3ED] flex items-center justify-center">
          <p className="text-[#6B7B94]">Loading property...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (notFound || !property) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-[#F7F3ED] flex flex-col items-center justify-center gap-4">
          <p className="text-[#162338] text-xl font-bold">Property not found</p>
          <Link href="/properties" className="text-[#0D2F5B] underline">Browse all properties</Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F7F3ED]">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-[#E2DDD6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-[#6B7B94]">
            <Link href="/" className="hover:text-[#0D2F5B]">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/properties" className="hover:text-[#0D2F5B]">Properties</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#162338] font-medium truncate">{property.title}</span>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Gallery */}
              <PropertyGallery gallery={property.gallery} title={property.title} />

              {/* Price unlock banner — below image */}
              <PriceUnlockBanner
                property={property}
                priceUnlocked={priceUnlocked}
                onUnlocked={handlePriceUnlock}
              />

              {/* Title & Meta */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2DDD6]">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          property.status === "available"
                            ? "bg-[#2D7A4F]/10 text-[#2D7A4F]"
                            : "bg-[#B86A3C]/10 text-[#B86A3C]"
                        }`}
                      >
                        {property.status === "available" ? "✓ Available" : "Reserved"}
                      </span>
                      <span className="font-mono text-xs text-[#6B7B94] bg-[#F7F3ED] px-2 py-0.5 rounded">
                        {property.propertyCode}
                      </span>
                    </div>
                    <h1 className="text-[#0D2F5B] text-2xl md:text-3xl font-bold leading-tight">
                      {property.title}
                    </h1>
                    <div className="flex items-center gap-1.5 mt-2">
                      <MapPin className="w-4 h-4 text-[#B86A3C]" />
                      <span className="text-[#6B7B94] text-sm">
                        {property.village}, {property.taluka}, {property.district}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button className="p-2 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#0D2F5B] hover:border-[#0D2F5B] transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#B86A3C] hover:border-[#B86A3C] transition-colors">
                      <Bookmark className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Facts Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#E2DDD6]">
                  {/* Price facts — locked until form submitted */}
                  {priceUnlocked ? (
                    <QuickFact label="Total Price" value={formatPrice(property.priceTotal)} highlight />
                  ) : (
                    <LockedFact label="Total Price" />
                  )}
                  {priceUnlocked ? (
                    <QuickFact label="Price / sqft" value={`₹${property.pricePerSqft.toLocaleString()}`} />
                  ) : (
                    <LockedFact label="Price / sqft" />
                  )}
                  <QuickFact label="Area" value={formatArea(property.areaSqft)} />
                  <QuickFact label="Guntha" value={`${property.areaGuntha} Guntha`} />
                  <QuickFact label="Zoning" value={property.zoningType} />
                  <QuickFact
                    label="Title"
                    value={property.titleClarity === "clear" ? "Clear ✓" : "Check"}
                    valueColor={property.titleClarity === "clear" ? "text-[#2D7A4F]" : "text-[#B86A3C]"}
                  />
                  <QuickFact label="Road Access" value={property.roadAccess ? "Yes ✓" : "No"} />
                  <QuickFact label="District" value={property.district} />
                </div>
              </div>

              {/* Property Highlights */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2DDD6]">
                <h2 className="text-[#0D2F5B] font-bold text-lg mb-4">Property Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-[#2D7A4F] flex-shrink-0" />
                      <span className="text-[#162338] text-sm">{h}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mt-5 pt-5 border-t border-[#E2DDD6]">
                  {property.titleClarity === "clear" && (
                    <TrustBadge icon={Shield} label="Clear Title" color="text-[#2D7A4F]" bg="bg-[#2D7A4F]/8" />
                  )}
                  {property.roadAccess && (
                    <TrustBadge icon={Navigation} label="Road Access" color="text-[#0D2F5B]" bg="bg-[#0D2F5B]/8" />
                  )}
                  <TrustBadge icon={CheckCircle} label="Verified Docs" color="text-[#B86A3C]" bg="bg-[#B86A3C]/8" />
                  <TrustBadge icon={Calendar} label="Site Visit Available" color="text-[#0D2F5B]" bg="bg-[#0D2F5B]/8" />
                </div>
              </div>

              {/* Investment Reasoning */}
              <div className="bg-[#0D2F5B] rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-[#B86A3C]" />
                  <h2 className="text-white font-bold text-lg">Investment Reasoning</h2>
                </div>
                <p className="text-white/80 text-sm leading-relaxed">{property.investmentReasoning}</p>
              </div>

              {/* Why This Property */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2DDD6]">
                <h2 className="text-[#0D2F5B] font-bold text-lg mb-3">Why This Property?</h2>
                <p className="text-[#6B7B94] text-sm leading-relaxed">{property.whyThisProperty}</p>
              </div>

              {/* Nearby Landmarks */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2DDD6]">
                <h2 className="text-[#0D2F5B] font-bold text-lg mb-4">Nearby Landmarks & Distances</h2>
                <div className="space-y-3">
                  {property.nearbyLandmarks.map((lm, i) => (
                    <div key={i} className="flex items-center justify-between py-2.5 border-b border-[#F7F3ED] last:border-0">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-[#F7F3ED] rounded-lg flex items-center justify-center text-base">
                          {lm.type === "airport" ? "✈️" : lm.type === "highway" ? "🛣️" : lm.type === "railway" ? "🚆" : "📍"}
                        </div>
                        <span className="text-[#162338] text-sm font-medium">{lm.name}</span>
                      </div>
                      <span className="text-[#B86A3C] text-sm font-semibold">{lm.distance}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Map */}
              <div className="bg-white rounded-2xl p-6 border border-[#E2DDD6]">
                <h2 className="text-[#0D2F5B] font-bold text-lg mb-4">Location on Map</h2>
                <div className="bg-[#F7F3ED] rounded-xl h-64 flex items-center justify-center border border-[#E2DDD6]">
                  <div className="text-center">
                    <MapPin className="w-8 h-8 text-[#B86A3C] mx-auto mb-2" />
                    <p className="text-[#6B7B94] text-sm">
                      {property.village}, {property.taluka}
                    </p>
                    <p className="text-xs text-[#6B7B94] mt-1">
                      {property.coordinates.lat.toFixed(4)}, {property.coordinates.lng.toFixed(4)}
                    </p>
                    <a
                      href={`https://maps.google.com/?q=${property.coordinates.lat},${property.coordinates.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-[#0D2F5B] border border-[#0D2F5B] px-3 py-1.5 rounded-lg hover:bg-[#0D2F5B] hover:text-white transition-colors"
                    >
                      <Navigation className="w-3 h-3" />
                      Open in Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Right Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                {/* Price / Unlock Card */}
                {priceUnlocked ? (
                  <div className="bg-white rounded-2xl p-6 border border-[#E2DDD6] shadow-sm">
                    <div className="mb-4">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <CheckCircle className="w-4 h-4 text-[#2D7A4F]" />
                        <span className="text-[#2D7A4F] text-xs font-semibold">Price Unlocked</span>
                      </div>
                      <div className="text-[#0D2F5B] font-bold text-3xl mt-1">
                        {formatPrice(property.priceTotal)}
                      </div>
                      <span className="text-[#6B7B94] text-sm">
                        ₹{property.pricePerSqft.toLocaleString()} per sqft
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      <a
                        href="tel:+918169693894"
                        className="w-full flex items-center justify-center gap-2 bg-[#0D2F5B] text-white font-bold text-sm py-3 rounded-xl hover:bg-[#0a2347] transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Call Now
                      </a>
                      <a
                        href={`https://wa.me/918169693894?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-sm py-3 rounded-xl hover:bg-[#1eb558] transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp Us
                      </a>
                      <Link
                        href="/book-site-visit"
                        className="w-full flex items-center justify-center gap-2 border-2 border-[#B86A3C] text-[#B86A3C] font-bold text-sm py-3 rounded-xl hover:bg-[#B86A3C] hover:text-white transition-colors"
                      >
                        <Calendar className="w-4 h-4" />
                        Book Site Visit
                      </Link>
                      {property.brochure && (
                        <a
                          href={property.brochure}
                          download
                          className="w-full flex items-center justify-center gap-2 border border-[#E2DDD6] text-[#162338] font-medium text-sm py-3 rounded-xl hover:bg-[#F7F3ED] transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download Brochure
                        </a>
                      )}
                    </div>
                    <p className="text-center text-xs text-[#6B7B94] mt-4">No obligation · Free consultation</p>
                  </div>
                ) : (
                  <PriceSidebarUnlock
                    propertyTitle={property.title}
                    onUnlocked={handlePriceUnlock}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#0D2F5B] text-2xl font-bold">Similar Properties in {property.location}</h2>
                <Link href="/properties" className="text-sm text-[#0D2F5B] font-semibold hover:text-[#B86A3C] transition-colors">
                  View All →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {similar.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}

function PriceUnlockBanner({
  property,
  priceUnlocked,
  onUnlocked,
}: {
  property: Property;
  priceUnlocked: boolean;
  onUnlocked: () => void;
}) {
  const [showModal, setShowModal] = useState(false);

  if (priceUnlocked) {
    return (
      <div className="bg-[#2D7A4F]/8 border border-[#2D7A4F]/25 rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-[#2D7A4F] flex-shrink-0" />
          <div>
            <p className="text-[#2D7A4F] text-xs font-semibold mb-0.5">Price Unlocked</p>
            <p className="text-[#0D2F5B] font-bold text-xl leading-none">
              {formatPrice(property.priceTotal)}
              <span className="text-sm font-normal text-[#6B7B94] ml-2">
                ₹{property.pricePerSqft.toLocaleString()} / sqft
              </span>
            </p>
          </div>
        </div>
        <a
          href={`https://wa.me/918169693894?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#25D366] text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:bg-[#1eb558] transition-colors flex-shrink-0"
        >
          <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="w-full bg-[#0D2F5B] rounded-2xl px-5 py-4 flex items-center justify-between hover:bg-[#0a2347] transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#B86A3C]/20 flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5 text-[#B86A3C]" />
          </div>
          <div className="text-left">
            <p className="text-[#B86A3C] text-xs font-bold uppercase tracking-widest mb-0.5">Price Hidden</p>
            <p className="text-white font-bold text-base leading-tight">
              Click to unlock price &amp; get details
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-[#B86A3C] text-white text-sm font-bold px-4 py-2 rounded-xl group-hover:bg-[#9a5630] transition-colors flex-shrink-0">
          Unlock <ArrowRight className="w-4 h-4" />
        </div>
      </button>

      {showModal && (
        <DetailPriceModal
          property={property}
          onClose={() => setShowModal(false)}
          onUnlocked={() => { setShowModal(false); onUnlocked(); }}
        />
      )}
    </>
  );
}

function DetailPriceModal({
  property,
  onClose,
  onUnlocked,
}: {
  property: Property;
  onClose: () => void;
  onUnlocked: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          message: `Price unlock — property detail page: ${property.title}`,
        }),
      });
    } catch {}
    localStorage.setItem(PRICE_KEY, "1");
    setLoading(false);
    setDone(true);
  }

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" onClick={!done ? onClose : undefined} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-[#0D2F5B] px-5 py-4 flex items-start justify-between">
            <div>
              <p className="text-[#B86A3C] text-xs font-bold uppercase tracking-widest mb-1">
                🔒 Price Locked
              </p>
              <h3 className="text-white font-bold text-base">Enter details to unlock price</h3>
              <p className="text-white/60 text-xs mt-0.5">Free · No spam · 2-hour response</p>
            </div>
            {!done && (
              <button onClick={onClose} className="ml-3 p-1.5 rounded-lg hover:bg-white/15 transition-colors">
                <X className="w-5 h-5 text-white/70" />
              </button>
            )}
          </div>

          <div className="px-5 py-5">
            {done ? (
              <div className="text-center py-2">
                <div className="text-4xl mb-2">🎉</div>
                <p className="text-[#0D2F5B] font-bold text-lg mb-1">Price Unlocked!</p>
                <p className="text-[#B86A3C] font-bold text-2xl mb-0.5">{formatPrice(property.priceTotal)}</p>
                <p className="text-[#6B7B94] text-sm mb-5">₹{property.pricePerSqft.toLocaleString()} per sqft</p>
                <div className="space-y-3">
                  <a
                    href={`https://wa.me/918169693894?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold px-5 py-3 rounded-xl text-sm hover:bg-[#1eb558] transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                  </a>
                  <button
                    onClick={onUnlocked}
                    className="w-full text-[#0D2F5B] text-sm font-semibold py-2 hover:underline"
                  >
                    View full details →
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name *"
                  className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/30 focus:border-[#0D2F5B] text-[#162338]"
                />
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number *"
                  className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/30 focus:border-[#0D2F5B] text-[#162338]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#B86A3C] text-white font-bold py-3 rounded-xl hover:bg-[#9a5630] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? "Unlocking..." : <><span>Unlock Price</span><ArrowRight className="w-4 h-4" /></>}
                </button>
                <div className="relative flex items-center gap-2 py-1">
                  <div className="flex-1 border-t border-[#E2DDD6]" />
                  <span className="text-xs text-[#6B7B94]">or</span>
                  <div className="flex-1 border-t border-[#E2DDD6]" />
                </div>
                <a
                  href={`https://wa.me/918169693894?text=Hi%2C%20I%20want%20to%20know%20the%20price%20of%20${encodeURIComponent(property.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-sm py-3 rounded-xl hover:bg-[#1eb558] transition-colors"
                >
                  <MessageCircle className="w-4 h-4" /> Ask on WhatsApp
                </a>
                <p className="text-center text-xs text-[#6B7B94]">No spam · Free · Response within 2 hours</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function PriceSidebarUnlock({
  propertyTitle,
  onUnlocked,
}: {
  propertyTitle: string;
  onUnlocked: () => void;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          message: `Price unlock — property detail: ${propertyTitle}`,
        }),
      });
    } catch {}
    setLoading(false);
    onUnlocked();
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2DDD6] shadow-sm overflow-hidden">
      {/* Locked header */}
      <div className="bg-[#0D2F5B] px-5 py-4">
        <div className="flex items-center gap-2 mb-1">
          <Lock className="w-4 h-4 text-[#B86A3C]" />
          <p className="text-[#B86A3C] text-xs font-bold uppercase tracking-widest">Price Hidden</p>
        </div>
        <h3 className="text-white font-bold text-base leading-snug">
          Submit details to unlock the price
        </h3>
        <p className="text-white/60 text-xs mt-1">Free · No spam · Response within 2 hours</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-5 space-y-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your Name *"
          className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/30 focus:border-[#0D2F5B] text-[#162338]"
        />
        <input
          required
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Phone Number *"
          className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/30 focus:border-[#0D2F5B] text-[#162338]"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#B86A3C] text-white font-bold py-3 rounded-xl hover:bg-[#9a5630] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {loading ? "Unlocking..." : <><span>Unlock Price & Details</span><ArrowRight className="w-4 h-4" /></>}
        </button>

        <div className="relative flex items-center gap-2 py-1">
          <div className="flex-1 border-t border-[#E2DDD6]" />
          <span className="text-xs text-[#6B7B94]">or</span>
          <div className="flex-1 border-t border-[#E2DDD6]" />
        </div>

        <a
          href={`https://wa.me/918169693894?text=Hi%2C%20I%20want%20to%20know%20the%20price%20of%20${encodeURIComponent(propertyTitle)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-sm py-3 rounded-xl hover:bg-[#1eb558] transition-colors"
        >
          <MessageCircle className="w-4 h-4" />
          Ask on WhatsApp
        </a>
      </form>
    </div>
  );
}

function PropertyGallery({ gallery, title }: { gallery: string[]; title: string }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  function goTo(idx: number) {
    if (idx === current || animating) return;
    setAnimating(true);
    setCurrent(idx);
    setTimeout(() => setAnimating(false), 300);
  }

  function prev() { goTo((current - 1 + gallery.length) % gallery.length); }
  function next() { goTo((current + 1) % gallery.length); }

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [current, animating]);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E2DDD6]">
      <div className="relative h-72 md:h-[420px] bg-[#0D2F5B]/5 overflow-hidden">
        <img
          key={current}
          src={gallery[current]}
          alt={`${title} — Photo ${current + 1}`}
          className="w-full h-full object-cover"
          style={{ animation: animating ? "galleryFade 0.3s ease-in-out" : "none" }}
        />

        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {gallery.length > 1 && (
          <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            📷 {gallery.length} Photos
          </div>
        )}

        {gallery.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
            {current + 1} / {gallery.length}
          </div>
        )}

        {gallery.length > 1 && (
          <div className="absolute bottom-3 left-3 text-white/60 text-[10px] hidden md:block">
            ← → keys to navigate
          </div>
        )}

        {gallery.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-[#162338]" />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white hover:scale-110 transition-all"
            >
              <ChevronRight className="w-5 h-5 text-[#162338]" />
            </button>
          </>
        )}
      </div>

      {gallery.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto scrollbar-hide">
          {gallery.map((img, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`View photo ${i + 1}`}
              className={`relative flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden transition-all duration-200 ${
                i === current
                  ? "ring-2 ring-[#B86A3C] ring-offset-1 scale-105"
                  : "opacity-55 hover:opacity-90 hover:scale-105"
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
              {i === 0 && (
                <div className="absolute bottom-0 inset-x-0 bg-[#B86A3C]/80 text-white text-[8px] font-bold text-center py-0.5">
                  MAIN
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {gallery.length > 1 && gallery.length <= 8 && (
        <div className="flex justify-center gap-1.5 pb-3 md:hidden">
          {gallery.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`rounded-full transition-all ${
                i === current
                  ? "w-5 h-2 bg-[#B86A3C]"
                  : "w-2 h-2 bg-[#E2DDD6] hover:bg-[#6B7B94]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function QuickFact({
  label,
  value,
  highlight,
  valueColor,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  valueColor?: string;
}) {
  return (
    <div className={`p-3 rounded-xl ${highlight ? "bg-[#0D2F5B]/5" : "bg-[#F7F3ED]"}`}>
      <div className="text-[#6B7B94] text-xs mb-0.5">{label}</div>
      <div className={`font-bold text-sm ${valueColor || (highlight ? "text-[#0D2F5B]" : "text-[#162338]")}`}>
        {value}
      </div>
    </div>
  );
}

function LockedFact({ label }: { label: string }) {
  return (
    <div className="p-3 rounded-xl bg-[#F7F3ED] border border-dashed border-[#B86A3C]/30">
      <div className="text-[#6B7B94] text-xs mb-0.5">{label}</div>
      <div className="font-bold text-sm text-[#B86A3C] flex items-center gap-1">
        <Lock className="w-3 h-3" /> Locked
      </div>
    </div>
  );
}

function TrustBadge({
  icon: Icon,
  label,
  color,
  bg,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${bg}`}>
      <Icon className={`w-3.5 h-3.5 ${color}`} />
      <span className={`text-xs font-semibold ${color}`}>{label}</span>
    </div>
  );
}
