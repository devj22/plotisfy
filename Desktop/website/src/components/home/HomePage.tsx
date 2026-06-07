"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  ChevronRight,
  Shield,
  CheckCircle,
  TrendingUp,
  MapPin,
  Quote,
  Star,
  Plane,
  Zap,
  Truck,
  ChevronDown,
  ArrowRight,
  Building2,
  Users,
  Award,
} from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import { TESTIMONIALS, INFRASTRUCTURE_HIGHLIGHTS, FAQS } from "@/lib/data";
import { Property } from "@/types";

const TRUST_BADGES = [
  { icon: Shield, label: "Verified Docs", color: "text-[#2D7A4F]" },
  { icon: CheckCircle, label: "Clear Title", color: "text-[#0D2F5B]" },
  { icon: MapPin, label: "Road Access", color: "text-[#B86A3C]" },
  { icon: Users, label: "Site Visit Support", color: "text-[#0D2F5B]" },
];

const STATS = [
  { value: "50+", label: "Verified Listings" },
  { value: "200+", label: "Happy Investors" },
  { value: "₹120Cr+", label: "Land Transacted" },
  { value: "2", label: "Premium Locations" },
];

const INFRA_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  airport: Plane,
  bridge: Zap,
  road: Truck,
};

export default function HomePage() {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetch("/api/properties?published=true")
      .then((r) => r.json())
      .then((data: Property[]) => {
        if (Array.isArray(data)) {
          setFeaturedProperties(data.filter((p) => p.featured).slice(0, 6));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600')",
          }}
        />
        <div className="absolute inset-0 gradient-hero" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-3xl">
            {/* Tag */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 bg-[#B86A3C] rounded-full animate-pulse" />
              Land Investment · Panvel & Khalapur · Maharashtra
            </div>

            <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Invest in Land That's{" "}
              <span className="text-[#B86A3C]">Ready to Grow</span>{" "}
              With India
            </h1>

            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl">
              Premium verified plots in Panvel and Khalapur — next to India's newest international
              airport, Atal Setu, and the Mumbai-Pune Expressway missing link.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 bg-[#B86A3C] text-white font-bold text-base px-7 py-3.5 rounded-xl hover:bg-[#9a5630] transition-colors"
              >
                View Properties <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/918169693894"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-bold text-base px-7 py-3.5 rounded-xl hover:bg-white/20 transition-colors"
              >
                💬 WhatsApp Now
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-3">
              {TRUST_BADGES.map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-medium px-3 py-1.5 rounded-lg"
                >
                  <badge.icon className={`w-3.5 h-3.5 ${badge.color}`} />
                  {badge.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown className="w-6 h-6 text-white/50 animate-bounce" />
        </div>
      </section>

      {/* ===== STATS STRIP ===== */}
      <section className="bg-[#0D2F5B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-[#B86A3C] font-bold text-3xl md:text-4xl">{stat.value}</div>
                <div className="text-white/60 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SEARCH ===== */}
      <section className="bg-white border-b border-[#E2DDD6]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-[#0D2F5B] text-xl font-bold text-center mb-6">
            Find Your Perfect Plot
          </h2>
          <SmartSearch />
        </div>
      </section>

      {/* ===== FEATURED LISTINGS ===== */}
      <section className="section-padding bg-[#F7F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#B86A3C] text-sm font-semibold uppercase tracking-wider mb-2">
                Premium Listings
              </p>
              <h2 className="text-[#0D2F5B] text-3xl md:text-4xl font-bold">
                Featured Properties
              </h2>
              <p className="text-[#6B7B94] mt-2 max-w-xl">
                Hand-picked verified plots with clear titles, road access, and strong investment
                fundamentals.
              </p>
            </div>
            <Link
              href="/properties"
              className="hidden md:flex items-center gap-2 text-[#0D2F5B] font-semibold text-sm hover:text-[#B86A3C] transition-colors"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          <div className="mt-10 text-center md:hidden">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 bg-[#0D2F5B] text-white font-semibold px-6 py-3 rounded-xl"
            >
              View All Properties <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== LOCATIONS ===== */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#B86A3C] text-sm font-semibold uppercase tracking-wider mb-2">
              Where We Operate
            </p>
            <h2 className="text-[#0D2F5B] text-3xl md:text-4xl font-bold">Two Strategic Locations</h2>
            <p className="text-[#6B7B94] mt-3 max-w-xl mx-auto">
              Both locations sit in Maharashtra's most exciting infrastructure growth corridors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Panvel */}
            <div className="relative rounded-2xl overflow-hidden group h-80">
              <img
                src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800"
                alt="Panvel"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D2F5B]/90 via-[#0D2F5B]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-[#B86A3C]" />
                  <span className="text-white/70 text-sm">Raigad District</span>
                </div>
                <h3 className="text-white font-bold text-2xl mb-1">Plots in Panvel</h3>
                <p className="text-white/70 text-sm mb-4">
                  Next to India's newest international airport. CIDCO-approved zones with rapid infrastructure development.
                </p>
                <Link
                  href="/locations/panvel"
                  className="inline-flex items-center gap-2 bg-[#B86A3C] text-white text-sm font-semibold px-4 py-2 rounded-lg"
                >
                  Explore Panvel <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Khalapur */}
            <div className="relative rounded-2xl overflow-hidden group h-80">
              <img
                src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800"
                alt="Khalapur"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#162338]/90 via-[#162338]/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-[#B86A3C]" />
                  <span className="text-white/70 text-sm">Raigad District</span>
                </div>
                <h3 className="text-white font-bold text-2xl mb-1">Plots in Khalapur</h3>
                <p className="text-white/70 text-sm mb-4">
                  On the Mumbai-Pune Expressway corridor. Weekend homes, farmhouses, and long-term investment land.
                </p>
                <Link
                  href="/locations/khalapur"
                  className="inline-flex items-center gap-2 bg-[#0D2F5B] text-white text-sm font-semibold px-4 py-2 rounded-lg"
                >
                  Explore Khalapur <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INFRASTRUCTURE ===== */}
      <section className="section-padding bg-[#0D2F5B]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#B86A3C] text-sm font-semibold uppercase tracking-wider mb-2">
              The Growth Catalysts
            </p>
            <h2 className="text-white text-3xl md:text-4xl font-bold">
              Infrastructure Driving Land Values
            </h2>
            <p className="text-white/60 mt-3 max-w-xl mx-auto">
              Three major government-backed projects are transforming the Panvel–Khalapur corridor
              into one of Maharashtra's fastest-appreciating land zones.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {INFRASTRUCTURE_HIGHLIGHTS.map((item) => {
              const Icon = INFRA_ICONS[item.icon] || Zap;
              return (
                <div
                  key={item.id}
                  className="bg-white/8 border border-white/10 rounded-2xl p-6 hover:bg-white/12 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-[#B86A3C]/20 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-[#B86A3C]" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 bg-[#B86A3C] rounded-full" />
                      <span className="text-[#B86A3C] text-xs font-semibold">{item.impact}</span>
                    </div>
                  </div>
                  <span className="text-[#B86A3C]/70 text-xs font-medium uppercase tracking-wide">
                    {item.location}
                  </span>
                  <h3 className="text-white font-bold text-lg mt-1 mb-3">{item.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed mb-4">{item.description}</p>
                  <a
                    href={item.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/40 hover:text-white/70 transition-colors"
                  >
                    Source: {item.source} ↗
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WHY PLOTSIFY ===== */}
      <section className="section-padding bg-[#F7F3ED]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[#B86A3C] text-sm font-semibold uppercase tracking-wider mb-3">
                Why Choose Plotzify
              </p>
              <h2 className="text-[#0D2F5B] text-3xl md:text-4xl font-bold mb-6">
                Premium Land, Transparent Process, Real Guidance
              </h2>
              <p className="text-[#6B7B94] text-lg leading-relaxed mb-8">
                We are not a portal that lists anything and everything. Every property on Plotzify is
                personally verified by our team — title, road access, zoning, and neighbouring
                development.
              </p>

              <div className="space-y-5">
                {[
                  {
                    icon: Shield,
                    title: "Verified Documentation",
                    desc: "7/12 extract, property card, encumbrance certificate — all checked before listing.",
                  },
                  {
                    icon: CheckCircle,
                    title: "Clear Title Properties",
                    desc: "We only list properties with unambiguous title history. No disputes, no surprises.",
                  },
                  {
                    icon: TrendingUp,
                    title: "Investment-First Reasoning",
                    desc: "Every listing explains why this property makes financial sense, not just what it is.",
                  },
                  {
                    icon: Users,
                    title: "White-Glove Site Visits",
                    desc: "Weekend visits organised from Mumbai and Pune. No cold leads, no pressure.",
                  },
                ].map((item) => (
                  <div key={item.title} className="flex gap-4">
                    <div className="w-10 h-10 bg-[#0D2F5B]/8 rounded-xl flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-[#0D2F5B]" />
                    </div>
                    <div>
                      <h4 className="text-[#0D2F5B] font-semibold mb-0.5">{item.title}</h4>
                      <p className="text-[#6B7B94] text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=700"
                alt="Plotzify Team"
                className="rounded-2xl w-full object-cover h-96"
              />
              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-xl border border-[#E2DDD6]">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-[#B86A3C]" />
                  <div>
                    <div className="text-[#0D2F5B] font-bold text-sm">Trusted Platform</div>
                    <div className="text-[#6B7B94] text-xs">200+ investors served</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-[#B86A3C] text-sm font-semibold uppercase tracking-wider mb-2">
              Investor Stories
            </p>
            <h2 className="text-[#0D2F5B] text-3xl md:text-4xl font-bold">
              What Our Investors Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TESTIMONIALS.slice(0, 3).map((t) => (
              <div
                key={t.id}
                className="bg-[#F7F3ED] rounded-2xl p-6 border border-[#E2DDD6]"
              >
                <Quote className="w-6 h-6 text-[#B86A3C]/40 mb-4" />
                <p className="text-[#162338] text-sm leading-relaxed mb-5 line-clamp-3">
                  &ldquo;{t.content}&rdquo;
                </p>
                {t.propertyPurchased && (
                  <p className="text-[#B86A3C] text-xs font-medium mb-4 truncate">
                    📍 {t.propertyPurchased}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0D2F5B] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-[#0D2F5B] font-semibold text-sm">{t.name}</div>
                    <div className="text-[#6B7B94] text-xs">{t.location}</div>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-[#B86A3C] fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/testimonials"
              className="inline-flex items-center gap-2 text-[#0D2F5B] font-semibold hover:text-[#B86A3C] transition-colors"
            >
              Read more stories <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== ENQUIRY FORM ===== */}
      <section className="section-padding bg-[#F7F3ED]" id="enquire">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="text-[#B86A3C] text-sm font-semibold uppercase tracking-wider mb-2">
              Get in Touch
            </p>
            <h2 className="text-[#0D2F5B] text-3xl font-bold">Tell Us What You're Looking For</h2>
            <p className="text-[#6B7B94] mt-2">
              We'll get back to you within 2 hours with matching options.
            </p>
          </div>
          <EnquiryForm />
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="section-padding bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-[#0D2F5B] text-3xl font-bold">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.slice(0, 5).map((faq) => (
              <div
                key={faq.id}
                className="bg-[#F7F3ED] rounded-xl border border-[#E2DDD6] overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between p-5 text-left"
                  onClick={() => setActiveFaq(activeFaq === faq.id ? null : faq.id)}
                >
                  <span className="text-[#0D2F5B] font-semibold text-sm pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#6B7B94] flex-shrink-0 transition-transform ${
                      activeFaq === faq.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === faq.id && (
                  <div className="px-5 pb-5">
                    <p className="text-[#6B7B94] text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/faqs"
              className="inline-flex items-center gap-2 text-[#0D2F5B] font-semibold hover:text-[#B86A3C] transition-colors"
            >
              View all FAQs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function SmartSearch() {
  return (
    <div className="bg-[#F7F3ED] rounded-2xl border border-[#E2DDD6] p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <select className="w-full bg-white border border-[#E2DDD6] text-[#162338] text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#B86A3C]/40">
          <option value="">All Locations</option>
          <option value="panvel">Panvel</option>
          <option value="khalapur">Khalapur</option>
        </select>
        <select className="w-full bg-white border border-[#E2DDD6] text-[#162338] text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#B86A3C]/40">
          <option value="">Any Budget</option>
          <option value="3-5cr">₹3Cr – ₹5Cr</option>
          <option value="5-10cr">₹5Cr – ₹10Cr</option>
          <option value="above-10cr">Above ₹10Cr</option>
        </select>
        <select className="w-full bg-white border border-[#E2DDD6] text-[#162338] text-sm rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#B86A3C]/40">
          <option value="">Any Purpose</option>
          <option value="investment">Investment</option>
          <option value="self-use">Self Use</option>
          <option value="weekend-home">Weekend Home</option>
          <option value="agriculture">Agriculture</option>
        </select>
        <Link
          href="/properties"
          className="flex items-center justify-center gap-2 bg-[#0D2F5B] text-white text-sm font-semibold rounded-lg px-4 py-2.5 hover:bg-[#0a2347] transition-colors"
        >
          <Search className="w-4 h-4" />
          Search Plots
        </Link>
      </div>
    </div>
  );
}

function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [locationPreference, setLocationPreference] = useState("");
  const [budgetRange, setBudgetRange] = useState("");
  const [message, setMessage] = useState("");

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center border border-[#E2DDD6]">
        <div className="w-14 h-14 bg-[#2D7A4F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-[#2D7A4F]" />
        </div>
        <h3 className="text-[#0D2F5B] font-bold text-xl mb-2">Enquiry Received!</h3>
        <p className="text-[#6B7B94] text-sm">
          Our team will contact you within 2 hours with matching property options.
        </p>
        <a
          href="https://wa.me/918169693894"
          className="inline-flex items-center gap-2 mt-5 bg-[#25D366] text-white font-semibold px-5 py-2.5 rounded-lg text-sm"
        >
          💬 Continue on WhatsApp
        </a>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, locationPreference, budgetRange, message }),
      });
    } catch {
      // still show success to user even if save fails
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  }

  return (
    <form
      className="bg-white rounded-2xl p-6 md:p-8 border border-[#E2DDD6] space-y-4"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#162338] mb-1.5">Full Name *</label>
          <input
            required
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full border border-[#E2DDD6] rounded-lg px-3.5 py-2.5 text-sm text-[#162338] focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/30 focus:border-[#0D2F5B]"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#162338] mb-1.5">Phone Number *</label>
          <input
            required
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 ..."
            className="w-full border border-[#E2DDD6] rounded-lg px-3.5 py-2.5 text-sm text-[#162338] focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/30 focus:border-[#0D2F5B]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#162338] mb-1.5">Location Preference</label>
          <select
            value={locationPreference}
            onChange={(e) => setLocationPreference(e.target.value)}
            className="w-full border border-[#E2DDD6] rounded-lg px-3.5 py-2.5 text-sm text-[#162338] focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/30 focus:border-[#0D2F5B]"
          >
            <option value="">Any Location</option>
            <option value="Panvel">Panvel</option>
            <option value="Khalapur">Khalapur</option>
            <option value="Both / Open">Both / Open</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#162338] mb-1.5">Budget Range</label>
          <select
            value={budgetRange}
            onChange={(e) => setBudgetRange(e.target.value)}
            className="w-full border border-[#E2DDD6] rounded-lg px-3.5 py-2.5 text-sm text-[#162338] focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/30 focus:border-[#0D2F5B]"
          >
            <option value="">Select Budget</option>
            <option value="₹3Cr – ₹5Cr">₹3Cr – ₹5Cr</option>
            <option value="₹5Cr – ₹10Cr">₹5Cr – ₹10Cr</option>
            <option value="Above ₹10Cr">Above ₹10Cr</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#162338] mb-1.5">Message (optional)</label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your investment goals..."
          className="w-full border border-[#E2DDD6] rounded-lg px-3.5 py-2.5 text-sm text-[#162338] focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/30 focus:border-[#0D2F5B] resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#0D2F5B] text-white font-bold text-base py-3.5 rounded-xl hover:bg-[#0a2347] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? "Sending..." : <><span>Send Enquiry</span> <ArrowRight className="w-4 h-4" /></>}
      </button>
      <p className="text-center text-xs text-[#6B7B94]">
        We respond within 2 hours · No spam
      </p>
    </form>
  );
}
