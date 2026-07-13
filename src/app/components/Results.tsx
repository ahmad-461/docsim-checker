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
  const printReportRef = useRef<HTMLDivElement>(null);
  const [threshold, setThreshold] = useState<number>(0);
  const [prevSentences, setPrevSentences] = useState<{a: Sentence[], b: Sentence[]}>({ a: sentencesA, b: sentencesB });

  // Reset threshold to 0% whenever a new comparison result is rendered
  if (prevSentences.a !== sentencesA || prevSentences.b !== sentencesB) {
    setThreshold(0);
    setPrevSentences({ a: sentencesA, b: sentencesB });
  }

  const getVerdict = (score: number) => {
    if (score >= 70) return "Substantial overlap detected";
    if (score >= 30) return "Moderate similarity detected";
    return "Mostly original content";
  };

  const handleDownloadPDF = async () => {
    if (!printReportRef.current) return;

    // Preload logo image to ensure it's in the browser cache for html2canvas
    await new Promise<void>((resolve) => {
      const img = new window.Image();
      img.src = '/logo.png';
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });

    let tempStyleEl: HTMLStyleElement | null = null;

    try {
      const element = printReportRef.current;

      // 1. Gather all CSS rules from the original document
      let cssText = '';
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          const rules = sheet.cssRules;
          if (rules) {
            for (const rule of Array.from(rules)) {
              cssText += rule.cssText + '\n';
            }
          }
        } catch (e) {
          // Fallback for CORS security restrictions or inline style tags
          if (sheet.ownerNode && (sheet.ownerNode.nodeName === 'STYLE')) {
            cssText += sheet.ownerNode.textContent + '\n';
          }
        }
      }

      // Replace modern unsupported color functions oklch(...), oklab(...), lab(...), and lch(...) with standard hex/RGB
      // Also replace modern color-mix function calls with standard hex fallback
      const cleanCssText = cssText
        .replace(/oklch\([^)]*\)/g, '#ea580c')
        .replace(/oklab\([^)]*\)/g, '#ea580c')
        .replace(/lab\([^)]*\)/g, '#ea580c')
        .replace(/lch\([^)]*\)/g, '#ea580c')
        .replace(/color-mix\([^;}]*\)/g, '#ea580c');

      // 2. Create a temporary stylesheet in the document
      tempStyleEl = document.createElement('style');
      tempStyleEl.textContent = cleanCssText;
      document.head.appendChild(tempStyleEl);

      // 3. Temporarily override document.styleSheets so html2canvas reads the cleaned CSS rules
      Object.defineProperty(document, 'styleSheets', {
        value: [tempStyleEl.sheet],
        configurable: true
      });

      const canvas = await html2canvas(element, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Remove original style sheets and link tags in the cloned document
          const stylesAndLinks = clonedDoc.querySelectorAll('link[rel="stylesheet"], style');
          stylesAndLinks.forEach(el => el.remove());

          // Inject the clean CSS as a single style block in the cloned document's head
          const cleanStyleEl = clonedDoc.createElement('style');
          cleanStyleEl.textContent = cleanCssText;
          clonedDoc.head.appendChild(cleanStyleEl);

          // Force standard color fallbacks inside the cloned print template to render correctly
          const elementsWithColors = clonedDoc.querySelectorAll('*');
          elementsWithColors.forEach((el) => {
            const style = window.getComputedStyle(el);
            const htmlEl = el as HTMLElement;
            if (style.color && (style.color.includes('oklch') || style.color.includes('lab') || style.color.includes('oklab') || style.color.includes('lch'))) {
               htmlEl.style.color = '#0f172a'; // Default slate-900 style
            }
          });
        }
      });

      // Compress the canvas using JPEG at 85% quality to keep file size small while maintaining crisp text
      const imgData = canvas.toDataURL('image/jpeg', 0.85);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4', // A4: 595.28 x 841.89 pt
        compress: true // Enable page stream compression
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Bottom footer area height
      const footerHeight = 45;
      const usablePageHeight = pdfHeight - footerHeight;

      // Calculate how many canvas pixels map to one usable PDF page height
      const scale = pdfWidth / canvas.width;
      const contentHeightInPdfPoints = canvas.height * scale;

      const totalPages = Math.ceil(contentHeightInPdfPoints / usablePageHeight);

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        if (pageNum > 1) {
          pdf.addPage();
        }

        // Render canvas slice on this page by offset drawing
        const yOffset = - (pageNum - 1) * usablePageHeight;

        // Add the image with JPEG and FAST compression
        pdf.addImage(imgData, 'JPEG', 0, yOffset, pdfWidth, contentHeightInPdfPoints, undefined, 'FAST');

        // Draw a solid white masking rectangle over the footer area to clean any canvas overflow
        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, usablePageHeight, pdfWidth, footerHeight, 'F');

        // Draw a light gray separation horizontal rule right above the footer
        pdf.setDrawColor(229, 231, 235); // gray-200
        pdf.setLineWidth(1);
        pdf.line(0, usablePageHeight, pdfWidth, usablePageHeight);

        // Draw footer text and page numbers
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(100, 116, 139); // slate-500

        // Center the brand text
        const footerBrand = "Generated by DocSim Checker — docsimchecker.com";
        const brandWidth = pdf.getTextWidth(footerBrand);
        pdf.text(footerBrand, (pdfWidth - brandWidth) / 2, usablePageHeight + 25);

        // Right-align page numbering
        const pageText = `Page ${pageNum} of ${totalPages}`;
        const pageTextWidth = pdf.getTextWidth(pageText);
        pdf.text(pageText, pdfWidth - 40 - pageTextWidth, usablePageHeight + 25);
      }

      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const filename = `DocSim-Report-${year}-${month}-${day}.pdf`;

      pdf.save(filename);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      // 4. Restore original document.styleSheets and remove the temporary style element
      if (tempStyleEl) {
        delete (document as any).styleSheets;
        tempStyleEl.remove();
      }
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

      {/* DEDICATED OFF-SCREEN PRINT TEMPLATE FOR PDF GENERATION */}
      <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
        <div
          ref={printReportRef}
          className="w-[800px] bg-white p-12 text-slate-900 space-y-10"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          {/* Header */}
          <div className="flex justify-between items-end border-b-2 border-orange-600 pb-6">
            <div className="flex flex-col gap-4">
              <img
                src="/logo.png"
                alt="DocSim Checker Logo"
                className="h-10 w-auto object-contain self-start"
              />
              <h1 className="text-3xl font-black tracking-tight text-slate-900">
                Document Similarity Report
              </h1>
            </div>
            <div className="text-right text-sm text-slate-500 font-medium">
              <div className="font-semibold text-slate-800">Generated Date</div>
              <div>
                {new Date().toLocaleString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 flex justify-between items-center">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold uppercase tracking-wider text-slate-500">
                  Verdict
                </span>
                {isSample && (
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-orange-200 uppercase tracking-widest">
                    Sample Result
                  </span>
                )}
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900">
                {getVerdict(score)}
              </h2>
              <div className="text-sm text-slate-500 font-medium space-y-1.5">
                <div>Comparison Method: {method === 'tfidf_only' ? 'Basic Similarity Matching' : 'AI-Powered Semantic Analysis'}</div>
                <div className={threshold > 0 ? "text-orange-600 font-bold" : "text-slate-500"}>
                  Match Threshold: {threshold > 0 ? `Showing matches above ${threshold}% similarity` : 'Showing all matches (0% threshold)'}
                </div>
              </div>
            </div>
            <div className="text-center bg-white border border-slate-200 rounded-xl px-6 py-4 shadow-sm">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Similarity
              </div>
              <div className="text-5xl font-black text-orange-600 mt-1">
                {score}%
              </div>
            </div>
          </div>

          {/* Document Content Stack */}
          <div className="space-y-10 pt-4">
            {/* Document A */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-lg font-bold text-slate-800 tracking-wide uppercase">
                  Document A
                </h3>
              </div>
              <div className="text-base text-slate-800 leading-relaxed bg-slate-50/50 border border-slate-100 rounded-xl p-6 whitespace-pre-line">
                {sentencesA.map((s, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: getHighlightColor(s.match_score) }}
                    className="inline transition-colors duration-300"
                  >
                    {s.text}{' '}
                  </span>
                ))}
              </div>
            </div>

            {/* Document B */}
            <div className="space-y-4">
              <div className="border-b border-slate-200 pb-2">
                <h3 className="text-lg font-bold text-slate-800 tracking-wide uppercase">
                  Document B
                </h3>
              </div>
              <div className="text-base text-slate-800 leading-relaxed bg-slate-50/50 border border-slate-100 rounded-xl p-6 whitespace-pre-line">
                {sentencesB.map((s, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: getHighlightColor(s.match_score) }}
                    className="inline transition-colors duration-300"
                  >
                    {s.text}{' '}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
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
