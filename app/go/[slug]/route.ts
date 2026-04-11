import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;

  // --- TEMBOK PEMISAH V1 & V2 ---
  // Kalau slug BUKAN ANGKA, berarti ini milik V1. Tendang balik ke rute utama (Safelink)!
  if (!/^\d+$/.test(slug)) {
    return Response.redirect(new URL(`/${slug}`, request.url), 301);
  }

  // 1. Ambil data dari database
  const { data: urlData, error } = await supabase
    .from('urls')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (error || !urlData || !urlData.original_url) {
    return NextResponse.json({ error: 'Link Not Found' }, { status: 404 });
  }

  // 2. Baca Identitas Pengunjung (User-Agent)
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';

  // 3. DETEKSI BOT PREVIEW SOSMED
  // Daftar lengkap bot yang cuma bertugas narik gambar/judul
  const isBotScraper = /facebookexternalhit|whatsapp|telegrambot|twitterbot|linkedinbot|discordbot|slackbot|skypeuripreview|googlebot|bingbot/i.test(userAgent);

  // --- LOGIKA REDIRECT V2 (CLOAKING MURNI) ---

  // KONDISI 1: BOT SOSMED DATANG (Preview) -> KASIH FAKE LINK
  if (isBotScraper && urlData.fake_url) {
    return Response.redirect(urlData.fake_url, 302);
  }

  // KONDISI 2: MANUSIA DATANG (Klik dari Sosmed, Tele, WA, atau Browser) -> KASIH LINK TUJUAN ASLI
  // Update hitcount di background (jangan ditungguin biar load-nya instan)
  supabase.from('urls').update({ hitcount: (urlData.hitcount || 0) + 1 }).eq('id', urlData.id).then();
  
  return Response.redirect(urlData.original_url, 302);
}
