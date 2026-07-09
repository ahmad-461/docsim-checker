import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Free Duplicate Line Remover Tool | DocSim Checker",
  description: "Free tool to remove duplicate lines from any text or list instantly. Case-sensitive and whitespace options included. No sign-up required.",
};

export default function DuplicateLineRemoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
