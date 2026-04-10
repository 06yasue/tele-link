import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const user = searchParams.get('user');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 5;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from('urls').select('*', { count: 'exact' });
    
    // Filter kalau ada user ID
    if (user && user !== 'null') {
      query = query.eq('chat_id', user);
    }

    const { data, count, error } = await query
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) throw error;

    // Hitung total klik
    let clickQuery = supabase.from('urls').select('hitcount');
    if (user && user !== 'null') {
      clickQuery = clickQuery.eq('chat_id', user);
    }
    const { data: allClicks } = await clickQuery;
    const clicks = allClicks?.reduce((acc, curr) => acc + (curr.hitcount || 0), 0) || 0;

    return NextResponse.json({ urls: data || [], totalLinks: count || 0, totalClicks: clicks });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();
    await supabase.from('urls').delete().eq('id', id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
