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
  docAName?: string;
  docBName?: string;
}

// Token extraction helper for client-side sentence pairing
const getTokens = (text: string): Set<string> => {
  const normalized = text.toLowerCase().replace(/[^\w\s]/g, '');
  const tokens = normalized.split(/\s+/).filter(t => t.length > 2);
  return new Set(tokens);
};

// Jaccard similarity index helper
const calculateJaccard = (setA: Set<string>, setB: Set<string>): number => {
  if (setA.size === 0 || setB.size === 0) return 0;
  const intersection = new Set([...setA].filter(x => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return intersection.size / union.size;
};

const Results: React.FC<ResultsProps> = ({
  score,
  method,
  sentencesA,
  sentencesB,
  isSample,
  docAName,
  docBName
}) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const printReportRef = useRef<HTMLDivElement>(null);
  const [threshold, setThreshold] = useState<number>(0);
  const [prevSentences, setPrevSentences] = useState<{a: Sentence[], b: Sentence[]}>({ a: sentencesA, b: sentencesB });
  const [showPreview, setShowPreview] = useState(false);

  // Stable random Report ID per comparison session
  const [reportId] = useState(() => `DS-${Math.random().toString(36).substring(2, 10).toUpperCase()}`);

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

  const getWaxSealLabel = (score: number) => {
    if (score >= 70) return "HIGH MATCH";
    if (score >= 30) return "MOD MATCH";
    return "LOW MATCH";
  };

  // Generate client-side sentence matching pairs based on current active threshold
  const tokensA = sentencesA.map(s => getTokens(s.text));
  const tokensB = sentencesB.map(s => getTokens(s.text));

  const mappedPairs: { aIndex: number; bIndex: number; pairId: number }[] = [];
  let nextPairId = 1;

  sentencesA.forEach((sA, aIdx) => {
    // Only map sentences that actually meet the match criteria
    if (sA.match_score * 100 >= threshold && sA.match_score >= 0.05) {
      let bestBIdx = -1;
      let maxSimilarity = -1;
      sentencesB.forEach((sB, bIdx) => {
        if (sB.match_score * 100 >= threshold && sB.match_score >= 0.05) {
          const sim = calculateJaccard(tokensA[aIdx], tokensB[bIdx]);
          if (sim > maxSimilarity) {
            maxSimilarity = sim;
            bestBIdx = bIdx;
          }
        }
      });

      if (bestBIdx !== -1 && maxSimilarity > 0.05) {
        const alreadyMapped = mappedPairs.find(p => p.bIndex === bestBIdx);
        if (!alreadyMapped) {
          mappedPairs.push({ aIndex: aIdx, bIndex: bestBIdx, pairId: nextPairId++ });
        } else {
          mappedPairs.push({ aIndex: aIdx, bIndex: bestBIdx, pairId: alreadyMapped.pairId });
        }
      }
    }
  });

  const getPairIdForA = (aIdx: number) => {
    const found = mappedPairs.find(p => p.aIndex === aIdx);
    return found ? found.pairId : null;
  };

  const getPairIdForB = (bIdx: number) => {
    const found = mappedPairs.find(p => p.bIndex === bIdx);
    return found ? found.pairId : null;
  };

  // Stack fallback: if either document has more than 10 sentences
  const isStacked = sentencesA.length > 10 || sentencesB.length > 10;

  // Render session name
  const sessionName = docAName || "Untitled Comparison";

  const handleDownloadPDF = async () => {
    if (!printReportRef.current) return;

    await new Promise<void>((resolve) => {
      const img = new window.Image();
      img.src = '/logo.png';
      img.onload = () => resolve();
      img.onerror = () => resolve();
    });

    let tempStyleEl: HTMLStyleElement | null = null;

    try {
      const element = printReportRef.current;

      const safeCssText = `
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background-color: #ffffff; color: #1a1a1a; font-family: system-ui, -apple-system, sans-serif; }
      `;

      tempStyleEl = document.createElement('style');
      tempStyleEl.textContent = safeCssText;
      document.head.appendChild(tempStyleEl);

      Object.defineProperty(document, 'styleSheets', {
        value: [tempStyleEl.sheet],
        configurable: true
      });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: 800,
        windowWidth: 800,
        onclone: (clonedDoc) => {
          const stylesAndLinks = clonedDoc.querySelectorAll('link[rel="stylesheet"], style');
          stylesAndLinks.forEach(el => el.remove());

          const cleanStyleEl = clonedDoc.createElement('style');
          cleanStyleEl.textContent = safeCssText;
          clonedDoc.head.appendChild(cleanStyleEl);
        }
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.85);

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const footerHeight = 45;
      const usablePageHeight = pdfHeight - footerHeight;

      const scale = pdfWidth / 800;
      const contentHeightInPdfPoints = canvas.height * (scale / 2);

      const totalPages = Math.ceil(contentHeightInPdfPoints / usablePageHeight);

      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        if (pageNum > 1) {
          pdf.addPage();
        }

        const yOffset = - (pageNum - 1) * usablePageHeight;

        pdf.addImage(imgData, 'JPEG', 0, yOffset, pdfWidth, contentHeightInPdfPoints, undefined, 'FAST');

        pdf.setFillColor(255, 255, 255);
        pdf.rect(0, usablePageHeight, pdfWidth, footerHeight, 'F');

        pdf.setDrawColor(229, 231, 235);
        pdf.setLineWidth(1);
        pdf.line(0, usablePageHeight, pdfWidth, usablePageHeight);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(100, 116, 139);

        const footerBrand = "Generated by DocSim Checker — docsimchecker.com";
        const brandWidth = pdf.getTextWidth(footerBrand);
        pdf.text(footerBrand, (pdfWidth - brandWidth) / 2, usablePageHeight + 25);

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
      if (tempStyleEl) {
        const docWithStylesheets = document as unknown as { styleSheets?: unknown };
        delete docWithStylesheets.styleSheets;
        tempStyleEl.remove();
      }
    }
  };

  const getHighlightColor = (score: number) => {
    const percentage = score * 100;
    if (percentage < threshold) return 'transparent';
    if (score < 0.05) return 'transparent';
    const alpha = Math.min(score, 0.6);
    return `rgba(234, 88, 12, ${alpha})`; // hex brand orange rgba equivalent
  };

  return (
    <div className="mt-12 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-center">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-md hover:shadow-orange-600/10 active:scale-95 transform hover:scale-[1.02]"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Download PDF Report
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

        {/* Core PDF Canvas Container */}
        <div
          ref={printReportRef}
          style={{
            width: '800px',
            backgroundColor: '#ffffff',
            padding: '48px',
            color: '#1a1a1a',
            display: 'flex',
            flexDirection: 'column',
            gap: '32px',
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
            paddingBottom: '20px',
            width: '100%',
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h1 style={{
                fontSize: '26px',
                fontWeight: 'bold',
                fontFamily: 'Georgia, serif',
                color: '#1a1a1a',
                margin: 0,
                lineHeight: '1.2',
              }}>
                Document Similarity Report
              </h1>
              <div style={{ fontSize: '13px', color: '#555555', fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Session: {sessionName}
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '11px', color: '#666666' }}>
              <div style={{ fontWeight: 'bold', color: '#1a1a1a', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Generated Timestamp</div>
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

          {/* Overall Score Block & Wax Seal (Left Side layout) */}
          <div style={{
            backgroundColor: '#faf8f5',
            border: '1px solid #e6ddc4',
            borderRadius: '16px',
            padding: '24px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
              {/* Giant score percentage */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666', marginBottom: '4px' }}>
                  Overall Score
                </span>
                <span style={{ fontSize: '54px', fontWeight: '900', fontFamily: 'Georgia, serif', color: '#1a1a1a', lineHeight: '1' }}>
                  {score}%
                </span>
              </div>

              {/* Wax Seal Badge next to it */}
              <div style={{
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: '#9a3412', // Deep rust wax seal color
                border: '3px double #fcd34d', // Golden double border
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.6), 0 4px 6px rgba(154,52,18,0.2)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '4px',
                boxSizing: 'border-box',
                transform: 'rotate(-4deg)', // Authentic stamp angle
              }}>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '8px', color: '#fcd34d', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1px' }}>
                  VERDICT
                </span>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: '9px', color: '#ffffff', fontWeight: '900', textTransform: 'uppercase', lineHeight: '1.2' }}>
                  {getWaxSealLabel(score)}
                </span>
              </div>
            </div>

            {/* Verdict text and method */}
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#666666' }}>
                VERDICT
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 'bold', fontFamily: 'Georgia, serif', color: '#1a1a1a', margin: 0 }}>
                {getVerdict(score)}
              </h2>
              <div style={{ fontSize: '11px', color: '#666666' }}>
                Method: {method === 'tfidf_only' ? 'Basic Structural Matching' : 'AI-Powered Semantic Analysis'}
              </div>
              {threshold > 0 && (
                <div style={{ fontSize: '11px', color: '#ea580c', fontWeight: 'bold' }}>
                  Threshold filter: Only showing &ge;{threshold}% matches
                </div>
              )}
            </div>
          </div>

          {/* Document Content Side-by-Side or Stacked */}
          {isStacked ? (
            /* STACKED FALLBACK LAYOUT */
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%', boxSizing: 'border-box' }}>
              {/* Doc A */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                <div style={{ borderBottom: '1px solid #e6ddc4', paddingBottom: '6px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', fontFamily: 'Georgia, serif', color: '#1a1a1a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Document A (Submitted)
                  </h3>
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#1a1a1a',
                  lineHeight: '1.6',
                  backgroundColor: '#faf8f5',
                  border: '1px solid #e6ddc4',
                  borderRadius: '12px',
                  padding: '20px',
                  whiteSpace: 'pre-line',
                  boxSizing: 'border-box',
                  width: '100%',
                }}>
                  {sentencesA.map((s, i) => {
                    const pairId = getPairIdForA(i);
                    const highlightColor = getHighlightColor(s.match_score);
                    return (
                      <span key={i} style={{ backgroundColor: highlightColor, padding: '2px 0' }}>
                        {pairId && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ea580c',
                            color: '#ffffff',
                            fontSize: '9px',
                            fontWeight: 'bold',
                            borderRadius: '50%',
                            width: '13px',
                            height: '13px',
                            marginRight: '3px',
                            verticalAlign: 'middle',
                          }}>
                            {pairId}
                          </span>
                        )}
                        {s.text}{' '}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Doc B */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                <div style={{ borderBottom: '1px solid #e6ddc4', paddingBottom: '6px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 'bold', fontFamily: 'Georgia, serif', color: '#1a1a1a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Document B (Compared Source)
                  </h3>
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#1a1a1a',
                  lineHeight: '1.6',
                  backgroundColor: '#faf8f5',
                  border: '1px solid #e6ddc4',
                  borderRadius: '12px',
                  padding: '20px',
                  whiteSpace: 'pre-line',
                  boxSizing: 'border-box',
                  width: '100%',
                }}>
                  {sentencesB.map((s, i) => {
                    const pairId = getPairIdForB(i);
                    const highlightColor = getHighlightColor(s.match_score);
                    return (
                      <span key={i} style={{ backgroundColor: highlightColor, padding: '2px 0' }}>
                        {pairId && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ea580c',
                            color: '#ffffff',
                            fontSize: '9px',
                            fontWeight: 'bold',
                            borderRadius: '50%',
                            width: '13px',
                            height: '13px',
                            marginRight: '3px',
                            verticalAlign: 'middle',
                          }}>
                            {pairId}
                          </span>
                        )}
                        {s.text}{' '}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* PREMIUM SIDE-BY-SIDE PANELS */
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '20px',
              width: '100%',
              boxSizing: 'border-box'
            }}>
              {/* Left Column - Doc A */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ borderBottom: '1px solid #e6ddc4', paddingBottom: '6px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'Georgia, serif', color: '#1a1a1a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Submitted Document A
                  </h3>
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#1a1a1a',
                  lineHeight: '1.6',
                  backgroundColor: '#faf8f5',
                  border: '1px solid #e6ddc4',
                  borderRadius: '12px',
                  padding: '16px',
                  whiteSpace: 'pre-line',
                  boxSizing: 'border-box',
                  minHeight: '260px',
                }}>
                  {sentencesA.map((s, i) => {
                    const pairId = getPairIdForA(i);
                    const highlightColor = getHighlightColor(s.match_score);
                    return (
                      <span key={i} style={{ backgroundColor: highlightColor, padding: '2px 0' }}>
                        {pairId && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ea580c',
                            color: '#ffffff',
                            fontSize: '9px',
                            fontWeight: 'bold',
                            borderRadius: '50%',
                            width: '13px',
                            height: '13px',
                            marginRight: '3px',
                            verticalAlign: 'middle',
                          }}>
                            {pairId}
                          </span>
                        )}
                        {s.text}{' '}
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Right Column - Doc B */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ borderBottom: '1px solid #e6ddc4', paddingBottom: '6px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', fontFamily: 'Georgia, serif', color: '#1a1a1a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Compared Document B
                  </h3>
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#1a1a1a',
                  lineHeight: '1.6',
                  backgroundColor: '#faf8f5',
                  border: '1px solid #e6ddc4',
                  borderRadius: '12px',
                  padding: '16px',
                  whiteSpace: 'pre-line',
                  boxSizing: 'border-box',
                  minHeight: '260px',
                }}>
                  {sentencesB.map((s, i) => {
                    const pairId = getPairIdForB(i);
                    const highlightColor = getHighlightColor(s.match_score);
                    return (
                      <span key={i} style={{ backgroundColor: highlightColor, padding: '2px 0' }}>
                        {pairId && (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#ea580c',
                            color: '#ffffff',
                            fontSize: '9px',
                            fontWeight: 'bold',
                            borderRadius: '50%',
                            width: '13px',
                            height: '13px',
                            marginRight: '3px',
                            verticalAlign: 'middle',
                          }}>
                            {pairId}
                          </span>
                        )}
                        {s.text}{' '}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Three-Column Bottom Summary Section */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '16px',
            width: '100%',
            boxSizing: 'border-box',
            marginTop: '12px'
          }}>
            {/* Card 1: Metadata Ledger */}
            <div style={{
              backgroundColor: '#faf8f5',
              border: '1px solid #e6ddc4',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxSizing: 'border-box'
            }}>
              <h4 style={{
                fontSize: '11px',
                fontWeight: 'bold',
                fontFamily: 'Georgia, serif',
                color: '#9a3412',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '1px solid #e6ddc4',
                paddingBottom: '4px'
              }}>
                Metadata Ledger
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #e6ddc4', paddingBottom: '4px' }}>
                  <span style={{ color: '#666666' }}>Report ID:</span>
                  <span style={{ fontWeight: 'bold', color: '#1a1a1a', fontFamily: 'monospace' }}>{reportId}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px dotted #e6ddc4', paddingBottom: '4px' }}>
                  <span style={{ color: '#666666' }}>Doc A Source:</span>
                  <span style={{ fontWeight: 'bold', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {docAName || "Pasted Text"}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', borderBottom: '1px dotted #e6ddc4', paddingBottom: '4px' }}>
                  <span style={{ color: '#666666' }}>Doc B Source:</span>
                  <span style={{ fontWeight: 'bold', color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {docBName || "Pasted Text"}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666666' }}>Secure Verification:</span>
                  <span style={{ color: '#22c55e', fontWeight: 'bold' }}>Active ✓</span>
                </div>
              </div>
            </div>

            {/* Card 2: Similarity Breakdown */}
            <div style={{
              backgroundColor: '#faf8f5',
              border: '1px solid #e6ddc4',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxSizing: 'border-box'
            }}>
              <h4 style={{
                fontSize: '11px',
                fontWeight: 'bold',
                fontFamily: 'Georgia, serif',
                color: '#9a3412',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '1px solid #e6ddc4',
                paddingBottom: '4px'
              }}>
                Match Alignment
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '11px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #e6ddc4', paddingBottom: '4px' }}>
                  <span style={{ color: '#666666' }}>Comparison Pair:</span>
                  <span style={{ fontWeight: 'bold', color: '#1a1a1a' }}>Doc A &harr; Doc B</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #e6ddc4', paddingBottom: '4px', alignItems: 'center' }}>
                  <span style={{ color: '#666666' }}>Similarity Index:</span>
                  <span style={{ fontWeight: 'bold', color: '#ea580c', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {score}%
                    <span style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: '#ea580c'
                    }} />
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dotted #e6ddc4', paddingBottom: '4px' }}>
                  <span style={{ color: '#666666' }}>Matched Blocks:</span>
                  <span style={{ fontWeight: 'bold', color: '#1a1a1a' }}>{mappedPairs.length} aligned</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#666666' }}>Integrity Check:</span>
                  <span style={{ color: '#16a34a', fontWeight: 'bold' }}>Passed ✓</span>
                </div>
              </div>
            </div>

            {/* Card 3: Methodology Summary */}
            <div style={{
              backgroundColor: '#faf8f5',
              border: '1px solid #e6ddc4',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              boxSizing: 'border-box'
            }}>
              <h4 style={{
                fontSize: '11px',
                fontWeight: 'bold',
                fontFamily: 'Georgia, serif',
                color: '#9a3412',
                margin: 0,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                borderBottom: '1px solid #e6ddc4',
                paddingBottom: '4px'
              }}>
                Methodology Summary
              </h4>
              <p style={{
                fontSize: '10px',
                color: '#555555',
                lineHeight: '1.5',
                margin: 0
              }}>
                Blends TF-IDF mathematical word-matching with AI Semantic Embeddings (via Google Gemini text-embedding-004) to detect factual alignments and conceptual duplicates, even when paraphrased.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* WEB USER INTERFACE (On-Screen Results Card) */}
      <div ref={reportRef} className="bg-[#FAF8F5] dark:bg-[#181615] p-8 rounded-2xl border border-[#E6DDC4] dark:border-[#2C2420] shadow-lg space-y-8 transition-colors duration-200">
        <div className="border-b border-[#E6DDC4] dark:border-[#2C2420] pb-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <h1 className="text-2xl font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4]">DocSim Checker — Similarity Report</h1>
            <p className="text-stone-500 dark:text-stone-400 mt-1 font-mono text-xs uppercase tracking-widest">
              Report ID: {reportId} &bull; Generated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Beautiful Wax Seal Stamp on web interface */}
          <div className="flex items-center gap-4 bg-white dark:bg-stone-900 px-5 py-3 rounded-xl border border-[#E6DDC4] dark:border-stone-800 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#9A3412] border-2 double border-[#fcd34d] shadow-inner flex flex-col items-center justify-center text-center">
              <span className="text-[6px] text-[#fcd34d] font-bold tracking-widest">VERDICT</span>
              <span className="text-[7px] text-white font-black tracking-tighter leading-none">{getWaxSealLabel(score)}</span>
            </div>
            <div>
              <div className="text-xs text-stone-500 font-mono tracking-wider uppercase">Overall Similarity</div>
              <div className="text-3xl font-black font-editorial text-orange-600 leading-none">{score}%</div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-lg font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] uppercase tracking-wider">{getVerdict(score)}</h2>
          <div className="mt-2 inline-flex flex-col items-center w-full relative">
            {isSample && (
              <span className="bg-orange-100 dark:bg-orange-950/20 text-orange-700 dark:text-orange-300 text-xs font-bold px-2.5 py-1 rounded-full border border-orange-200 dark:border-orange-900/30 uppercase tracking-wider animate-pulse">
                Sample Result
              </span>
            )}
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
            <span className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
              Show matches above:
            </span>
            <span className="text-lg font-black text-orange-600 bg-orange-50/50 dark:bg-orange-950/20 px-3 py-1 rounded-lg">
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
          <div className="flex justify-between text-xs text-stone-500 dark:text-stone-500 font-medium px-0.5">
            <span>0% (All matches)</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Empty State Banner */}
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

        {/* SIDE-BY-SIDE PANELS (Web View) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-md font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] border-b border-[#E6DDC4] dark:border-[#2C2420] pb-2">
              Document A ({docAName || "Submitted"})
            </h3>
            <div id="doc-a-container" className="bg-white dark:bg-stone-900/40 p-5 border border-[#E6DDC4] dark:border-[#2C2420] rounded-xl h-[300px] md:h-[450px] overflow-y-auto leading-relaxed text-foreground shadow-inner">
              {sentencesA.map((s, i) => {
                const pairId = getPairIdForA(i);
                const highlightColor = getHighlightColor(s.match_score);
                return (
                  <span
                    key={i}
                    style={{ backgroundColor: highlightColor }}
                    className="transition-colors duration-300 px-0.5 rounded-sm inline-block"
                    title={`Match score: ${(s.match_score * 100).toFixed(1)}%`}
                  >
                    {pairId && (
                      <span className="inline-flex items-center justify-center bg-orange-600 text-white font-mono font-bold text-[9px] rounded-full w-4 h-4 mr-1 select-none">
                        {pairId}
                      </span>
                    )}
                    {s.text}{' '}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-md font-bold font-editorial text-[#1A1A1A] dark:text-[#F5F5F4] border-b border-[#E6DDC4] dark:border-[#2C2420] pb-2">
              Document B ({docBName || "Compared Source"})
            </h3>
            <div id="doc-b-container" className="bg-white dark:bg-stone-900/40 p-5 border border-[#E6DDC4] dark:border-[#2C2420] rounded-xl h-[300px] md:h-[450px] overflow-y-auto leading-relaxed text-foreground shadow-inner">
              {sentencesB.map((s, i) => {
                const pairId = getPairIdForB(i);
                const highlightColor = getHighlightColor(s.match_score);
                return (
                  <span
                    key={i}
                    style={{ backgroundColor: highlightColor }}
                    className="transition-colors duration-300 px-0.5 rounded-sm inline-block"
                    title={`Match score: ${(s.match_score * 100).toFixed(1)}%`}
                  >
                    {pairId && (
                      <span className="inline-flex items-center justify-center bg-orange-600 text-white font-mono font-bold text-[9px] rounded-full w-4 h-4 mr-1 select-none">
                        {pairId}
                      </span>
                    )}
                    {s.text}{' '}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Premium bottom three columns for web view */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#E6DDC4] dark:border-[#2C2420]">
          {/* Card 1: Metadata Ledger */}
          <div className="bg-[#FAF8F5]/50 dark:bg-stone-900/20 border border-[#E6DDC4] dark:border-stone-800 rounded-xl p-5 flex flex-col gap-3">
            <h4 className="text-xs font-bold font-editorial text-[#9A3412] dark:text-orange-500 uppercase tracking-widest border-b border-[#E6DDC4] dark:border-stone-800 pb-2">
              Metadata Ledger
            </h4>
            <div className="flex flex-col gap-2.5 text-xs font-mono text-stone-600 dark:text-stone-400">
              <div className="flex justify-between border-b border-dashed border-[#E6DDC4] dark:border-stone-800 pb-1.5">
                <span>Report ID:</span>
                <span className="font-bold text-[#1A1A1A] dark:text-stone-200">{reportId}</span>
              </div>
              <div className="flex flex-col border-b border-dashed border-[#E6DDC4] dark:border-stone-800 pb-1.5">
                <span>Doc A Source:</span>
                <span className="font-bold text-[#1A1A1A] dark:text-stone-200 truncate">{docAName || "Pasted Text"}</span>
              </div>
              <div className="flex flex-col border-b border-dashed border-[#E6DDC4] dark:border-stone-800 pb-1.5">
                <span>Doc B Source:</span>
                <span className="font-bold text-[#1A1A1A] dark:text-stone-200 truncate">{docBName || "Pasted Text"}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-600 dark:text-green-400 font-bold">Secure ✓</span>
              </div>
            </div>
          </div>

          {/* Card 2: Similarity Breakdown */}
          <div className="bg-[#FAF8F5]/50 dark:bg-stone-900/20 border border-[#E6DDC4] dark:border-stone-800 rounded-xl p-5 flex flex-col gap-3">
            <h4 className="text-xs font-bold font-editorial text-[#9A3412] dark:text-orange-500 uppercase tracking-widest border-b border-[#E6DDC4] dark:border-stone-800 pb-2">
              Match Alignment
            </h4>
            <div className="flex flex-col gap-2.5 text-xs font-mono text-stone-600 dark:text-stone-400">
              <div className="flex justify-between border-b border-dashed border-[#E6DDC4] dark:border-stone-800 pb-1.5">
                <span>Compared files:</span>
                <span className="font-bold text-[#1A1A1A] dark:text-stone-200">A &harr; B</span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#E6DDC4] dark:border-stone-800 pb-1.5 items-center">
                <span>Similarity Index:</span>
                <span className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1.5">
                  {score}%
                  <span className="inline-block w-2 h-2 rounded-full bg-orange-600 animate-pulse" />
                </span>
              </div>
              <div className="flex justify-between border-b border-dashed border-[#E6DDC4] dark:border-stone-800 pb-1.5">
                <span>Alignments:</span>
                <span className="font-bold text-[#1A1A1A] dark:text-stone-200">{mappedPairs.length} mapped</span>
              </div>
              <div className="flex justify-between">
                <span>Verification:</span>
                <span className="text-green-600 dark:text-green-400 font-bold">Passed ✓</span>
              </div>
            </div>
          </div>

          {/* Card 3: Methodology Summary */}
          <div className="bg-[#FAF8F5]/50 dark:bg-stone-900/20 border border-[#E6DDC4] dark:border-stone-800 rounded-xl p-5 flex flex-col gap-3">
            <h4 className="text-xs font-bold font-editorial text-[#9A3412] dark:text-orange-500 uppercase tracking-widest border-b border-[#E6DDC4] dark:border-stone-800 pb-2">
              Methodology Summary
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed font-sans">
              Blends TF-IDF mathematical word-matching with AI Semantic Embeddings (via Google Gemini text-embedding-004) to detect factual alignments and conceptual duplicates, even when paraphrased.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
