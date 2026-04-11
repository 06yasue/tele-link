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
    const imageUrl = `https://image.thum.io/get/width/1200/crop/630/${data.original_url}`; 

    return {
      title: `Redirecting to ${domain}`,
      description: `Please wait while we securely redirect you to your destination.`,
      openGraph: {
        title: `Redirecting to ${domain} | ${siteConfig.name}`,
        description: `Secure link processing by ${siteConfig.name}.`,
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

  // Auto increment hitcount
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

  return (
    <div className="min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen xl:min-h-screen bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center py-10 sm:py-10 md:py-16 lg:py-20 xl:py-24 relative sm:relative md:relative lg:relative xl:relative overflow-hidden sm:overflow-hidden md:overflow-hidden lg:overflow-hidden xl:overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute sm:absolute md:absolute lg:absolute xl:absolute top-0 sm:top-0 md:top-0 lg:top-0 xl:top-0 inset-x-0 sm:inset-x-0 md:inset-x-0 lg:inset-x-0 xl:inset-x-0 h-px sm:h-px md:h-px lg:h-px xl:h-px bg-gradient-to-r sm:bg-gradient-to-r md:bg-gradient-to-r lg:bg-gradient-to-r xl:bg-gradient-to-r from-transparent sm:from-transparent md:from-transparent lg:from-transparent xl:from-transparent via-zinc-700 sm:via-zinc-700 md:via-zinc-700 lg:via-zinc-700 xl:via-zinc-700 to-transparent sm:to-transparent md:to-transparent lg:to-transparent xl:to-transparent"></div>

      {settings?.ads_head && <div className="hidden" dangerouslySetInnerHTML={{ __html: settings.ads_head }} />}

      <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black sm:font-black md:font-black lg:font-black xl:font-black bg-gradient-to-r sm:bg-gradient-to-r md:bg-gradient-to-r lg:bg-gradient-to-r xl:bg-gradient-to-r from-blue-400 sm:from-blue-400 md:from-blue-400 lg:from-blue-400 xl:from-blue-400 to-indigo-500 sm:to-indigo-500 md:to-indigo-500 lg:to-indigo-500 xl:to-indigo-500 bg-clip-text sm:bg-clip-text md:bg-clip-text lg:bg-clip-text xl:bg-clip-text text-transparent sm:text-transparent md:text-transparent lg:text-transparent xl:text-transparent mb-10 sm:mb-10 md:mb-14 lg:mb-16 xl:mb-16 relative sm:relative md:relative lg:relative xl:relative z-10 sm:z-10 md:z-10 lg:z-10 xl:z-10 tracking-tight sm:tracking-tight md:tracking-tight lg:tracking-tight xl:tracking-tight">
        {siteConfig.name}
      </h1>

      {settings?.ads_body && (
        <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-3xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-5xl mb-8 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-12 flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center px-4 sm:px-4 md:px-6 lg:px-8 xl:px-8 relative sm:relative md:relative lg:relative xl:relative z-10 sm:z-10 md:z-10 lg:z-10 xl:z-10" dangerouslySetInnerHTML={{ __html: settings.ads_body }} />
      )}

      {/* PANGGIL KOMPONEN CLIENT (TANPA RECAPTCHA) */}
      <SafelinkClient originalUrl={urlData.original_url} settings={settings} />

      <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-3xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-5xl mt-12 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-20 flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center px-4 sm:px-4 md:px-6 lg:px-8 xl:px-8 relative sm:relative md:relative lg:relative xl:relative z-10 sm:z-10 md:z-10 lg:z-10 xl:z-10">
        {settings?.ads_mobile && <div className="block sm:block md:hidden lg:hidden xl:hidden w-full sm:w-full md:w-full lg:w-full xl:w-full text-center sm:text-center md:text-center lg:text-center xl:text-center" dangerouslySetInnerHTML={{ __html: settings.ads_mobile }} />}
        {settings?.ads_desktop && <div className="hidden sm:hidden md:block lg:block xl:block w-full sm:w-full md:w-full lg:w-full xl:w-full text-center sm:text-center md:text-center lg:text-center xl:text-center" dangerouslySetInnerHTML={{ __html: settings.ads_desktop }} />}
      </div>

      {settings?.ads_footer && (
        <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-3xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-5xl mt-auto sm:mt-auto md:mt-auto lg:mt-auto xl:mt-auto pt-16 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-24 flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center px-4 sm:px-4 md:px-6 lg:px-8 xl:px-8 relative sm:relative md:relative lg:relative xl:relative z-10 sm:z-10 md:z-10 lg:z-10 xl:z-10" dangerouslySetInnerHTML={{ __html: settings.ads_footer }} />
      )}
    </div>
  );
}
