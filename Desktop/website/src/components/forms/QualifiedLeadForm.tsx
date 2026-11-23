"use client";

import { useId, useState } from "react";
import { ArrowRight, Info } from "lucide-react";
import { useLeadSubmission } from "@/lib/use-lead-submission";
import {
  AREA_UNITS,
  BUDGET_OPTIONS,
  BELOW_BUDGET_MESSAGE,
  PURPOSE_OPTIONS,
  QUALIFIER_TEXT,
  budgetOption,
  checkQualifier,
} from "@/lib/lead-qualifier";

interface Props {
  /** Form identifier saved with the lead, e.g. "home_hero_form". */
  source: string;
  /** For price-unlock forms: the property the enquiry is about. */
  propertyId?: string;
  /** Free-text context saved in the lead's message. */
  context?: string;
  theme?: "light" | "dark";
  submitLabel: string;
  loadingLabel?: string;
  /** Called once the server has confirmed the lead was saved. */
  onSaved: () => void;
  footnote?: string;
  /** Extra fields shown to eligible buyers after the standard ones. */
  extraFields?: React.ReactNode;
  /** Extra values sent with the lead (e.g. visit date, location). */
  extraPayload?: Record<string, string>;
  submitIcon?: React.ReactNode;
}

/**
 * Budget-first enquiry form. The visitor picks a land purchase budget before
 * anything else; below ₹2.5 crore the form stops with a notice and collects
 * no contact details. Eligible visitors then give name, phone, purpose and
 * required land area. The lead conversion fires only after a confirmed save
 * (see useLeadSubmission).
 */
export default function QualifiedLeadForm({
  source,
  propertyId,
  context,
  theme = "light",
  submitLabel,
  loadingLabel = "Sending...",
  onSaved,
  footnote = "Free · No spam · Response within 2 hours",
  extraFields,
  extraPayload,
  submitIcon,
}: Props) {
  const id = useId();
  const { submit, loading, error } = useLeadSubmission(source);
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [purpose, setPurpose] = useState("");
  const [areaValue, setAreaValue] = useState("");
  const [areaUnit, setAreaUnit] = useState("acres");
  const [areaGuidance, setAreaGuidance] = useState(false);
  const [localError, setLocalError] = useState("");

  const option = budgetOption(budget);
  const below = option?.eligible === false;
  const eligible = option?.eligible === true;

  const dark = theme === "dark";
  const labelCls = dark ? "block text-white/80 text-xs font-semibold mb-1" : "block text-xs font-semibold text-[#162338] mb-1";
  const inputCls = dark
    ? "w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/15 [&>option]:text-[#162338]"
    : "w-full border border-[#E2DDD6] rounded-lg px-3 py-2.5 text-sm text-[#162338] bg-white focus:outline-none focus:ring-2 focus:ring-[#0D2F5B]/30 focus:border-[#0D2F5B]";
  const mutedCls = dark ? "text-white/60" : "text-[#6B7B94]";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const check = checkQualifier({ budget, purpose, areaValue, areaUnit, areaGuidance });
    if (!check.ok) {
      setLocalError(check.reason === "below_budget" ? "" : check.message);
      return;
    }
    setLocalError("");
    const saved = await submit({
      name,
      phone,
      budget,
      purpose,
      areaValue: areaGuidance ? "" : areaValue,
      areaUnit,
      areaGuidance: areaGuidance ? "1" : "",
      propertyId: propertyId ?? "",
      message: context ?? "",
      ...extraPayload,
    });
    if (saved) onSaved();
  }

  const shownError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-3" noValidate={below}>
      <p className={`text-xs font-semibold ${dark ? "text-[#E7B08A]" : "text-[#B86A3C]"}`}>{QUALIFIER_TEXT}</p>

      <div>
        <label htmlFor={`${id}-budget`} className={labelCls}>Land-only purchase budget *</label>
        <select
          id={`${id}-budget`}
          required
          value={budget}
          onChange={(e) => { setBudget(e.target.value); setLocalError(""); }}
          className={inputCls}
        >
          <option value="" disabled>Select your budget</option>
          {BUDGET_OPTIONS.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
      </div>

      {below && (
        <div
          role="status"
          className={`flex gap-2 rounded-xl p-3 text-sm leading-snug ${dark ? "bg-white/10 text-white/90 border border-white/20" : "bg-[#F7F3ED] text-[#162338] border border-[#E2DDD6]"}`}
        >
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#B86A3C]" />
          <span>{BELOW_BUDGET_MESSAGE}</span>
        </div>
      )}

      {eligible && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${id}-name`} className={labelCls}>Name *</label>
              <input id={`${id}-name`} required minLength={2} autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} />
            </div>
            <div>
              <label htmlFor={`${id}-phone`} className={labelCls}>Phone *</label>
              <input id={`${id}-phone`} required type="tel" autoComplete="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 ..." className={inputCls} />
            </div>
          </div>

          <div>
            <label htmlFor={`${id}-purpose`} className={labelCls}>Purpose *</label>
            <select id={`${id}-purpose`} required value={purpose} onChange={(e) => setPurpose(e.target.value)} className={inputCls}>
              <option value="" disabled>Select purpose</option>
              {PURPOSE_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`${id}-area`} className={labelCls}>Required land area *</label>
            <div className="flex gap-2">
              <input
                id={`${id}-area`}
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                required={!areaGuidance}
                disabled={areaGuidance}
                value={areaGuidance ? "" : areaValue}
                onChange={(e) => setAreaValue(e.target.value)}
                placeholder={areaGuidance ? "We'll guide you" : "e.g. 2"}
                className={`${inputCls} min-w-0 flex-1 disabled:opacity-50`}
              />
              <select
                aria-label="Area unit"
                disabled={areaGuidance}
                value={areaUnit}
                onChange={(e) => setAreaUnit(e.target.value)}
                className={`${inputCls} !w-28 flex-shrink-0 disabled:opacity-50`}
              >
                {AREA_UNITS.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
            </div>
            <label className={`mt-2 inline-flex items-center gap-2 text-xs cursor-pointer ${dark ? "text-white/80" : "text-[#162338]"}`}>
              <input type="checkbox" checked={areaGuidance} onChange={(e) => setAreaGuidance(e.target.checked)} className="w-4 h-4 accent-[#B86A3C]" />
              Need guidance
            </label>
          </div>

          {extraFields}

          {shownError && <p className={`text-xs leading-snug ${dark ? "text-red-300" : "text-red-600"}`}>{shownError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#B86A3C] text-white font-bold py-3 rounded-xl hover:bg-[#9a5630] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? loadingLabel : <>{submitIcon}<span>{submitLabel}</span>{!submitIcon && <ArrowRight className="w-4 h-4" />}</>}
          </button>
          {footnote && <p className={`text-center text-xs ${mutedCls}`}>{footnote}</p>}
        </>
      )}
    </form>
  );
}
