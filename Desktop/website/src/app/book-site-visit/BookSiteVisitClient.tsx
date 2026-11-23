"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import { CheckCircle, Phone, MessageCircle, Calendar, MapPin } from "lucide-react";
import { reportConversion } from "@/lib/gtag";
import QualifiedLeadForm from "@/components/forms/QualifiedLeadForm";

export default function BookSiteVisitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [location, setLocation] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [notes, setNotes] = useState("");
  const today = new Date().toISOString().slice(0, 10);
  const fieldCls = "w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm text-[#162338] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/30 focus:border-[#0D2F5B]";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F7F3ED]">
        <section className="bg-[#0D2F5B] py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <Calendar className="w-10 h-10 text-[#B86A3C] mx-auto mb-4" />
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-3">Book a Site Visit</h1>
            <p className="text-white/70 text-lg">
              We organise weekend site visits from Mumbai and Pune. Our team will walk you through the
              property, answer questions, and help you make an informed decision.
            </p>
          </div>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Info */}
            <div>
              <h2 className="text-[#0D2F5B] text-xl font-bold mb-6">What to Expect</h2>
              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Share Your Preferences",
                    desc: "Tell us your location preference, budget, and purpose. We'll shortlist 2–3 properties for your visit.",
                  },
                  {
                    step: "2",
                    title: "We Confirm a Visit Date",
                    desc: "Weekend visits are organised every Saturday and Sunday. We confirm within 24 hours.",
                  },
                  {
                    step: "3",
                    title: "Guided Property Tour",
                    desc: "Our team meets you at the site and walks you through every detail — boundaries, road access, surroundings.",
                  },
                  {
                    step: "4",
                    title: "No Pressure. Just Facts.",
                    desc: "We never pressure you to decide on site. Take your time. We follow up with all documentation.",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="w-8 h-8 bg-[#0D2F5B] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="text-[#0D2F5B] font-semibold">{item.title}</h3>
                      <p className="text-[#6B7B94] text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 bg-white rounded-2xl p-5 border border-[#E2DDD6]">
                <h3 className="text-[#0D2F5B] font-bold mb-3">Prefer to call?</h3>
                <div className="flex gap-3">
                  <a
                    href="tel:+918169693894"
                    onClick={() => reportConversion()}
                    className="flex items-center gap-2 bg-[#0D2F5B] text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
                  >
                    <Phone className="w-4 h-4" /> Call Us
                  </a>
                  <a
                    href="https://wa.me/918169693894?text=Hi%2C%20I%27d%20like%20to%20book%20a%20site%20visit"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => reportConversion()}
                    className="flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
                  >
                    <MessageCircle className="w-4 h-4" /> WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Form */}
            <div>
              {submitted ? (
                <div className="bg-white rounded-2xl p-8 border border-[#E2DDD6] text-center">
                  <div className="w-16 h-16 bg-[#2D7A4F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-[#2D7A4F]" />
                  </div>
                  <h3 className="text-[#0D2F5B] font-bold text-xl mb-2">Visit Request Received!</h3>
                  <p className="text-[#6B7B94]">
                    Our team will call you within 4 hours to confirm your visit date and shortlist properties.
                  </p>
                  <a
                    href="https://wa.me/918169693894"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => reportConversion()}
                    className="inline-flex items-center gap-2 mt-5 bg-[#25D366] text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
                  >
                    💬 Continue on WhatsApp
                  </a>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 border border-[#E2DDD6] space-y-4">
                  <h2 className="text-[#0D2F5B] font-bold text-lg">Request a Site Visit</h2>
                  <QualifiedLeadForm
                    source="site_visit"
                    submitLabel="Request Site Visit"
                    submitIcon={<Calendar className="w-4 h-4" />}
                    footnote="Free · No obligation · Weekends available"
                    extraPayload={{
                      locationPreference: location,
                      visitDate,
                      message: ["Site visit request", visitDate && `Preferred date: ${visitDate}`, notes && `Notes: ${notes}`].filter(Boolean).join(" · "),
                    }}
                    extraFields={
                      <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label htmlFor="sv-location" className="block text-xs font-semibold text-[#162338] mb-1">Location Preference</label>
                            <select id="sv-location" value={location} onChange={(e) => setLocation(e.target.value)} className={fieldCls}>
                              <option value="">Select Location</option>
                              <option>Panvel</option>
                              <option>Khalapur - Khopoli</option>
                              <option>Karjat</option>
                              <option>Both / Open to either</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="sv-date" className="block text-xs font-semibold text-[#162338] mb-1">Preferred Visit Date</label>
                            <input id="sv-date" type="date" min={today} value={visitDate} onChange={(e) => setVisitDate(e.target.value)} className={fieldCls} />
                          </div>
                        </div>
                        <div>
                          <label htmlFor="sv-notes" className="block text-xs font-semibold text-[#162338] mb-1">Additional Notes</label>
                          <textarea id="sv-notes" rows={2} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any specific property or requirements..." className={`${fieldCls} resize-none`} />
                        </div>
                      </>
                    }
                    onSaved={() => {
                      setSubmitted(true);
                      window.open("/thank-you", "_blank", "noopener,noreferrer");
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileCTA />
    </>
  );
}
