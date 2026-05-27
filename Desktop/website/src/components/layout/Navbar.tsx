"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  {
    label: "Properties",
    href: "/properties",
    children: [
      { label: "All Listings", href: "/properties" },
      { label: "Plots in Panvel", href: "/locations/panvel" },
      { label: "Plots in Khalapur", href: "/locations/khalapur" },
      { label: "Map View", href: "/properties?view=map" },
    ],
  },
  {
    label: "Locations",
    href: "/locations",
    children: [
      { label: "Panvel", href: "/locations/panvel" },
      { label: "Khalapur", href: "/locations/khalapur" },
      { label: "Near Airport", href: "/locations/navi-mumbai-airport" },
      { label: "Near Expressway", href: "/locations/expressway" },
    ],
  },
  {
    label: "Why Invest",
    href: "/why-invest",
    children: [
      { label: "Why Panvel", href: "/why-invest/panvel" },
      { label: "Why Khalapur", href: "/why-invest/khalapur" },
      { label: "Infrastructure Growth", href: "/why-invest/infrastructure" },
      { label: "Buyer Guides", href: "/why-invest/guides" },
    ],
  },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#E2DDD6] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#0D2F5B] rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">P</span>
            </div>
            <span className="text-[#0D2F5B] font-bold text-xl tracking-tight">
              Plotz<span className="text-[#B86A3C]">ify</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                    "text-[#162338] hover:text-[#0D2F5B] hover:bg-[#F7F3ED]"
                  )}
                >
                  {link.label}
                  {link.children && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                </Link>

                {link.children && activeDropdown === link.label && (
                  <div className="absolute top-full left-0 pt-1 w-52">
                    <div className="bg-white rounded-xl shadow-xl border border-[#E2DDD6] overflow-hidden">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2.5 text-sm text-[#162338] hover:bg-[#F7F3ED] hover:text-[#0D2F5B] transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/book-site-visit"
              className="text-sm font-medium text-[#0D2F5B] hover:text-[#B86A3C] transition-colors"
            >
              Book Site Visit
            </Link>

            <a
              href="tel:+918169693894"
              className="flex items-center gap-2 bg-[#0D2F5B] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#0a2347] transition-colors"
            >
              📞 Call Now
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-[#F7F3ED] transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <X className="w-5 h-5 text-[#162338]" />
            ) : (
              <Menu className="w-5 h-5 text-[#162338]" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[#E2DDD6] bg-white">
          <div className="px-4 py-4 space-y-1 max-h-[70vh] overflow-y-auto">
            {NAV_LINKS.map((link) => (
              <div key={link.label}>
                <Link
                  href={link.href}
                  className="block px-3 py-2.5 text-sm font-semibold text-[#162338] hover:text-[#0D2F5B] rounded-lg hover:bg-[#F7F3ED]"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
                {link.children && (
                  <div className="ml-4 space-y-0.5">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-3 py-2 text-sm text-[#6B7B94] hover:text-[#0D2F5B] rounded-lg hover:bg-[#F7F3ED]"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div className="pt-4 border-t border-[#E2DDD6] grid grid-cols-2 gap-2">
              <a
                href="tel:+918169693894"
                className="flex items-center justify-center gap-1.5 bg-[#0D2F5B] text-white text-sm font-semibold px-3 py-2.5 rounded-lg"
              >
                📞 Call
              </a>
              <a
                href="https://wa.me/918169693894"
                className="flex items-center justify-center gap-1.5 bg-[#25D366] text-white text-sm font-semibold px-3 py-2.5 rounded-lg"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
