"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { siteConfig } from "@/config/site";

// --- KUMPULAN ICON SVG ---
const IconLink = () => <svg className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>;
const IconClick = () => <svg className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 xl:w-8 xl:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const IconTrash = () => <svg className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-5 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconQR = () => <svg className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" /></svg>;
const IconCopy = () => <svg className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const IconCheck = () => <svg className="w-4 h-4 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-5 lg:h-5 xl:w-5 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>;
const IconCalendar = () => <svg className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconMiniClick = () => <svg className="w-3 h-3 sm:w-3 sm:h-3 md:w-4 md:h-4 lg:w-4 lg:h-4 xl:w-4 xl:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;

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
  const limit = 6; // Dibuat genap biar rapih di grid

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

  const downloadQR = (slug: string) => {
    const fullUrl = `https://${siteConfig.domain}/${slug}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(fullUrl)}&color=ffffff&bgcolor=09090b`;
    window.open(qrUrl, "_blank");
  };

  const getDomainName = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url.substring(0, 20);
    }
  };

  const getFavicon = (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen xl:min-h-screen bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 text-white sm:text-white md:text-white lg:text-white xl:text-white p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      
      {/* HEADER & STATS */}
      <div className="max-w-7xl sm:max-w-7xl md:max-w-7xl lg:max-w-7xl xl:max-w-7xl mx-auto sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row justify-between sm:justify-between md:justify-between lg:justify-between xl:justify-between items-start sm:items-start md:items-center lg:items-center xl:items-center mb-8 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-14 gap-6 sm:gap-6 md:gap-0 lg:gap-0 xl:gap-0">
        
        <div>
          <h1 className="text-3xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold bg-gradient-to-r sm:bg-gradient-to-r md:bg-gradient-to-r lg:bg-gradient-to-r xl:bg-gradient-to-r from-blue-400 sm:from-blue-400 md:from-blue-400 lg:from-blue-400 xl:from-blue-400 to-indigo-500 sm:to-indigo-500 md:to-indigo-500 lg:to-indigo-500 xl:to-indigo-500 bg-clip-text sm:bg-clip-text md:bg-clip-text lg:bg-clip-text xl:bg-clip-text text-transparent sm:text-transparent md:text-transparent lg:text-transparent xl:text-transparent mb-2 sm:mb-2 md:mb-3 lg:mb-3 xl:mb-4">
            Dashboard Link
          </h1>
          <p className="text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl text-zinc-400 sm:text-zinc-400 md:text-zinc-400 lg:text-zinc-400 xl:text-zinc-400">
            Berikut adalah daftar tautan yang telah Anda buat.
          </p>
        </div>
        
        <div className="flex sm:flex md:flex lg:flex xl:flex flex-row sm:flex-row md:flex-row lg:flex-row xl:flex-row gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6 w-full sm:w-full md:w-auto lg:w-auto xl:w-auto">
          {/* STAT CARD 1 */}
          <div className="bg-zinc-900 sm:bg-zinc-900 md:bg-zinc-900 lg:bg-zinc-900 xl:bg-zinc-900 border sm:border md:border lg:border xl:border border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl p-4 sm:p-4 md:p-5 lg:p-6 xl:p-6 flex-1 sm:flex-1 md:flex-none lg:flex-none xl:flex-none flex sm:flex md:flex lg:flex xl:flex items-center sm:items-center md:items-center lg:items-center xl:items-center gap-3 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-5">
            <div className="p-2 sm:p-2 md:p-3 lg:p-3 xl:p-4 bg-blue-500/10 sm:bg-blue-500/10 md:bg-blue-500/10 lg:bg-blue-500/10 xl:bg-blue-500/10 rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-xl xl:rounded-xl text-blue-500 sm:text-blue-500 md:text-blue-500 lg:text-blue-500 xl:text-blue-500">
              <IconLink />
            </div>
            <div>
              <p className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base text-zinc-500 sm:text-zinc-500 md:text-zinc-500 lg:text-zinc-500 xl:text-zinc-500 font-semibold sm:font-semibold md:font-semibold lg:font-semibold xl:font-semibold uppercase sm:uppercase md:uppercase lg:uppercase xl:uppercase tracking-wider sm:tracking-wider md:tracking-wider lg:tracking-wider xl:tracking-wider">Total Link</p>
              <p className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-black sm:font-black md:font-black lg:font-black xl:font-black text-white sm:text-white md:text-white lg:text-white xl:text-white">{totalLinks}</p>
            </div>
          </div>
          
          {/* STAT CARD 2 */}
          <div className="bg-zinc-900 sm:bg-zinc-900 md:bg-zinc-900 lg:bg-zinc-900 xl:bg-zinc-900 border sm:border md:border lg:border xl:border border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl p-4 sm:p-4 md:p-5 lg:p-6 xl:p-6 flex-1 sm:flex-1 md:flex-none lg:flex-none xl:flex-none flex sm:flex md:flex lg:flex xl:flex items-center sm:items-center md:items-center lg:items-center xl:items-center gap-3 sm:gap-3 md:gap-4 lg:gap-4 xl:gap-5">
            <div className="p-2 sm:p-2 md:p-3 lg:p-3 xl:p-4 bg-rose-500/10 sm:bg-rose-500/10 md:bg-rose-500/10 lg:bg-rose-500/10 xl:bg-rose-500/10 rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-xl xl:rounded-xl text-rose-500 sm:text-rose-500 md:text-rose-500 lg:text-rose-500 xl:text-rose-500">
              <IconClick />
            </div>
            <div>
              <p className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base text-zinc-500 sm:text-zinc-500 md:text-zinc-500 lg:text-zinc-500 xl:text-zinc-500 font-semibold sm:font-semibold md:font-semibold lg:font-semibold xl:font-semibold uppercase sm:uppercase md:uppercase lg:uppercase xl:uppercase tracking-wider sm:tracking-wider md:tracking-wider lg:tracking-wider xl:tracking-wider">Total Klik</p>
              <p className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-black sm:font-black md:font-black lg:font-black xl:font-black text-rose-500 sm:text-rose-500 md:text-rose-500 lg:text-rose-500 xl:text-rose-500">{totalClicks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* GRID KARTU */}
      <div className="max-w-7xl sm:max-w-7xl md:max-w-7xl lg:max-w-7xl xl:max-w-7xl mx-auto sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto">
        {loading ? (
          <div className="text-center sm:text-center md:text-center lg:text-center xl:text-center py-10 sm:py-10 md:py-16 lg:py-20 xl:py-24 text-zinc-500 sm:text-zinc-500 md:text-zinc-500 lg:text-zinc-500 xl:text-zinc-500 text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl animate-pulse sm:animate-pulse md:animate-pulse lg:animate-pulse xl:animate-pulse">
            Memuat daftar link...
          </div>
        ) : urls.length === 0 ? (
          <div className="text-center sm:text-center md:text-center lg:text-center xl:text-center py-10 sm:py-10 md:py-16 lg:py-20 xl:py-24 text-zinc-500 sm:text-zinc-500 md:text-zinc-500 lg:text-zinc-500 xl:text-zinc-500 text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl border sm:border md:border lg:border xl:border border-dashed sm:border-dashed md:border-dashed lg:border-dashed xl:border-dashed border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 rounded-2xl sm:rounded-2xl md:rounded-3xl lg:rounded-3xl xl:rounded-3xl">
            Belum ada link yang dibuat.
          </div>
        ) : (
          <div className="grid sm:grid md:grid lg:grid xl:grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-6 xl:gap-8">
            {urls.map((u) => (
              <div key={u.id} className="relative sm:relative md:relative lg:relative xl:relative bg-zinc-900 sm:bg-zinc-900 md:bg-zinc-900 lg:bg-zinc-900 xl:bg-zinc-900 border sm:border md:border lg:border xl:border border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl p-4 sm:p-5 md:p-6 lg:p-6 xl:p-8 flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col justify-between sm:justify-between md:justify-between lg:justify-between xl:justify-between hover:border-zinc-700 sm:hover:border-zinc-700 md:hover:border-zinc-700 lg:hover:border-zinc-700 xl:hover:border-zinc-700 transition-colors sm:transition-colors md:transition-colors lg:transition-colors xl:transition-colors group sm:group md:group lg:group xl:group">
                
                {/* Tombol Delete di Pojok Kanan Atas */}
                <button 
                  onClick={() => handleDelete(u.id)}
                  disabled={deletingId === u.id}
                  className="absolute sm:absolute md:absolute lg:absolute xl:absolute top-4 sm:top-4 md:top-5 lg:top-5 xl:top-6 right-4 sm:right-4 md:right-5 lg:right-5 xl:right-6 text-zinc-500 sm:text-zinc-500 md:text-zinc-500 lg:text-zinc-500 xl:text-zinc-500 hover:text-rose-500 sm:hover:text-rose-500 md:hover:text-rose-500 lg:hover:text-rose-500 xl:hover:text-rose-500 bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 p-2 sm:p-2 md:p-2 lg:p-2 xl:p-2.5 rounded-md sm:rounded-md md:rounded-lg lg:rounded-lg xl:rounded-lg disabled:opacity-50 sm:disabled:opacity-50 md:disabled:opacity-50 lg:disabled:opacity-50 xl:disabled:opacity-50 transition-colors sm:transition-colors md:transition-colors lg:transition-colors xl:transition-colors"
                  title="Hapus Link"
                >
                  <IconTrash />
                </button>

                <div>
                  {/* Judul & Favicon */}
                  <div className="flex sm:flex md:flex lg:flex xl:flex items-center sm:items-center md:items-center lg:items-center xl:items-center gap-2 sm:gap-2 md:gap-3 lg:gap-3 xl:gap-3 mb-2 sm:mb-2 md:mb-3 lg:mb-3 xl:mb-4 pr-10 sm:pr-10 md:pr-12 lg:pr-12 xl:pr-14">
                    <img 
                      src={getFavicon(u.original_url) || "/favicon.ico"} 
                      alt="Icon" 
                      className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 lg:w-6 lg:h-6 xl:w-7 xl:h-7 rounded-sm sm:rounded-sm md:rounded-sm lg:rounded-md xl:rounded-md bg-white sm:bg-white md:bg-white lg:bg-white xl:bg-white p-0.5 sm:p-0.5 md:p-0.5 lg:p-0.5 xl:p-0.5 shrink-0 sm:shrink-0 md:shrink-0 lg:shrink-0 xl:shrink-0"
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                    <h2 className="text-base sm:text-base md:text-lg lg:text-xl xl:text-xl font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold text-zinc-100 sm:text-zinc-100 md:text-zinc-100 lg:text-zinc-100 xl:text-zinc-100 truncate sm:truncate md:truncate lg:truncate xl:truncate">
                      {getDomainName(u.original_url)}
                    </h2>
                  </div>

                  {/* Original URL (Truncate) */}
                  <p className="text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base text-zinc-400 sm:text-zinc-400 md:text-zinc-400 lg:text-zinc-400 xl:text-zinc-400 truncate sm:truncate md:truncate lg:truncate xl:truncate mb-4 sm:mb-4 md:mb-5 lg:mb-5 xl:mb-6">
                    {u.original_url}
                  </p>

                  {/* Short URL (Warna Biru Khas Link) */}
                  <a href={`https://${siteConfig.domain}/${u.slug}`} target="_blank" rel="noreferrer" className="inline-block sm:inline-block md:inline-block lg:inline-block xl:inline-block text-sm sm:text-sm md:text-base lg:text-lg xl:text-lg font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium text-blue-400 sm:text-blue-400 md:text-blue-400 lg:text-blue-400 xl:text-blue-400 hover:text-blue-300 sm:hover:text-blue-300 md:hover:text-blue-300 lg:hover:text-blue-300 xl:hover:text-blue-300 mb-6 sm:mb-6 md:mb-8 lg:mb-8 xl:mb-8 truncate sm:truncate md:truncate lg:truncate xl:truncate max-w-full sm:max-w-full md:max-w-full lg:max-w-full xl:max-w-full bg-blue-500/10 sm:bg-blue-500/10 md:bg-blue-500/10 lg:bg-blue-500/10 xl:bg-blue-500/10 px-3 sm:px-3 md:px-4 lg:px-4 xl:px-4 py-1.5 sm:py-1.5 md:py-2 lg:py-2 xl:py-2 rounded-md sm:rounded-md md:rounded-md lg:rounded-lg xl:rounded-lg">
                    {siteConfig.domain}/{u.slug}
                  </a>
                </div>

                <div>
                  {/* Info Row: Date & Hitcount */}
                  <div className="flex sm:flex md:flex lg:flex xl:flex items-center sm:items-center md:items-center lg:items-center xl:items-center justify-between sm:justify-between md:justify-between lg:justify-between xl:justify-between text-[11px] sm:text-[11px] md:text-xs lg:text-sm xl:text-sm text-zinc-500 sm:text-zinc-500 md:text-zinc-500 lg:text-zinc-500 xl:text-zinc-500 mb-4 sm:mb-4 md:mb-5 lg:mb-5 xl:mb-6 px-1 sm:px-1 md:px-1 lg:px-1 xl:px-1">
                    <div className="flex sm:flex md:flex lg:flex xl:flex items-center sm:items-center md:items-center lg:items-center xl:items-center gap-1.5 sm:gap-1.5 md:gap-2 lg:gap-2 xl:gap-2">
                      <IconCalendar />
                      <span>{new Date(u.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                    <div className="flex sm:flex md:flex lg:flex xl:flex items-center sm:items-center md:items-center lg:items-center xl:items-center gap-1.5 sm:gap-1.5 md:gap-2 lg:gap-2 xl:gap-2 font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium text-zinc-400 sm:text-zinc-400 md:text-zinc-400 lg:text-zinc-400 xl:text-zinc-400">
                      <IconMiniClick />
                      <span>{u.hitcount} Clicks</span>
                    </div>
                  </div>

                  {/* Action Buttons (Show QR & Copy) */}
                  <div className="flex sm:flex md:flex lg:flex xl:flex gap-2 sm:gap-3 md:gap-3 lg:gap-4 xl:gap-4 border-t sm:border-t md:border-t lg:border-t xl:border-t border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 pt-4 sm:pt-4 md:pt-5 lg:pt-5 xl:pt-6">
                    <button 
                      onClick={() => downloadQR(u.slug)}
                      className="flex-1 sm:flex-1 md:flex-1 lg:flex-1 xl:flex-1 flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center items-center sm:items-center md:items-center lg:items-center xl:items-center gap-2 sm:gap-2 md:gap-2 lg:gap-2 xl:gap-3 bg-zinc-800 sm:bg-zinc-800 md:bg-zinc-800 lg:bg-zinc-800 xl:bg-zinc-800 hover:bg-zinc-700 sm:hover:bg-zinc-700 md:hover:bg-zinc-700 lg:hover:bg-zinc-700 xl:hover:bg-zinc-700 text-zinc-300 sm:text-zinc-300 md:text-zinc-300 lg:text-zinc-300 xl:text-zinc-300 text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium py-2 sm:py-2 md:py-2.5 lg:py-2.5 xl:py-3 rounded-md sm:rounded-md md:rounded-lg lg:rounded-lg xl:rounded-lg transition-colors sm:transition-colors md:transition-colors lg:transition-colors xl:transition-colors"
                    >
                      <IconQR />
                      Show QR
                    </button>
                    <button 
                      onClick={() => handleCopy(u.slug, u.id)}
                      className="flex-1 sm:flex-1 md:flex-1 lg:flex-1 xl:flex-1 flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center items-center sm:items-center md:items-center lg:items-center xl:items-center gap-2 sm:gap-2 md:gap-2 lg:gap-2 xl:gap-3 bg-zinc-800 sm:bg-zinc-800 md:bg-zinc-800 lg:bg-zinc-800 xl:bg-zinc-800 hover:bg-zinc-700 sm:hover:bg-zinc-700 md:hover:bg-zinc-700 lg:hover:bg-zinc-700 xl:hover:bg-zinc-700 text-zinc-300 sm:text-zinc-300 md:text-zinc-300 lg:text-zinc-300 xl:text-zinc-300 text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium py-2 sm:py-2 md:py-2.5 lg:py-2.5 xl:py-3 rounded-md sm:rounded-md md:rounded-lg lg:rounded-lg xl:rounded-lg transition-colors sm:transition-colors md:transition-colors lg:transition-colors xl:transition-colors"
                    >
                      {copiedId === u.id ? <IconCheck /> : <IconCopy />}
                      {copiedId === u.id ? "Copied!" : "Copy URL"}
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* PAGINATION */}
        <div className="mt-8 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-14 flex sm:flex md:flex lg:flex xl:flex flex-row sm:flex-row md:flex-row lg:flex-row xl:flex-row justify-between sm:justify-between md:justify-between lg:justify-between xl:justify-between items-center sm:items-center md:items-center lg:items-center xl:items-center max-w-sm sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl mx-auto sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto bg-zinc-900 sm:bg-zinc-900 md:bg-zinc-900 lg:bg-zinc-900 xl:bg-zinc-900 p-2 sm:p-2 md:p-3 lg:p-3 xl:p-4 rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-3xl border sm:border md:border lg:border xl:border border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800">
          <button 
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 sm:px-4 md:px-5 lg:px-6 xl:px-8 py-2 sm:py-2 md:py-2.5 lg:py-3 xl:py-3.5 text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-xl xl:rounded-xl bg-zinc-800 sm:bg-zinc-800 md:bg-zinc-800 lg:bg-zinc-800 xl:bg-zinc-800 text-zinc-300 sm:text-zinc-300 md:text-zinc-300 lg:text-zinc-300 xl:text-zinc-300 hover:bg-zinc-700 sm:hover:bg-zinc-700 md:hover:bg-zinc-700 lg:hover:bg-zinc-700 xl:hover:bg-zinc-700 disabled:opacity-30 sm:disabled:opacity-30 md:disabled:opacity-30 lg:disabled:opacity-30 xl:disabled:opacity-30 font-semibold sm:font-semibold md:font-semibold lg:font-semibold xl:font-semibold transition-all sm:transition-all md:transition-all lg:transition-all xl:transition-all"
          >
            ← Prev
          </button>
          
          <span className="text-xs sm:text-xs md:text-sm lg:text-base xl:text-lg text-zinc-400 sm:text-zinc-400 md:text-zinc-400 lg:text-zinc-400 xl:text-zinc-400 font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium">
            Page {page}
          </span>
          
          <button 
            onClick={() => setPage(p => p + 1)}
            disabled={page * limit >= totalLinks}
            className="px-4 sm:px-4 md:px-5 lg:px-6 xl:px-8 py-2 sm:py-2 md:py-2.5 lg:py-3 xl:py-3.5 text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-xl xl:rounded-xl bg-zinc-800 sm:bg-zinc-800 md:bg-zinc-800 lg:bg-zinc-800 xl:bg-zinc-800 text-zinc-300 sm:text-zinc-300 md:text-zinc-300 lg:text-zinc-300 xl:text-zinc-300 hover:bg-zinc-700 sm:hover:bg-zinc-700 md:hover:bg-zinc-700 lg:hover:bg-zinc-700 xl:hover:bg-zinc-700 disabled:opacity-30 sm:disabled:opacity-30 md:disabled:opacity-30 lg:disabled:opacity-30 xl:disabled:opacity-30 font-semibold sm:font-semibold md:font-semibold lg:font-semibold xl:font-semibold transition-all sm:transition-all md:transition-all lg:transition-all xl:transition-all"
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
      <div className="min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen xl:min-h-screen bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center items-center sm:items-center md:items-center lg:items-center xl:items-center">
        <p className="text-zinc-500 sm:text-zinc-500 md:text-zinc-500 lg:text-zinc-500 xl:text-zinc-500 text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl animate-pulse sm:animate-pulse md:animate-pulse lg:animate-pulse xl:animate-pulse">Loading dashboard...</p>
      </div>
    }>
      <ListContent />
    </Suspense>
  );
}
