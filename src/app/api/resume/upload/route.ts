import { NextRequest, NextResponse } from 'next/server';
import { processResumePipeline } from '@/lib/resume/pipeline';
import { enrichPortfolioData } from '@/lib/resume/enricher';

// Dynamic import for mammoth (DOCX parsing)
let mammoth: any;
try {
  mammoth = require('mammoth');
} catch (e) {
  console.warn('mammoth not available for DOCX parsing');
}

export async function POST(req: NextRequest) {
  const startTime = performance.now();
  console.log('[1/4] Resume uploaded (Deterministic Pipeline)');

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No resume file uploaded.' }, { status: 400 });
    }

    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File size exceeds the 5MB limit.' }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const isPdf = fileName.endsWith('.pdf');
    const isDocx = fileName.endsWith('.docx');

    if (!isPdf && !isDocx) {
      return NextResponse.json({ error: 'Unsupported file type. Only PDF and DOCX files are allowed.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let rawText = '';
    let portfolio: any = {};

    if (isPdf) {
      console.log('[2/4] Executing 8-Stage Deterministic Pipeline (PDF)');
      const result = await processResumePipeline(buffer);
      rawText = result.rawText;
      portfolio = result.portfolio;
    } else if (isDocx && mammoth) {
      console.log('[2/4] Parsing DOCX with mammoth');
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
      
      // Use the same text-based pipeline for DOCX
      const { detectSectionsFromText } = await import('@/lib/resume/pipeline/5-sections');
      const { extractStructuredInfo } = await import('@/lib/resume/pipeline/6-structured');
      const { normalizeData } = await import('@/lib/resume/pipeline/7-normalizer');
      
      const sections = detectSectionsFromText(rawText);
      const rawData = extractStructuredInfo(sections, []);
      portfolio = normalizeData(rawData);
    } else {
      return NextResponse.json({ error: 'DOCX parsing not available. Please use PDF.' }, { status: 400 });
    }

    console.log('[3/4] Enrichment (Optional)');
    let externalData: { github: unknown[]; linkedin: unknown[]; coding: unknown[]; portfolio: unknown[]; otherLinks: unknown[] } = { github: [], linkedin: [], coding: [], portfolio: [], otherLinks: [] };
    try {
      externalData = await enrichPortfolioData(rawText);
    } catch (e) {
      console.error('Enrichment failed', e);
    }

    console.log('[4/4] Pipeline Complete');
    const totalTime = performance.now() - startTime;
    console.log(`Total Processing Time: ${(totalTime / 1000).toFixed(2)}s`);

    // Debug info for frontend
    const debugInfo = {
      pipeline: isPdf ? 'deterministic-v1' : 'docx-text-v1',
      rawPdfText: rawText,
      cleanedText: rawText,
      sections: portfolio,
      extractedJson: portfolio,
      llmInputs: null
    };

    return NextResponse.json({
      success: true,
      extractedText: rawText,
      detectedUrls: [],
      detectedSections: portfolio,
      isDemo: false,
      demoReason: null,
      resumeData: portfolio,
      externalData: externalData,
      mergedData: portfolio,
      debugInfo: debugInfo
    });

  } catch (error: unknown) {
    console.error('Server upload error:', error);
    const msg = error instanceof Error ? error.message : 'An unexpected server error occurred.';
    return NextResponse.json({ 
      error: msg,
      debugInfo: { pipeline: 'error', rawPdfText: '', extractedJson: null }
    }, { status: 500 });

  }
}
