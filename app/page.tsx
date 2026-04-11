import { siteConfig } from '@/config/site';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  let settings = null;
  try {
    const { data } = await supabase.from('settings').select('*').eq('id', 1).maybeSingle();
    settings = data;
  } catch (e) {}

  // Ganti link ini sama username bot Telegram lu
  const telegramBotLink = "https://t.me/Linkv1_bot";

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center font-sans text-white relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      {settings?.ads_head && <div className="hidden" dangerouslySetInnerHTML={{ __html: settings.ads_head || "" }} />}

      {/* NAVBAR */}
      <nav className="w-full max-w-5xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-indigo-500 drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
          <span className="text-xl font-black tracking-tight">{siteConfig.name}</span>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center justify-center text-center mt-12 md:mt-24 relative z-20">
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Enterprise-Grade Link Management
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 tracking-tighter leading-[1.1] drop-shadow-lg">
          Streamline & Secure <br className="hidden md:block" />
          Your Links <span className="bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Instantly.</span>
        </h1>
        
        <p className="text-base sm:text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl font-medium leading-relaxed">
          Empower your workflow with instant URL shortening, robust bot protection, and seamless monetization—all executed directly from your Telegram interface.
        </p>

        {/* TOMBOL LAUNCH TELEGRAM (Box 3D) */}
        <a 
          href={telegramBotLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 bg-indigo-600 border-2 border-indigo-800 text-white font-black text-base sm:text-lg md:text-xl py-4 sm:py-5 px-8 sm:px-12 rounded-2xl uppercase tracking-widest transition-all shadow-[0px_6px_0px_0px_#3730a3] sm:shadow-[0px_8px_0px_0px_#3730a3] active:shadow-[0px_0px_0px_0px_#3730a3] active:translate-y-[8px] hover:bg-indigo-500"
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M11.944 0A12 12 0 000 12a12 12 0 0012 12 12 12 0 0012-12A12 12 0 0012 0a12 12 0 00-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 01.171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.888-.667 3.473-1.512 5.788-2.511 6.945-2.997 3.305-1.391 3.993-1.63 4.435-1.638z" /></svg>
          Open Telegram Bot
        </a>

      </main>

      {/* SILENT ADS INJECTION (Ads bakal nyelip di sini tanpa box norak) */}
      {(settings?.ads_body || settings?.ads_native) && (
        <div className="w-full max-w-5xl mx-auto px-4 mt-16 flex justify-center z-20">
          <div dangerouslySetInnerHTML={{ __html: settings.ads_body || settings.ads_native || "" }} />
        </div>
      )}

      {/* FEATURES SECTION (3D Cards) */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 mt-20 md:mt-24 mb-24 z-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
        
        <div className="bg-[#1e1e20] border-2 border-[#3f3f46] rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#3f3f46] hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_#3f3f46] transition-all">
          <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 shadow-inner">
            <svg className="w-7 h-7 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <h3 className="text-xl font-black text-white mb-3">Blazing Fast Execution</h3>
          <p className="text-sm text-zinc-400 font-medium leading-relaxed">Generate secure, shortened URLs in milliseconds without ever leaving your Telegram interface. Built for maximum efficiency.</p>
        </div>

        <div className="bg-[#1e1e20] border-2 border-[#3f3f46] rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#3f3f46] hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_#3f3f46] transition-all">
          <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 shadow-inner">
            <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h3 className="text-xl font-black text-white mb-3">Advanced Protection</h3>
          <p className="text-sm text-zinc-400 font-medium leading-relaxed">Our robust Safelink technology filters out malicious bots and spam traffic, ensuring your final destination remains completely secure.</p>
        </div>

        <div className="bg-[#1e1e20] border-2 border-[#3f3f46] rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#3f3f46] hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_#3f3f46] transition-all sm:col-span-2 md:col-span-1">
          <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 border border-rose-500/20 shadow-inner">
            <svg className="w-7 h-7 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-xl font-black text-white mb-3">Effortless Monetization</h3>
          <p className="text-sm text-zinc-400 font-medium leading-relaxed">Easily integrate your preferred ad networks and start generating revenue from your organic link traffic instantly.</p>
        </div>

      </div>

      {settings?.ads_footer && (
        <div className="w-full flex justify-center items-center pb-10 z-20" dangerouslySetInnerHTML={{ __html: settings.ads_footer || "" }} />
      )}

      {/* REAL PROFESSIONAL FOOTER */}
      <footer className="w-full bg-[#0a0a0a] border-t border-zinc-800/80 pt-12 pb-8 px-6 mt-auto z-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          
          <div className="flex items-center gap-2 opacity-80">
            <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <span className="font-bold text-white text-lg tracking-tight">{siteConfig.name}</span>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm font-medium text-zinc-500">
            
          </div>

        </div>
        <div className="max-w-5xl mx-auto mt-8 text-center md:text-left text-xs text-zinc-600 font-medium">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved. Built for creators.
        </div>
      </footer>

    </div>
  );
}
