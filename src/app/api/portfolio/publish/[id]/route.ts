import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { slug, action } = body;

    // Verify the portfolio belongs to the user
    const { data: portfolio, error: fetchError } = await supabase
      .from('portfolios')
      .select('id, slug, status, user_id')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    if (action === 'unpublish') {
      const { data, error } = await supabase
        .from('portfolios')
        .update({ status: 'draft', slug: null })
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        return NextResponse.json({ error: error.message || 'Failed to unpublish portfolio' }, { status: 500 });
      }

      return NextResponse.json({ portfolio: data, message: 'Portfolio unpublished' });
    }

    // Publish action - requires a unique name
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json({ error: 'Unique portfolio name is required to publish' }, { status: 400 });
    }

    // Normalize unique name: lowercase, alphanumeric + hyphens only
    const normalizedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');

    if (!normalizedSlug || normalizedSlug.length < 2) {
      return NextResponse.json({ error: 'Invalid unique name. Use at least 2 characters (letters, numbers, hyphens).' }, { status: 400 });
    }

    // Check if unique name is already taken by another portfolio
    const { data: existing } = await supabase
      .from('portfolios')
      .select('id')
      .eq('slug', normalizedSlug)
      .neq('id', id)
      .single();

    if (existing) {
      return NextResponse.json({ error: 'This unique name is already taken. Please choose another.' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('portfolios')
      .update({ status: 'published', slug: normalizedSlug })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message || 'Failed to publish portfolio' }, { status: 500 });
    }

    return NextResponse.json({ portfolio: data, message: 'Portfolio published', slug: normalizedSlug });
  } catch (err) {
    console.error('Error in publish portfolio API:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
