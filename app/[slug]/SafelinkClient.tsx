"use client";

import { useState, useEffect } from "react";

export default function SafelinkClient({ 
  originalUrl, 
  settings,
  metaTitle,
  metaImage
}: { 
  originalUrl: string, 
  settings: any,
  metaTitle: string,
  metaImage: string
}) {
  const [phase, setPhase] = useState(1);
  const [timeLeft, setTimeLeft] = useState(5);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 2) {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      } else {
        setPhase(3);
      }
    }
    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  return (
    // CONTAINER EFEK 3D PERSPECTIVE
    <div 
      className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-[90%] sm:max-w-[85%] md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto relative sm:relative md:relative lg:relative xl:relative z-30 sm:z-30 md:z-30 lg:z-30 xl:z-30"
      style={{ perspective: '1200px' }}
    >
      
      {/* 3D BOX UTAMA (Miring dari Samping) */}
      <div 
        className="bg-zinc-900 sm:bg-zinc-900 md:bg-zinc-900 lg:bg-zinc-900 xl:bg-zinc-900 border-l-4 sm:border-l-4 md:border-l-[6px] lg:border-l-[8px] xl:border-l-[8px] border-b-4 sm:border-b-4 md:border-b-[6px] lg:border-b-[8px] xl:border-b-[8px] border-indigo-600 sm:border-indigo-600 md:border-indigo-600 lg:border-indigo-600 xl:border-indigo-600 rounded-2xl sm:rounded-2xl md:rounded-3xl lg:rounded-3xl xl:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-12 shadow-[15px_15px_30px_rgba(0,0,0,0.8)] sm:shadow-[20px_20px_40px_rgba(0,0,0,0.8)] md:shadow-[25px_25px_50px_rgba(0,0,0,0.8)] lg:shadow-[30px_30px_60px_rgba(0,0,0,0.8)] xl:shadow-[30px_30px_60px_rgba(0,0,0,0.8)] transition-transform sm:transition-transform md:transition-transform lg:transition-transform xl:transition-transform duration-700 sm:duration-700 md:duration-700 lg:duration-700 xl:duration-700 hover:rotate-0 sm:hover:rotate-0 md:hover:rotate-0 lg:hover:rotate-0 xl:hover:rotate-0"
        style={{ transform: 'rotateY(-12deg) rotateX(4deg)' }}
      >

        {/* IMAGE & TITLE DARI LINK TUJUAN */}
        {!imageFailed && (
          <div className="mb-6 sm:mb-8 md:mb-10 lg:mb-10 xl:mb-12 flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center gap-4 sm:gap-4 md:gap-6 lg:gap-6 xl:gap-6 animate-in sm:animate-in md:animate-in lg:animate-in xl:animate-in fade-in sm:fade-in md:fade-in lg:fade-in xl:fade-in duration-500 sm:duration-500 md:duration-500 lg:duration-500 xl:duration-500">
            <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl overflow-hidden sm:overflow-hidden md:overflow-hidden lg:overflow-hidden xl:overflow-hidden border sm:border md:border lg:border xl:border border-zinc-700 sm:border-zinc-700 md:border-zinc-700 lg:border-zinc-700 xl:border-zinc-700 shadow-lg sm:shadow-lg md:shadow-lg lg:shadow-lg xl:shadow-lg aspect-[16/9] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[21/9] xl:aspect-[21/9] bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 relative sm:relative md:relative lg:relative xl:relative">
              <img 
                src={metaImage} 
                alt="Content Preview" 
                className="w-full sm:w-full md:w-full lg:w-full xl:w-full h-full sm:h-full md:h-full lg:h-full xl:h-full object-cover sm:object-cover md:object-cover lg:object-cover xl:object-cover"
                onError={() => setImageFailed(true)} 
              />
              <div className="absolute sm:absolute md:absolute lg:absolute xl:absolute inset-0 sm:inset-0 md:inset-0 lg:inset-0 xl:inset-0 bg-gradient-to-t sm:bg-gradient-to-t md:bg-gradient-to-t lg:bg-gradient-to-t xl:bg-gradient-to-t from-zinc-900 sm:from-zinc-900 md:from-zinc-900 lg:from-zinc-900 xl:from-zinc-900 via-transparent sm:via-transparent md:via-transparent lg:via-transparent xl:via-transparent to-transparent sm:to-transparent md:to-transparent lg:to-transparent xl:to-transparent"></div>
            </div>
            
            <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold text-white sm:text-white md:text-white lg:text-white xl:text-white text-center sm:text-center md:text-center lg:text-center xl:text-center line-clamp-2 sm:line-clamp-2 md:line-clamp-2 lg:line-clamp-2 xl:line-clamp-2 px-2 sm:px-2 md:px-4 lg:px-4 xl:px-4">
              {metaTitle}
            </h2>
          </div>
        )}

        {/* NATIVE ADS (DIPAKSA TENGAH) */}
        {settings?.ads_native && (
          <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full mb-8 sm:mb-8 md:mb-10 lg:mb-10 xl:mb-10 flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center items-center sm:items-center md:items-center lg:items-center xl:items-center overflow-hidden sm:overflow-hidden md:overflow-hidden lg:overflow-hidden xl:overflow-hidden" dangerouslySetInnerHTML={{ __html: settings.ads_native }} />
        )}

        {/* --- PHASE 1: CONTINUE BUTTON --- */}
        {phase === 1 && (
          <div className="flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg text-zinc-400 sm:text-zinc-400 md:text-zinc-400 lg:text-zinc-400 xl:text-zinc-400 mb-6 sm:mb-8 md:mb-10 lg:mb-10 xl:mb-10 text-center sm:text-center md:text-center lg:text-center xl:text-center max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-lg font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium tracking-wide sm:tracking-wide md:tracking-wide lg:tracking-wide xl:tracking-wide">
              Please click the button below to securely proceed to the destination page.
            </p>

            <button 
              onClick={() => setPhase(2)}
              className="w-full sm:w-auto md:w-auto lg:w-auto xl:w-auto min-w-[240px] sm:min-w-[260px] md:min-w-[280px] lg:min-w-[300px] xl:min-w-[300px] bg-indigo-600 sm:bg-indigo-600 md:bg-indigo-600 lg:bg-indigo-600 xl:bg-indigo-600 hover:bg-indigo-500 sm:hover:bg-indigo-500 md:hover:bg-indigo-500 lg:hover:bg-indigo-500 xl:hover:bg-indigo-500 text-white sm:text-white md:text-white lg:text-white xl:text-white font-black sm:font-black md:font-black lg:font-black xl:font-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl py-4 sm:py-4 md:py-4 lg:py-5 xl:py-5 px-8 sm:px-8 md:px-10 lg:px-10 xl:px-10 rounded-xl sm:rounded-xl md:rounded-xl lg:rounded-2xl xl:rounded-2xl uppercase sm:uppercase md:uppercase lg:uppercase xl:uppercase tracking-widest sm:tracking-widest md:tracking-widest lg:tracking-widest xl:tracking-widest transition-colors sm:transition-colors md:transition-colors lg:transition-colors xl:transition-colors shadow-lg sm:shadow-lg md:shadow-lg lg:shadow-lg xl:shadow-lg"
            >
              Continue
            </button>
          </div>
        )}

        {/* --- PHASE 2: TIMER COUNTDOWN --- */}
        {phase === 2 && (
          <div className="flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center animate-in sm:animate-in md:animate-in lg:animate-in xl:animate-in fade-in sm:fade-in md:fade-in lg:fade-in xl:fade-in zoom-in-95 sm:zoom-in-95 md:zoom-in-95 lg:zoom-in-95 xl:zoom-in-95 duration-300 sm:duration-300 md:duration-300 lg:duration-300 xl:duration-300">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl text-zinc-300 sm:text-zinc-300 md:text-zinc-300 lg:text-zinc-300 xl:text-zinc-300 mb-8 sm:mb-8 md:mb-10 lg:mb-10 xl:mb-10 font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium text-center sm:text-center md:text-center lg:text-center xl:text-center">
              Processing your secure link...
            </p>

            <div className="relative sm:relative md:relative lg:relative xl:relative flex sm:flex md:flex lg:flex xl:flex items-center sm:items-center md:items-center lg:items-center xl:items-center justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center w-24 sm:w-28 md:w-32 lg:w-36 xl:w-36 h-24 sm:h-28 md:h-32 lg:h-36 xl:h-36">
              <svg className="absolute sm:absolute md:absolute lg:absolute xl:absolute inset-0 sm:inset-0 md:inset-0 lg:inset-0 xl:inset-0 w-full sm:w-full md:w-full lg:w-full xl:w-full h-full sm:h-full md:h-full lg:h-full xl:h-full -rotate-90 sm:-rotate-90 md:-rotate-90 lg:-rotate-90 xl:-rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" className="stroke-zinc-800 sm:stroke-zinc-800 md:stroke-zinc-800 lg:stroke-zinc-800 xl:stroke-zinc-800" strokeWidth="6" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" className="stroke-indigo-500 sm:stroke-indigo-500 md:stroke-indigo-500 lg:stroke-indigo-500 xl:stroke-indigo-500" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * timeLeft) / 5}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-black sm:font-black md:font-black lg:font-black xl:font-black text-white sm:text-white md:text-white lg:text-white xl:text-white">
                {timeLeft}
              </span>
            </div>
          </div>
        )}

        {/* --- PHASE 3: GET LINK READY --- */}
        {phase === 3 && (
          <div className="flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center animate-in sm:animate-in md:animate-in lg:animate-in xl:animate-in fade-in sm:fade-in md:fade-in lg:fade-in xl:fade-in zoom-in-95 sm:zoom-in-95 md:zoom-in-95 lg:zoom-in-95 xl:zoom-in-95 duration-500 sm:duration-500 md:duration-500 lg:duration-500 xl:duration-500">
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl text-emerald-400 sm:text-emerald-400 md:text-emerald-400 lg:text-emerald-400 xl:text-emerald-400 mb-8 sm:mb-8 md:mb-10 lg:mb-10 xl:mb-10 font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold text-center sm:text-center md:text-center lg:text-center xl:text-center">
              Your link is ready!
            </p>

            <a 
              href={originalUrl}
              className="w-full sm:w-auto md:w-auto lg:w-auto xl:w-auto min-w-[240px] sm:min-w-[260px] md:min-w-[280px] lg:min-w-[300px] xl:min-w-[300px] bg-emerald-600 sm:bg-emerald-600 md:bg-emerald-600 lg:bg-emerald-600 xl:bg-emerald-600 hover:bg-emerald-500 sm:hover:bg-emerald-500 md:hover:bg-emerald-500 lg:hover:bg-emerald-500 xl:hover:bg-emerald-500 text-white sm:text-white md:text-white lg:text-white xl:text-white font-black sm:font-black md:font-black lg:font-black xl:font-black text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl py-4 sm:py-4 md:py-4 lg:py-5 xl:py-5 px-8 sm:px-8 md:px-10 lg:px-10 xl:px-10 rounded-xl sm:rounded-xl md:rounded-xl lg:rounded-2xl xl:rounded-2xl uppercase sm:uppercase md:uppercase lg:uppercase xl:uppercase tracking-widest sm:tracking-widest md:tracking-widest lg:tracking-widest xl:tracking-widest transition-all sm:transition-all md:transition-all lg:transition-all xl:transition-all shadow-[0_10px_40px_-10px_rgba(5,150,105,0.6)] sm:shadow-[0_10px_40px_-10px_rgba(5,150,105,0.6)] md:shadow-[0_10px_40px_-10px_rgba(5,150,105,0.6)] lg:shadow-[0_10px_40px_-10px_rgba(5,150,105,0.6)] xl:shadow-[0_10px_40px_-10px_rgba(5,150,105,0.6)] hover:-translate-y-1 sm:hover:-translate-y-1 md:hover:-translate-y-1 lg:hover:-translate-y-1 xl:hover:-translate-y-1 active:translate-y-0 sm:active:translate-y-0 md:active:translate-y-0 lg:active:translate-y-0 xl:active:translate-y-0 text-center sm:text-center md:text-center lg:text-center xl:text-center flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center items-center sm:items-center md:items-center lg:items-center xl:items-center gap-3 sm:gap-3 md:gap-3 lg:gap-3 xl:gap-3"
            >
              Get Link
              <svg className="w-5 sm:w-5 md:w-6 lg:w-6 xl:w-6 h-5 sm:h-5 md:h-6 lg:h-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
