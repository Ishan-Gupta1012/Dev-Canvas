import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import path from 'path';
import { pathToFileURL } from 'url';
import { PdfDocument } from './types';

// In Next.js Server Components / API routes, the fake worker dynamic import fails.
// We explicitly set the workerSrc to the resolved file:// URL.
if (typeof window === 'undefined') {
  const workerPath = path.join(process.cwd(), 'node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
  try {
    pdfjs.GlobalWorkerOptions.workerSrc = pathToFileURL(workerPath).href;
  } catch {
    pdfjs.GlobalWorkerOptions.workerSrc = workerPath;
  }
  console.log('[PDF Loader] Worker path:', pdfjs.GlobalWorkerOptions.workerSrc);
}

export async function loadPdf(buffer: Buffer): Promise<PdfDocument> {
  const data = new Uint8Array(buffer);
  
  // Setting standardFontDataUrl might also be needed to prevent font loading issues
  const standardFontDataUrl = path.join(process.cwd(), 'node_modules/pdfjs-dist/standard_fonts/');

  const loadingTask = pdfjs.getDocument({
    data,
    useSystemFonts: true,
    disableFontFace: true,
    standardFontDataUrl
  });
  
  try {
    const pdfDocument = await loadingTask.promise;
    console.log('[PDF Loader] PDF loaded successfully, pages:', pdfDocument.numPages);
    return pdfDocument as unknown as PdfDocument;
  } catch (err) {
    console.error('[PDF Loader] Failed to load PDF:', err);
    throw new Error(`Failed to load PDF: ${err instanceof Error ? err.message : 'Unknown error'}`);
  }
}
