"use client";

import { AnchorHTMLAttributes } from "react";
import { reportConversion } from "@/lib/gtag";

/**
 * Drop-in replacement for <a> on tel:/wa.me contact links. Fires the Google
 * Ads "Contact" conversion on click, then lets the link behave normally.
 * Exists so server-component pages don't need to become client components
 * just to attach an onClick handler.
 */
export default function TrackedContactLink({
  onClick,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      {...props}
      onClick={(e) => {
        reportConversion();
        onClick?.(e);
      }}
    />
  );
}
