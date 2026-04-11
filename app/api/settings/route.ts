import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    // Paksa ambil cuma baris ID 1
    const { data, error } = await supabase.from('settings').select('*').eq('id', 1).single();
    if (error) throw error;
    return NextResponse.json(data || {});
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data settings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Pastikan kita buang field captcha biar gak nyangkut kalau disimpen
    delete body.captcha_key_1;
    delete body.captcha_key_2;

    // WAJIB PAKE UPDATE + EQ('id', 1) BIAR NIMPA, BUKAN BIKIN BARU
    const { error } = await supabase
      .from('settings')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', 1);

    if (error) throw error;
    return NextResponse.json({ status: 'ok' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan settings' }, { status: 500 });
  }
}
