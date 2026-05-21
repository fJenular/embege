"use client";

import { useState } from "react";
import { login } from "./actions";
import { Lock, Mail, ChevronRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await login(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-900">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105"
        style={{ backgroundImage: "url('/login_background_1778480858792.png')" }}
      />
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-900/80 via-slate-900/40 to-emerald-900/40" />

      {/* Login Card */}
      <div className="relative z-20 w-full max-w-md px-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl p-10 overflow-hidden">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-emerald-500 shadow-lg shadow-emerald-500/30 mb-6 group transition-all-custom hover:scale-110">
              <img 
                src="/catering_app_logo_1778480833493.png" 
                alt="EMBEGE Logo" 
                className="w-14 h-14 object-contain brightness-0 invert"
              />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">EMBEGE</h1>
            <p className="text-emerald-100/60 mt-2 font-medium text-sm">Eat More. Be Good Everyday.</p>
            <p className="text-emerald-100/60 font-medium text-sm italic">&quot;Good food. Good mood.&quot;</p>
          </div>

          <form action={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 px-4 py-3 rounded-2xl flex items-center gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span className="text-sm font-semibold">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-emerald-100/70 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  name="email"
                  type="email" 
                  required
                  placeholder="name@example.com"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-emerald-100/70 uppercase tracking-widest">Password</label>
                <a href="#" className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors">Forgot?</a>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-100/30 group-focus-within:text-emerald-400 transition-colors" />
                <input 
                  name="password"
                  type="password" 
                  required
                  placeholder="••••••••"
                  className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 group transition-all-custom active:scale-[0.98] mt-4"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Sign In
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/10 text-center">
            <p className="text-emerald-100/40 text-sm font-medium">
              Admin: admin@embege.com / admin123
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] animate-pulse" />
      </div>
    </div>
  );
}
