import type { Metadata } from "next";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://sitesmith.co.in"),
  title: "Sitesmith | Web Design Studio, Mumbai",
  description: "Most websites take months and cost lakhs. Yours will take days. Custom-designed websites for your brand or business, built by three people you'll actually talk to.",
  alternates: {
    canonical: "https://sitesmith.co.in",
  },
  openGraph: {
    type: "website",
    siteName: "Sitesmith",
    url: "https://sitesmith.co.in",
    title: "Sitesmith | Web Design Studio, Mumbai",
    description: "Most websites take months and cost lakhs. Yours will take days.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Sitesmith — websites that move at the speed of your idea",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sitesmith | Web Design Studio, Mumbai",
    description: "Most websites take months and cost lakhs. Yours will take days.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* Analytics stub: GA4 snippet placeholder */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXXXXXXX');` }} /> */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            name: "Sitesmith",
            url: "https://sitesmith.co.in",
            description: "Web design studio in Mumbai building custom websites for professionals and businesses.",
            email: "studio@sitesmith.co.in",
            telephone: "+91-98202-36834",
            address: { "@type": "PostalAddress", addressLocality: "Mumbai", addressRegion: "Maharashtra", addressCountry: "IN" },
            areaServed: "IN",
            founder: [
              { "@type": "Person", name: "Aarav Aher" },
              { "@type": "Person", name: "Abhimanyu Gupta" },
              { "@type": "Person", name: "Advay Vaidya" },
            ],
          })}}
        />
      </head>
      <body suppressHydrationWarning>
        <LenisProvider>
        <main>{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}