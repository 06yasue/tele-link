import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function NotFound() {
  return (
    // Tambahin px-4 biar di HP layarnya gak mentok ke pinggir
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white px-4">
      
      {/* Bungkus 404 dan Label di dalam div relative biar labelnya nempel rapih di tengah */}
      <div className="relative flex justify-center items-center">
        <h1 className="text-9xl font-extrabold tracking-widest text-rose-600 drop-shadow-md">404</h1>
        <div className="absolute rotate-12 rounded bg-rose-700 px-3 py-1 text-sm font-bold shadow-lg border border-rose-500/50">
          URL Not Found
        </div>
      </div>
      
      {/* Kasih max-w-sm dan sm:max-w-md biar teksnya otomatis turun ke bawah (ngelipet) kalau kepanjangan */}
      <p className="mt-8 max-w-sm sm:max-w-md text-center text-base sm:text-lg text-zinc-400 font-medium leading-relaxed">
        Oops, the link you are looking for doesn't exist or has been deleted.
      </p>
      
      <Link
        href={`https://${siteConfig.domain}`}
        className="mt-8 inline-block rounded-xl bg-indigo-600 px-8 py-3.5 font-bold text-white transition hover:bg-indigo-500 hover:-translate-y-1 shadow-[0_4px_14px_0_rgba(79,70,229,0.39)]"
      >
        Back to {siteConfig.name}
      </Link>

    </div>
  );
}
