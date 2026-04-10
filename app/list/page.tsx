"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";

type UrlData = {
  id: string;
  slug: string;
  original_url: string;
  hitcount: number;
  created_at: string;
};

function ListContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user"); 

  const [urls, setUrls] = useState<UrlData[]>([]);
  const [totalLinks, setTotalLinks] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  
  const [page, setPage] = useState(1);
  const limit = 5; 

  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [page, user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/urls?user=${user || ""}&page=${page}`);
      if (!res.ok) throw new Error("Gagal fetch data");
      
      const json = await res.json();
      setUrls(json.urls);
      setTotalLinks(json.totalLinks);
      setTotalClicks(json.totalClicks);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (slug: string, id: string) => {
    const fullUrl = `https://${siteConfig.domain}/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000); 
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await fetch("/api/urls", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    setDeletingId(null);
    fetchData(); 
  };

  // Solusi untuk In-App Browser Telegram: Buka di Tab Baru
  const downloadQR = (slug: string) => {
    const fullUrl = `https://${siteConfig.domain}/${slug}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(fullUrl)}&color=ffffff&bgcolor=09090b`;
    window.open(qrUrl, "_blank");
  };

  // Fungsi untuk ngambil Logo/Favicon dari URL
  const getFavicon = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch (e) {
      return null;
    }
  };

  return (
    <div className="min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen xl:min-h-screen bg-zinc-950 text-white p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
      
      <div className="max-w-7xl sm:max-w-7xl md:max-w-7xl lg:max-w-7xl xl:max-w-7xl mx-auto sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row justify-between items-start sm:items-start md:items-center lg:items-center xl:items-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-14 gap-4 sm:gap-6 md:gap-0 lg:gap-0 xl:gap-0">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4 lg:mb-5 xl:mb-6">
            Dashboard Link
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-zinc-400">
            {user ? "Berikut adalah daftar tautan yang telah Anda buat." : "Menampilkan seluruh daftar tautan."}
          </p>
        </div>
        
        <div className="flex flex-row sm:flex-row md:flex-row lg:flex-row xl:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 w-full sm:w-full md:w-auto lg:w-auto xl:w-auto">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-3xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 flex-1 sm:flex-1 md:flex-none lg:flex-none xl:flex-none text-center sm:text-center md:text-center lg:text-center xl:text-center">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-zinc-500 uppercase tracking-widest sm:tracking-widest md:tracking-widest lg:tracking-widest xl:tracking-widest mb-1 sm:mb-2 md:mb-2 lg:mb-3 xl:mb-4">Total Link</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black sm:font-black md:font-black lg:font-black xl:font-black text-white">{totalLinks}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-3xl p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 flex-1 sm:flex-1 md:flex-none lg:flex-none xl:flex-none text-center sm:text-center md:text-center lg:text-center xl:text-center">
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-zinc-500 uppercase tracking-widest sm:tracking-widest md:tracking-widest lg:tracking-widest xl:tracking-widest mb-1 sm:mb-2 md:mb-2 lg:mb-3 xl:mb-4">Total Klik</p>
            <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black sm:font-black md:font-black lg:font-black xl:font-black text-rose-500">{totalClicks}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl sm:max-w-7xl md:max-w-7xl lg:max-w-7xl xl:max-w-7xl mx-auto sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-zinc-900/50 border border-zinc-800 rounded-xl sm:rounded-2xl md:rounded-3xl lg:rounded-3xl xl:rounded-3xl overflow-hidden sm:overflow-hidden md:overflow-hidden lg:overflow-hidden xl:overflow-hidden">
        {/* Pembungkus Tabel buat Horizontal Scroll */}
        <div className="overflow-x-auto sm:overflow-x-auto md:overflow-x-auto lg:overflow-x-auto xl:overflow-x-auto w-full sm:w-full md:w-full lg:w-full xl:w-full">
          <table className="w-full sm:w-full md:w-full lg:w-full xl:w-full text-left sm:text-left md:text-left lg:text-left xl:text-left border-collapse sm:border-collapse md:border-collapse lg:border-collapse xl:border-collapse min-w-[800px] sm:min-w-[800px] md:min-w-full lg:min-w-full xl:min-w-full">
            <thead>
              <tr className="bg-zinc-900 border-b border-zinc-800 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-zinc-400">
                <th className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 font-semibold sm:font-semibold md:font-semibold lg:font-semibold xl:font-semibold whitespace-nowrap sm:whitespace-nowrap md:whitespace-nowrap lg:whitespace-nowrap xl:whitespace-nowrap">QR Code</th>
                <th className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 font-semibold sm:font-semibold md:font-semibold lg:font-semibold xl:font-semibold whitespace-nowrap sm:whitespace-nowrap md:whitespace-nowrap lg:whitespace-nowrap xl:whitespace-nowrap">Short URL</th>
                <th className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 font-semibold sm:font-semibold md:font-semibold lg:font-semibold xl:font-semibold whitespace-nowrap sm:whitespace-nowrap md:whitespace-nowrap lg:whitespace-nowrap xl:whitespace-nowrap">Original URL</th>
                <th className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 font-semibold sm:font-semibold md:font-semibold lg:font-semibold xl:font-semibold text-center sm:text-center md:text-center lg:text-center xl:text-center whitespace-nowrap sm:whitespace-nowrap md:whitespace-nowrap lg:whitespace-nowrap xl:whitespace-nowrap">Clicks</th>
                <th className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 font-semibold sm:font-semibold md:font-semibold lg:font-semibold xl:font-semibold text-right sm:text-right md:text-right lg:text-right xl:text-right whitespace-nowrap sm:whitespace-nowrap md:whitespace-nowrap lg:whitespace-nowrap xl:whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y sm:divide-y md:divide-y lg:divide-y xl:divide-y divide-zinc-800 sm:divide-zinc-800 md:divide-zinc-800 lg:divide-zinc-800 xl:divide-zinc-800">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 text-center sm:text-center md:text-center lg:text-center xl:text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-zinc-500">
                    Memuat data...
                  </td>
                </tr>
              ) : urls.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-6 sm:p-8 md:p-10 lg:p-12 xl:p-16 text-center sm:text-center md:text-center lg:text-center xl:text-center text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-zinc-500">
                    Belum ada link yang dibuat.
                  </td>
                </tr>
              ) : (
                urls.map((u) => (
                  <tr key={u.id} className="hover:bg-zinc-800/30 sm:hover:bg-zinc-800/30 md:hover:bg-zinc-800/30 lg:hover:bg-zinc-800/30 xl:hover:bg-zinc-800/30 transition-colors sm:transition-colors md:transition-colors lg:transition-colors xl:transition-colors">
                    
                    <td className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 align-middle sm:align-middle md:align-middle lg:align-middle xl:align-middle w-[100px] sm:w-[120px] md:w-[150px] lg:w-[150px] xl:w-[150px]">
                      <div className="flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col items-center sm:items-center md:items-center lg:items-center xl:items-center gap-2 sm:gap-2 md:gap-3 lg:gap-3 xl:gap-4">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(`https://${siteConfig.domain}/${u.slug}`)}&color=ffffff&bgcolor=09090b`} 
                          alt="QR Code" 
                          className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 rounded sm:rounded md:rounded-md lg:rounded-md xl:rounded-lg"
                        />
                        <button 
                          onClick={() => downloadQR(u.slug)}
                          className="text-[10px] sm:text-xs md:text-sm lg:text-sm xl:text-base text-zinc-400 hover:text-white sm:hover:text-white md:hover:text-white lg:hover:text-white xl:hover:text-white bg-zinc-800 sm:bg-zinc-800 md:bg-zinc-800 lg:bg-zinc-800 xl:bg-zinc-800 px-2 sm:px-2 md:px-3 lg:px-3 xl:px-4 py-1 sm:py-1 md:py-1.5 lg:py-1.5 xl:py-2 rounded sm:rounded md:rounded lg:rounded xl:rounded whitespace-nowrap sm:whitespace-nowrap md:whitespace-nowrap lg:whitespace-nowrap xl:whitespace-nowrap"
                        >
                          Lihat QR
                        </button>
                      </div>
                    </td>

                    <td className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 align-middle sm:align-middle md:align-middle lg:align-middle xl:align-middle max-w-[150px] sm:max-w-[200px] md:max-w-[250px] lg:max-w-[300px] xl:max-w-[350px]">
                      <a href={`https://${siteConfig.domain}/${u.slug}`} target="_blank" rel="noreferrer" className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-blue-400 font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium hover:underline sm:hover:underline md:hover:underline lg:hover:underline xl:hover:underline truncate sm:truncate md:truncate lg:truncate xl:truncate block sm:block md:block lg:block xl:block">
                        {siteConfig.domain}/{u.slug}
                      </a>
                    </td>

                    <td className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 align-middle sm:align-middle md:align-middle lg:align-middle xl:align-middle max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[400px] xl:max-w-[500px]">
                      <div className="flex sm:flex md:flex lg:flex xl:flex items-center sm:items-center md:items-center lg:items-center xl:items-center gap-2 sm:gap-2 md:gap-3 lg:gap-3 xl:gap-3">
                        <img 
                          src={getFavicon(u.original_url) || "/favicon.ico"} 
                          alt="Icon" 
                          className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 xl:w-8 xl:h-8 rounded-sm sm:rounded-sm md:rounded-md lg:rounded-md xl:rounded-md bg-white sm:bg-white md:bg-white lg:bg-white xl:bg-white p-0.5 sm:p-0.5 md:p-0.5 lg:p-0.5 xl:p-0.5 shrink-0 sm:shrink-0 md:shrink-0 lg:shrink-0 xl:shrink-0"
                          onError={(e) => { e.currentTarget.style.display = 'none' }}
                        />
                        <div className="min-w-0 sm:min-w-0 md:min-w-0 lg:min-w-0 xl:min-w-0">
                          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-zinc-300 truncate sm:truncate md:truncate lg:truncate xl:truncate">
                            {u.original_url}
                          </p>
                          <p className="text-[10px] sm:text-xs md:text-sm lg:text-sm xl:text-base text-zinc-600 mt-1 sm:mt-1 md:mt-1 lg:mt-2 xl:mt-2">
                            {new Date(u.created_at).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 align-middle sm:align-middle md:align-middle lg:align-middle xl:align-middle text-center sm:text-center md:text-center lg:text-center xl:text-center">
                      <span className="inline-flex sm:inline-flex md:inline-flex lg:inline-flex xl:inline-flex items-center sm:items-center md:items-center lg:items-center xl:items-center justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 rounded-full sm:rounded-full md:rounded-full lg:rounded-full xl:rounded-full bg-indigo-500/10 text-indigo-400 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold">
                        {u.hitcount}
                      </span>
                    </td>

                    <td className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-8 align-middle sm:align-middle md:align-middle lg:align-middle xl:align-middle text-right sm:text-right md:text-right lg:text-right xl:text-right whitespace-nowrap sm:whitespace-nowrap md:whitespace-nowrap lg:whitespace-nowrap xl:whitespace-nowrap">
                      <div className="flex flex-row sm:flex-row md:flex-row lg:flex-row xl:flex-row justify-end sm:justify-end md:justify-end lg:justify-end xl:justify-end gap-2 sm:gap-2 md:gap-3 lg:gap-4 xl:gap-5">
                        <button 
                          onClick={() => handleCopy(u.slug, u.id)}
                          className="px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-3 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium rounded sm:rounded md:rounded-lg lg:rounded-lg xl:rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 sm:hover:bg-zinc-700 md:hover:bg-zinc-700 lg:hover:bg-zinc-700 xl:hover:bg-zinc-700 transition-colors sm:transition-colors md:transition-colors lg:transition-colors xl:transition-colors text-center sm:text-center md:text-center lg:text-center xl:text-center"
                        >
                          {copiedId === u.id ? "✅ Copied" : "Copy"}
                        </button>
                        
                        <button 
                          onClick={() => handleDelete(u.id)}
                          disabled={deletingId === u.id}
                          className="px-2 sm:px-3 md:px-4 lg:px-5 xl:px-6 py-1 sm:py-1.5 md:py-2 lg:py-2 xl:py-3 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium rounded sm:rounded md:rounded-lg lg:rounded-lg xl:rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white sm:hover:bg-rose-500 sm:hover:text-white md:hover:bg-rose-500 md:hover:text-white lg:hover:bg-rose-500 lg:hover:text-white xl:hover:bg-rose-500 xl:hover:text-white transition-colors sm:transition-colors md:transition-colors lg:transition-colors xl:transition-colors disabled:opacity-50 sm:disabled:opacity-50 md:disabled:opacity-50 lg:disabled:opacity-50 xl:disabled:opacity-50 text-center sm:text-center md:text-center lg:text-center xl:text-center"
                        >
                          {deletingId === u.id ? "Menghapus..." : "Delete"}
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 border-t border-zinc-800 flex flex-row sm:flex-row md:flex-row lg:flex-row xl:flex-row justify-between items-center sm:items-center md:items-center lg:items-center xl:items-center">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-2 sm:py-2.5 md:py-3 lg:py-4 xl:py-5 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl rounded sm:rounded md:rounded-lg lg:rounded-lg xl:rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 sm:hover:bg-zinc-700 md:hover:bg-zinc-700 lg:hover:bg-zinc-700 xl:hover:bg-zinc-700 disabled:opacity-30 sm:disabled:opacity-30 md:disabled:opacity-30 lg:disabled:opacity-30 xl:disabled:opacity-30 font-semibold sm:font-semibold md:font-semibold lg:font-semibold xl:font-semibold"
          >
            ← Prev
          </button>
          
          <span className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-zinc-500 font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium">
            Page {page}
          </span>
          
          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={page * limit >= totalLinks}
            className="px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-2 sm:py-2.5 md:py-3 lg:py-4 xl:py-5 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl rounded sm:rounded md:rounded-lg lg:rounded-lg xl:rounded-xl bg-zinc-800 text-zinc-300 hover:bg-zinc-700 sm:hover:bg-zinc-700 md:hover:bg-zinc-700 lg:hover:bg-zinc-700 xl:hover:bg-zinc-700 disabled:opacity-30 sm:disabled:opacity-30 md:disabled:opacity-30 lg:disabled:opacity-30 xl:disabled:opacity-30 font-semibold sm:font-semibold md:font-semibold lg:font-semibold xl:font-semibold"
          >
            Next →
          </button>
        </div>
      </div>

    </div>
  );
}

export default function ListPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen xl:min-h-screen bg-zinc-950 flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center items-center sm:items-center md:items-center lg:items-center xl:items-center p-4 sm:p-6 md:p-8 lg:p-12 xl:p-16">
        <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-zinc-500 animate-pulse sm:animate-pulse md:animate-pulse lg:animate-pulse xl:animate-pulse">Memuat data dashboard...</p>
      </div>
    }>
      <ListContent />
    </Suspense>
  );
}
