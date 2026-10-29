import Link from "next/link";
import { parseInlineSegments } from "@/lib/blog";

const LINK_CLS =
  "text-[#0D2F5B] font-semibold underline decoration-[#B86A3C]/40 underline-offset-2 hover:decoration-[#B86A3C] transition-colors";

export default function RichText({ text }: { text: string }) {
  const segments = parseInlineSegments(text);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.type === "bold") {
          return <strong key={i} className="font-semibold text-[#162338]">{seg.value}</strong>;
        }
        if (seg.type === "link") {
          // External sources open in a new tab; site links stay client-side.
          if (/^https?:\/\//.test(seg.href)) {
            return (
              <a key={i} href={seg.href} target="_blank" rel="noopener noreferrer" className={LINK_CLS}>
                {seg.text}
              </a>
            );
          }
          return (
            <Link key={i} href={seg.href} className={LINK_CLS}>
              {seg.text}
            </Link>
          );
        }
        return <span key={i}>{seg.value}</span>;
      })}
    </>
  );
}
