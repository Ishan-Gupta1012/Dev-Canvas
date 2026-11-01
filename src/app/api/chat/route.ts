import { NextRequest, NextResponse } from 'next/server';
import { generateJSON } from '@/lib/llm';

const SYSTEM_CONTEXT = `
You are DevCanvas Assistant, an AI support agent for DevCanvas (dev-canvas-ia.vercel.app), a portfolio website builder that turns resumes into professional portfolio sites.

You ONLY answer questions related to:
1. DevCanvas website features and how to use them (resume upload, AI parsing, job analysis, portfolio creation, template selection)
2. Publishing/deploying portfolios to dev-canvas-ia.vercel.app/<username> URLs
3. Exporting portfolio code as a ZIP and running it locally (npm install, npm run dev, etc.)
4. Resume parsing, match analysis, target brief creation
5. Account authentication and dashboard navigation
6. General guidance on using the DevCanvas platform

If a question is NOT related to DevCanvas, its features, portfolio creation, or running exported code locally, politely decline and say you can only help with DevCanvas-related questions.

Be concise, helpful, and use markdown formatting. Do not hallucinate features that don't exist.
`;

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const prompt = `${SYSTEM_CONTEXT}

User question: ${message}

Respond helpfully to the user's question about DevCanvas.`;

    const result = await generateJSON(prompt);

    // generateJSON expects JSON, but for chat we want plain text.
    // If the model returned JSON, extract the text; otherwise use as-is.
    const responseText = typeof result === 'string'
      ? result
      : result.response || result.text || result.answer || JSON.stringify(result);

    return NextResponse.json({ response: responseText });
  } catch (err: unknown) {
    console.error('Chat API error:', err);
    const message = err instanceof Error ? err.message : 'Failed to get response';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
