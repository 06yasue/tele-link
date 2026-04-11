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

  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  
  // 2. DETEKSI BOT YANG BENERAN BOT (Cuma buat Scraping/Preview)
  // Kita pastiin dia beneran bot crawler, bukan in-app browser manusia
  const isBotScraper = /facebookexternalhit|whatsapp|telegrambot|twitterbot|slackbot|discordbot|bingbot|googlebot/i.test(userAgent);

  // 3. LOGIKA REDIRECT V2
  
  // A. Jika ini BOT SCRAPER: Kasih Fake Link (Biar preview domain asli muncul)
  if (isBotScraper && urlData.fake_url) {
    return Response.redirect(urlData.fake_url, 302);
  }

  // B. Jika ini MANUSIA (Klik dari Sosmed atau Browser Langsung): 
  // Kita lempar ke Link Tujuan (Original URL)
  // Tapi kalau lu tetep pengen kalau orang COPY-PASTE manual ke browser ke Fake Link,
  // maka biarkan logika ini. Tapi saran gw: Langsung ke tujuan aja biar user gak bingung.
  
  // Update hitcount di background
  supabase.from('urls').update({ hitcount: (urlData.hitcount || 0) + 1 }).eq('id', urlData.id).then();

  // LANGSUNG KE TUJUAN (Original URL)
  return Response.redirect(urlData.original_url, 302);
}
