import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ComponentType } from "react";
import {
  MapPin,
  CheckCircle,
  ChevronRight,
  Share2,
  Bookmark,
  Shield,
  TrendingUp,
  Navigation,
  Calendar,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import PropertyCard from "@/components/properties/PropertyCard";
import { prisma } from "@/lib/prisma";
import { mapDbProperty } from "@/lib/db-mappers";
import { formatArea } from "@/lib/utils";
import {
  PropertyGallery,
  PriceUnlockBanner,
  PriceSidebar,
  LockedPriceFacts,
} from "./PropertyDetailClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const row = await prisma.property.findFirst({ where: { slug, published: true } });
  if (!row) return { title: "Property Not Found | Plotzify" };
  const prop = mapDbProperty(row);
  const title = prop.seoTitle ?? `${prop.title} | Plotzify`;
  const description =
    prop.seoDescription ??
    `${prop.areaGuntha} Guntha plot in ${prop.village}, ${prop.taluka}. ${prop.investmentReasoning.slice(0, 120)}`;
  return {
    title,
    description,
    alternates: { canonical: `/properties/${slug}` },
    openGraph: {
      title,
      description,
      images: prop.gallery.length > 0 ? [prop.gallery[0]] : [],
    },
  };
}

export default async function PropertyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [row, allPublished] = await Promise.all([
    prisma.property.findFirst({ where: { slug, published: true } }),
    prisma.property.findMany({ where: { published: true }, take: 50 }),
  ]);

  if (!row) notFound();

  const property = mapDbProperty(row);
  const similar = allPublished
    .filter((p) => p.slug !== slug && p.location === row.location)
    .slice(0, 3)
    .map(mapDbProperty);

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
              {/* Gallery — interactive client component */}
              <PropertyGallery gallery={property.gallery} title={property.title} />

              {/* Price unlock banner — client component */}
              <PriceUnlockBanner property={property} />

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
                  {/* Price facts — client component handles lock/unlock */}
                  <LockedPriceFacts property={property} />
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
                <h2 className="text-[#0D2F5B] font-bold text-lg mb-4">Nearby Landmarks &amp; Distances</h2>
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

            {/* Sticky Right Sidebar — client component */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-4">
                <PriceSidebar property={property} />
              </div>
            </div>
          </div>

          {/* Similar Properties */}
          {similar.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[#0D2F5B] text-2xl font-bold">
                  Similar Properties in {property.location}
                </h2>
                <Link
                  href="/properties"
                  className="text-sm text-[#0D2F5B] font-semibold hover:text-[#B86A3C] transition-colors"
                >
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

function TrustBadge({
  icon: Icon,
  label,
  color,
  bg,
}: {
  icon: ComponentType<{ className?: string }>;
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
