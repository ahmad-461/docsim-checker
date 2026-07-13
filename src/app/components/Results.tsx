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
  const [showPreview, setShowPreview] = useState(false);

  // Reset threshold to 0% whenever a new comparison result is rendered
  if (prevSentences.a !== sentencesA || prevSentences.b !== sentencesB) {
    setThreshold(0);
    setPrevSentences({ a: sentencesA, b: sentencesB });
  }

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const isDevEnv = process.env.NODE_ENV === 'development';
      if (params.get('preview') === 'pdf' && isDevEnv) {
        // Run asynchronously to avoid synchronous setState inside useEffect warning
        setTimeout(() => {
          setShowPreview(true);
        }, 0);
      }
    }
  }, []);

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

      // 1. Create a safe temporary stylesheet in the document with fallback basic CSS styles
      // to bypass html2canvas parsing errors of modern CSS v4 styles entirely.
      // Since the print template is completely styled using 100% standard inline CSS,
      // we only need simple styling support.
      const safeCssText = `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #ffffff; color: #0f172a; font-family: system-ui, -apple-system, sans-serif; }
      `;

      tempStyleEl = document.createElement('style');
      tempStyleEl.textContent = safeCssText;
      document.head.appendChild(tempStyleEl);

      // 2. Temporarily override document.styleSheets so html2canvas reads the safe, clean CSS rules
      Object.defineProperty(document, 'styleSheets', {
        value: [tempStyleEl.sheet],
        configurable: true
      });

      const canvas = await html2canvas(element, {
        scale: 2, // 2x high-resolution canvas capture
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 800, // Force canvas width to exactly 800px to avoid any flex responsive sizing shrinkage
        windowWidth: 800, // Mock layout viewport width of 800px during capture
        onclone: (clonedDoc) => {
          // Remove original style sheets and link tags in the cloned document
          const stylesAndLinks = clonedDoc.querySelectorAll('link[rel="stylesheet"], style');
          stylesAndLinks.forEach(el => el.remove());

          // Inject the clean, safe CSS as a single style block in the cloned document's head
          const cleanStyleEl = clonedDoc.createElement('style');
          cleanStyleEl.textContent = safeCssText;
          clonedDoc.head.appendChild(cleanStyleEl);
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

      // Calculate standard scaling factor: map 800px container width to standard PDF width points
      const scale = pdfWidth / 800; // Since element has fixed width 800px, map exactly to pdfWidth
      const contentHeightInPdfPoints = canvas.height * (scale / 2); // Divide by 2 because canvas scale is 2

      const totalPages = Math.ceil(contentHeightInPdfPoints / usablePageHeight);

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        if (pageNum > 1) {
          pdf.addPage();
        }

        // Render canvas slice on this page by offset drawing
        const yOffset = - (pageNum - 1) * usablePageHeight;

        // Add the image with JPEG and FAST compression
        // Ensure image width and height matches the exact layout mapping
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
        // Use a safer type casting to comply with ESLint standard rules
        const docWithStylesheets = document as unknown as { styleSheets?: unknown };
        delete docWithStylesheets.styleSheets;
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
      <div
        style={
          showPreview
            ? {
                display: 'block',
                margin: '40px auto',
                border: '4px dashed #ea580c',
                borderRadius: '16px',
                width: '800px',
                backgroundColor: '#ffffff',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
                position: 'relative',
              }
            : { position: 'absolute', left: '-9999px', top: '-9999px' }
        }
      >
        {showPreview && (
          <div style={{ backgroundColor: '#ea580c', color: '#ffffff', padding: '16px', fontWeight: 'bold', textAlign: 'center', fontSize: '14px', borderBottom: '2px solid #c2410c', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            DEVELOPMENT-ONLY PDF PREVIEW (Gated to Development Environment)
          </div>
        )}
        <div
          ref={printReportRef}
          style={{
            width: '800px',
            backgroundColor: '#ffffff',
            padding: '48px',
            color: '#0f172a', // slate-900
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            boxSizing: 'border-box',
          }}
        >
          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderBottom: '2px solid #ea580c',
            paddingBottom: '24px',
            width: '100%',
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <img
                src="/logo.png"
                alt="DocSim Checker Logo"
                style={{ height: '40px', width: 'auto', display: 'block' }}
              />
              <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#0f172a',
                margin: 0,
                lineHeight: '1.2',
              }}>
                Document Similarity Report
              </h1>
            </div>
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
              <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>Generated Date</div>
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
          <div style={{
            backgroundColor: '#f8fafc', // slate-50
            border: '1px solid #e2e8f0', // slate-200
            borderRadius: '16px',
            padding: '32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b' }}>
                  Verdict
                </span>
                {isSample && (
                  <span style={{
                    backgroundColor: '#ffedd5', // orange-100
                    color: '#c2410c', // orange-700
                    fontSize: '10px',
                    fontWeight: '800',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    border: '1px solid #fed7aa', // orange-200
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                  }}>
                    Sample Result
                  </span>
                )}
              </div>
              <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                {getVerdict(score)}
              </h2>
              <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div>Comparison Method: {method === 'tfidf_only' ? 'Basic Similarity Matching' : 'AI-Powered Semantic Analysis'}</div>
                <div style={threshold > 0 ? { color: '#ea580c', fontWeight: 'bold' } : { color: '#64748b' }}>
                  Match Threshold: {threshold > 0 ? `Showing matches above ${threshold}% similarity` : 'Showing all matches (0% threshold)'}
                </div>
              </div>
            </div>
            <div style={{
              textAlign: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '16px 24px',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
            }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Similarity
              </div>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ea580c', marginTop: '4px', lineHeight: '1' }}>
                {score}%
              </div>
            </div>
          </div>

          {/* Document Content Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px', width: '100%', boxSizing: 'border-box' }}>
            {/* Document A */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Document A
                </h3>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#1e293b',
                lineHeight: '1.6',
                backgroundColor: 'rgba(248, 250, 252, 0.5)',
                border: '1px solid #f1f5f9',
                borderRadius: '12px',
                padding: '24px',
                whiteSpace: 'pre-line',
                boxSizing: 'border-box',
                width: '100%',
              }}>
                {sentencesA.map((s, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: getHighlightColor(s.match_score) }}
                  >
                    {s.text}{' '}
                  </span>
                ))}
              </div>
            </div>

            {/* Visible Divider Line between Document A and Document B */}
            <div style={{ borderTop: '2px dashed #e2e8f0', margin: '8px 0' }}></div>

            {/* Document B */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '8px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Document B
                </h3>
              </div>
              <div style={{
                fontSize: '14px',
                color: '#1e293b',
                lineHeight: '1.6',
                backgroundColor: 'rgba(248, 250, 252, 0.5)',
                border: '1px solid #f1f5f9',
                borderRadius: '12px',
                padding: '24px',
                whiteSpace: 'pre-line',
                boxSizing: 'border-box',
                width: '100%',
              }}>
                {sentencesB.map((s, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: getHighlightColor(s.match_score) }}
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
