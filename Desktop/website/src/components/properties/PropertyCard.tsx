"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Maximize2, CheckCircle, MessageCircle, X, ArrowRight, Lock } from "lucide-react";
import { Property } from "@/types";
import { formatPrice, formatArea } from "@/lib/utils";
import { cn } from "@/lib/utils";

const PRICE_KEY = "plotzify_price_unlocked";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
  const [priceUnlocked, setPriceUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(PRICE_KEY)) {
      setPriceUnlocked(true);
    }
  }, []);

  function onUnlocked() {
    sessionStorage.setItem(PRICE_KEY, "1");
    setPriceUnlocked(true);
    setShowModal(false);
  }

  const statusColor =
    property.status === "available"
      ? "bg-[#2D7A4F]/10 text-[#2D7A4F] border-[#2D7A4F]/20"
      : property.status === "reserved"
      ? "bg-[#B86A3C]/10 text-[#B86A3C] border-[#B86A3C]/20"
      : "bg-[#6B7B94]/10 text-[#6B7B94] border-[#6B7B94]/20";

  const statusLabel =
    property.status === "available"
      ? "Available"
      : property.status === "reserved"
      ? "Reserved"
      : "Sold";

  return (
    <>
      <div
        className={cn(
          "bg-white rounded-2xl overflow-hidden border border-[#E2DDD6] card-shadow card-shadow-hover group",
          className
        )}
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={property.gallery[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 left-3">
            <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full border", statusColor)}>
              {statusLabel}
            </span>
          </div>
          {property.featured && (
            <div className="absolute top-3 right-3">
              <span className="bg-[#B86A3C] text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                Featured
              </span>
            </div>
          )}
          <div className="absolute bottom-3 right-3">
            <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded font-mono">
              {property.propertyCode}
            </span>
          </div>
          {property.gallery.length > 1 && (
            <div className="absolute bottom-3 left-3">
              <span className="flex items-center gap-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                📷 {property.gallery.length}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start gap-1 mb-1">
            <MapPin className="w-3.5 h-3.5 text-[#B86A3C] mt-0.5 flex-shrink-0" />
            <span className="text-xs text-[#6B7B94] font-medium">
              {property.village}, {property.taluka}
            </span>
          </div>

          <h3 className="text-[#0D2F5B] font-bold text-base leading-snug mb-3 line-clamp-2">
            {property.title}
          </h3>

          {/* Price & Area Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              {priceUnlocked ? (
                <>
                  <div className="text-[#0D2F5B] font-bold text-lg">
                    {formatPrice(property.priceTotal)}
                  </div>
                  <span className="text-xs text-[#6B7B94]">
                    ₹{property.pricePerSqft.toLocaleString()} / sqft
                  </span>
                </>
              ) : (
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1.5 bg-[#B86A3C]/10 border border-[#B86A3C]/30 text-[#B86A3C] text-xs font-bold px-3 py-2 rounded-lg hover:bg-[#B86A3C]/20 transition-colors"
                >
                  <Lock className="w-3.5 h-3.5" />
                  View Price
                </button>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 justify-end">
                <Maximize2 className="w-3.5 h-3.5 text-[#6B7B94]" />
                <span className="text-[#162338] font-semibold text-sm">
                  {formatArea(property.areaSqft)}
                </span>
              </div>
              <span className="text-xs text-[#6B7B94]">{property.areaGuntha} Guntha</span>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {property.titleClarity === "clear" && (
              <span className="flex items-center gap-1 text-xs bg-[#2D7A4F]/8 text-[#2D7A4F] px-2 py-0.5 rounded-full border border-[#2D7A4F]/15">
                <CheckCircle className="w-3 h-3" /> Clear Title
              </span>
            )}
            {property.roadAccess && (
              <span className="flex items-center gap-1 text-xs bg-[#0D2F5B]/8 text-[#0D2F5B] px-2 py-0.5 rounded-full border border-[#0D2F5B]/15">
                <CheckCircle className="w-3 h-3" /> Road Access
              </span>
            )}
            <span className="text-xs bg-[#F7F3ED] text-[#6B7B94] px-2 py-0.5 rounded-full border border-[#E2DDD6]">
              {property.zoningType}
            </span>
          </div>

          {/* Highlights */}
          <div className="mb-4">
            <p className="text-xs text-[#6B7B94] line-clamp-2">
              {property.highlights.slice(0, 2).join(" · ")}
            </p>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-2">
            <Link
              href={`/properties/${property.slug}`}
              className="flex-1 bg-[#0D2F5B] text-white text-sm font-semibold py-2.5 rounded-lg text-center hover:bg-[#0a2347] transition-colors"
            >
              View Details
            </Link>
            <a
              href={`https://wa.me/918169693894?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 border border-[#25D366] text-[#25D366] text-sm font-semibold px-3 py-2.5 rounded-lg hover:bg-[#25D366]/5 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Price Unlock Modal */}
      {showModal && (
        <PriceUnlockModal
          propertyTitle={property.title}
          price={formatPrice(property.priceTotal)}
          pricePerSqft={`₹${property.pricePerSqft.toLocaleString()} / sqft`}
          whatsappUrl={`https://wa.me/918169693894?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}`}
          onClose={() => setShowModal(false)}
          onUnlocked={onUnlocked}
        />
      )}
    </>
  );
}

function PriceUnlockModal({
  propertyTitle,
  price,
  pricePerSqft,
  whatsappUrl,
  onClose,
  onUnlocked,
}: {
  propertyTitle: string;
  price: string;
  pricePerSqft: string;
  whatsappUrl: string;
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
          message: `Price unlock request for: ${propertyTitle}`,
        }),
      });
    } catch {}
    setLoading(false);
    setDone(true);
    onUnlocked();
  }

  return (
    <>
      <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-[#0D2F5B] px-5 py-4 flex items-start justify-between">
            <div>
              <p className="text-[#B86A3C] text-xs font-bold uppercase tracking-widest mb-1">
                🔒 Price Locked
              </p>
              <h3 className="text-white font-bold text-base leading-snug">
                Enter details to unlock price
              </h3>
              <p className="text-white/60 text-xs mt-0.5">Free · No spam · 2-hour response</p>
            </div>
            <button
              onClick={onClose}
              className="ml-3 p-1.5 rounded-lg hover:bg-white/15 transition-colors flex-shrink-0"
            >
              <X className="w-5 h-5 text-white/70" />
            </button>
          </div>

          {/* Body */}
          <div className="px-5 py-5">
            {done ? (
              <div className="text-center py-2">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-[#0D2F5B] font-bold text-lg mb-1">Price Unlocked!</p>
                <p className="text-[#B86A3C] font-bold text-2xl mb-0.5">{price}</p>
                <p className="text-[#6B7B94] text-sm mb-5">{pricePerSqft}</p>
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25D366] text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
                >
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </a>
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
                <p className="text-center text-xs text-[#6B7B94]">No spam · Free · Response within 2 hours</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
