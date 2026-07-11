import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://docsimchecker.com"),
  title: {
    default: "DocSim Checker — Professional Side-by-Side Document Comparison",
    template: "%s | DocSim Checker",
  },
  description: "Compare two documents to detect overlapping content, matching sentences, and similarity scores. Free, private, and instant text comparison tool.",
  alternates: {
    canonical: "./",
  },
  openGraph: {
    title: "DocSim Checker — Professional Side-by-Side Document Comparison",
    description: "Compare two documents to detect overlapping content, matching sentences, and similarity scores. Free, private, and instant text comparison tool.",
    url: "https://docsimchecker.com",
    siteName: "DocSim Checker",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DocSim Checker — Compare Documents side-by-side",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocSim Checker — Professional Side-by-Side Document Comparison",
    description: "Compare two documents to detect overlapping content, matching sentences, and similarity scores. Free, private, and instant text comparison tool.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "DocSim Checker",
    "url": "https://docsimchecker.com",
    "logo": "https://docsimchecker.com/logo.png",
    "description": "Compare two documents side-by-side to detect overlapping content, matching sentences, and similarity scores. Free, private, and instant text comparison tool."
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var supportDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches === true;
                  if (!theme && supportDarkMode) theme = 'dark';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
