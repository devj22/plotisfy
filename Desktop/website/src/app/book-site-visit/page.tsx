"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileCTA from "@/components/layout/MobileCTA";
import { CheckCircle, Phone, MessageCircle, Calendar, MapPin, ArrowRight } from "lucide-react";

export default function BookSiteVisitPage() {
  const [submitted, setSubmitted] = useState(false);

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
                    className="flex items-center gap-2 bg-[#0D2F5B] text-white text-sm font-semibold px-4 py-2.5 rounded-xl"
                  >
                    <Phone className="w-4 h-4" /> Call Us
                  </a>
                  <a
                    href="https://wa.me/918169693894?text=Hi%2C%20I%27d%20like%20to%20book%20a%20site%20visit"
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
                    className="inline-flex items-center gap-2 mt-5 bg-[#25D366] text-white font-semibold px-5 py-2.5 rounded-xl text-sm"
                  >
                    💬 Continue on WhatsApp
                  </a>
                </div>
              ) : (
                <form
                  className="bg-white rounded-2xl p-6 border border-[#E2DDD6] space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <h2 className="text-[#0D2F5B] font-bold text-lg">Request a Site Visit</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[#162338] mb-1.5">Name *</label>
                      <input
                        required
                        type="text"
                        className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#162338] mb-1.5">Phone *</label>
                      <input
                        required
                        type="tel"
                        className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#162338] mb-1.5">Location Preference</label>
                    <select className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]">
                      <option value="">Select Location</option>
                      <option>Panvel</option>
                      <option>Khalapur</option>
                      <option>Both / Open to either</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#162338] mb-1.5">Preferred Visit Date</label>
                    <input
                      type="date"
                      className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#162338] mb-1.5">Budget Range</label>
                    <select className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]">
                      <option>₹3Cr – ₹5Cr</option>
                      <option>₹5Cr – ₹10Cr</option>
                      <option>Above ₹10Cr</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#162338] mb-1.5">Additional Notes</label>
                    <textarea
                      rows={2}
                      placeholder="Any specific property or requirements..."
                      className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#B86A3C] text-white font-bold py-3.5 rounded-xl hover:bg-[#9a5630] transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4" />
                    Request Site Visit
                  </button>
                  <p className="text-center text-xs text-[#6B7B94]">
                    Free · No obligation · Weekends available
                  </p>
                </form>
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
