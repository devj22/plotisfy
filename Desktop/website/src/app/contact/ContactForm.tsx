"use client";

import { useState } from "react";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="bg-white rounded-2xl border border-[#E2DDD6] p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-[#162338] font-bold text-lg mb-1">Message Sent!</h3>
        <p className="text-[#6B7B94] text-sm">Our team will reach out within 2 hours.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[#E2DDD6] p-6">
      <h2 className="text-[#0D2F5B] font-bold text-lg mb-5">Send us a message</h2>
      <form
        onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#162338] mb-1.5">Name</label>
            <input type="text" placeholder="Your name" required className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#162338] mb-1.5">Phone</label>
            <input type="tel" placeholder="+91 XXXXX XXXXX" className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#162338] mb-1.5">Email</label>
          <input type="email" placeholder="your@email.com" className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#162338] mb-1.5">Message</label>
          <textarea rows={4} placeholder="Tell us what you're looking for..." className="w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#0D2F5B] resize-none" />
        </div>
        <button type="submit" className="w-full bg-[#0D2F5B] text-white font-semibold py-3 rounded-xl hover:bg-[#0a2347] transition-colors">
          Send Message
        </button>
      </form>
    </div>
  );
}
