import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site';
import SafelinkClient from './SafelinkClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Fungsi mata-mata (Scraper) buat ngambil Meta Tags web tujuan
async function fetchTargetMeta(url: string) {
  let title = `Menuju ke ${new URL(url).hostname}`;
  let image = `https://image.thum.io/get/width/1200/crop/630/${url}`; // Fallback pakai screenshot
  
  try {
    const res = await fetch(url, { 
      next: { revalidate: 3600 }, 
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' } 
    });
    const html = await res.text();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"[^>]*>/i) || html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:title"[^>]*>/i);
    const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"[^>]*>/i) || html.match(/<meta[^>]*content="([^"]+)"[^>]*property="og:image"[^>]*>/i);

    if (ogTitleMatch) title = ogTitleMatch[1];
    else if (titleMatch) title = titleMatch[1];

    if (ogImageMatch) image = ogImageMatch[1];
  } catch (e) {
    // Abaikan jika web tujuan memblokir bot, biarkan pakai fallback
  }
  return { title, image };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { data } = await supabase.from('urls').select('original_url').eq('slug', params.slug).maybeSingle();
  if (!data || !data.original_url) return { title: 'Not Found' };

  // Ambil meta tags dari web asli biar pas di-share ke FB/WA keliatan nyata
  const meta = await fetchTargetMeta(data.original_url);

  return {
    title: meta.title,
    description: `Aman diteruskan oleh ${siteConfig.name}`,
    openGraph: {
      title: meta.title,
      description: `Tautan ini diproses secara aman oleh ${siteConfig.name}.`,
      images: [meta.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      images: [meta.image],
    }
  };
}

export default async function SafelinkPage({ params }: { params: { slug: string } }) {
  const { data: urlData, error } = await supabase.from('urls').select('*').eq('slug', params.slug).maybeSingle();
  if (error || !urlData || !urlData.original_url) notFound();

  try {
    await supabase.from('urls').update({ hitcount: (urlData.hitcount || 0) + 1 }).eq('id', urlData.id);
  } catch (e) {}

  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
  
  // Ambil meta untuk ditampilkan di Client
  const meta = await fetchTargetMeta(urlData.original_url);

  return (
    <div className="min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen xl:min-h-screen bg-[#0a0a0a] sm:bg-[#0a0a0a] md:bg-[#0a0a0a] lg:bg-[#0a0a0a] xl:bg-[#0a0a0a] flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 px-4 sm:px-4 md:px-6 lg:px-8 xl:px-8 overflow-hidden sm:overflow-hidden md:overflow-hidden lg:overflow-hidden xl:overflow-hidden">
      
      {settings?.ads_head && <div className="hidden" dangerouslySetInnerHTML={{ __html: settings.ads_head }} />}

      {/* HEADER TITLE */}
      <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black sm:font-black md:font-black lg:font-black xl:font-black text-white sm:text-white md:text-white lg:text-white xl:text-white mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-12 tracking-tighter sm:tracking-tighter md:tracking-tighter lg:tracking-tighter xl:tracking-tighter drop-shadow-2xl sm:drop-shadow-2xl md:drop-shadow-2xl lg:drop-shadow-2xl xl:drop-shadow-2xl relative sm:relative md:relative lg:relative xl:relative z-20 sm:z-20 md:z-20 lg:z-20 xl:z-20">
        {siteConfig.name}
        <div className="absolute sm:absolute md:absolute lg:absolute xl:absolute -inset-2 sm:-inset-2 md:-inset-2 lg:-inset-2 xl:-inset-2 bg-indigo-500/20 sm:bg-indigo-500/20 md:bg-indigo-500/20 lg:bg-indigo-500/20 xl:bg-indigo-500/20 blur-xl sm:blur-xl md:blur-xl lg:blur-xl xl:blur-xl -z-10 sm:-z-10 md:-z-10 lg:-z-10 xl:-z-10"></div>
      </h1>

      {/* DIPAKSA KE TENGAH UNTUK SEMUA ADS */}
      {settings?.ads_body && (
        <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-4xl sm:max-w-4xl md:max-w-4xl lg:max-w-5xl xl:max-w-5xl mb-8 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-12 flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center items-center sm:items-center md:items-center lg:items-center xl:items-center overflow-hidden sm:overflow-hidden md:overflow-hidden lg:overflow-hidden xl:overflow-hidden relative sm:relative md:relative lg:relative xl:relative z-20 sm:z-20 md:z-20 lg:z-20 xl:z-20" dangerouslySetInnerHTML={{ __html: settings.ads_body }} />
      )}

      {/* COMPONENT 3D CLIENT */}
      <SafelinkClient 
        originalUrl={urlData.original_url} 
        settings={settings} 
        metaTitle={meta.title} 
        metaImage={meta.image} 
      />

      <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-4xl sm:max-w-4xl md:max-w-4xl lg:max-w-5xl xl:max-w-5xl mt-12 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-20 flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center relative sm:relative md:relative lg:relative xl:relative z-20 sm:z-20 md:z-20 lg:z-20 xl:z-20">
        {settings?.ads_mobile && (
          <div className="block sm:block md:hidden lg:hidden xl:hidden w-full sm:w-full md:w-full lg:w-full xl:w-full flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center items-center sm:items-center md:items-center lg:items-center xl:items-center overflow-hidden sm:overflow-hidden md:overflow-hidden lg:overflow-hidden xl:overflow-hidden" dangerouslySetInnerHTML={{ __html: settings.ads_mobile }} />
        )}
        {settings?.ads_desktop && (
          <div className="hidden sm:hidden md:block lg:block xl:block w-full sm:w-full md:w-full lg:w-full xl:w-full flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center items-center sm:items-center md:items-center lg:items-center xl:items-center overflow-hidden sm:overflow-hidden md:overflow-hidden lg:overflow-hidden xl:overflow-hidden" dangerouslySetInnerHTML={{ __html: settings.ads_desktop }} />
        )}
      </div>

      {settings?.ads_footer && (
        <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-4xl sm:max-w-4xl md:max-w-4xl lg:max-w-5xl xl:max-w-5xl mt-auto sm:mt-auto md:mt-auto lg:mt-auto xl:mt-auto pt-16 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-24 flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center items-center sm:items-center md:items-center lg:items-center xl:items-center overflow-hidden sm:overflow-hidden md:overflow-hidden lg:overflow-hidden xl:overflow-hidden relative sm:relative md:relative lg:relative xl:relative z-20 sm:z-20 md:z-20 lg:z-20 xl:z-20" dangerouslySetInnerHTML={{ __html: settings.ads_footer }} />
      )}
    </div>
  );
}
