import type { Metadata } from "next";
import PropertiesClient from "./PropertiesClient";

export const metadata: Metadata = {
  alternates: { canonical: "/properties" },
};

export default function Page() {
  return <PropertiesClient />;
}
