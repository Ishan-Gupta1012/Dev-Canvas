import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/** Mirrors the normalization used when publishing and on the public page. */
function normalizeSlug(raw: string): string {
  let decoded = raw;

  try {
    decoded = decodeURIComponent(raw);
  } catch {
    // Malformed percent-encoding — fall through with the raw value.
  }

  return decoded.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();

    const { slug } = await params;
    const normalizedSlug = normalizeSlug(slug);

    if (!normalizedSlug) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('id, title, template_name, data, status, slug, created_at, updated_at')
      .eq('slug', normalizedSlug)
      .eq('status', 'published')
      .limit(1);

    const portfolio = portfolios?.[0];

    if (error || !portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    return NextResponse.json({ portfolio });
  } catch (err) {
    console.error('Error in fetch portfolio by slug API:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
