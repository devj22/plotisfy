import type { Metadata } from "next";
import GatedCommunityClient from "./GatedCommunityClient";

export const metadata: Metadata = {
  alternates: { canonical: "/gated-community" },
};

export default function Page() {
  return <GatedCommunityClient />;
}
