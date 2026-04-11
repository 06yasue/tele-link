"use client";

import { useState, useEffect } from "react";

export default function SafelinkClient({ 
  originalUrl, 
  settings
}: { 
  originalUrl: string, 
  settings: any
}) {
  const [phase, setPhase] = useState(1);
  const [timeLeft, setTimeLeft] = useState(5);

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
    <div className="w-full max-w-2xl mx-auto z-20">
      
      {/* MODERN CARD CONTAINER DENGAN EFEK KETEBALAN / DEPTH YANG WARAS */}
      <div className="bg-[#121214] border border-zinc-800/80 rounded-2xl p-6 md:p-10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] relative overflow-hidden">

        {/* Subtle top light reflection */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-zinc-600 to-transparent opacity-50"></div>

        {/* NATIVE ADS (DIPAKSA TENGAH & RAPIH) */}
        {settings?.ads_native && (
          <div className="w-full mb-8 flex justify-center items-center overflow-hidden rounded-lg bg-zinc-900/30" dangerouslySetInnerHTML={{ __html: settings.ads_native }} />
        )}

        {/* --- PHASE 1: CONTINUE BUTTON --- */}
        {phase === 1 && (
          <div className="flex flex-col items-center animate-in fade-in duration-300">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/20 shadow-inner">
              <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">Secure Connection</h2>
            <p className="text-sm md:text-base text-zinc-400 mb-8 text-center max-w-md">
              Please click the button below to securely proceed to the destination page.
            </p>

            <button 
              onClick={() => setPhase(2)}
              className="w-full sm:w-auto min-w-[280px] bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg py-4 px-10 rounded-xl uppercase tracking-wider transition-all shadow-[0_4px_0_0_#3730a3] active:shadow-none active:translate-y-[4px]"
            >
              Continue
            </button>
          </div>
        )}

        {/* --- PHASE 2: TIMER COUNTDOWN --- */}
        {phase === 2 && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">Processing Request</h2>
            <p className="text-sm md:text-base text-zinc-400 mb-8 font-medium text-center">
              Please wait while your link is being generated...
            </p>

            <div className="relative flex items-center justify-center w-28 h-28 mb-4">
              <svg className="absolute inset-0 w-full h-full -rotate-90 drop-shadow-[0_0_15px_rgba(99,102,241,0.2)]" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" className="stroke-zinc-800" strokeWidth="6" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" className="stroke-indigo-500" strokeWidth="6"
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

        {/* --- PHASE 3: GET LINK READY --- */}
        {phase === 3 && (
          <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/20 shadow-inner">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-white mb-2 text-center">
              Your Link is Ready
            </h2>
            <p className="text-sm md:text-base text-zinc-400 mb-8 text-center">
              Verification complete. You may now proceed to your destination.
            </p>

            <a 
              href={originalUrl}
              className="w-full sm:w-auto min-w-[280px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-lg py-4 px-10 rounded-xl uppercase tracking-wider transition-all shadow-[0_4px_0_0_#047857] active:shadow-none active:translate-y-[4px] text-center flex justify-center items-center gap-3"
            >
              Get Link
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
