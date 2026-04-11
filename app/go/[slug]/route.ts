import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // 1. Ambil data
  const { data: urlData, error } = await supabase
    .from('urls')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !urlData || !urlData.original_url) {
    return NextResponse.json({ error: 'Link Not Found' }, { status: 404 });
  }

  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  // Cek apakah ini Bot Sosmed
  const isBot = /bot|facebookexternalhit|whatsapp|telegram|twitter|linkedin|skype|discord|slack|google|bing/i.test(userAgent);

  // 2. LOGIKA REDIRECT V2
  if (isBot) {
    // BOT SOSMED: Kasih Fake Link (Biar preview domain asli muncul)
    return Response.redirect(urlData.fake_url || urlData.original_url, 302);
  }

  // MANUSIA (Browser): Alihkan ke FAKE LINK sesuai permintaan lu
  // Link asli (original_url) tetep aman di database buat keperluan lu aja
  if (urlData.fake_url) {
    return Response.redirect(urlData.fake_url, 302);
  }

  return Response.redirect(urlData.original_url, 302);
}
