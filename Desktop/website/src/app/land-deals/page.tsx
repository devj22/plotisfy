import type { Metadata } from "next";
import LandDealsClient from "./LandDealsClient";

export const metadata: Metadata = {
  alternates: { canonical: "/land-deals" },
};

export default function Page() {
  return <LandDealsClient />;
}
