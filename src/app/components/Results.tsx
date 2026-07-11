import React, { useRef, useState } from 'react';
import ErrorMessage from './ErrorMessage';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface Sentence {
  text: string;
  match_score: number;
}

interface ResultsProps {
  score: number;
  method: 'blended' | 'tfidf_only';
  sentencesA: Sentence[];
  sentencesB: Sentence[];
  isSample?: boolean;
}

const Results: React.FC<ResultsProps> = ({ score, method, sentencesA, sentencesB, isSample }) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [threshold, setThreshold] = useState<number>(0);
  const [prevSentences, setPrevSentences] = useState<{a: Sentence[], b: Sentence[]}>({ a: sentencesA, b: sentencesB });

  // Reset threshold to 0% whenever a new comparison result is rendered
  if (prevSentences.a !== sentencesA || prevSentences.b !== sentencesB) {
    setThreshold(0);
    setPrevSentences({ a: sentencesA, b: sentencesB });
  }

  const handleDownloadPDF = async () => {
    // Future gate: if (user_tier === 'pro') { ... } else { showUpsell() }
    if (!reportRef.current) return;

    try {
      const element = reportRef.current;

      // Temporary style changes to ensure full content is captured
      const docAContainer = element.querySelector('#doc-a-container') as HTMLElement;
      const docBContainer = element.querySelector('#doc-b-container') as HTMLElement;

      const originalAHeight = docAContainer.style.height;
      const originalAOverflow = docAContainer.style.overflow;
      const originalBHeight = docBContainer.style.height;
      const originalBOverflow = docBContainer.style.overflow;

      docAContainer.style.height = 'auto';
      docAContainer.style.overflow = 'visible';
      docBContainer.style.height = 'auto';
      docBContainer.style.overflow = 'visible';

      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        onclone: (clonedDoc) => {
          // Fix for html2canvas failing on oklch colors used in Tailwind v4
          // Force standard RGB for elements that might use modern color functions
          const elementsWithColors = clonedDoc.querySelectorAll('*');
          elementsWithColors.forEach((el) => {
            const style = window.getComputedStyle(el);
            const element = el as HTMLElement;
            if (style.color && (style.color.includes('oklch') || style.color.includes('lab'))) {
               element.style.color = 'black'; // Fallback
            }
            if (style.backgroundColor && (style.backgroundColor.includes('oklch') || style.backgroundColor.includes('lab'))) {
               element.style.backgroundColor = 'transparent'; // Fallback
            }
          });
        }
      });

      // Restore original styles
      docAContainer.style.height = originalAHeight;
      docAContainer.style.overflow = originalAOverflow;
      docBContainer.style.height = originalBHeight;
      docBContainer.style.overflow = originalBOverflow;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`DocSim-Report-${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  const getHighlightColor = (score: number) => {
    // Convert score to percentage
    const percentage = score * 100;
    // If the sentence's match score is below the threshold, revert to normal, unhighlighted text (transparent)
    if (percentage < threshold) return 'transparent';

    // 0% = white, 100% = deep orange
    const intensity = score;
    if (intensity < 0.05) return 'transparent';

    // Cap alpha at 0.8 to ensure black text remains readable even at 100% match
    const alpha = Math.min(intensity, 0.8);
    return `rgba(255, 165, 0, ${alpha})`;
  };

  return (
    <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-center">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-6 py-2 bg-gray-800 dark:bg-stone-700 text-white rounded-md hover:bg-gray-900 dark:hover:bg-stone-600 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download Report
        </button>
      </div>

      <div ref={reportRef} className="bg-card p-8 rounded-xl border border-card-border shadow-sm space-y-8 transition-colors duration-200">
        <div className="border-b border-card-border pb-6 text-center">
          <h1 className="text-2xl font-bold text-foreground">DocSim Checker — Similarity Report</h1>
          <p className="text-gray-500 dark:text-stone-400 mt-1">{new Date().toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>

      <div className="text-center">
        <h2 className="text-lg font-medium text-foreground">Overall Similarity</h2>
        <div className="mt-2 inline-flex flex-col items-center w-full relative">
          <div className="flex items-center gap-3">
            <span className="text-6xl font-extrabold text-orange-600">{score}%</span>
            {isSample && (
              <span className="bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 text-xs font-bold px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-800/50 uppercase tracking-wider animate-pulse">
                Sample Result
              </span>
            )}
          </div>
          {method === 'tfidf_only' && (
            <ErrorMessage
              type="fallback"
              message="Using basic similarity matching (semantic matching temporarily unavailable)"
            />
          )}
        </div>
      </div>

      {/* Slider UI */}
      <div data-html2canvas-ignore="true" className="max-w-md mx-auto space-y-3 pt-2 pb-4 w-full">
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold text-gray-500 dark:text-stone-400 uppercase tracking-wider">
            Show matches above:
          </span>
          <span className="text-lg font-black text-orange-600 bg-orange-50 dark:bg-orange-950/30 px-3 py-1 rounded-lg">
            {threshold}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="5"
          value={threshold}
          onChange={(e) => setThreshold(parseInt(e.target.value))}
          className="w-full h-2.5 bg-gray-200 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-orange-600 transition-all focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-stone-500 font-medium px-0.5">
          <span>0% (All matches)</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Empty State Banner (between slider and documents, excluded from PDF export via data-html2canvas-ignore) */}
      {(() => {
        const hasMatchA = sentencesA.some(s => s.match_score * 100 >= threshold && s.match_score >= 0.05);
        const hasMatchB = sentencesB.some(s => s.match_score * 100 >= threshold && s.match_score >= 0.05);

        if (!hasMatchA && !hasMatchB) {
          return (
            <div data-html2canvas-ignore="true" className="max-w-md mx-auto animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3 p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900/40 rounded-xl text-orange-800 dark:text-orange-300 text-sm font-medium text-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600 dark:text-orange-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>No matches found above this threshold. Try lowering the slider.</span>
              </div>
            </div>
          );
        }
        return null;
      })()}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-stone-300 border-b border-card-border pb-2">Document A</h3>
          <div id="doc-a-container" className="bg-white dark:bg-stone-900/50 p-4 border border-card-border rounded-lg h-[300px] md:h-[500px] overflow-y-auto leading-relaxed text-foreground">
            {sentencesA.map((s, i) => (
              <span
                key={i}
                style={{ backgroundColor: getHighlightColor(s.match_score) }}
                className="transition-colors duration-300"
                title={`Match score: ${(s.match_score * 100).toFixed(1)}%`}
              >
                {s.text}{' '}
              </span>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700 dark:text-stone-300 border-b border-card-border pb-2">Document B</h3>
          <div id="doc-b-container" className="bg-white dark:bg-stone-900/50 p-4 border border-card-border rounded-lg h-[300px] md:h-[500px] overflow-y-auto leading-relaxed text-foreground">
            {sentencesB.map((s, i) => (
              <span
                key={i}
                style={{ backgroundColor: getHighlightColor(s.match_score) }}
                className="transition-colors duration-300"
                title={`Match score: ${(s.match_score * 100).toFixed(1)}%`}
              >
                {s.text}{' '}
              </span>
            ))}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Results;
