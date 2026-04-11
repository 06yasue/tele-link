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
    return NextResponse.json({ error: 'Link Not Found' }, { status: 404 });
  }

  // 2. Baca Identitas Pengunjung (User-Agent & Referer)
  const headersList = request.headers;
  const userAgent = headersList.get('user-agent')?.toLowerCase() || '';
  const referer = headersList.get('referer')?.toLowerCase() || '';

  // Deteksi bot scraper (Cuma bot yang tugasnya narik data untuk preview)
  const isBotScraper = /facebookexternalhit|whatsapp|telegrambot|twitterbot|slackbot|discordbot|bingbot|googlebot/i.test(userAgent);

  // --- LOGIKA REDIRECT V2 HARGA MATI ---

  // KONDISI 1: BOT SOSMED DATANG (Buat Preview) -> FAKE LINK
  if (isBotScraper && urlData.fake_url) {
    return Response.redirect(urlData.fake_url, 302);
  }

  // KONDISI 2: ORANG KLIK DARI SOSMED (Ada jejak Referer) -> LINK TUJUAN ASLI
  // Kalau referer gak kosong, artinya dia beneran ngeklik dari suatu tempat (sosmed, web lain)
  if (referer.length > 0) {
    // Tambah hitcount karena ada manusia asli yang ngeklik
    supabase.from('urls').update({ hitcount: (urlData.hitcount || 0) + 1 }).eq('id', urlData.id).then();
    return Response.redirect(urlData.original_url, 302);
  }

  // KONDISI 3: ORANG AKSES LANGSUNG KE BROWSER (Copy-Paste / Gak ada Referer) -> FAKE LINK
  if (urlData.fake_url) {
    return Response.redirect(urlData.fake_url, 302);
  }

  // Fallback (Jaga-jaga kalau fake_url kosong karena alasan tertentu)
  return Response.redirect(urlData.original_url, 302);
}
