import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Portfolio Trash & Soft-Delete Management API
 * 
 * Supports:
 * - GET: Fetch all trashed portfolios for the current user
 * - POST: Soft-delete ('trash') or revert ('restore') a portfolio without loss of data or ID
 * - DELETE: Permanently delete a portfolio from trash (requires explicit call)
 */

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: portfolios, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching trashed portfolios:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Filter only portfolios where data has _isTrashed = true
    const trashed = (portfolios || []).filter(
      (p) => Boolean(p.data && (p.data as Record<string, unknown>)._isTrashed)
    );

    return NextResponse.json({ trashed });
  } catch (err) {
    console.error('Error in trash GET route:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { portfolioId, action } = body as { portfolioId: string; action: 'trash' | 'restore' };

    if (!portfolioId || !['trash', 'restore'].includes(action)) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    }

    // Fetch existing portfolio ensuring ownership
    const { data: portfolio, error: fetchError } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', portfolioId)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const currentData = (portfolio.data as Record<string, unknown>) || {};

    if (action === 'trash') {
      // Soft delete: mark _isTrashed = true, keep all original content & ID intact
      const updatedData = {
        ...currentData,
        _isTrashed: true,
        _trashedAt: new Date().toISOString(),
        _prevStatus: portfolio.status,
      };

      const { data: updated, error: updateError } = await supabase
        .from('portfolios')
        .update({
          data: updatedData,
          status: 'draft', // unpublish while in trash so public URL is temporarily disabled
        })
        .eq('id', portfolioId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, portfolio: updated, action: 'trash' });
    }

    if (action === 'restore') {
      // Revert soft-delete: restore original configuration & status
      const updatedData = { ...currentData };
      const prevStatus = (updatedData._prevStatus as 'draft' | 'published') || 'draft';
      delete updatedData._isTrashed;
      delete updatedData._trashedAt;
      delete updatedData._prevStatus;

      const { data: updated, error: updateError } = await supabase
        .from('portfolios')
        .update({
          data: updatedData,
          status: prevStatus,
        })
        .eq('id', portfolioId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ success: true, portfolio: updated, action: 'restore' });
    }

    return NextResponse.json({ error: 'Unhandled action' }, { status: 400 });
  } catch (err) {
    console.error('Error in trash POST route:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const portfolioId = searchParams.get('id');

    if (!portfolioId) {
      return NextResponse.json({ error: 'Missing portfolio id' }, { status: 400 });
    }

    // Permanent deletion from database
    const { error: deleteError } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', portfolioId)
      .eq('user_id', user.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, deletedId: portfolioId });
  } catch (err) {
    console.error('Error in trash DELETE route:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

