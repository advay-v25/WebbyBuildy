import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://sitesmith.co.in/book",
  },
};

export default function BookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
