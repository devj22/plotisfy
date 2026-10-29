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

export type ContentBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "img"; alt: string; src: string }
  | { type: "ul"; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "numbered"; number: string; text: string }
  | { type: "p"; text: string };

const IMG_RE = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const TABLE_SEPARATOR_RE = /^\|[\s:|-]+\|$/;

function splitTableRow(line: string): string[] {
  return line.replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}

/**
 * Classifies one paragraph of post content. Supports a small markdown subset
 * (`## `/`### ` headings, `- ` bullet lists, `|` tables, `![alt](src)` images)
 * on top of plain and numbered paragraphs, so older plain-text posts render unchanged.
 */
export function parseBlock(paragraph: string): ContentBlock {
  if (paragraph.startsWith("### ")) return { type: "h3", text: paragraph.slice(4).trim() };
  if (paragraph.startsWith("## ")) return { type: "h2", text: paragraph.slice(3).trim() };

  const img = paragraph.match(IMG_RE);
  if (img) return { type: "img", alt: img[1], src: img[2] };

  const lines = paragraph.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.every((l) => l.startsWith("- "))) {
    return { type: "ul", items: lines.map((l) => l.slice(2)) };
  }
  if (lines.length > 1 && lines.every((l) => l.startsWith("|") && l.endsWith("|"))) {
    const [head, ...rest] = lines.filter((l) => !TABLE_SEPARATOR_RE.test(l));
    return { type: "table", head: splitTableRow(head), rows: rest.map(splitTableRow) };
  }

  const numbered = parseNumberedParagraph(paragraph);
  if (numbered) return { type: "numbered", ...numbered };
  return { type: "p", text: paragraph };
}

export type ContentSegment =
  | { type: "text"; value: string }
  | { type: "bold"; value: string }
  | { type: "link"; text: string; href: string };

const INLINE_RE = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;

/** Parses inline `[label](href)` links and `**bold**` spans out of a plain-text paragraph. */
export function parseInlineSegments(text: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(INLINE_RE)) {
    const [full, label, href, bold] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) segments.push({ type: "text", value: text.slice(lastIndex, index) });
    if (bold !== undefined) segments.push({ type: "bold", value: bold });
    else segments.push({ type: "link", text: label, href });
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
