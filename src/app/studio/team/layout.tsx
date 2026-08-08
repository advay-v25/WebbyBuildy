import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://sitesmith.co.in/studio/team",
  },
};

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
