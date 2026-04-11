"use client";

import { useState, useEffect } from "react";

declare global {
  interface Window {
    show_10862751?: () => Promise<void>;
  }
}

export default function SafelinkClient({ 
  originalUrl, 
  settings,
  title
}: { 
  originalUrl: string, 
  settings: any,
  title: string
}) {
  const [phase, setPhase] = useState(1);
  const [timeLeft, setTimeLeft] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 2 && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (phase === 2 && timeLeft === 0) {
      setPhase(3);
    }
    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  const handleGetLink = () => {
    setIsGenerating(true);
    if (typeof window !== 'undefined' && typeof window.show_10862751 === 'function') {
      window.show_10862751()
        .then(() => { window.location.href = originalUrl; })
        .catch((e) => { window.location.href = originalUrl; });
    } else {
      window.location.href = originalUrl;
    }
  };

  // Nangkep link offer dari database, kalau kosong dilempar ke '#'
  const offerLink = settings?.offer_url || settings?.offer_link || "#";

  return (
    <div className="w-full max-w-xl mx-auto z-20 px-4 flex flex-col items-center text-center mt-4 mb-8">

      {/* TITLE DARI LINK TUJUAN */}
      <div className="mb-8 w-full bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-5 flex items-center justify-center min-h-[80px] backdrop-blur-sm">
        <h2 className="text-lg md:text-xl font-bold text-zinc-100 line-clamp-2">
          {title}
        </h2>
      </div>

      {/* NATIVE ADS */}
      {settings?.ads_native && (
        <div className="w-full mb-8 flex justify-center items-center rounded-xl overflow-hidden shadow-lg" dangerouslySetInnerHTML={{ __html: settings.ads_native || "" }} />
      )}

      {/* PHASE 1: CONTINUE BUTTON */}
      {phase === 1 && (
        <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
          <p className="text-sm md:text-base text-zinc-400 mb-8 font-medium max-w-sm">
            Please click the button below to securely proceed to the destination page.
          </p>

          <button 
            onClick={() => setPhase(2)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg py-4 px-8 rounded-xl uppercase tracking-wider transition-colors shadow-lg shadow-indigo-500/20"
          >
            Continue
          </button>
        </div>
      )}

      {/* PHASE 2: TIMER */}
      {phase === 2 && (
        <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
          <p className="text-sm md:text-base text-zinc-400 mb-8 font-medium">
            Please wait while your link is being generated...
          </p>

          <div className="relative flex items-center justify-center w-28 h-28 mb-4">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" className="stroke-zinc-800" strokeWidth="8" />
              <circle 
                cx="50" cy="50" r="45" fill="none" className="stroke-indigo-500" strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * timeLeft) / 5}
                style={{ transition: "stroke-dashoffset 1s linear" }}
              />
            </svg>
            <span className="text-5xl font-black text-white">
              {timeLeft}
            </span>
          </div>
        </div>
      )}

      {/* PHASE 3: GET LINK */}
      {phase === 3 && (
        <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
          <p className="text-sm md:text-base text-emerald-400 mb-8 font-bold">
            Your link is ready!
          </p>

          <button 
            onClick={handleGetLink}
            disabled={isGenerating}
            className={`w-full font-bold text-lg py-4 px-8 rounded-xl uppercase tracking-wider transition-colors text-center flex justify-center items-center gap-2 shadow-lg ${
              isGenerating 
                ? 'bg-emerald-600/50 text-white/70 cursor-wait shadow-none' 
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
            }`}
          >
            {isGenerating ? 'Processing...' : 'Get Link'}
            {!isGenerating && (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* --- ADS LOKAL (ads.png + OFFER URL) --- */}
      <div className="w-full mt-10 sm:mt-12 animate-in fade-in duration-500">
        <a 
          href={offerLink} 
          target="_blank" 
          rel="noreferrer" 
          className="block w-full rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.4)] hover:opacity-90 hover:scale-[1.02] transition-all duration-300"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ads.png" alt="Special Offer" className="w-full h-auto object-cover" />
        </a>
        <p className="text-[10px] sm:text-xs text-zinc-600 mt-3 font-bold uppercase tracking-widest">Sponsored</p>
      </div>

    </div>
  );
}
