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

/**
 * Label of the Google Ads "Submit lead form" conversion (the part after
 * "AW-18224971112/" in its event snippet). While empty, no Ads lead
 * conversion is sent.
 */
const LEAD_FORM_CONVERSION_LABEL = "hBfuCKG0ic8cEOj6q_JD";

/**
 * Reports a submitted shortlist enquiry. Call only after the server has saved
 * an eligible lead. `leadId` is a random, non-personal id; Google Ads
 * de-duplicates conversions that share a transaction_id. Never pass names,
 * phone numbers or messages here.
 */
export function reportLeadSubmitted(leadId: string, details: { budget: string; location: string }) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  if (LEAD_FORM_CONVERSION_LABEL) {
    window.gtag("event", "conversion", {
      send_to: `AW-18224971112/${LEAD_FORM_CONVERSION_LABEL}`,
      transaction_id: leadId,
    });
  }
  window.gtag("event", "generate_lead", {
    send_to: "G-9G2ZJGJEKR",
    lead_source: "land_near_mumbai",
    budget_band: details.budget,
    preferred_location: details.location,
  });
}
