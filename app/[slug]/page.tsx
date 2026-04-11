import { notFound, redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site';
import SafelinkClient from './SafelinkClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

  // 2. CLOAKING: Deteksi Bot Sosmed
  const headersList = headers();
  const userAgent = headersList.get('user-agent')?.toLowerCase() || '';
  
  // Daftar bot dari sosmed besar
  const isBot = /bot|facebookexternalhit|whatsapp|telegram|twitter|linkedin|skype|discord|slack|google|bing/i.test(userAgent);

  if (isBot) {
    // Jika yang akses adalah bot, LANGSUNG lempar ke URL asli. 
    // Ini bikin preview di FB/WA otomatis ngambil domain dan meta target asli.
    redirect(urlData.original_url);
  }

  // 3. Update Hitcount (Cuma jalan kalau yang akses manusia)
  try {
    await supabase.from('urls').update({ hitcount: (urlData.hitcount || 0) + 1 }).eq('id', urlData.id);
  } catch (e) {}

  // 4. Ambil Setting Iklan
  let settings = null;
  try {
    const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    settings = data;
  } catch (e) {}

  return (
    <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center py-8 px-4 font-sans selection:bg-indigo-500/30">
      
      {/* ADS HEAD */}
      {settings?.ads_head && <div className="hidden" dangerouslySetInnerHTML={{ __html: settings.ads_head }} />}

      {/* HEADER */}
      <h1 className="text-3xl md:text-5xl font-black text-white mb-8 tracking-tight drop-shadow-xl z-10 relative">
        {siteConfig.name}
      </h1>

      {/* ADS BODY (Tengah/Rapih) */}
      {settings?.ads_body && (
        <div className="w-full max-w-4xl mb-8 flex justify-center items-center overflow-hidden z-10" dangerouslySetInnerHTML={{ __html: settings.ads_body }} />
      )}

      {/* TAMPILAN CLIENT (Safelink UI) */}
      <SafelinkClient 
        originalUrl={urlData.original_url} 
        settings={settings} 
      />

      {/* ADS KHUSUS DEVICE (Rapih Tengah) */}
      <div className="w-full max-w-4xl mt-12 flex flex-col items-center z-10">
        {settings?.ads_mobile && (
          <div className="block md:hidden w-full flex justify-center items-center overflow-hidden" dangerouslySetInnerHTML={{ __html: settings.ads_mobile }} />
        )}
        {settings?.ads_desktop && (
          <div className="hidden md:flex w-full justify-center items-center overflow-hidden" dangerouslySetInnerHTML={{ __html: settings.ads_desktop }} />
        )}
      </div>

      {/* ADS FOOTER */}
      {settings?.ads_footer && (
        <div className="w-full max-w-4xl mt-auto pt-12 flex justify-center items-center overflow-hidden z-10" dangerouslySetInnerHTML={{ __html: settings.ads_footer }} />
      )}

    </div>
  );
}
