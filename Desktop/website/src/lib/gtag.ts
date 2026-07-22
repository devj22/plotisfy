declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const CONTACT_CONVERSION_SEND_TO = "AW-18224971112/V8DRCJHEos8cEOj6q_JD";

/**
 * Fires the Google Ads "Contact" conversion for Call / WhatsApp clicks.
 * These links either open a native app (tel:) or a new tab (wa.me), so the
 * current page never unloads and no delayed-redirect trick is needed.
 */
export function reportConversion() {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: CONTACT_CONVERSION_SEND_TO,
    });
  }
}
