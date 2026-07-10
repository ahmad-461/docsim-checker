import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Text Case Converter — UPPERCASE & Title Case",
  description: "Free online case converter. Instantly switch text between UPPERCASE, lowercase, Title Case, Sentence case, camelCase, and snake_case. No sign-up required.",
};

export default function CaseConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
