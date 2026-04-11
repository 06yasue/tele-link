import { Metadata } from 'next';
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
    const timeoutId = setTimeout(() => controller.abort(), 3000); 
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

  // 2. CLOAKING: Lempar Bot Sosmed Langsung ke Link Asli
  const headersList = headers();
  const userAgent = headersList.get('user-agent')?.toLowerCase() || '';
  const isBot = /bot|facebookexternalhit|whatsapp|telegram|twitter|linkedin|skype|discord|slack|google|bing|vercel/i.test(userAgent);

  if (isBot) {
    redirect(urlData.original_url);
  }

  // 3. Update Hitcount
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
    <div className="min-h-screen bg-[#121212] flex flex-col items-center py-8 px-4 font-sans text-white relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent"></div>

      {settings?.ads_head && <div className="hidden" dangerouslySetInnerHTML={{ __html: settings.ads_head || "" }} />}

      {/* --- HEADER TITLE (TANPA BOX 3D, HANYA SVG + TEKS) --- */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 mb-10 sm:mb-12 mt-4 sm:mt-6 w-full max-w-4xl">
        <svg className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
          {siteConfig.name}
        </h1>
      </div>

      {settings?.ads_body && (
        <div className="w-full max-w-4xl mb-8 flex justify-center items-center overflow-hidden" dangerouslySetInnerHTML={{ __html: settings.ads_body || "" }} />
      )}

      {/* PANGGIL UI SAFELINK BOX 3D */}
      <SafelinkClient 
        originalUrl={urlData.original_url} 
        settings={settings} 
        title={pageTitle}
      />

      {/* --- ADS AREA PONSEL & DESKTOP --- */}
      {/* Box 3D ini cuma bakal muncul kalau minimal ada satu iklan (Mobile/Desktop) yang diisi */}
      {(settings?.ads_mobile || settings?.ads_desktop) && (
        <div className="w-full max-w-[90%] sm:max-w-[85%] md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto mt-12 sm:mt-16 md:mt-20 lg:mt-20 xl:mt-24 bg-[#1e1e20] border-2 border-[#3f3f46] rounded-2xl p-6 md:p-8 lg:p-10 shadow-[6px_6px_0px_0px_#3f3f46] sm:shadow-[8px_8px_0px_0px_#3f3f46] md:shadow-[10px_10px_0px_0px_#3f3f46] flex flex-col items-center justify-center text-center">
          <div className="w-full flex flex-col items-center justify-center">
            {settings?.ads_mobile && (
              <div className="block sm:block md:hidden lg:hidden xl:hidden w-full text-center flex justify-center items-center overflow-hidden" dangerouslySetInnerHTML={{ __html: settings.ads_mobile || "" }} />
            )}
            {settings?.ads_desktop && (
              <div className="hidden sm:hidden md:block lg:block xl:block w-full text-center flex justify-center items-center overflow-hidden" dangerouslySetInnerHTML={{ __html: settings.ads_desktop || "" }} />
            )}
          </div>
        </div>
      )}

      {settings?.ads_footer && (
        <div className="w-full max-w-4xl mt-auto pt-16 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-24 flex justify-center items-center overflow-hidden" dangerouslySetInnerHTML={{ __html: settings.ads_footer || "" }} />
      )}
    </div>
  );
}
