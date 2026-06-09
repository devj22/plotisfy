import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Plotzify – Premium Land Investment in Panvel & Khalapur",
    template: "%s | Plotzify",
  },
  description:
    "Discover verified land plots near Navi Mumbai Airport in Panvel and Khalapur. Premium land investment opportunities with clear title, road access, and expert guidance.",
  keywords: [
    "land plots Panvel",
    "land plots Khalapur",
    "Navi Mumbai Airport land",
    "land investment Maharashtra",
    "plots near expressway",
    "Plotzify",
  ],
  authors: [{ name: "Plotzify" }],
  creator: "Plotzify",
  metadataBase: new URL("https://plotzify.com"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://plotzify.com",
    siteName: "Plotzify",
    title: "Plotzify – Premium Land Investment in Panvel & Khalapur",
    description:
      "Verified land plots near Navi Mumbai Airport. Premium investment opportunities with clear title and road access.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plotzify – Premium Land Investment",
    description: "Verified land plots near Navi Mumbai Airport in Panvel & Khalapur.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${plusJakarta.variable} h-full antialiased`}>
      <head>
        {/* Google tag (gtag.js) - Google Ads AW-18224971112 */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=AW-18224971112"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'AW-18224971112');
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-off-white">{children}</body>
    </html>
  );
}
