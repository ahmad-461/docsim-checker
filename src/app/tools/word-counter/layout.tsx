import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Word Counter Tool — Count Words, Characters & Reading Time | DocSim Checker",
  description: "Free online word counter. Instantly check word count, character count, and reading time. No sign-up required.",
};

export default function WordCounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
