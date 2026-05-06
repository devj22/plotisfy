import Link from "next/link";
import { MapPin, Maximize2, IndianRupee, CheckCircle, Phone, MessageCircle } from "lucide-react";
import { Property } from "@/types";
import { formatPrice, formatArea } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
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
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full border",
              statusColor
            )}
          >
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
        {/* Property Code */}
        <div className="absolute bottom-3 right-3">
          <span className="bg-black/60 text-white text-xs px-2 py-0.5 rounded font-mono">
            {property.propertyCode}
          </span>
        </div>
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
            <div className="flex items-center gap-0.5">
              <IndianRupee className="w-4 h-4 text-[#0D2F5B]" />
              <span className="text-[#0D2F5B] font-bold text-lg">
                {formatPrice(property.priceTotal)}
              </span>
            </div>
            <span className="text-xs text-[#6B7B94]">
              ₹{property.pricePerSqft.toLocaleString()} / sqft
            </span>
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
            href={`https://wa.me/919820000000?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}`}
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
  );
}
