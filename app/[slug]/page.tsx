import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site';
import SafelinkClient from './SafelinkClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const { data } = await supabase.from('urls').select('original_url').eq('slug', params.slug).maybeSingle();
    
    if (!data || !data.original_url) return { title: 'Not Found' };

    const domain = new URL(data.original_url).hostname;
    // Pake Thum.io buat nampilin screenshot konten aslinya di sosmed
    const imageUrl = `https://image.thum.io/get/width/1200/crop/630/${data.original_url}`; 

    return {
      title: `Menuju ke ${domain}`,
      description: `Klik untuk melanjutkan ke halaman tujuan yang aman.`,
      openGraph: {
        title: `Menuju ke ${domain} | ${siteConfig.name}`,
        description: `Tautan ini diamankan oleh ${siteConfig.name}.`,
        images: [imageUrl],
      },
    };
  } catch (error) {
    return { title: siteConfig.name };
  }
}

export default async function SafelinkPage({ params }: { params: { slug: string } }) {
  const { data: urlData, error } = await supabase
    .from('urls')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();

  if (error || !urlData || !urlData.original_url) {
    notFound(); 
  }

  // Hitcount di background
  try {
    await supabase
      .from('urls')
      .update({ hitcount: (urlData.hitcount || 0) + 1 })
      .eq('id', urlData.id);
  } catch (e) {}

  let settings = null;
  try {
    const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    settings = data;
  } catch (e) {}

  let domainName = urlData.original_url;
  try {
    domainName = new URL(urlData.original_url).hostname;
  } catch (e) {
    domainName = urlData.original_url.substring(0, 20);
  }

  return (
    <div className="min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen xl:min-h-screen bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 px-4 sm:px-4 md:px-6 lg:px-8 xl:px-10">
      
      {/* HEADER LOGO */}
      <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black sm:font-black md:font-black lg:font-black xl:font-black bg-gradient-to-r sm:bg-gradient-to-r md:bg-gradient-to-r lg:bg-gradient-to-r xl:bg-gradient-to-r from-blue-500 sm:from-blue-500 md:from-blue-500 lg:from-blue-500 xl:from-blue-500 to-indigo-500 sm:to-indigo-500 md:to-indigo-500 lg:to-indigo-500 xl:to-indigo-500 bg-clip-text sm:bg-clip-text md:bg-clip-text lg:bg-clip-text xl:bg-clip-text text-transparent sm:text-transparent md:text-transparent lg:text-transparent xl:text-transparent mb-6 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12">
        {siteConfig.name}
      </h1>

      {/* ADS HEAD & BODY */}
      {settings?.ads_head && <div className="hidden" dangerouslySetInnerHTML={{ __html: settings.ads_head }} />}
      {settings?.ads_body && (
        <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-2xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-4xl mb-6 sm:mb-6 md:mb-8 lg:mb-8 xl:mb-10 flex justify-center" dangerouslySetInnerHTML={{ __html: settings.ads_body }} />
      )}

      {/* PANGGIL CLIENT COMPONENT (TAMPILAN SAFELINK) */}
      <SafelinkClient originalUrl={urlData.original_url} domainName={domainName} settings={settings} />

      {/* ADS DEVICE & FOOTER */}
      <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-2xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-4xl mt-8 sm:mt-8 md:mt-10 lg:mt-10 xl:mt-12 flex justify-center">
        {settings?.ads_mobile && <div className="block sm:block md:hidden lg:hidden xl:hidden w-full text-center" dangerouslySetInnerHTML={{ __html: settings.ads_mobile }} />}
        {settings?.ads_desktop && <div className="hidden sm:hidden md:block lg:block xl:block w-full text-center" dangerouslySetInnerHTML={{ __html: settings.ads_desktop }} />}
      </div>

      {settings?.ads_footer && (
        <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-2xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-4xl mt-auto sm:mt-auto md:mt-auto lg:mt-auto xl:mt-auto pt-10 sm:pt-10 md:pt-12 lg:pt-16 xl:pt-16 flex justify-center" dangerouslySetInnerHTML={{ __html: settings.ads_footer }} />
      )}
    </div>
  );
}
