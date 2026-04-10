import Link from 'next/link';
import { siteConfig } from '@/config/site';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
      <h1 className="text-9xl font-extrabold tracking-widest text-rose-600">404</h1>
      <div className="absolute rotate-12 rounded bg-rose-700 px-2 text-sm shadow-lg">
        URL Tidak Ditemukan
      </div>
      <p className="mt-8 text-center text-lg text-zinc-400">
        Waduh, link yang dicari tidak ada atau sudah dihapus.
      </p>
      <Link
        href={`https://${siteConfig.domain}`}
        className="mt-6 inline-block rounded bg-indigo-600 px-6 py-3 font-semibold text-white transition hover:bg-indigo-700 shadow-md"
      >
        Kembali ke {siteConfig.name}
      </Link>
    </div>
  );
}
