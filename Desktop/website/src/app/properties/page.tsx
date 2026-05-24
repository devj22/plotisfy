"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import PropertyCard from "@/components/properties/PropertyCard";
import { Property } from "@/types";
import { SlidersHorizontal, Grid3X3, List, Search, X, ChevronDown } from "lucide-react";

type SortOption = "featured" | "price-asc" | "price-desc" | "area-asc" | "area-desc" | "newest";

export default function PropertiesPage() {
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [location, setLocation] = useState("");
  const [budget, setBudget] = useState("");
  const [purpose, setPurpose] = useState("");
  const [zoning, setZoning] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("/api/properties?published=true")
      .then((r) => r.json())
      .then((data) => setAllProperties(Array.isArray(data) ? data : []))
      .catch(() => setAllProperties([]))
      .finally(() => setLoadingProps(false));
  }, []);

  const published = allProperties;

  let filtered = published.filter((p) => {
    if (location && p.location.toLowerCase() !== location.toLowerCase()) return false;
    if (status && p.status !== status) return false;
    if (zoning && !p.zoningType.toLowerCase().includes(zoning.toLowerCase())) return false;
    if (budget) {
      const price = p.priceTotal;
      if (budget === "under-30l" && price >= 3000000) return false;
      if (budget === "30-50l" && (price < 3000000 || price >= 5000000)) return false;
      if (budget === "50l-1cr" && (price < 5000000 || price >= 10000000)) return false;
      if (budget === "above-1cr" && price < 10000000) return false;
    }
    return true;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    if (sort === "price-asc") return a.priceTotal - b.priceTotal;
    if (sort === "price-desc") return b.priceTotal - a.priceTotal;
    if (sort === "area-asc") return a.areaSqft - b.areaSqft;
    if (sort === "area-desc") return b.areaSqft - a.areaSqft;
    if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  const activeFilterCount = [location, budget, purpose, zoning, status].filter(Boolean).length;

  const clearAll = () => {
    setLocation("");
    setBudget("");
    setPurpose("");
    setZoning("");
    setStatus("");
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F7F3ED]">
        {/* Header */}
        <div className="bg-[#0D2F5B] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
              Land Plots & Properties
            </h1>
            <p className="text-white/70">
              {loadingProps ? "Loading properties..." : `${filtered.length} verified properties in Panvel & Khalapur`}
            </p>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white border-b border-[#E2DDD6] sticky top-16 z-30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              {/* Location */}
              <FilterSelect
                value={location}
                onChange={setLocation}
                label="Location"
                options={[
                  { value: "Panvel", label: "Panvel" },
                  { value: "Khalapur", label: "Khalapur" },
                ]}
              />
              {/* Budget */}
              <FilterSelect
                value={budget}
                onChange={setBudget}
                label="Budget"
                options={[
                  { value: "under-30l", label: "Under ₹30L" },
                  { value: "30-50l", label: "₹30L – ₹50L" },
                  { value: "50l-1cr", label: "₹50L – ₹1Cr" },
                  { value: "above-1cr", label: "Above ₹1Cr" },
                ]}
              />
              {/* Status */}
              <FilterSelect
                value={status}
                onChange={setStatus}
                label="Status"
                options={[
                  { value: "available", label: "Available" },
                  { value: "reserved", label: "Reserved" },
                ]}
              />
              {/* Zoning */}
              <FilterSelect
                value={zoning}
                onChange={setZoning}
                label="Zoning"
                options={[
                  { value: "residential", label: "Residential" },
                  { value: "agricultural", label: "Agricultural" },
                  { value: "industrial", label: "Industrial" },
                  { value: "commercial", label: "Commercial" },
                ]}
              />

              {activeFilterCount > 0 && (
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#B86A3C] bg-[#B86A3C]/10 rounded-full border border-[#B86A3C]/20 flex-shrink-0 hover:bg-[#B86A3C]/20 transition-colors"
                >
                  <X className="w-3 h-3" />
                  Clear ({activeFilterCount})
                </button>
              )}

              {/* Sort */}
              <div className="ml-auto flex items-center gap-2 flex-shrink-0">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="text-xs border border-[#E2DDD6] rounded-lg px-3 py-1.5 text-[#162338] focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="area-asc">Area: Small First</option>
                  <option value="area-desc">Area: Large First</option>
                  <option value="newest">Newest First</option>
                </select>

                {/* View Toggle */}
                <div className="flex border border-[#E2DDD6] rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 ${
                      viewMode === "grid"
                        ? "bg-[#0D2F5B] text-white"
                        : "bg-white text-[#6B7B94] hover:bg-[#F7F3ED]"
                    } transition-colors`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 ${
                      viewMode === "list"
                        ? "bg-[#0D2F5B] text-white"
                        : "bg-white text-[#6B7B94] hover:bg-[#F7F3ED]"
                    } transition-colors`}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-[#E2DDD6] mx-auto mb-4" />
              <h3 className="text-[#0D2F5B] font-bold text-lg mb-2">No properties found</h3>
              <p className="text-[#6B7B94] text-sm mb-5">
                Try adjusting your filters to find more listings.
              </p>
              <button
                onClick={clearAll}
                className="bg-[#0D2F5B] text-white text-sm font-semibold px-5 py-2.5 rounded-lg"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <p className="text-[#6B7B94] text-sm mb-6">
                Showing <span className="font-semibold text-[#162338]">{filtered.length}</span> properties
              </p>
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {filtered.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  options: { value: string; label: string }[];
}

function FilterSelect({ value, onChange, label, options }: FilterSelectProps) {
  return (
    <div className="relative flex-shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none text-xs font-medium px-3 py-1.5 pr-7 rounded-full border transition-colors focus:outline-none cursor-pointer ${
          value
            ? "bg-[#0D2F5B] text-white border-[#0D2F5B]"
            : "bg-white text-[#162338] border-[#E2DDD6] hover:border-[#0D2F5B]"
        }`}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className={`absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 pointer-events-none ${
          value ? "text-white" : "text-[#6B7B94]"
        }`}
      />
    </div>
  );
}
