const WORDS_PER_MINUTE = 200;

export function estimateReadingMinutes(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
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

export function initials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}
