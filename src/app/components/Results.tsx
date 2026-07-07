import React, { useRef } from 'react';
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
}

const Results: React.FC<ResultsProps> = ({ score, method, sentencesA, sentencesB }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    // Future gate: if (user_tier === 'pro') { ... } else { showUpsell() }
    if (!reportRef.current) return;

    try {
      const element = reportRef.current;

      // Temporary style changes to ensure full content is captured
      const originalStyle = element.style.height;
      const originalOverflow = element.style.overflow;

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
    // 0% = white, 100% = deep orange
    // rgb(255, 255, 255) to rgb(255, 127, 0)
    const intensity = score;
    if (intensity < 0.1) return 'transparent';

    // We can use tailwind classes for common intensities or inline styles for precise mapping
    // Let's use inline style for match strength
    const alpha = intensity * 0.8; // Max 0.8 alpha for readability
    return `rgba(255, 165, 0, ${alpha})`;
  };

  return (
    <div className="mt-12 space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-center">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download Report
        </button>
      </div>

      <div ref={reportRef} className="bg-white p-8 rounded-xl border shadow-sm space-y-8">
        <div className="border-b pb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">DocSim Checker — Similarity Report</h1>
          <p className="text-gray-500 mt-1">{new Date().toLocaleString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>

      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-900">Overall Similarity</h2>
        <div className="mt-2 inline-flex flex-col items-center w-full">
          <span className="text-6xl font-extrabold text-orange-600">{score}%</span>
          {method === 'tfidf_only' && (
            <ErrorMessage
              type="fallback"
              message="Using basic similarity matching (semantic matching temporarily unavailable)"
            />
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-md font-semibold text-gray-700 border-b pb-2">Document A</h3>
          <div id="doc-a-container" className="bg-white p-4 border rounded-lg h-[500px] overflow-y-auto leading-relaxed">
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
          <h3 className="text-md font-semibold text-gray-700 border-b pb-2">Document B</h3>
          <div id="doc-b-container" className="bg-white p-4 border rounded-lg h-[500px] overflow-y-auto leading-relaxed">
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
