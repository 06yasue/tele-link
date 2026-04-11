import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site';
import SafelinkClient from './SafelinkClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Fungsi cuma ngambil TITLE dari web tujuan, TANPA GAMBAR
async function fetchTitleOnly(url: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // Max 3 detik biar gak lemot
    const res = await fetch(url, { 
      signal: controller.signal,
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)' } 
    });
    clearTimeout(timeoutId);
    
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) return titleMatch[1];
  } catch (e) {
    // Abaikan kalau gagal ditarik
  }
  return `Menuju ke ${new URL(url).hostname}`;
}

export default async function SafelinkPage({ params }: { params: { slug: string } }) {
  // 1. Ambil data URL
  const { data: urlData, error } = await supabase
    .from('urls')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();

  if (error || !urlData || !urlData.original_url) {
    notFound(); 
  }

  // 2. CLOAKING: Lempar Bot Sosmed Langsung ke Link Asli!
  const headersList = headers();
  const userAgent = headersList.get('user-agent')?.toLowerCase() || '';
  const isBot = /bot|facebookexternalhit|whatsapp|telegram|twitter|linkedin|skype|discord|slack|google|bing|vercel/i.test(userAgent);

  if (isBot) {
    redirect(urlData.original_url);
  }

  // 3. Update Hitcount (Hanya untuk manusia)
  try {
    await supabase.from('urls').update({ hitcount: (urlData.hitcount || 0) + 1 }).eq('id', urlData.id);
  } catch (e) {}

  // 4. Ambil Setting Iklan
  let settings = null;
  try {
    const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    settings = data;
  } catch (e) {}

  // 5. Ambil Title untuk ditampilin di UI
  const pageTitle = await fetchTitleOnly(urlData.original_url);

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center py-8 px-4 font-sans text-white">
      
      {settings?.ads_head && <div className="hidden" dangerouslySetInnerHTML={{ __html: settings.ads_head || "" }} />}

      <h1 className="text-3xl md:text-5xl font-black mb-8 tracking-tight drop-shadow-xl text-center">
        {siteConfig.name}
      </h1>

      {settings?.ads_body && (
        <div className="w-full max-w-4xl mb-8 flex justify-center items-center" dangerouslySetInnerHTML={{ __html: settings.ads_body || "" }} />
      )}

      {/* PANGGIL UI SAFELINK BOX 3D */}
      <SafelinkClient 
        originalUrl={urlData.original_url} 
        settings={settings} 
        title={pageTitle}
      />

      <div className="w-full max-w-4xl mt-12 flex flex-col items-center">
        {settings?.ads_mobile && (
          <div className="block md:hidden w-full flex justify-center items-center" dangerouslySetInnerHTML={{ __html: settings.ads_mobile || "" }} />
        )}
        {settings?.ads_desktop && (
          <div className="hidden md:flex w-full justify-center items-center" dangerouslySetInnerHTML={{ __html: settings.ads_desktop || "" }} />
        )}
      </div>

      {settings?.ads_footer && (
        <div className="w-full max-w-4xl mt-auto pt-12 flex justify-center items-center" dangerouslySetInnerHTML={{ __html: settings.ads_footer || "" }} />
      )}
    </div>
  );
}

