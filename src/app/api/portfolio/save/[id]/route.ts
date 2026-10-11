import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
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

    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error('Error fetching portfolio:', error);
      return NextResponse.json({ error: error.message || 'Portfolio not found' }, { status: 404 });
    }

    return NextResponse.json({ portfolio });
  } catch (err) {
    console.error('Error in fetch portfolio API:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
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
    const { portfolioData, templateName, title } = body;

    if (!portfolioData || !templateName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .update({
        title: title || portfolioData.hero?.name || 'Untitled Portfolio',
        template_name: templateName,
        data: portfolioData,
      })
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) {
      console.error('Error updating portfolio:', error);
      return NextResponse.json({ error: error.message || 'Failed to update portfolio' }, { status: 500 });
    }

    return NextResponse.json({ portfolio });
  } catch (err) {
    console.error('Error in update portfolio API:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
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

    const { error } = await supabase
      .from('portfolios')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting portfolio:', error);
      return NextResponse.json({ error: error.message || 'Failed to delete portfolio' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error in delete portfolio API:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}