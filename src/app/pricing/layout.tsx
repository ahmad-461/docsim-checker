import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DocSim Checker Pricing — Free and Pro Plans",
  description: "Compare plans for DocSim Checker. Explore our Free tier and Pro options for larger documents, unlimited comparisons, and detailed reports.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
