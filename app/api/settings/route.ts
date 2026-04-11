import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 itu error kalau data kosong
    return NextResponse.json(data || {});
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Update data dengan id 1
    const { error } = await supabase
      .from('settings')
      .upsert({ id: 1, ...body, updated_at: new Date().toISOString() });

    if (error) throw error;
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan settings' }, { status: 500 });
  }
}
