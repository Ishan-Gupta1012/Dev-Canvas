import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const supabase = await createClient();

    const { slug } = await params;

    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .select('id, title, template_name, data, status, slug, created_at, updated_at')
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error || !portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    return NextResponse.json({ portfolio });
  } catch (err) {
    console.error('Error in fetch portfolio by slug API:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
