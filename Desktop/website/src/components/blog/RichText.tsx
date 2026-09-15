import Link from "next/link";
import { parseInlineSegments } from "@/lib/blog";

export default function RichText({ text }: { text: string }) {
  const segments = parseInlineSegments(text);
  return (
    <>
      {segments.map((seg, i) =>
        seg.type === "link" ? (
          <Link
            key={i}
            href={seg.href}
            className="text-[#0D2F5B] font-semibold underline decoration-[#B86A3C]/40 underline-offset-2 hover:decoration-[#B86A3C] transition-colors"
          >
            {seg.text}
          </Link>
        ) : (
          <span key={i}>{seg.value}</span>
        )
      )}
    </>
  );
}
