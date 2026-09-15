const WORDS_PER_MINUTE = 200;

const LINK_RE = /\[([^\]]+)\]\(([^)]+)\)/g;

export function estimateReadingMinutes(content: string): number {
  const plain = content.replace(LINK_RE, "$1");
  const words = plain.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

export function splitParagraphs(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

const NUMBERED_LIST_RE = /^(\d+)\.\s+([\s\S]*)$/;

export function parseNumberedParagraph(paragraph: string): { number: string; text: string } | null {
  const match = paragraph.match(NUMBERED_LIST_RE);
  if (!match) return null;
  return { number: match[1], text: match[2] };
}

export type ContentSegment =
  | { type: "text"; value: string }
  | { type: "link"; text: string; href: string };

/** Parses inline `[label](href)` markdown links out of a plain-text paragraph. */
export function parseInlineSegments(text: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(LINK_RE)) {
    const [full, label, href] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) segments.push({ type: "text", value: text.slice(lastIndex, index) });
    segments.push({ type: "link", text: label, href });
    lastIndex = index + full.length;
  }
  if (lastIndex < text.length) segments.push({ type: "text", value: text.slice(lastIndex) });
  return segments;
}

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
