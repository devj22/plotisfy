import type { Metadata } from "next";
import FaqsClient from "./FaqsClient";

export const metadata: Metadata = {
  alternates: { canonical: "/faqs" },
};

export default function Page() {
  return <FaqsClient />;
}
