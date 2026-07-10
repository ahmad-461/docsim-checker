import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact DocSim Checker — Questions & Feedback",
  description: "Get in touch with the DocSim Checker team. Send us your feedback, bug reports, feature requests, or questions through our secure contact form.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
