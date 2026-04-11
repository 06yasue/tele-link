"use client";

import { useState, useEffect } from "react";

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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 2 && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (phase === 2 && timeLeft === 0) {
      setPhase(3);
    }
    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  return (
    <div className="w-full max-w-2xl mx-auto z-20 px-2 sm:px-0">
      
      {/* BOX 3D TIMBUL (Neo-Brutalism Design) */}
      <div className="bg-[#1e1e20] border-2 border-[#3f3f46] rounded-2xl p-6 md:p-10 shadow-[6px_6px_0px_0px_#3f3f46] sm:shadow-[10px_10px_0px_0px_#3f3f46] flex flex-col items-center text-center">

        {/* TITLE DARI LINK TUJUAN (TANPA GAMBAR) */}
        <div className="mb-8 w-full bg-[#121212] border border-[#27272a] rounded-xl p-4 shadow-inner flex items-center justify-center min-h-[80px]">
          <h2 className="text-lg md:text-xl font-bold text-zinc-100 line-clamp-2">
            {title}
          </h2>
        </div>

        {/* NATIVE ADS (PASTI DI TENGAH) */}
        {settings?.ads_native && (
          <div className="w-full mb-8 flex justify-center items-center rounded-lg overflow-hidden" dangerouslySetInnerHTML={{ __html: settings.ads_native || "" }} />
        )}

        {/* PHASE 1: CONTINUE BUTTON */}
        {phase === 1 && (
          <div className="w-full flex flex-col items-center animate-in fade-in duration-300">
            <p className="text-sm md:text-base text-zinc-400 mb-8 font-medium max-w-sm">
              Please click the button below to securely proceed to the destination page.
            </p>

            {/* Tombol 3D bisa dipencet */}
            <button 
              onClick={() => setPhase(2)}
              className="w-full sm:w-auto min-w-[280px] bg-indigo-600 border-2 border-indigo-800 text-white font-bold text-lg py-4 px-10 rounded-xl uppercase tracking-wider transition-all shadow-[0px_6px_0px_0px_#3730a3] active:shadow-[0px_0px_0px_0px_#3730a3] active:translate-y-[6px]"
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

            <div className="relative flex items-center justify-center w-24 h-24 mb-4">
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

            <a 
              href={originalUrl}
              className="w-full sm:w-auto min-w-[280px] bg-emerald-600 border-2 border-emerald-800 text-white font-bold text-lg py-4 px-10 rounded-xl uppercase tracking-wider transition-all shadow-[0px_6px_0px_0px_#047857] active:shadow-[0px_0px_0px_0px_#047857] active:translate-y-[6px] text-center flex justify-center items-center gap-2"
            >
              Get Link
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
