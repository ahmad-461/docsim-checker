import React from "react";
import { Metadata } from "next";
import InfoPageLayout, { PageLink } from "../components/InfoPageLayout";

export const metadata: Metadata = {
  title: "What's New — DocSim Checker Changelog",
  description: "Stay up to date with the latest features, improvements, and bug fixes for DocSim Checker. See what's new.",
};

interface ChangelogItem {
  date: string;
  added?: string[];
  improved?: string[];
  fixed?: string[];
}

const changelogData: ChangelogItem[] = [
  {
    date: "July 8, 2026",
    added: [
      "Match threshold slider on comparison results — filter highlighted matches by minimum similarity score",
      "Three new free tools: Word Counter, Case Converter, and Duplicate Line Remover",
      "Dark mode support across the entire site",
      "Downloadable PDF comparison reports",
      "Sample comparison demo — try the tool instantly without pasting your own content",
    ],
    improved: [
      "Faster, lighter backend — removed heavy dependencies for quicker load times",
      "More robust file handling — better support for various text encodings and DOCX files with tables",
      "Expanded methodology explanation on how similarity scores are calculated",
    ],
    fixed: [
      "Resolved file upload errors affecting certain PDF and Word documents",
      "Fixed dark mode contrast issues for improved readability",
      "Corrected various accessibility and mobile responsiveness issues",
    ],
  },
  {
    date: "June 15, 2026",
    added: [
      "Support for Word document (.docx) file uploads",
      "Copy to Clipboard buttons for easily copying highlighted paragraphs and comparison results",
    ],
    improved: [
      "Improved sentence-splitting accuracy to better handle multi-line paragraphs, bullet points, and common abbreviations",
      "Enhanced client-side error handling to display clear, friendly messages when file decoding or parsing fails",
    ],
    fixed: [
      "Fixed an issue where trailing whitespaces or blank lines could slightly skew the final similarity score",
    ],
  },
  {
    date: "May 20, 2026",
    added: [
      "Initial public release of DocSim Checker side-by-side text comparison engine",
      "Support for direct text pasting and .txt and .pdf document uploads",
      "Hashed, non-reversible IP-based anonymous daily limit tracking — enabling private usage with no sign-up or accounts required",
    ],
  },
];

export default function ChangelogPage() {
  return (
    <InfoPageLayout
      title="What's New"
      subtitle="A running log of updates, fixes, and new features."
      noProse={true}
    >
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Ongoing Maintenance Note */}
        <div className="p-6 bg-orange-50 dark:bg-orange-950/20 border-l-4 border-orange-500 rounded-r-2xl shadow-sm">
          <p className="text-gray-700 dark:text-stone-300 leading-relaxed font-medium">
            We&apos;re actively building and improving DocSim Checker. Check back here for updates, or{" "}
            <PageLink href="/contact">contact us</PageLink> with suggestions.
          </p>
        </div>

        {/* Timeline List */}
        <div className="space-y-12 relative before:absolute before:inset-0 before:left-6 md:before:left-8 before:w-0.5 before:bg-gray-200/60 dark:before:bg-stone-800/60 before:h-full pb-6">
          {changelogData.map((item, idx) => (
            <div key={item.date} className="relative pl-12 md:pl-16 group">
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-6 top-1.5 -translate-x-1/2 w-4 h-4 rounded-full border-4 border-background bg-orange-600 shadow-sm z-10 group-first:scale-125 group-first:bg-orange-600 transition-transform duration-300"></div>

              <div className="bg-white dark:bg-stone-800 rounded-2xl border border-gray-100 dark:border-stone-700 shadow-sm p-6 md:p-8 hover:shadow-md transition-shadow duration-300">
                {/* Date Header */}
                <div className="flex items-center justify-between border-b border-gray-100 dark:border-stone-700/50 pb-4 mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground">
                    {item.date}
                  </h2>
                  {idx === 0 && (
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-full tracking-wider uppercase">
                      Latest Update
                    </span>
                  )}
                </div>

                {/* Categories */}
                <div className="space-y-6">
                  {/* Added Category */}
                  {item.added && item.added.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Added
                      </h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-stone-300">
                        {item.added.map((desc, i) => (
                          <li key={i} className="leading-relaxed text-base">
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improved Category */}
                  {item.improved && item.improved.length > 0 && (
                    <div className={item.added ? "pt-4 border-t border-gray-50 dark:border-stone-700/30" : ""}>
                      <h3 className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        Improved
                      </h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-stone-300">
                        {item.improved.map((desc, i) => (
                          <li key={i} className="leading-relaxed text-base">
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Fixed Category */}
                  {item.fixed && item.fixed.length > 0 && (
                    <div className={(item.added || item.improved) ? "pt-4 border-t border-gray-50 dark:border-stone-700/30" : ""}>
                      <h3 className="text-sm font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                        Fixed
                      </h3>
                      <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-stone-300">
                        {item.fixed.map((desc, i) => (
                          <li key={i} className="leading-relaxed text-base">
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </InfoPageLayout>
  );
}
