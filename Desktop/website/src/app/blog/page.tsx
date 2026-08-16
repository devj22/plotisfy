import type { Metadata } from "next";
import BlogListClient from "./BlogListClient";

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
};

export default function Page() {
  return <BlogListClient />;
}
