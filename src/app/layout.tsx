import type { Metadata } from "next";
import "./globals.css";
import Toolbar from "@/components/ui/Toolbar";

export const metadata: Metadata = {
  title: "[BRAND NAME] | Web Design Studio, Mumbai",
  description: "Most websites take months and cost lakhs. Yours will take days. Custom-designed websites for your brand or business, built by three people you'll actually talk to.",
  openGraph: {
    title: "[BRAND NAME] | Web Design Studio, Mumbai",
    description: "Most websites take months and cost lakhs. Yours will take days.",
    images: [
      {
        url: "/og-placeholder.png", // OG image placeholder
        width: 1200,
        height: 630,
        alt: "[IMAGE: OG Link Preview]",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Analytics stub: GA4 snippet placeholder */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
        <script dangerouslySetInnerHTML={{ __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-XXXXXXXXXX');` }} /> */}
      </head>
      <body>
        <Toolbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
