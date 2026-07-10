import { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — DocSim Checker Document Comparison Tool",
  description: "Get answers to frequently asked questions about DocSim Checker, document similarity limits, file format support, and data privacy.",
};

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
