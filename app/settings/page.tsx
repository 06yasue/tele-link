"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Kumpulan Icon
const IconSave = () => <svg className="w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-5 lg:h-5 xl:w-5 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>;
const IconSettings = () => <svg className="w-6 h-6 sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 xl:w-10 xl:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

function SettingsContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    ads_head: "",
    ads_body: "",
    ads_native: "",
    ads_footer: "",
    ads_mobile: "",
    ads_desktop: "",
    offer_link: "",
    captcha_key_1: "",
    captcha_key_2: "",
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          setFormData({
            ads_head: data.ads_head || "",
            ads_body: data.ads_body || "",
            ads_native: data.ads_native || "",
            ads_footer: data.ads_footer || "",
            ads_mobile: data.ads_mobile || "",
            ads_desktop: data.ads_desktop || "",
            offer_link: data.offer_link || "",
            captcha_key_1: data.captcha_key_1 || "",
            captcha_key_2: data.captcha_key_2 || "",
          });
        }
      }
    } catch (error) {
      console.error("Gagal load setting:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setMessage("✅ Settings berhasil disimpan!");
        setTimeout(() => setMessage(""), 3000);
      } else {
        setMessage("❌ Gagal menyimpan.");
      }
    } catch (error) {
      setMessage("❌ Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen xl:min-h-screen bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center items-center sm:items-center md:items-center lg:items-center xl:items-center">
        <p className="text-zinc-500 sm:text-zinc-500 md:text-zinc-500 lg:text-zinc-500 xl:text-zinc-500 text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl animate-pulse sm:animate-pulse md:animate-pulse lg:animate-pulse xl:animate-pulse">Memuat konfigurasi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen xl:min-h-screen bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 text-white sm:text-white md:text-white lg:text-white xl:text-white p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 pb-24 sm:pb-24 md:pb-24 lg:pb-24 xl:pb-24">
      
      <div className="max-w-4xl sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl mx-auto sm:mx-auto md:mx-auto lg:mx-auto xl:mx-auto">
        
        {/* HEADER */}
        <div className="flex sm:flex md:flex lg:flex xl:flex items-center sm:items-center md:items-center lg:items-center xl:items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6 mb-8 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-14 border-b sm:border-b md:border-b lg:border-b xl:border-b border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 pb-6 sm:pb-6 md:pb-8 lg:pb-8 xl:pb-10">
          <div className="p-3 sm:p-3 md:p-4 lg:p-5 xl:p-5 bg-indigo-500/10 sm:bg-indigo-500/10 md:bg-indigo-500/10 lg:bg-indigo-500/10 xl:bg-indigo-500/10 rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl text-indigo-500 sm:text-indigo-500 md:text-indigo-500 lg:text-indigo-500 xl:text-indigo-500">
            <IconSettings />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold bg-gradient-to-r sm:bg-gradient-to-r md:bg-gradient-to-r lg:bg-gradient-to-r xl:bg-gradient-to-r from-blue-400 sm:from-blue-400 md:from-blue-400 lg:from-blue-400 xl:from-blue-400 to-indigo-500 sm:to-indigo-500 md:to-indigo-500 lg:to-indigo-500 xl:to-indigo-500 bg-clip-text sm:bg-clip-text md:bg-clip-text lg:bg-clip-text xl:bg-clip-text text-transparent sm:text-transparent md:text-transparent lg:text-transparent xl:text-transparent mb-1 sm:mb-1 md:mb-2 lg:mb-2 xl:mb-2">
              Pengaturan Ads & Sistem
            </h1>
            <p className="text-sm sm:text-sm md:text-base lg:text-lg xl:text-xl text-zinc-400 sm:text-zinc-400 md:text-zinc-400 lg:text-zinc-400 xl:text-zinc-400">
              {user ? `Halo Admin (${user}), atur konfigurasi sistem di sini.` : "Atur konfigurasi sistem di sini."}
            </p>
          </div>
        </div>

        {/* KONTEN SETTING */}
        <div className="space-y-6 sm:space-y-6 md:space-y-8 lg:space-y-10 xl:space-y-10">
          
          {/* SECTION: OFFER & CAPTCHA */}
          <div className="bg-zinc-900 sm:bg-zinc-900 md:bg-zinc-900 lg:bg-zinc-900 xl:bg-zinc-900 border sm:border md:border lg:border xl:border border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl p-5 sm:p-5 md:p-6 lg:p-8 xl:p-10">
            <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold text-zinc-200 sm:text-zinc-200 md:text-zinc-200 lg:text-zinc-200 xl:text-zinc-200 mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-8">Tautan & Keamanan</h2>
            
            <div className="space-y-4 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-6">
              <div>
                <label className="block sm:block md:block lg:block xl:block text-xs sm:text-xs md:text-sm lg:text-base xl:text-base text-zinc-400 sm:text-zinc-400 md:text-zinc-400 lg:text-zinc-400 xl:text-zinc-400 font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium mb-1 sm:mb-1 md:mb-2 lg:mb-2 xl:mb-2">Link Offer</label>
                <input 
                  type="text" 
                  name="offer_link"
                  value={formData.offer_link}
                  onChange={handleChange}
                  placeholder="https://example-offer.com"
                  className="w-full sm:w-full md:w-full lg:w-full xl:w-full bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 border sm:border md:border lg:border xl:border border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 rounded-lg sm:rounded-lg md:rounded-lg lg:rounded-xl xl:rounded-xl px-3 sm:px-3 md:px-4 lg:px-5 xl:px-5 py-2 sm:py-2 md:py-3 lg:py-3 xl:py-4 text-sm sm:text-sm md:text-base lg:text-base xl:text-lg focus:outline-none sm:focus:outline-none md:focus:outline-none lg:focus:outline-none xl:focus:outline-none focus:border-indigo-500 sm:focus:border-indigo-500 md:focus:border-indigo-500 lg:focus:border-indigo-500 xl:focus:border-indigo-500 focus:ring-1 sm:focus:ring-1 md:focus:ring-1 lg:focus:ring-1 xl:focus:ring-1 focus:ring-indigo-500 sm:focus:ring-indigo-500 md:focus:ring-indigo-500 lg:focus:ring-indigo-500 xl:focus:ring-indigo-500 transition-colors sm:transition-colors md:transition-colors lg:transition-colors xl:transition-colors"
                />
              </div>
              
              <div className="grid sm:grid md:grid lg:grid xl:grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-6">
                <div>
                  <label className="block sm:block md:block lg:block xl:block text-xs sm:text-xs md:text-sm lg:text-base xl:text-base text-zinc-400 sm:text-zinc-400 md:text-zinc-400 lg:text-zinc-400 xl:text-zinc-400 font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium mb-1 sm:mb-1 md:mb-2 lg:mb-2 xl:mb-2">Captcha Secret Key 1</label>
                  <input 
                    type="text" 
                    name="captcha_key_1"
                    value={formData.captcha_key_1}
                    onChange={handleChange}
                    placeholder="Secret Key Primary"
                    className="w-full sm:w-full md:w-full lg:w-full xl:w-full bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 border sm:border md:border lg:border xl:border border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 rounded-lg sm:rounded-lg md:rounded-lg lg:rounded-xl xl:rounded-xl px-3 sm:px-3 md:px-4 lg:px-5 xl:px-5 py-2 sm:py-2 md:py-3 lg:py-3 xl:py-4 text-sm sm:text-sm md:text-base lg:text-base xl:text-lg focus:outline-none sm:focus:outline-none md:focus:outline-none lg:focus:outline-none xl:focus:outline-none focus:border-indigo-500 sm:focus:border-indigo-500 md:focus:border-indigo-500 lg:focus:border-indigo-500 xl:focus:border-indigo-500 focus:ring-1 sm:focus:ring-1 md:focus:ring-1 lg:focus:ring-1 xl:focus:ring-1 focus:ring-indigo-500 sm:focus:ring-indigo-500 md:focus:ring-indigo-500 lg:focus:ring-indigo-500 xl:focus:ring-indigo-500 transition-colors sm:transition-colors md:transition-colors lg:transition-colors xl:transition-colors"
                  />
                </div>
                <div>
                  <label className="block sm:block md:block lg:block xl:block text-xs sm:text-xs md:text-sm lg:text-base xl:text-base text-zinc-400 sm:text-zinc-400 md:text-zinc-400 lg:text-zinc-400 xl:text-zinc-400 font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium mb-1 sm:mb-1 md:mb-2 lg:mb-2 xl:mb-2">Captcha Secret Key 2</label>
                  <input 
                    type="text" 
                    name="captcha_key_2"
                    value={formData.captcha_key_2}
                    onChange={handleChange}
                    placeholder="Secret Key Secondary"
                    className="w-full sm:w-full md:w-full lg:w-full xl:w-full bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 border sm:border md:border lg:border xl:border border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 rounded-lg sm:rounded-lg md:rounded-lg lg:rounded-xl xl:rounded-xl px-3 sm:px-3 md:px-4 lg:px-5 xl:px-5 py-2 sm:py-2 md:py-3 lg:py-3 xl:py-4 text-sm sm:text-sm md:text-base lg:text-base xl:text-lg focus:outline-none sm:focus:outline-none md:focus:outline-none lg:focus:outline-none xl:focus:outline-none focus:border-indigo-500 sm:focus:border-indigo-500 md:focus:border-indigo-500 lg:focus:border-indigo-500 xl:focus:border-indigo-500 focus:ring-1 sm:focus:ring-1 md:focus:ring-1 lg:focus:ring-1 xl:focus:ring-1 focus:ring-indigo-500 sm:focus:ring-indigo-500 md:focus:ring-indigo-500 lg:focus:ring-indigo-500 xl:focus:ring-indigo-500 transition-colors sm:transition-colors md:transition-colors lg:transition-colors xl:transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION: KODE IKLAN */}
          <div className="bg-zinc-900 sm:bg-zinc-900 md:bg-zinc-900 lg:bg-zinc-900 xl:bg-zinc-900 border sm:border md:border lg:border xl:border border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl xl:rounded-2xl p-5 sm:p-5 md:p-6 lg:p-8 xl:p-10">
            <h2 className="text-lg sm:text-lg md:text-xl lg:text-2xl xl:text-2xl font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold text-zinc-200 sm:text-zinc-200 md:text-zinc-200 lg:text-zinc-200 xl:text-zinc-200 mb-4 sm:mb-5 md:mb-6 lg:mb-6 xl:mb-8">Penempatan Kode Iklan</h2>
            
            <div className="grid sm:grid md:grid lg:grid xl:grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8">
              
              {/* Textarea Masing-masing Ads */}
              {[
                { name: "ads_head", label: "Ads Head (Tag <head>)" },
                { name: "ads_body", label: "Ads Body" },
                { name: "ads_native", label: "Ads Native Banner" },
                { name: "ads_footer", label: "Ads Footer" },
                { name: "ads_mobile", label: "Ads Khusus Ponsel" },
                { name: "ads_desktop", label: "Ads Khusus Desktop" }
              ].map((ad, idx) => (
                <div key={idx} className="flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-col lg:flex-col xl:flex-col">
                  <label className="text-xs sm:text-xs md:text-sm lg:text-base xl:text-base text-zinc-400 sm:text-zinc-400 md:text-zinc-400 lg:text-zinc-400 xl:text-zinc-400 font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium mb-1 sm:mb-1 md:mb-2 lg:mb-2 xl:mb-2">{ad.label}</label>
                  <textarea 
                    name={ad.name}
                    value={(formData as any)[ad.name]}
                    onChange={handleChange}
                    placeholder={``}
                    className="w-full sm:w-full md:w-full lg:w-full xl:w-full h-32 sm:h-32 md:h-36 lg:h-40 xl:h-48 bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 border sm:border md:border lg:border xl:border border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 rounded-lg sm:rounded-lg md:rounded-lg lg:rounded-xl xl:rounded-xl px-3 sm:px-3 md:px-4 lg:px-5 xl:px-5 py-2 sm:py-2 md:py-3 lg:py-3 xl:py-4 text-xs sm:text-xs md:text-sm lg:text-sm xl:text-base font-mono sm:font-mono md:font-mono lg:font-mono xl:font-mono text-zinc-300 sm:text-zinc-300 md:text-zinc-300 lg:text-zinc-300 xl:text-zinc-300 focus:outline-none sm:focus:outline-none md:focus:outline-none lg:focus:outline-none xl:focus:outline-none focus:border-indigo-500 sm:focus:border-indigo-500 md:focus:border-indigo-500 lg:focus:border-indigo-500 xl:focus:border-indigo-500 focus:ring-1 sm:focus:ring-1 md:focus:ring-1 lg:focus:ring-1 xl:focus:ring-1 focus:ring-indigo-500 sm:focus:ring-indigo-500 md:focus:ring-indigo-500 lg:focus:ring-indigo-500 xl:focus:ring-indigo-500 transition-colors sm:transition-colors md:transition-colors lg:transition-colors xl:transition-colors resize-y sm:resize-y md:resize-y lg:resize-y xl:resize-y"
                  ></textarea>
                </div>
              ))}

            </div>
          </div>
        </div>

      </div>

      {/* FLOATING SAVE BUTTON */}
      <div className="fixed sm:fixed md:fixed lg:fixed xl:fixed bottom-0 sm:bottom-0 md:bottom-0 lg:bottom-0 xl:bottom-0 left-0 sm:left-0 md:left-0 lg:left-0 xl:left-0 right-0 sm:right-0 md:right-0 lg:right-0 xl:right-0 p-4 sm:p-5 md:p-6 lg:p-8 xl:p-10 bg-zinc-950/80 sm:bg-zinc-950/80 md:bg-zinc-950/80 lg:bg-zinc-950/80 xl:bg-zinc-950/80 backdrop-blur-md sm:backdrop-blur-md md:backdrop-blur-md lg:backdrop-blur-md xl:backdrop-blur-md border-t sm:border-t md:border-t lg:border-t xl:border-t border-zinc-800 sm:border-zinc-800 md:border-zinc-800 lg:border-zinc-800 xl:border-zinc-800 flex sm:flex md:flex lg:flex xl:flex flex-col sm:flex-col md:flex-row lg:flex-row xl:flex-row justify-center sm:justify-center md:justify-end lg:justify-end xl:justify-end items-center sm:items-center md:items-center lg:items-center xl:items-center gap-4 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 z-50 sm:z-50 md:z-50 lg:z-50 xl:z-50">
        
        {message && (
          <span className={`text-sm sm:text-sm md:text-base lg:text-base xl:text-lg font-medium sm:font-medium md:font-medium lg:font-medium xl:font-medium ${message.includes("✅") ? "text-emerald-400" : "text-rose-400"}`}>
            {message}
          </span>
        )}

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-full md:w-auto lg:w-auto xl:w-auto flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center items-center sm:items-center md:items-center lg:items-center xl:items-center gap-2 sm:gap-2 md:gap-3 lg:gap-3 xl:gap-3 px-6 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-3 sm:py-3 md:py-3.5 lg:py-4 xl:py-4 bg-indigo-600 sm:bg-indigo-600 md:bg-indigo-600 lg:bg-indigo-600 xl:bg-indigo-600 hover:bg-indigo-500 sm:hover:bg-indigo-500 md:hover:bg-indigo-500 lg:hover:bg-indigo-500 xl:hover:bg-indigo-500 text-white sm:text-white md:text-white lg:text-white xl:text-white text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl font-bold sm:font-bold md:font-bold lg:font-bold xl:font-bold rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-xl xl:rounded-xl shadow-lg sm:shadow-lg md:shadow-lg lg:shadow-lg xl:shadow-lg disabled:opacity-50 sm:disabled:opacity-50 md:disabled:opacity-50 lg:disabled:opacity-50 xl:disabled:opacity-50 transition-all sm:transition-all md:transition-all lg:transition-all xl:transition-all"
        >
          {saving ? (
            "Menyimpan..."
          ) : (
            <>
              <IconSave /> Simpan Pengaturan
            </>
          )}
        </button>
      </div>

    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen sm:min-h-screen md:min-h-screen lg:min-h-screen xl:min-h-screen bg-zinc-950 sm:bg-zinc-950 md:bg-zinc-950 lg:bg-zinc-950 xl:bg-zinc-950 flex sm:flex md:flex lg:flex xl:flex justify-center sm:justify-center md:justify-center lg:justify-center xl:justify-center items-center sm:items-center md:items-center lg:items-center xl:items-center">
        <p className="text-zinc-500 sm:text-zinc-500 md:text-zinc-500 lg:text-zinc-500 xl:text-zinc-500 animate-pulse sm:animate-pulse md:animate-pulse lg:animate-pulse xl:animate-pulse">Loading settings...</p>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
