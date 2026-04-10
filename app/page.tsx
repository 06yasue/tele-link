import { siteConfig } from '@/config/site';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 p-6">
      <h1 className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-5xl font-bold text-transparent">
        {siteConfig.name}
      </h1>
      <p className="mt-4 text-zinc-400">
        Kirim link ke bot Telegram untuk dipendekkan.
      </p>
    </main>
  );
}
