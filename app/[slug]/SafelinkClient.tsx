"use client";

import { useState, useEffect } from "react";

export default function SafelinkClient({ 
  originalUrl, 
  settings 
}: { 
  originalUrl: string, 
  settings: any 
}) {
  // Phase 1: Continue Button | Phase 2: Timer | Phase 3: Get Link
  const [phase, setPhase] = useState(1);
  const [timeLeft, setTimeLeft] = useState(5);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 2) {
      if (timeLeft > 0) {
        timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      } else {
        setPhase(3); // Otomatis pindah ke tombol Get Link kalau waktu habis
      }
    }
    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  return (
    <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto px-4 sm:px-4 md:px-0 lg:px-0 xl:px-0 relative sm:relative md:relative lg:relative xl:relative z-10 sm:z-10 md:z-10 lg:z-10 xl:z-10">
      
      {/* MAIN CARD (Modern Premium Design) */}
      <div className="bg-zinc-900/80 sm:bg-zinc-900/80 md:bg-zinc-900/80 lg:bg-zinc-900/80 xl:bg-zinc-900/80 backdrop-blur-xl sm:backdrop-blur-xl md:backdrop-blur-xl lg:backdrop-blur-xl xl:backdrop-blur-xl border sm:border md:border lg:border xl:border border-zinc-800/50 sm:border-zinc-800/50 md:border-zinc-800/50 lg:border-zinc-800/50 xl:border-zinc-800/50 rounded-2xl sm:rounded-2xl md:rounded-3xl lg:rounded-3xl xl:rounded-3xl p-6 sm:p-8 md:p-10 lg:p-12 xl:p-12 shadow-[0_0_50px_-15px_rgba(0,0,0,0.5)] sm:shadow-[0_0_50px_-15px_rgba(0,0,0,0.5)] md:shadow-[0_0_50px_-15px_rgba(0,0,0,0.5)] lg:shadow-[0_0_50px_-15px_rgba(0,0,0,0.5)] xl:shadow-[0_0_50px_-15px_rgba(0,0,0,0.5)] relative sm:relative md:relative lg:relative xl:relative overflow-hidden sm:overflow-hidden md:overflow-hidden lg:overflow-hidden xl:overflow-hidden">
        
        {/* Glow Effect Background */}
        <div className="absolute sm:absolute md:absolute lg:absolute xl:absolute top-0 sm:top-0 md:top-0 lg:top-0 xl:top-0 left-1/2 sm:left-1/2 md:left-1/2 lg:left-1/2 xl:left-1/2 -translate-x-1/2 sm:-translate-x-1/2 md:-translate-x-1/2 lg:-translate-x-1/2 xl:-translate-x-1/2 w-full sm:w-full md:w-full lg:w-full xl:w-full h-32 sm:h-32 md:h-40 lg:h-48 xl:h-48 bg-indigo-500/10 sm:bg-indigo-500/10 md:bg-indigo-500/10 lg:bg-indigo-500/10 xl:bg-indigo-500/10 blur-[100px] sm:blur-[100px] md:blur-[100px] lg:blur-[120px] xl:blur-[120px] pointer-events-none sm:pointer-events-none md:pointer-events-none lg:pointer-events-none xl:pointer-events-none"></div>

        {/* CONTENT IMAGE */}
        {!imageFailed && (
          <div className="mb-8 sm:mb-8 md:mb-10 lg:mb-10 xl:mb-12 rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl overflow-hidden sm:overflow-hidden md:overflow-hidden lg:overflow-hidden xl:overflow-hidden border sm:border md:border lg:border xl:border border-zinc-800/80 sm:border-zinc-800/80 md:border-zinc-800/80 lg:border-zinc-800/80 xl:border-zinc-800/80 shadow-lg sm:shadow-lg md:shadow-lg lg:shadow-lg xl:shadow-lg relative sm:relative md:relative lg:relative xl:relative aspect-video sm:aspect-video md:aspect-video lg:aspect-video xl:aspect-video bg-zinc-950/50 sm:bg-zinc-950/50 md:bg-zinc-950/50 lg:bg-zinc-950/50 xl:bg-zinc-950/50">
            <img 
              src={`https://image.thum.io/get/width/1000/crop/600/${originalUrl}`} 
              alt="Destination Preview" 
              className="w-full sm:w-full md:w-full lg:w-full xl:w-full h-full sm:h-full md:h-full lg:h-full xl:h-full object-cover sm:object-cover md:object-cover lg:object-cover xl:object-cover"
              onError={() => setImageFailed(true)} 
            />
            <div className="absolute sm:absolute md:absolute lg:absolute xl:absolute inset-0 sm:inset-0 md:inset-0 lg:inset-0 xl:inset-0 bg-gradient-to-t sm:bg-gradient-to-t md:bg-gradient-to-t lg:bg-gradient-to-t xl:bg-gradient-to-t from-zinc-900/90 sm:from-zinc-900/90 md:from-zinc-900/90 lg:from-zinc-900/90 xl:from-zinc-900/90 via-transparent sm:via-transparent md:via-transparent lg:via-transparent xl:via-transparent to-transparent sm:to-transparent md:to-transparent lg:to-transparent xl:to-transparent"></div>
          </div>
        )}

        {/* NATIVE ADS */}
        {settings?.ads_native && (
          <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full mb-8 sm:mb-8 md:mb-10 lg:mb-10 xl:mb-10 flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center" dangerouslySetInnerHTML={{ __html: settings.ads_native }} />
        )}

        {/* PHASE 1: CONTINUE BUTTON */}
        {phase === 1 && (
          <div className="flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center animate-in sm:animate-in md:animate-in lg:animate-in xl:animate-in fade-in sm:fade-in md:fade-in lg:fade-in xl:fade-in duration-500 sm:duration-500 md:duration-500 lg:duration-500 xl:duration-500 relative sm:relative md:relative lg:relative xl:relative z-10 sm:z-10 md:z-10 lg:z-10 xl:z-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold text-white sm:text-white md:text-white lg:text-white xl:text-white mb-3 sm:mb-3 md:mb-4 lg:mb-4 xl:mb-4 tracking-tight sm:tracking-tight md:tracking-tight lg:tracking-tight xl:tracking-tight">
              Secure Destination Link
            </h2>
            <p className="text-sm sm:text-sm md:text-base lg:text-base xl:text-base text-zinc-400 sm:text-zinc-400 md:text-zinc-400 lg:text-zinc-400 xl:text-zinc-400 mb-8 sm:mb-8 md:mb-10 lg:mb-10 xl:mb-10 text-center sm:text-center md:text-center lg:text-center xl:text-center max-w-sm sm:max-w-sm md:max-w-md lg:max-w-md xl:max-w-md">
              Please click the button below to proceed safely to your destination page.
            </p>

            <button 
              onClick={() => setPhase(2)}
              className="w-full sm:w-auto md:w-auto lg:w-auto xl:w-auto min-w-[240px] sm:min-w-[260px] md:min-w-[280px] lg:min-w-[280px] xl:min-w-[280px] bg-indigo-600 sm:bg-indigo-600 md:bg-indigo-600 lg:bg-indigo-600 xl:bg-indigo-600 hover:bg-indigo-500 sm:hover:bg-indigo-500 md:hover:bg-indigo-500 lg:hover:bg-indigo-500 xl:hover:bg-indigo-500 text-white sm:text-white md:text-white lg:text-white xl:text-white font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold text-base sm:text-base md:text-lg lg:text-lg xl:text-lg py-4 sm:py-4 md:py-4 lg:py-4 xl:py-4 px-8 sm:px-8 md:px-10 lg:px-10 xl:px-10 rounded-xl sm:rounded-xl md:rounded-xl lg:rounded-xl xl:rounded-xl transition-all sm:transition-all md:transition-all lg:transition-all xl:transition-all duration-300 sm:duration-300 md:duration-300 lg:duration-300 xl:duration-300 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] sm:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] md:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] lg:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] xl:shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] hover:-translate-y-1 sm:hover:-translate-y-1 md:hover:-translate-y-1 lg:hover:-translate-y-1 xl:hover:-translate-y-1 active:translate-y-0 sm:active:translate-y-0 md:active:translate-y-0 lg:active:translate-y-0 xl:active:translate-y-0"
            >
              Continue
            </button>
          </div>
        )}

        {/* PHASE 2: TIMER */}
        {phase === 2 && (
          <div className="flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center animate-in sm:animate-in md:animate-in lg:animate-in xl:animate-in fade-in sm:fade-in md:fade-in lg:fade-in xl:fade-in zoom-in-95 sm:zoom-in-95 md:zoom-in-95 lg:zoom-in-95 xl:zoom-in-95 duration-500 sm:duration-500 md:duration-500 lg:duration-500 xl:duration-500 relative sm:relative md:relative lg:relative xl:relative z-10 sm:z-10 md:z-10 lg:z-10 xl:z-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold text-white sm:text-white md:text-white lg:text-white xl:text-white mb-2 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-2">
              Processing Request
            </h2>
            <p className="text-sm sm:text-sm md:text-base lg:text-base xl:text-base text-zinc-400 sm:text-zinc-400 md:text-zinc-400 lg:text-zinc-400 xl:text-zinc-400 mb-8 sm:mb-8 md:mb-10 lg:mb-10 xl:mb-10">
              Please wait while your link is being generated...
            </p>

            <div className="relative sm:relative md:relative lg:relative xl:relative w-28 sm:w-28 md:w-32 lg:w-32 xl:w-32 h-28 sm:h-28 md:h-32 lg:h-32 xl:h-32 mb-4 sm:mb-4 md:mb-4 lg:mb-4 xl:mb-4 flex sm:flex md:flex lg:flex xl:flex items-center sm:items-center md:items-center lg:items-center xl:items-center justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center">
              <svg className="absolute sm:absolute md:absolute lg:absolute xl:absolute inset-0 sm:inset-0 md:inset-0 lg:inset-0 xl:inset-0 w-full sm:w-full md:w-full lg:w-full xl:w-full h-full sm:h-full md:h-full lg:h-full xl:h-full -rotate-90 sm:-rotate-90 md:-rotate-90 lg:-rotate-90 xl:-rotate-90 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] sm:drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] md:drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] lg:drop-shadow-[0_0_15px_rgba(99,102,241,0.5)] xl:drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="46" fill="none" className="stroke-zinc-800 sm:stroke-zinc-800 md:stroke-zinc-800 lg:stroke-zinc-800 xl:stroke-zinc-800" strokeWidth="6" />
                <circle 
                  cx="50" cy="50" r="46" fill="none" className="stroke-indigo-500 sm:stroke-indigo-500 md:stroke-indigo-500 lg:stroke-indigo-500 xl:stroke-indigo-500" strokeWidth="6"
                  strokeLinecap="round"
                  strokeDasharray="289"
                  strokeDashoffset={289 - (289 * timeLeft) / 5}
                  style={{ transition: "stroke-dashoffset 1s linear" }}
                />
              </svg>
              <span className="text-5xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-6xl font-black sm:font-black md:font-black lg:font-black xl:font-black text-white sm:text-white md:text-white lg:text-white xl:text-white">
                {timeLeft}
              </span>
            </div>
          </div>
        )}

        {/* PHASE 3: GET LINK */}
        {phase === 3 && (
          <div className="flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center animate-in sm:animate-in md:animate-in lg:animate-in xl:animate-in fade-in sm:fade-in md:fade-in lg:fade-in xl:fade-in zoom-in-95 sm:zoom-in-95 md:zoom-in-95 lg:zoom-in-95 xl:zoom-in-95 duration-500 sm:duration-500 md:duration-500 lg:duration-500 xl:duration-500 relative sm:relative md:relative lg:relative xl:relative z-10 sm:z-10 md:z-10 lg:z-10 xl:z-10">
            <div className="w-16 sm:w-16 md:w-20 lg:w-20 xl:w-20 h-16 sm:h-16 md:h-20 lg:h-20 xl:h-20 bg-emerald-500/20 sm:bg-emerald-500/20 md:bg-emerald-500/20 lg:bg-emerald-500/20 xl:bg-emerald-500/20 rounded-full sm:rounded-full md:rounded-full lg:rounded-full xl:rounded-full flex sm:flex md:flex lg:flex xl:flex items-center sm:items-center md:items-center lg:items-center xl:items-center justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center mb-6 sm:mb-6 md:mb-6 lg:mb-6 xl:mb-6">
              <svg className="w-8 sm:w-8 md:w-10 lg:w-10 xl:w-10 h-8 sm:h-8 md:h-10 lg:h-10 xl:h-10 text-emerald-400 sm:text-emerald-400 md:text-emerald-400 lg:text-emerald-400 xl:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            
            <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-3xl font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold text-white sm:text-white md:text-white lg:text-white xl:text-white mb-2 sm:mb-2 md:mb-2 lg:mb-2 xl:mb-2">
              Your Link is Ready
            </h2>
            <p className="text-sm sm:text-sm md:text-base lg:text-base xl:text-base text-zinc-400 sm:text-zinc-400 md:text-zinc-400 lg:text-zinc-400 xl:text-zinc-400 mb-8 sm:mb-8 md:mb-10 lg:mb-10 xl:mb-10 text-center sm:text-center md:text-center lg:text-center xl:text-center">
              Verification complete. You may now proceed to your destination.
            </p>

            <a 
              href={originalUrl}
              className="w-full sm:w-auto md:w-auto lg:w-auto xl:w-auto min-w-[240px] sm:min-w-[260px] md:min-w-[280px] lg:min-w-[280px] xl:min-w-[280px] bg-emerald-600 sm:bg-emerald-600 md:bg-emerald-600 lg:bg-emerald-600 xl:bg-emerald-600 hover:bg-emerald-500 sm:hover:bg-emerald-500 md:hover:bg-emerald-500 lg:hover:bg-emerald-500 xl:hover:bg-emerald-500 text-white sm:text-white md:text-white lg:text-white xl:text-white font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold text-base sm:text-base md:text-lg lg:text-lg xl:text-lg py-4 sm:py-4 md:py-4 lg:py-4 xl:py-4 px-8 sm:px-8 md:px-10 lg:px-10 xl:px-10 rounded-xl sm:rounded-xl md:rounded-xl lg:rounded-xl xl:rounded-xl transition-all sm:transition-all md:transition-all lg:transition-all xl:transition-all duration-300 sm:duration-300 md:duration-300 lg:duration-300 xl:duration-300 shadow-[0_10px_40px_-10px_rgba(5,150,105,0.5)] sm:shadow-[0_10px_40px_-10px_rgba(5,150,105,0.5)] md:shadow-[0_10px_40px_-10px_rgba(5,150,105,0.5)] lg:shadow-[0_10px_40px_-10px_rgba(5,150,105,0.5)] xl:shadow-[0_10px_40px_-10px_rgba(5,150,105,0.5)] hover:-translate-y-1 sm:hover:-translate-y-1 md:hover:-translate-y-1 lg:hover:-translate-y-1 xl:hover:-translate-y-1 active:translate-y-0 sm:active:translate-y-0 md:active:translate-y-0 lg:active:translate-y-0 xl:active:translate-y-0 text-center sm:text-center md:text-center lg:text-center xl:text-center flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center items-center sm:items-center md:items-center lg:items-center xl:items-center gap-2 sm:gap-2 md:gap-2 lg:gap-2 xl:gap-2"
            >
              Get Link
              <svg className="w-5 sm:w-5 md:w-6 lg:w-6 xl:w-6 h-5 sm:h-5 md:h-6 lg:h-6 xl:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
