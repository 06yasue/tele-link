import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site';
import SafelinkClient from './SafelinkClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Icon Bot 3D
const IconBot = () => (
  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v4m-3-2h6" />
  </svg>
);

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
  const { data: urlData, error } = await supabase.from('urls').select('*').eq('slug', params.slug).maybeSingle();
  if (error || !urlData || !urlData.original_url) notFound();

  const headersList = headers();
  const userAgent = headersList.get('user-agent')?.toLowerCase() || '';
  const isBot = /bot|facebookexternalhit|whatsapp|telegram|twitter|linkedin|skype|discord|slack|google|bing|vercel/i.test(userAgent);

  if (isBot) redirect(urlData.original_url);

  try {
    await supabase.from('urls').update({ hitcount: (urlData.hitcount || 0) + 1 }).eq('id', urlData.id);
  } catch (e) {}

  let settings = null;
  try {
    const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    settings = data;
  } catch (e) {}

  const pageTitle = await fetchTitleOnly(urlData.original_url);

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center py-8 px-4 font-sans text-white">
      
      {settings?.ads_head && <div className="hidden" dangerouslySetInnerHTML={{ __html: settings.ads_head || "" }} />}

      {/* --- HEADER TITLE 3D BOX (BARU) --- */}
      <div className="flex items-center gap-4 mb-10 w-full max-w-4xl justify-center">
        <div className="p-3 bg-indigo-600 text-white rounded-xl shadow-[4px_4px_0_0_#3730a3] border-2 border-[#3730a3]">
          <IconBot />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
          Short URL Bot
        </h1>
      </div>

      {settings?.ads_body && (
        <div className="w-full max-w-4xl mb-8 flex justify-center items-center overflow-hidden" dangerouslySetInnerHTML={{ __html: settings.ads_body || "" }} />
      )}

      <SafelinkClient originalUrl={urlData.original_url} settings={settings} title={pageTitle} />

      <div className="w-full max-w-4xl mt-12 flex flex-col items-center">
        {settings?.ads_mobile && <div className="block md:hidden w-full text-center" dangerouslySetInnerHTML={{ __html: settings.ads_mobile || "" }} />}
        {settings?.ads_desktop && <div className="hidden md:block w-full text-center" dangerouslySetInnerHTML={{ __html: settings.ads_desktop || "" }} />}
      </div>

      {settings?.ads_footer && (
        <div className="w-full max-w-4xl mt-auto pt-16 flex justify-center items-center" dangerouslySetInnerHTML={{ __html: settings.ads_footer || "" }} />
      )}
    </div>
  );
}
