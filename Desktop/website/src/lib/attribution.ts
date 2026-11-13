/**
 * Captures campaign attribution (UTM tags and Google click identifiers) from
 * the landing URL so it can be saved with the enquiry. Kept in sessionStorage
 * so it survives in-page navigation; the first tagged visit in a session wins.
 */

const KEY = "plotzify_attribution";

export const ATTRIBUTION_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "gbraid",
  "wbraid",
] as const;

export type Attribution = Partial<Record<(typeof ATTRIBUTION_PARAMS)[number] | "landing_page", string>>;

export function captureAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Attribution = {};
  for (const p of ATTRIBUTION_PARAMS) {
    const v = params.get(p);
    if (v) fromUrl[p] = v.slice(0, 200);
  }
  try {
    const stored = sessionStorage.getItem(KEY);
    if (stored) return JSON.parse(stored) as Attribution;
    if (Object.keys(fromUrl).length > 0) {
      const withPage = { ...fromUrl, landing_page: window.location.pathname };
      sessionStorage.setItem(KEY, JSON.stringify(withPage));
      return withPage;
    }
  } catch {
    // Storage unavailable (private mode): fall back to the current URL only.
  }
  return { ...fromUrl, landing_page: window.location.pathname };
}
