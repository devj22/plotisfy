import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0D2F5B] text-white">
      {/* CTA Banner */}
      <div className="bg-[#B86A3C]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white text-xl font-bold">Ready to invest in your future?</h3>
            <p className="text-white/80 text-sm mt-1">
              Talk to our land investment team. No pressure, just facts.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/919820000000"
              className="bg-white text-[#B86A3C] font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-[#F7F3ED] transition-colors"
            >
              💬 WhatsApp Us
            </a>
            <Link
              href="/book-site-visit"
              className="bg-[#0D2F5B] text-white font-semibold text-sm px-5 py-2.5 rounded-lg hover:bg-[#0a2347] transition-colors"
            >
              Book Site Visit
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#B86A3C] rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">P</span>
              </div>
              <span className="text-white font-bold text-xl">
                Plotz<span className="text-[#B86A3C]">ify</span>
              </span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed max-w-xs">
              Premium land investment platform for Panvel and Khalapur, Maharashtra. Verified listings,
              clear titles, expert guidance.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a
                href="tel:+919820000000"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                📞 +91 98200 00000
              </a>
            </div>
            <div className="mt-2">
              <a
                href="mailto:hello@plotsify.com"
                className="text-sm text-white/70 hover:text-white transition-colors"
              >
                ✉️ hello@plotsify.com
              </a>
            </div>
            <p className="text-white/40 text-xs mt-4">
            </p>
          </div>

          {/* Properties */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Properties</h4>
            <ul className="space-y-2.5">
              {[
                { label: "All Listings", href: "/properties" },
                { label: "Plots in Panvel", href: "/locations/panvel" },
                { label: "Plots in Khalapur", href: "/locations/khalapur" },
                { label: "Near Airport", href: "/locations/navi-mumbai-airport" },
                { label: "Near Expressway", href: "/locations/expressway" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Invest */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Why Invest</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Why Panvel", href: "/why-invest/panvel" },
                { label: "Why Khalapur", href: "/why-invest/khalapur" },
                { label: "Infrastructure", href: "/why-invest/infrastructure" },
                { label: "Buyer Guides", href: "/why-invest/guides" },
                { label: "Testimonials", href: "/testimonials" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2.5">
              {[
                { label: "About Us", href: "/about" },
                { label: "Blog", href: "/blog" },
                { label: "FAQs", href: "/faqs" },
                { label: "Contact", href: "/contact" },
                { label: "Book Site Visit", href: "/book-site-visit" },
                { label: "Privacy Policy", href: "/privacy" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Infrastructure sources */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/30 text-xs leading-relaxed max-w-3xl">
            Infrastructure data sourced from official government sources:{" "}
            <a href="https://cidco.maharashtra.gov.in" className="hover:text-white/60 underline" target="_blank" rel="noopener noreferrer">CIDCO</a> (Airport – ~1,160 Ha, 60M pax capacity),{" "}
            <a href="https://mmrda.maharashtra.gov.in" className="hover:text-white/60 underline" target="_blank" rel="noopener noreferrer">MMRDA</a> (Atal Setu – 21.8 km),{" "}
            <a href="https://msrdc.in" className="hover:text-white/60 underline" target="_blank" rel="noopener noreferrer">MSRDC</a> (Missing Link – saves 20–25 min).
            Investment in land carries risk. Please conduct independent due diligence.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Plotsify. All rights reserved. Panvel & Khalapur, Maharashtra.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-white/40 hover:text-white/70 text-xs transition-colors">Privacy</Link>
            <Link href="/terms" className="text-white/40 hover:text-white/70 text-xs transition-colors">Terms</Link>
            <Link href="/sitemap.xml" className="text-white/40 hover:text-white/70 text-xs transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
