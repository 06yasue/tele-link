"use client";

import { useState, useEffect } from "react";

export default function SafelinkClient({ 
  originalUrl, 
  domainName, 
  settings 
}: { 
  originalUrl: string, 
  domainName: string, 
  settings: any 
}) {
  const [phase, setPhase] = useState(1); // Phase 1: Captcha, Phase 2: Timer
  const [isVerified, setIsVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5);

  // Efek buat Timer mundur pas masuk Phase 2
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (phase === 2 && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [phase, timeLeft]);

  return (
    <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-md sm:max-w-md md:max-w-lg lg:max-w-2xl xl:max-w-3xl bg-zinc-900 sm:bg-zinc-900 md:bg-zinc-900 lg:bg-zinc-900 xl:bg-zinc-900 border sm:border md:border lg:border xl:border border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 rounded-2xl sm:rounded-2xl md:rounded-3xl lg:rounded-3xl xl:rounded-3xl p-6 sm:p-6 md:p-8 lg:p-10 xl:p-12 flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center text-center sm:text-center md:text-center lg:text-center xl:text-center shadow-2xl sm:shadow-2xl md:shadow-2xl lg:shadow-2xl xl:shadow-2xl mx-auto sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto">
      
      {/* GAMBAR KONTEN (Web Screenshot) */}
      <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full mb-6 sm:mb-6 md:mb-8 lg:mb-8 xl:mb-10 overflow-hidden sm:overflow-hidden md:overflow-hidden lg:overflow-hidden xl:overflow-hidden rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl border sm:border md:border lg:border xl:border border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 shadow-lg sm:shadow-lg md:shadow-lg lg:shadow-lg xl:shadow-lg bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950">
        <img 
          src={`https://image.thum.io/get/width/600/crop/800/${originalUrl}`} 
          alt="Content Preview" 
          className="w-full sm:w-full md:w-full lg:w-full xl:w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 object-cover sm:object-cover md:object-cover lg:object-cover xl:object-cover opacity-90 sm:opacity-90 md:opacity-90 lg:opacity-90 xl:opacity-90 hover:opacity-100 sm:hover:opacity-100 md:hover:opacity-100 lg:hover:opacity-100 xl:hover:opacity-100 transition-opacity sm:transition-opacity md:transition-opacity lg:transition-opacity xl:transition-opacity"
          onError={(e) => { e.currentTarget.src = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop" }} // Gambar cadangan elegan
        />
        <div className="bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 py-3 sm:py-3 md:py-4 lg:py-4 xl:py-4 border-t sm:border-t md:border-t lg:border-t xl:border-t border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800">
          <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold text-zinc-100 sm:text-zinc-100 md:text-zinc-100 lg:text-zinc-100 xl:text-zinc-100 truncate sm:truncate md:truncate lg:truncate xl:truncate px-4 sm:px-4 md:px-6 lg:px-6 xl:px-6">
            {domainName}
          </h2>
        </div>
      </div>

      {/* 🟢 IKLAN NATIVE BANNER DI TENGAH */}
      {settings?.ads_native && (
        <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full mb-6 sm:mb-6 md:mb-8 lg:mb-8 xl:mb-10 flex justify-center" dangerouslySetInnerHTML={{ __html: settings.ads_native }} />
      )}

      {/* TAMPILAN PHASE 1: CAPTCHA */}
      {phase === 1 && (
        <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full animate-in fade-in zoom-in duration-500">
          <p className="text-sm sm:text-sm md:text-base lg:text-lg xl:text-lg text-zinc-400 sm:text-zinc-400 md:text-zinc-400 lg:text-zinc-400 xl:text-zinc-400 mb-6 sm:mb-6 md:mb-8 lg:mb-8 xl:mb-8 font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium">
            Please click on below captcha box to proceed to the destination page.
          </p>

          {/* SIMULASI KOTAK RECAPTCHA YANG ELEGAN */}
          <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full max-w-[300px] sm:max-w-[300px] md:max-w-[320px] lg:max-w-[350px] xl:max-w-[350px] mx-auto sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 border sm:border md:border lg:border xl:border border-zinc-700 sm:border-zinc-700 md:border-zinc-700 lg:border-zinc-700 xl:border-zinc-700 rounded-lg sm:rounded-lg md:rounded-lg lg:rounded-xl xl:rounded-xl p-3 sm:p-3 md:p-4 lg:p-4 xl:p-5 flex sm:flex md:flex lg:flex xl:flex items-center sm:items-center md:items-center lg:items-center xl:items-center justify-between sm:justify-between md:justify-between lg:justify-between xl:justify-between mb-8 sm:mb-8 md:mb-10 lg:mb-10 xl:mb-10 shadow-md sm:shadow-md md:shadow-md lg:shadow-md xl:shadow-md">
            <div className="flex sm:flex md:flex lg:flex xl:flex items-center sm:items-center md:items-center lg:items-center xl:items-center gap-3 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-4">
              <input 
                type="checkbox" 
                checked={isVerified}
                onChange={() => setIsVerified(true)}
                className="w-6 h-6 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 xl:w-8 xl:h-8 cursor-pointer sm:cursor-pointer md:cursor-pointer lg:cursor-pointer xl:cursor-pointer accent-emerald-500 sm:accent-emerald-500 md:accent-emerald-500 lg:accent-emerald-500 xl:accent-emerald-500 rounded sm:rounded md:rounded lg:rounded xl:rounded"
              />
              <span className="text-sm sm:text-sm md:text-base lg:text-lg xl:text-lg font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium text-zinc-300 sm:text-zinc-300 md:text-zinc-300 lg:text-zinc-300 xl:text-zinc-300">
                I'm not a robot
              </span>
            </div>
            <div className="flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center">
              <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="reCAPTCHA" className="w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-10 lg:h-10 xl:w-10 xl:h-10 opacity-80 sm:opacity-80 md:opacity-80 lg:opacity-80 xl:opacity-80" />
              <span className="text-[10px] sm:text-[10px] md:text-xs lg:text-xs xl:text-xs text-zinc-500 sm:text-zinc-500 md:text-zinc-500 lg:text-zinc-500 xl:text-zinc-500 mt-1 sm:mt-1 md:mt-1 lg:mt-1 xl:mt-1">reCAPTCHA</span>
            </div>
          </div>

          <button 
            disabled={!isVerified}
            onClick={() => setPhase(2)}
            className="w-full sm:w-full md:w-full lg:w-full xl:w-full inline-block sm:inline-block md:inline-block lg:inline-block xl:inline-block bg-blue-600 sm:bg-blue-600 md:bg-blue-600 lg:bg-blue-600 xl:bg-blue-600 hover:bg-blue-500 sm:hover:bg-blue-500 md:hover:bg-blue-500 lg:hover:bg-blue-500 xl:hover:bg-blue-500 text-white sm:text-white md:text-white lg:text-white xl:text-white font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold text-base sm:text-base md:text-lg lg:text-xl xl:text-xl py-4 sm:py-4 md:py-4 lg:py-5 xl:py-5 rounded-xl sm:rounded-xl md:rounded-xl lg:rounded-2xl xl:rounded-2xl shadow-lg sm:shadow-lg md:shadow-lg lg:shadow-lg xl:shadow-lg transition-all sm:transition-all md:transition-all lg:transition-all xl:transition-all text-center sm:text-center md:text-center lg:text-center xl:text-center disabled:opacity-50 sm:disabled:opacity-50 md:disabled:opacity-50 lg:disabled:opacity-50 xl:disabled:opacity-50 disabled:cursor-not-allowed sm:disabled:cursor-not-allowed md:disabled:cursor-not-allowed lg:disabled:cursor-not-allowed xl:disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      )}

      {/* TAMPILAN PHASE 2: TIMER & GET LINK */}
      {phase === 2 && (
        <div className="w-full sm:w-full md:w-full lg:w-full xl:w-full animate-in fade-in zoom-in duration-500">
          <p className="text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-2xl text-emerald-400 sm:text-emerald-400 md:text-emerald-400 lg:text-emerald-400 xl:text-emerald-400 mb-6 sm:mb-6 md:mb-8 lg:mb-8 xl:mb-10 font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold">
            Link sudah siap!
          </p>

          <div className="w-32 h-32 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 xl:w-48 xl:h-48 mx-auto sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto rounded-full sm:rounded-full md:rounded-full lg:rounded-full xl:rounded-full border-4 sm:border-4 md:border-8 lg:border-8 xl:border-8 border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 flex sm:flex md:flex lg:flex xl:flex items-center sm:items-center md:items-center lg:items-center xl:items-center justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center mb-8 sm:mb-8 md:mb-10 lg:mb-10 xl:mb-12 relative sm:relative md:relative lg:relative xl:relative">
            {timeLeft > 0 ? (
              <span className="text-5xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-7xl font-black sm:font-black md:font-black lg:font-black xl:font-black text-indigo-400 sm:text-indigo-400 md:text-indigo-400 lg:text-indigo-400 xl:text-indigo-400 animate-pulse sm:animate-pulse md:animate-pulse lg:animate-pulse xl:animate-pulse">
                {timeLeft}
              </span>
            ) : (
              <svg className="w-16 h-16 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-24 xl:h-24 text-emerald-500 sm:text-emerald-500 md:text-emerald-500 lg:text-emerald-500 xl:text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            )}
          </div>

          <a 
            href={originalUrl}
            className={`w-full sm:w-full md:w-full lg:w-full xl:w-full inline-block sm:inline-block md:inline-block lg:inline-block xl:inline-block font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold text-base sm:text-base md:text-lg lg:text-xl xl:text-xl py-4 sm:py-4 md:py-4 lg:py-5 xl:py-5 rounded-xl sm:rounded-xl md:rounded-xl lg:rounded-2xl xl:rounded-2xl shadow-lg sm:shadow-lg md:shadow-lg lg:shadow-lg xl:shadow-lg transition-all sm:transition-all md:transition-all lg:transition-all xl:transition-all text-center sm:text-center md:text-center lg:text-center xl:text-center ${
              timeLeft > 0 
              ? "bg-zinc-800 text-zinc-500 pointer-events-none cursor-not-allowed" 
              : "bg-emerald-600 hover:bg-emerald-500 text-white animate-bounce"
            }`}
          >
            Get Link
          </a>
        </div>
      )}

    </div>
  );
}
