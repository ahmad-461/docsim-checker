import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Word Counter Tool — Count Words & Chars | DocSim",
  description: "Free online word counter and analyzer. Instantly check word count, character count, and average reading time of your text files. No sign-up required.",
};

export default function WordCounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
