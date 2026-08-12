"use client";

import { useState } from "react";
import { Link2, Check, MessageCircle } from "lucide-react";

export default function BlogShareBar({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${title} — ${typeof window !== "undefined" ? window.location.href : ""}`)}`;

  return (
    <div className="flex items-center gap-2">
      <a
        href={whatsappShareUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#25D366] hover:border-[#25D366] transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5" /> Share
      </a>
      <button
        type="button"
        onClick={copyLink}
        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg border border-[#E2DDD6] text-[#6B7B94] hover:text-[#0D2F5B] hover:border-[#0D2F5B] transition-colors"
      >
        {copied ? <Check className="w-3.5 h-3.5 text-[#2D7A4F]" /> : <Link2 className="w-3.5 h-3.5" />}
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
  );
}
