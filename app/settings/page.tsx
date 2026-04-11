"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const IconSave = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>;
const IconSettings = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;

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
        setMessage("✅ Settings berhasil ditimpa & disimpan!");
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
      <div className="min-h-screen bg-[#121212] flex justify-center items-center">
        <p className="text-zinc-500 text-lg animate-pulse">Memuat konfigurasi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 sm:p-6 md:p-10 pb-32 font-sans">
      
      <div className="w-full max-w-4xl mx-auto">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-10 border-b-2 border-[#27272a] pb-6">
          <div className="p-3 bg-indigo-500 text-white rounded-xl shadow-[4px_4px_0_0_#3730a3] border-2 border-[#3730a3]">
            <IconSettings />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              System Settings
            </h1>
            <p className="text-sm md:text-base text-zinc-400 mt-1 font-medium">
              {user ? `Admin Access (${user})` : "Manage your global configurations."}
            </p>
          </div>
        </div>

        <div className="space-y-10">
          
          {/* BOX 3D: TAUTAN OFFER */}
          <div className="bg-[#1e1e20] border-2 border-[#3f3f46] rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#3f3f46]">
            <h2 className="text-xl font-bold text-white mb-6">Offer Link Configuration</h2>
            
            <div>
              <label className="block text-sm text-zinc-300 font-bold mb-2 uppercase tracking-wide">Main Offer Link</label>
              <input 
                type="text" 
                name="offer_link"
                value={formData.offer_link}
                onChange={handleChange}
                placeholder="https://example-offer.com"
                className="w-full bg-[#121212] border-2 border-[#3f3f46] rounded-xl px-4 py-4 text-base font-medium text-white focus:outline-none focus:border-indigo-500 focus:shadow-[4px_4px_0_0_#4f46e5] transition-all"
              />
            </div>
          </div>

          {/* BOX 3D: KODE IKLAN */}
          <div className="bg-[#1e1e20] border-2 border-[#3f3f46] rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#3f3f46]">
            <h2 className="text-xl font-bold text-white mb-6">Ads Placements</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { name: "ads_head", label: "Ads Head (<head>)" },
                { name: "ads_body", label: "Ads Body (Top)" },
                { name: "ads_native", label: "Ads Native (Center)" },
                { name: "ads_footer", label: "Ads Footer (Bottom)" },
                { name: "ads_mobile", label: "Ads Mobile Only" },
                { name: "ads_desktop", label: "Ads Desktop Only" }
              ].map((ad, idx) => (
                <div key={idx} className="flex flex-col">
                  <label className="block text-sm text-zinc-300 font-bold mb-2 uppercase tracking-wide">{ad.label}</label>
                  <textarea 
                    name={ad.name}
                    value={(formData as any)[ad.name]}
                    onChange={handleChange}
                    placeholder={``}
                    className="w-full h-40 bg-[#121212] border-2 border-[#3f3f46] rounded-xl px-4 py-4 text-sm font-mono text-zinc-300 focus:outline-none focus:border-emerald-500 focus:shadow-[4px_4px_0_0_#10b981] transition-all resize-y"
                  ></textarea>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* FLOATING SAVE BUTTON (3D Neo-Brutalism) */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#121212]/90 backdrop-blur-md border-t-2 border-[#27272a] flex justify-center md:justify-end items-center gap-6 z-50">
        
        {message && (
          <span className={`text-base font-bold ${message.includes("✅") ? "text-emerald-400" : "text-rose-400"}`}>
            {message}
          </span>
        )}

        <button 
          onClick={handleSave}
          disabled={saving}
          className="w-full md:w-auto flex justify-center items-center gap-3 px-10 py-4 bg-indigo-600 border-2 border-[#3730a3] hover:bg-indigo-500 text-white text-lg font-black rounded-xl uppercase tracking-widest shadow-[0px_6px_0px_0px_#3730a3] active:shadow-[0px_0px_0px_0px_#3730a3] active:translate-y-[6px] transition-all disabled:opacity-50 disabled:pointer-events-none"
        >
          {saving ? (
            "Saving..."
          ) : (
            <>
              <IconSave /> Save Settings
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
      <div className="min-h-screen bg-[#121212] flex justify-center items-center">
        <p className="text-zinc-500 animate-pulse">Loading settings...</p>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
