import { NextRequest, NextResponse } from 'next/server';
import { processResumePipeline } from '@/lib/resume/pipeline';
import {
  analyzeResumeAgainstJob,
  extractJobDetailsFromText,
  JobDetails
} from '@/lib/resume/jobAnalyzer';

// Dynamic import for mammoth (DOCX parsing)
let mammoth: any;
try {
  mammoth = require('mammoth');
} catch (e) {
  console.warn('mammoth not available for DOCX parsing');
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    // Handle JSON payload (e.g. for extracting JD details or analyzing with pre-parsed text)
    if (contentType.includes('application/json')) {
      const body = await req.json();

      // Action: Auto-extract job details from raw JD text
      if (body.action === 'extract-job') {
        const rawText = body.rawText || '';
        const extracted = extractJobDetailsFromText(rawText);
        return NextResponse.json({ success: true, data: extracted });
      }

      // Direct analysis with pre-extracted resume data
      if (body.resumeText && body.jobData) {
        const jobData: JobDetails = body.jobData;
        const result = await analyzeResumeAgainstJob(
          body.resumeText,
          body.resumeData || {},
          jobData,
          body.fileName || 'Resume.pdf',
          body.fileSize || '100 KB'
        );
        return NextResponse.json({ success: true, data: result });
      }
    }

    // Handle multipart/form-data for file uploads
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const jobDataRaw = formData.get('jobData') as string | null;

    if (!jobDataRaw) {
      return NextResponse.json(
        { error: 'Job description and details are required for analysis.' },
        { status: 400 }
      );
    }

    let jobData: JobDetails;
    try {
      jobData = JSON.parse(jobDataRaw);
    } catch {
      return NextResponse.json({ error: 'Invalid job data format.' }, { status: 400 });
    }

    if (!jobData.title || (!jobData.description && (!jobData.requiredSkills || jobData.requiredSkills.length === 0))) {
      return NextResponse.json(
        { error: 'Please provide at least a Job Title and either Required Skills or a Job Description.' },
        { status: 400 }
      );
    }

    let rawText = (formData.get('resumeText') as string) || '';
    let portfolio: any = {};

    if (file) {
      const MAX_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_SIZE) {
        return NextResponse.json({ error: 'File size exceeds 10MB limit.' }, { status: 400 });
      }

      const fileName = file.name.toLowerCase();
      const isPdf = fileName.endsWith('.pdf');
      const isDocx = fileName.endsWith('.docx');

      if (!isPdf && !isDocx) {
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload a PDF or DOCX file.' },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const isTruePdf = isPdf && buffer.slice(0, 5).toString('ascii') === '%PDF-';

      if (isTruePdf) {
        try {
          const result = await processResumePipeline(buffer);
          rawText = result.rawText;
          portfolio = result.portfolio;
        } catch (pdfErr) {
          console.warn('[Analyze API] PDF pipeline failed, attempting pdf-parse fallback:', pdfErr);
          try {
            const pdfParse = require('pdf-parse');
            const parsed = await pdfParse(buffer);
            rawText = parsed.text;
            const { detectSectionsFromText } = await import('@/lib/resume/pipeline/5-sections');
            const { extractStructuredInfo } = await import('@/lib/resume/pipeline/6-structured');
            const { normalizeData } = await import('@/lib/resume/pipeline/7-normalizer');
            const sections = detectSectionsFromText(rawText);
            portfolio = normalizeData(extractStructuredInfo(sections, []));
          } catch (fallbackErr) {
            console.error('All PDF extraction attempts failed:', fallbackErr);
            throw new Error('Unable to extract text from PDF document. Please verify the file is not corrupted.');
          }
        }
      } else if (isPdf) {
        // Plain text content in buffer (e.g. client sample or text-encoded file)
        rawText = buffer.toString('utf-8');
        const { detectSectionsFromText } = await import('@/lib/resume/pipeline/5-sections');
        const { extractStructuredInfo } = await import('@/lib/resume/pipeline/6-structured');
        const { normalizeData } = await import('@/lib/resume/pipeline/7-normalizer');
        const sections = detectSectionsFromText(rawText);
        portfolio = normalizeData(extractStructuredInfo(sections, []));
      } else if (isDocx && mammoth) {
        const result = await mammoth.extractRawText({ buffer });
        rawText = result.value;

        const { detectSectionsFromText } = await import('@/lib/resume/pipeline/5-sections');
        const { extractStructuredInfo } = await import('@/lib/resume/pipeline/6-structured');
        const { normalizeData } = await import('@/lib/resume/pipeline/7-normalizer');

        const sections = detectSectionsFromText(rawText);
        const rawData = extractStructuredInfo(sections, []);
        portfolio = normalizeData(rawData);
      }
    }

    if (!rawText || !rawText.trim()) {
      return NextResponse.json(
        { error: 'Unable to extract text from the uploaded resume. Please verify the file is not an empty or scanned image document.' },
        { status: 400 }
      );
    }

    const fileSizeStr = file ? `${(file.size / 1024).toFixed(1)} KB` : '100 KB';
    const fileNameStr = file ? file.name : 'Resume.pdf';

    const analysisResult = await analyzeResumeAgainstJob(
      rawText,
      portfolio,
      jobData,
      fileNameStr,
      fileSizeStr
    );

    return NextResponse.json({
      success: true,
      data: analysisResult,
      resumeData: portfolio,
      extractedResumeText: rawText.slice(0, 2000), // preview
    });
  } catch (error: any) {
    console.error('Job-Specific Resume Analyzer error:', error);
    return NextResponse.json(
      { error: error?.message || 'An unexpected error occurred during resume analysis.' },
      { status: 500 }
    );
  }
}
