/**
 * Budget-first qualification shared by the site's enquiry forms (price unlock,
 * homepage hero and enquiry, popup, mobile enquiry). /api/leads applies the
 * same rules on the server; the client uses them only to guide the visitor.
 */
import { BUDGET_OPTIONS, budgetOption } from "@/lib/enquiry";

export { BUDGET_OPTIONS, budgetOption };

export const BELOW_BUDGET_MESSAGE =
  "Our current land options start at ₹2.5 crore. We don’t currently have matching inventory for your selected budget.";

export const QUALIFIER_TEXT = "Land purchase budgets ₹2.5 crore and above";

export const PURPOSE_OPTIONS = [
  { value: "investment", label: "Investment" },
  { value: "development", label: "Development" },
  { value: "personal-use", label: "Personal use" },
  { value: "representing-buyer", label: "Representing a buyer" },
] as const;

export const AREA_UNITS = [
  { value: "acres", label: "Acres" },
  { value: "guntha", label: "Guntha" },
] as const;

export interface QualifierInput {
  budget: string;
  purpose: string;
  areaValue: string;
  areaUnit: string;
  areaGuidance: boolean;
}

export type QualifierResult =
  | { ok: true; budgetLabel: string; purposeLabel: string; landArea: string }
  | { ok: false; reason: "below_budget" | "validation"; field?: keyof QualifierInput; message: string };

export function checkQualifier(input: QualifierInput): QualifierResult {
  const budget = budgetOption(input.budget);
  if (!budget) return { ok: false, reason: "validation", field: "budget", message: "Please choose your land purchase budget." };
  if (!budget.eligible) return { ok: false, reason: "below_budget", field: "budget", message: BELOW_BUDGET_MESSAGE };

  const purpose = PURPOSE_OPTIONS.find((p) => p.value === input.purpose);
  if (!purpose) return { ok: false, reason: "validation", field: "purpose", message: "Please choose the purpose of purchase." };

  let landArea = "Need guidance";
  if (!input.areaGuidance) {
    const n = Number(input.areaValue);
    const unit = AREA_UNITS.find((u) => u.value === input.areaUnit);
    if (!input.areaValue.trim() || !Number.isFinite(n) || n <= 0 || n > 100000) {
      return { ok: false, reason: "validation", field: "areaValue", message: "Please enter the land area you need, or tick “Need guidance”." };
    }
    if (!unit) return { ok: false, reason: "validation", field: "areaUnit", message: "Please choose acres or guntha." };
    landArea = `${+n.toFixed(2)} ${unit.value}`;
  }

  return { ok: true, budgetLabel: budget.label, purposeLabel: purpose.label, landArea };
}
