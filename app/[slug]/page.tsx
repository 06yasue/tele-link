import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { siteConfig } from '@/config/site';

// Paksa Next.js buat gak nge-cache biar gak error 500
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const { data } = await supabase.from('urls').select('original_url').eq('slug', params.slug).maybeSingle();
    
    if (!data || !data.original_url) return { title: 'Not Found' };

    const domain = new URL(data.original_url).hostname;
    const imageUrl = `https://logo.clearbit.com/${domain}`; 

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
  // 1. AMBIL DATA URL DENGAN SUPER AMAN
  const { data: urlData, error } = await supabase
    .from('urls')
    .select('*')
    .eq('slug', params.slug)
    .maybeSingle();

  // Kalau link gak ada di database, langsung lempar ke 404 tanpa crash
  if (error || !urlData || !urlData.original_url) {
    notFound(); 
  }

  // 2. UPDATE HITCOUNT DIBUNGKUS TRY-CATCH BUKAN SEBAGAI RENDER BLOCKER
  try {
    await supabase
      .from('urls')
      .update({ hitcount: (urlData.hitcount || 0) + 1 })
      .eq('id', urlData.id);
  } catch (e) {
    // Biarin aja kalau hitcount gagal, yang penting halaman tetap kebuka
    console.error("Gagal update hitcount");
  }

  // 3. AMBIL DATA SETTING IKLAN (Kebal walau kosong)
  let settings = null;
  try {
    const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    settings = data;
  } catch (e) {}

  // 4. EKSTRAK DOMAIN
  let domainName = urlData.original_url;
  try {
    domainName = new URL(urlData.original_url).hostname;
  } catch (e) {
    // Kalau URL-nya cacat tanpa http, potong aja teksnya biar gak crash
    domainName = urlData.original_url.substring(0, 20);
  }

  return (
    <div className="min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen xl:min-h-screen bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 text-white sm:text-white md:text-white lg:text-white xl:text-white flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center py-10 sm:py-10 md:py-12 lg:py-16 xl:py-20 px-4 sm:px-4 md:px-6 lg:px-8 xl:px-10">
      
      {/* 🟢 INJEKSI ADS HEAD */}
      {settings?.ads_head && (
        <div className="hidden" dangerouslySetInnerHTML={{ __html: settings.ads_head || "" }} />
      )}

      {/* HEADER LOGO WEB */}
      <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-black sm:font-black md:font-black lg:font-black xl:font-black bg-gradient-to-r sm:bg-gradient-to-r md:bg-gradient-to-r lg:bg-gradient-to-r xl:bg-gradient-to-r from-blue-500 sm:from-blue-500 md:from-blue-500 lg:from-blue-500 xl:from-blue-500 to-indigo-500 sm:to-indigo-500 md:to-indigo-500 lg:to-indigo-500 xl:to-indigo-500 bg-clip-text sm:bg-clip-text md:bg-clip-text lg:bg-clip-text xl:bg-clip-text text-transparent sm:text-transparent md:text-transparent lg:text-transparent xl:text-transparent mb-6 sm:mb-6 md:mb-8 lg:mb-10 xl:mb-12">
        {siteConfig.name}
      </h1>

      {/* 🟢 INJEKSI ADS BODY (Atas) */}
      {settings?.ads_body && (
        <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-2xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-4xl mb-6 sm:mb-6 md:mb-8 lg:mb-8 xl:mb-10 flex justify-center" dangerouslySetInnerHTML={{ __html: settings.ads_body || "" }} />
      )}

      {/* MAIN SAFELINK CARD */}
      <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-xl bg-zinc-900 sm:bg-zinc-900 md:bg-zinc-900 lg:bg-zinc-900 xl:bg-zinc-900 border sm:border md:border lg:border xl:border border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 rounded-2xl sm:rounded-2xl md:rounded-3xl lg:rounded-3xl xl:rounded-3xl p-6 sm:p-6 md:p-8 lg:p-10 xl:p-10 flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center text-center sm:text-center md:text-center lg:text-center xl:text-center shadow-2xl sm:shadow-2xl md:shadow-2xl lg:shadow-2xl xl:shadow-2xl">
        
        {/* Info Domain Tujuan */}
        <div className="mb-6 sm:mb-6 md:mb-8 lg:mb-8 xl:mb-8 flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center gap-4 sm:gap-4 md:gap-5 lg:gap-5 xl:gap-5">
          <img 
            src={`https://logo.clearbit.com/${domainName}`} 
            alt="Logo" 
            className="w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-24 xl:h-24 rounded-2xl sm:rounded-2xl md:rounded-3xl lg:rounded-3xl xl:rounded-3xl shadow-lg sm:shadow-lg md:shadow-lg lg:shadow-lg xl:shadow-lg bg-white sm:bg-white md:bg-white lg:bg-white xl:bg-white p-1 sm:p-1 md:p-1.5 lg:p-1.5 xl:p-1.5"
            onError={(e) => { e.currentTarget.src = "https://www.google.com/s2/favicons?domain=google.com&sz=128" }}
          />
          <div>
            <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold text-zinc-100 sm:text-zinc-100 md:text-zinc-100 lg:text-zinc-100 xl:text-zinc-100">
              {domainName}
            </h2>
            <p className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base text-zinc-500 sm:text-zinc-500 md:text-zinc-500 lg:text-zinc-500 xl:text-zinc-500 mt-1 sm:mt-1 md:mt-2 lg:mt-2 xl:mt-2">
              Anda akan diarahkan ke halaman ini.
            </p>
          </div>
        </div>

        {/* 🟢 INJEKSI ADS NATIVE (Tengah Kotak) */}
        {settings?.ads_native && (
          <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full my-4 sm:my-4 md:my-5 lg:my-6 xl:my-6 flex justify-center" dangerouslySetInnerHTML={{ __html: settings.ads_native || "" }} />
        )}

        {/* MOCKUP RECAPTCHA */}
        <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 border-2 sm:border-2 md:border-2 lg:border-2 xl:border-2 border-dashed sm:border-dashed md:border-dashed lg:border-dashed xl:border-dashed border-zinc-700 sm:border-zinc-700 md:border-zinc-700 lg:border-zinc-700 xl:border-zinc-700 rounded-xl sm:rounded-xl md:rounded-xl lg:rounded-xl xl:rounded-xl p-6 sm:p-6 md:p-8 lg:p-8 xl:p-8 mb-6 sm:mb-6 md:mb-8 lg:mb-8 xl:mb-8 flex sm:flex md:flex lg:flex xl:flex items-center sm:items-center md:items-center lg:items-center xl:items-center justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col gap-2 sm:gap-2 md:gap-3 lg:gap-3 xl:gap-3">
          <svg className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-12 xl:h-12 text-zinc-600 sm:text-zinc-600 md:text-zinc-600 lg:text-zinc-600 xl:text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          <span className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base text-zinc-500 sm:text-zinc-500 md:text-zinc-500 lg:text-zinc-500 xl:text-zinc-500 font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium">Tempat Google reCAPTCHA</span>
        </div>

        {/* TOMBOL LANJUTKAN */}
        <a 
          href={urlData.original_url}
          className="w-full sm:w-full md:w-full lg:w-full xl:w-full inline-block sm:inline-block md:inline-block lg:inline-block xl:inline-block bg-indigo-600 sm:bg-indigo-600 md:bg-indigo-600 lg:bg-indigo-600 xl:bg-indigo-600 hover:bg-indigo-500 sm:hover:bg-indigo-500 md:hover:bg-indigo-500 lg:hover:bg-indigo-500 xl:hover:bg-indigo-500 text-white sm:text-white md:text-white lg:text-white xl:text-white font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold text-sm sm:text-sm md:text-base lg:text-lg xl:text-lg py-3 sm:py-3 md:py-4 lg:py-4 xl:py-4 rounded-xl sm:rounded-xl md:rounded-xl lg:rounded-xl xl:rounded-xl shadow-lg sm:shadow-lg md:shadow-lg lg:shadow-lg xl:shadow-lg transition-all sm:transition-all md:transition-all lg:transition-all xl:transition-all text-center sm:text-center md:text-center lg:text-center xl:text-center"
        >
          Lanjutkan ke Link
        </a>
      </div>

      {/* 🟢 INJEKSI ADS KHUSUS DEVICE */}
      <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-2xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-4xl mt-8 sm:mt-8 md:mt-10 lg:mt-10 xl:mt-12 flex justify-center">
        {settings?.ads_mobile && (
          <div className="block sm:block md:hidden lg:hidden xl:hidden w-full text-center" dangerouslySetInnerHTML={{ __html: settings.ads_mobile || "" }} />
        )}
        {settings?.ads_desktop && (
          <div className="hidden sm:hidden md:block lg:block xl:block w-full text-center" dangerouslySetInnerHTML={{ __html: settings.ads_desktop || "" }} />
        )}
      </div>

      {/* 🟢 INJEKSI ADS FOOTER (Bawah) */}
      {settings?.ads_footer && (
        <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-2xl sm:max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-4xl mt-auto sm:mt-auto md:mt-auto lg:mt-auto xl:mt-auto pt-10 sm:pt-10 md:pt-12 lg:pt-16 xl:pt-16 flex justify-center" dangerouslySetInnerHTML={{ __html: settings.ads_footer || "" }} />
      )}

    </div>
  );
}
