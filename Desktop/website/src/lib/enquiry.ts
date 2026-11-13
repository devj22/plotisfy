/**
 * Shared options and validation for the land-near-mumbai shortlist enquiry.
 * The server is the source of truth (src/app/api/enquiries/route.ts); the
 * client uses the same rules only to show errors before submitting.
 */

export const MIN_BUDGET_LABEL = "₹2.5 crore";

export const BUDGET_OPTIONS = [
  { value: "below-2.5cr", label: "Below ₹2.5 crore", eligible: false },
  { value: "2.5-3cr", label: "₹2.5 – 3 crore", eligible: true },
  { value: "3-5cr", label: "₹3 – 5 crore", eligible: true },
  { value: "5-10cr", label: "₹5 – 10 crore", eligible: true },
  { value: "10cr-plus", label: "₹10 crore+", eligible: true },
] as const;

export const LOCATION_OPTIONS = ["Panvel", "Karjat", "Khalapur", "Khopoli", "Open to suggestions"] as const;

export const USE_OPTIONS = [
  "Residential / own home",
  "Farmhouse or weekend home",
  "Investment / land banking",
  "Agriculture",
  "Development project",
] as const;

export const TIMELINE_OPTIONS = [
  "Within 1 month",
  "1 – 3 months",
  "3 – 6 months",
  "6 – 12 months",
  "Just researching",
] as const;

export type BudgetValue = (typeof BUDGET_OPTIONS)[number]["value"];

export interface EnquiryInput {
  submissionId: string;
  name: string;
  mobile: string;
  location: string;
  intendedUse: string;
  timeline: string;
  budget: string;
  landArea: string;
}

export type FieldErrors = Partial<Record<keyof EnquiryInput, string>>;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function budgetOption(value: string) {
  return BUDGET_OPTIONS.find((b) => b.value === value);
}

/** Normalises an Indian mobile number to +91XXXXXXXXXX, or returns null if invalid. */
export function normaliseMobile(raw: string): string | null {
  let digits = raw.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith("0")) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? `+91${digits}` : null;
}

export function validateEnquiry(input: EnquiryInput): FieldErrors {
  const errors: FieldErrors = {};
  const name = input.name.trim();
  if (name.length < 2 || name.length > 80) errors.name = "Please enter your name.";
  if (!normaliseMobile(input.mobile)) errors.mobile = "Please enter a valid 10-digit mobile number.";
  if (!(LOCATION_OPTIONS as readonly string[]).includes(input.location)) errors.location = "Please choose a location.";
  if (!(USE_OPTIONS as readonly string[]).includes(input.intendedUse)) errors.intendedUse = "Please choose how you plan to use the land.";
  if (!(TIMELINE_OPTIONS as readonly string[]).includes(input.timeline)) errors.timeline = "Please choose your purchase timeline.";
  if (!budgetOption(input.budget)) errors.budget = "Please choose your budget.";
  if (input.landArea.length > 100) errors.landArea = "Please keep this under 100 characters.";
  if (!UUID_RE.test(input.submissionId)) errors.submissionId = "Invalid submission. Please reload the page.";
  return errors;
}
