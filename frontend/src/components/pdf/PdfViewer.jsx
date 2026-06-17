import { useCallback, useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2, FileWarning } from 'lucide-react';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import Button from '../ui/Button.jsx';

// Load the pdf.js worker from a CDN that matches the bundled version.
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

// Tailwind <mark> background per risk level (heatmap colors).
const HIGHLIGHT_BG = {
  HIGH: 'rgba(244, 63, 94, 0.32)', // rose
  MEDIUM: 'rgba(245, 158, 11, 0.32)', // amber
  LOW: 'rgba(16, 185, 129, 0.30)', // emerald
};

// Normalize text for fuzzy matching between AI quote and PDF text layer.
const normalize = (s) => (s || '').toLowerCase().replace(/\s+/g, ' ').trim();

/**
 * PDF viewer with page navigation, zoom and risk-clause highlighting.
 *
 * `highlight` (optional): { pageNumber, quote, level } — jumps to the page and
 * highlights text matching the quote. `nonce` forces a re-jump even when the
 * same clause is clicked twice.
 */
const PdfViewer = ({ fileUrl, highlight, nonce }) => {
  const [numPages, setNumPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState(false);
  const [flash, setFlash] = useState(false);

  const onLoadSuccess = ({ numPages: n }) => {
    setNumPages(n);
    setError(false);
  };

  const go = (delta) =>
    setPageNumber((p) => Math.min(Math.max(1, p + delta), numPages || 1));

  // Jump to the highlighted clause's page when a clause card is clicked.
  useEffect(() => {
    if (highlight?.pageNumber) {
      setPageNumber(Math.max(1, highlight.pageNumber));
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 1200);
      return () => clearTimeout(t);
    }
  }, [highlight, nonce]);

  // Wrap text-layer chunks that fall inside the target quote with a colored mark.
  const customTextRenderer = useCallback(
    (textItem) => {
      if (!highlight?.quote || highlight.pageNumber !== pageNumber) {
        return textItem.str;
      }
      const quote = normalize(highlight.quote);
      const piece = normalize(textItem.str);
      if (!piece || piece.length < 2) return textItem.str;

      // Highlight a chunk if the quote contains it (chunk-level match).
      if (quote.includes(piece)) {
        const bg = HIGHLIGHT_BG[highlight.level] || HIGHLIGHT_BG.LOW;
        return `<mark style="background:${bg};color:inherit;border-radius:2px;padding:0 1px;">${textItem.str}</mark>`;
      }
      return textItem.str;
    },
    [highlight, pageNumber]
  );

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-slate-100">
      <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-2">
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => go(-1)}
            disabled={pageNumber <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="px-2 text-sm text-slate-600">
            {numPages ? `${pageNumber} / ${numPages}` : '—'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => go(1)}
            disabled={pageNumber >= numPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center text-xs text-slate-500">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale((s) => Math.min(2.4, s + 0.2))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-slate-500">
            <FileWarning className="h-10 w-10 text-slate-300" />
            <p className="mt-3 text-sm">Unable to display this PDF.</p>
            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-2 text-sm font-medium text-brand-600 hover:underline"
            >
              Open in new tab
            </a>
          </div>
        ) : (
          <Document
            file={fileUrl}
            onLoadSuccess={onLoadSuccess}
            onLoadError={() => setError(true)}
            loading={
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-brand-600" />
              </div>
            }
            className="flex justify-center"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer
              renderAnnotationLayer
              customTextRenderer={customTextRenderer}
              className={`overflow-hidden rounded-lg shadow-card transition-shadow ${
                flash ? 'ring-2 ring-brand-400 ring-offset-2' : ''
              }`}
            />
          </Document>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
