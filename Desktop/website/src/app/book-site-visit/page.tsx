import type { Metadata } from "next";
import BookSiteVisitClient from "./BookSiteVisitClient";

export const metadata: Metadata = {
  alternates: { canonical: "/book-site-visit" },
};

export default function Page() {
  return <BookSiteVisitClient />;
}
