import { createClient } from '@/utils/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { portfolioData, templateName, title } = body;

    if (!portfolioData || !templateName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data: portfolio, error } = await supabase
      .from('portfolios')
      .insert({
        user_id: user.id,
        title: title || portfolioData.hero?.name || 'Untitled Portfolio',
        template_name: templateName,
        data: portfolioData,
        status: 'draft',
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving portfolio:', error);
      return NextResponse.json({ error: error.message || 'Failed to save portfolio' }, { status: 500 });
    }

    return NextResponse.json({ portfolio });
  } catch (err) {
    console.error('Error in save portfolio API:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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
      console.error('Error fetching portfolios:', error);
      return NextResponse.json({ error: error.message || 'Failed to fetch portfolios' }, { status: 500 });
    }

    return NextResponse.json({ portfolios });
  } catch (err) {
    console.error('Error in fetch portfolios API:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}