"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import Link from "next/link";
import { MapPin, Home, CheckCircle, ArrowRight, Clock, MessageCircle, Phone } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { reportConversion } from "@/lib/gtag";

interface GatedProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  location: string;
  developer: string;
  totalUnits: number;
  priceMin: number;
  priceMax: number;
  amenities: string;
  gallery: string;
  status: string;
  featured: boolean;
  published: boolean;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  coming_soon: { label: "Coming Soon", color: "text-[#B86A3C]", bg: "bg-[#B86A3C]/10" },
  available:   { label: "Available",   color: "text-[#2D7A4F]", bg: "bg-[#2D7A4F]/10" },
  sold_out:    { label: "Sold Out",    color: "text-[#6B7B94]", bg: "bg-[#6B7B94]/10" },
};

export default function GatedCommunityPage() {
  const [projects, setProjects] = useState<GatedProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gated-projects?published=true")
      .then((r) => r.json())
      .then((data) => setProjects(Array.isArray(data) ? data : []))
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F7F3ED]">
        {/* Hero */}
        <section className="bg-[#0D2F5B] py-14 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/80 text-xs font-medium px-3 py-1.5 rounded-full mb-5">
              <Home className="w-3.5 h-3.5 text-[#B86A3C]" /> Curated Gated Developments
            </div>
            <h1 className="text-white text-3xl md:text-5xl font-bold mb-4">
              Gated Community <span className="text-[#B86A3C]">Projects</span>
            </h1>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Premium gated developments in Panvel &amp; Khalapur - Khopoli with world-class amenities, security, and verified clear titles.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-20 text-[#6B7B94]">Loading projects...</div>
          ) : projects.length === 0 ? (
            <ComingSoonState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((p) => (
                <ProjectCard key={p.id} project={p} />
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

function ProjectCard({ project }: { project: GatedProject }) {
  const gallery = (() => { try { return JSON.parse(project.gallery); } catch { return []; } })();
  const amenities = (() => { try { return JSON.parse(project.amenities); } catch { return []; } })();
  const cfg = STATUS_CONFIG[project.status] ?? STATUS_CONFIG.coming_soon;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E2DDD6] shadow-sm hover:shadow-md transition-shadow group">
      {/* Image */}
      <div className="relative h-48 bg-[#0D2F5B]/5 overflow-hidden">
        {gallery[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={gallery[0]} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Home className="w-12 h-12 text-[#E2DDD6]" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.bg} ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-[#B86A3C] text-white text-xs font-semibold px-2.5 py-1 rounded-full">Featured</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-1 mb-1">
          <MapPin className="w-3.5 h-3.5 text-[#B86A3C] flex-shrink-0" />
          <span className="text-xs text-[#6B7B94] font-medium">{project.location}</span>
        </div>
        <h3 className="text-[#0D2F5B] font-bold text-base mb-1 leading-snug">{project.title}</h3>
        {project.developer && (
          <p className="text-xs text-[#6B7B94] mb-3">By {project.developer}</p>
        )}

        {/* Price */}
        {(project.priceMin > 0 || project.priceMax > 0) && (
          <div className="mb-3">
            <span className="text-[#0D2F5B] font-bold text-sm">
              {formatPrice(project.priceMin)} – {formatPrice(project.priceMax)}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="flex gap-4 mb-3 text-xs text-[#6B7B94]">
          {project.totalUnits > 0 && <span>🏘️ {project.totalUnits} Units</span>}
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {amenities.slice(0, 3).map((a: string, i: number) => (
              <span key={i} className="flex items-center gap-1 text-xs bg-[#F7F3ED] text-[#6B7B94] px-2 py-0.5 rounded-full border border-[#E2DDD6]">
                <CheckCircle className="w-3 h-3 text-[#2D7A4F]" /> {a}
              </span>
            ))}
            {amenities.length > 3 && (
              <span className="text-xs text-[#6B7B94] px-2 py-0.5">+{amenities.length - 3} more</span>
            )}
          </div>
        )}

        {/* CTAs */}
        <div className="flex gap-2">
          <a
            href={`https://wa.me/918169693894?text=Hi%2C%20I%20am%20interested%20in%20${encodeURIComponent(project.title)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => reportConversion()}
            className="flex-1 flex items-center justify-center gap-1.5 bg-[#0D2F5B] text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-[#0a2347] transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> Enquire
          </a>
          <a
            href="tel:+918169693894"
            onClick={() => reportConversion()}
            className="flex items-center justify-center gap-1.5 border border-[#E2DDD6] text-[#0D2F5B] text-sm font-semibold px-3 py-2.5 rounded-xl hover:bg-[#F7F3ED] transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

function ComingSoonState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-20 h-20 bg-[#0D2F5B]/8 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <Clock className="w-10 h-10 text-[#0D2F5B]/40" />
      </div>
      <h2 className="text-[#0D2F5B] text-2xl font-bold mb-2">Coming Soon</h2>
      <p className="text-[#6B7B94] text-base max-w-md mb-8">
        We are curating premium gated community projects in Panvel &amp; Khalapur - Khopoli. Be the first to know when they launch.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <a
          href="https://wa.me/918169693894?text=Hi%2C%20I%20want%20to%20know%20about%20upcoming%20gated%20community%20projects"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => reportConversion()}
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
