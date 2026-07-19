import type { Metadata } from "next";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";

export const metadata: Metadata = {
  title: "WebbyBuildy | Web Design Studio, Mumbai",
  description: "Most websites take months and cost lakhs. Yours will take days. Custom-designed websites for your brand or business, built by three people you'll actually talk to.",
  openGraph: {
    title: "WebbyBuildy | Web Design Studio, Mumbai",
    description: "Most websites take months and cost lakhs. Yours will take days.",
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
      </head>
      <body>
        <LenisProvider>
        <main>{children}</main>
        </LenisProvider>
      </body>
    </html>
  );
}
