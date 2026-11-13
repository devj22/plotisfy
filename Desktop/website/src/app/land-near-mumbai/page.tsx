import type { Metadata } from "next";
import { getPublishedProperties } from "@/lib/cms";
import { exclusionReason, formatLandArea, landCategory } from "@/lib/landing-inventory";
import LandNearMumbaiClient, { type LandingListing } from "./LandNearMumbaiClient";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Land Near Mumbai – Agricultural & Residential Land in Panvel, Karjat, Khalapur & Khopoli",
  description:
    "Looking for land near Mumbai? Agricultural and residential land in Panvel, Karjat, Khalapur and Khopoli for purchase budgets of ₹2.5 crore and above. Request a matching shortlist.",
  alternates: { canonical: "/land-near-mumbai" },
};

export default async function Page() {
  const properties = await getPublishedProperties();
  const listings: LandingListing[] = properties
    .filter((p) => exclusionReason(p) === null)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      place: [p.village, p.location].filter(Boolean).join(", ") || p.location,
      area: formatLandArea(p.areaGuntha),
      category: landCategory(p),
      image: p.gallery[0] ?? "",
    }));
  return <LandNearMumbaiClient listings={listings} />;
}
