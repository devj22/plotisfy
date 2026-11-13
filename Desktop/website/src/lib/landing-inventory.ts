import type { Property } from "@/types";

export const MIN_PARCEL_PRICE = 2.5e7; // ₹2.5 crore

export type LandCategory = "Residential zone" | "Agricultural / green zone";

const REGION_RE = /panvel|karjat|khalapur|khopoli/i;

/** Zone implied by a listing's title, or null if the title doesn't say. */
function zoneFromTitle(title: string): string | null {
  const t = title.toLowerCase();
  const residential = /\br-?\s?zone\b|residential/.test(t);
  const agri = /green zone|\bg1\b|agricultur|\bagri\b/.test(t);
  const other = /industrial|commercial|eco-?sensitive/.test(t);
  if (other || (residential && agri)) return "other";
  if (residential) return "Residential";
  if (agri) return "Agricultural";
  return null;
}

/** Area stated in the title, in guntha, or null if the title doesn't state one. */
function areaFromTitle(title: string): number | null {
  const m = title.match(/(\d+(?:\.\d+)?)\s*-?\s*(acres?|guntha)\b/i);
  if (!m) return null;
  const n = parseFloat(m[1]);
  return m[2].toLowerCase().startsWith("acre") ? n * 40 : n;
}

const near = (a: number, b: number, tolerance: number) => Math.abs(a - b) <= Math.abs(b) * tolerance;

/**
 * Reason a listing is excluded from the ad landing page, or null if it can be
 * shown. Listings whose stored category, area or price figures contradict each
 * other (or their own title) are left out rather than shown with wrong data.
 */
export function exclusionReason(p: Property): string | null {
  if (!p.published || p.status !== "available") return "not available";
  if (!REGION_RE.test(`${p.location} ${p.village} ${p.taluka} ${p.title}`)) return "outside target region";
  if (!(p.priceTotal >= MIN_PARCEL_PRICE)) return "price missing or under ₹2.5 Cr";
  if (!(p.areaGuntha > 0) || !(p.areaSqft > 0)) return "area missing";

  if (p.zoningType !== "Residential" && p.zoningType !== "Agricultural") return `category ${p.zoningType}`;
  const titleZone = zoneFromTitle(p.title);
  if (titleZone && titleZone !== p.zoningType) return `title zone (${titleZone}) ≠ category (${p.zoningType})`;

  const titleArea = areaFromTitle(p.title);
  if (titleArea !== null && !near(p.areaGuntha, titleArea, 0.05)) {
    return `title area ${titleArea} guntha ≠ stored ${p.areaGuntha.toFixed(1)} guntha`;
  }
  if (!near(p.areaSqft / 1089, p.areaGuntha, 0.05)) return "sq ft and guntha figures disagree";
  if (p.pricePerSqft > 0 && !near(p.priceTotal / p.areaSqft, p.pricePerSqft, 0.1)) return "price per sq ft disagrees with total";
  return null;
}

export function landCategory(p: Property): LandCategory {
  return p.zoningType === "Residential" ? "Residential zone" : "Agricultural / green zone";
}

export function formatLandArea(guntha: number): string {
  if (guntha >= 40) return `${+(guntha / 40).toFixed(2)} acres`;
  return `${+guntha.toFixed(1)} guntha`;
}
