"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// ICONS
const IconSave = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>;
const IconSettings = () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconLock = () => <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>;
const IconLogout = () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

function SettingsContent() {
  const searchParams = useSearchParams();
  const user = searchParams.get("user");

  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [loginProcessing, setLoginProcessing] = useState(false);

  // Settings States
  const [settingsLoading, setSettingsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    ads_head: "", ads_body: "", ads_native: "", ads_footer: "", ads_mobile: "", ads_desktop: "", offer_link: "",
  });

  // Toast State (Semi-popup)
  const [toast, setToast] = useState<{ message: string, type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    // Cek apakah session login masih aktif di browser
    const authState = sessionStorage.getItem("admin_auth");
    if (authState === "true") {
      setIsAuthenticated(true);
      fetchSettings();
    } else {
      setAuthLoading(false);
    }
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/settings");
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          setFormData({
            ads_head: data.ads_head || "", ads_body: data.ads_body || "", ads_native: data.ads_native || "",
            ads_footer: data.ads_footer || "", ads_mobile: data.ads_mobile || "", ads_desktop: data.ads_desktop || "",
            offer_link: data.offer_link || "",
          });
        }
      }
    } catch (error) {
      showToast("Failed to load configuration data.", "error");
    } finally {
      setSettingsLoading(false);
      setAuthLoading(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginProcessing(true);
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        sessionStorage.setItem("admin_auth", "true");
        setIsAuthenticated(true);
        showToast("Login successful. Welcome Admin!", "success");
        fetchSettings();
      } else {
        showToast(data.error || "Authentication failed.", "error");
      }
    } catch (error) {
      showToast("Server error. Please try again.", "error");
    } finally {
      setLoginProcessing(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    setLoginForm({ email: "", password: "" });
    showToast("Logged out successfully.", "success");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        showToast("Settings successfully saved and updated!", "success");
      } else {
        showToast("Failed to save settings.", "error");
      }
    } catch (error) {
      showToast("An error occurred while saving.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#121212] flex justify-center items-center">
        <p className="text-zinc-500 font-bold tracking-widest uppercase animate-pulse">Checking Access...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#121212] text-white p-4 sm:p-6 md:p-10 pb-32 font-sans relative overflow-hidden">
      
      {/* TOAST NOTIFICATION (SEMI-POPUP) */}
      <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 transform ${toast ? "translate-y-0 opacity-100" : "-translate-y-10 opacity-0 pointer-events-none"}`}>
        {toast && (
          <div className={`px-6 py-4 rounded-xl border-2 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.5)] font-bold tracking-wide flex items-center gap-3 ${toast.type === "success" ? "bg-emerald-600 border-emerald-800 text-white" : "bg-rose-600 border-rose-800 text-white"}`}>
            {toast.type === "success" ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            )}
            {toast.message}
          </div>
        )}
      </div>

      {/* LOGIN VIEW */}
      {!isAuthenticated ? (
        <div className="w-full h-[80vh] flex justify-center items-center">
          <div className="w-full max-w-md bg-[#1e1e20] border-2 border-[#3f3f46] rounded-2xl p-8 md:p-10 shadow-[8px_8px_0px_0px_#3f3f46] flex flex-col items-center">
            <div className="w-16 h-16 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center mb-6">
              <IconLock />
            </div>
            <h1 className="text-2xl font-black text-white mb-2 uppercase tracking-wide">Admin Access</h1>
            <p className="text-zinc-400 text-sm mb-8 text-center font-medium">Please enter your credentials to manage the system settings.</p>
            
            <form onSubmit={handleLoginSubmit} className="w-full space-y-5">
              <div>
                <label className="block text-xs text-zinc-300 font-bold mb-2 uppercase tracking-wide">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="admin@example.com"
                  className="w-full bg-[#121212] border-2 border-[#3f3f46] rounded-xl px-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-300 font-bold mb-2 uppercase tracking-wide">Password</label>
                <input 
                  type="password" 
                  required
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-[#121212] border-2 border-[#3f3f46] rounded-xl px-4 py-3.5 text-sm font-medium text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
              <button 
                type="submit"
                disabled={loginProcessing}
                className="w-full mt-4 bg-indigo-600 border-2 border-indigo-800 text-white font-bold text-base py-4 rounded-xl uppercase tracking-wider transition-all shadow-[0px_4px_0px_0px_#3730a3] active:shadow-[0px_0px_0px_0px_#3730a3] active:translate-y-[4px] disabled:opacity-70"
              >
                {loginProcessing ? "Authenticating..." : "Login"}
              </button>
            </form>
          </div>
        </div>
      ) : (

      /* SETTINGS VIEW (Protected) */
      <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500">
        
        {/* HEADER SETTINGS */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 border-b-2 border-[#27272a] pb-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500 text-white rounded-xl shadow-[4px_4px_0_0_#3730a3] border-2 border-[#3730a3]">
              <IconSettings />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">System Settings</h1>
              <p className="text-sm md:text-base text-emerald-400 mt-1 font-bold">Authorized Admin Session</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-zinc-800 border-2 border-zinc-600 hover:bg-rose-600 hover:border-rose-800 text-white font-bold py-2.5 px-6 rounded-lg uppercase tracking-wider transition-all shadow-[0px_4px_0px_0px_#52525b] hover:shadow-[0px_4px_0px_0px_#9f1239] active:shadow-none active:translate-y-[4px] text-xs"
          >
            <IconLogout /> Logout
          </button>
        </div>

        {settingsLoading ? (
          <div className="py-20 flex justify-center items-center">
            <p className="text-zinc-500 font-bold uppercase tracking-widest animate-pulse">Loading configurations...</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* BOX 3D: TAUTAN OFFER */}
            <div className="bg-[#1e1e20] border-2 border-[#3f3f46] rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#3f3f46]">
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wide">Offer Link Configuration</h2>
              <div>
                <label className="block text-xs text-zinc-300 font-bold mb-2 uppercase tracking-wide">Main Offer Link</label>
                <input 
                  type="text" 
                  name="offer_link"
                  value={formData.offer_link}
                  onChange={handleChange}
                  placeholder="https://example-offer.com"
                  className="w-full bg-[#121212] border-2 border-[#3f3f46] rounded-xl px-4 py-4 text-base font-medium text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>

            {/* BOX 3D: KODE IKLAN */}
            <div className="bg-[#1e1e20] border-2 border-[#3f3f46] rounded-2xl p-6 md:p-8 shadow-[6px_6px_0px_0px_#3f3f46]">
              <h2 className="text-xl font-black text-white mb-6 uppercase tracking-wide">Ads Placements</h2>
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
                    <label className="block text-xs text-zinc-300 font-bold mb-2 uppercase tracking-wide">{ad.label}</label>
                    <textarea 
                      name={ad.name}
                      value={(formData as any)[ad.name]}
                      onChange={handleChange}
                      placeholder={``}
                      className="w-full h-40 bg-[#121212] border-2 border-[#3f3f46] rounded-xl px-4 py-4 text-xs font-mono text-zinc-300 focus:outline-none focus:border-indigo-500 transition-colors resize-y"
                    ></textarea>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FLOATING SAVE BUTTON */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-[#121212]/90 backdrop-blur-md border-t-2 border-[#27272a] flex justify-center md:justify-end items-center z-40">
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full md:w-auto flex justify-center items-center gap-3 px-10 py-4 bg-indigo-600 border-2 border-[#3730a3] hover:bg-indigo-500 text-white text-base font-black rounded-xl uppercase tracking-widest shadow-[0px_6px_0px_0px_#3730a3] active:shadow-[0px_0px_0px_0px_#3730a3] active:translate-y-[6px] transition-all disabled:opacity-50"
          >
            {saving ? "Saving..." : <><IconSave /> Save Settings</>}
          </button>
        </div>

      </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#121212] flex justify-center items-center">
        <p className="text-zinc-500 font-bold tracking-widest uppercase animate-pulse">Loading Application...</p>
      </div>
    }>
      <SettingsContent />
    </Suspense>
  );
}
