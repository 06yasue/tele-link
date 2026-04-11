import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site';
import SafelinkClient from './SafelinkClient';
import Histats from '@/components/Histats';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function fetchTitleOnly(url: string) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); 
    const res = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'Mozilla/5.0' } });
    clearTimeout(timeoutId);
    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) return titleMatch[1];
  } catch (e) {}
  return `Menuju ke ${new URL(url).hostname}`;
}

export default async function SafelinkPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  if (/^\d+$/.test(slug)) return redirect(`/go/${slug}`);

  const { data: urlData, error } = await supabase.from('urls').select('*').eq('slug', slug).maybeSingle();
  if (error || !urlData || !urlData.original_url) notFound(); 

  const headersList = headers();
  const userAgent = headersList.get('user-agent')?.toLowerCase() || '';
  const isBot = /bot|facebookexternalhit|whatsapp|telegram|twitter|linkedin|skype|discord|slack|google|bing|vercel/i.test(userAgent);
  if (isBot) redirect(urlData.original_url);

  try { await supabase.from('urls').update({ hitcount: (urlData.hitcount || 0) + 1 }).eq('id', urlData.id); } catch (e) {}

  let settings = null;
  try {
    const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    settings = data;
  } catch (e) {}

  const pageTitle = await fetchTitleOnly(urlData.original_url);

  return (
    // Tambahin pb-32 (padding-bottom) biar konten gak ketutup iklan floating di bawah
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center py-8 px-4 pb-32 font-sans text-white relative">
      
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-zinc-800 to-transparent"></div>
      {settings?.ads_head && <div className="hidden" dangerouslySetInnerHTML={{ __html: settings.ads_head || "" }} />}

      {/* --- HEADER TITLE (UKURAN LEBIH TEBAL & BESAR) --- */}
      <div className="flex items-center justify-center gap-3 sm:gap-5 mb-10 sm:mb-12 mt-4 sm:mt-6 w-full max-w-4xl">
        <svg className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500 drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-lg">
          {siteConfig.name}
        </h1>
      </div>

      {settings?.ads_body && (
        <div className="w-full max-w-4xl mb-8 flex justify-center items-center overflow-hidden" dangerouslySetInnerHTML={{ __html: settings.ads_body || "" }} />
      )}

      {/* PANGGIL UI SAFELINK CLIENT */}
      <SafelinkClient originalUrl={urlData.original_url} settings={settings} title={pageTitle} />

      {/* --- ADS AREA PONSEL & DESKTOP (FLOATING DI BAWAH) --- */}
      {(settings?.ads_mobile || settings?.ads_desktop) && (
        <div className="fixed bottom-0 inset-x-0 z-50 w-full bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800/80 p-2 sm:p-3 flex justify-center items-center shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
          <div className="w-full flex items-center justify-center">
            {settings?.ads_mobile && (
              <div className="block sm:block md:hidden lg:hidden xl:hidden w-full text-center flex justify-center items-center" dangerouslySetInnerHTML={{ __html: settings.ads_mobile || "" }} />
            )}
            {settings?.ads_desktop && (
              <div className="hidden sm:hidden md:flex lg:flex xl:flex w-full justify-center text-center items-center" dangerouslySetInnerHTML={{ __html: settings.ads_desktop || "" }} />
            )}
          </div>
        </div>
      )}

      <Histats />
    </div>
  );
}
