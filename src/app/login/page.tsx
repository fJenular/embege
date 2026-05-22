"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "./actions";
import { Lock, Mail, ChevronRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
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
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-10 animate-fade-in">
      <div className="w-full max-w-xl">
        <div className="bg-white border border-slate-200 rounded-[2rem] shadow-2xl overflow-hidden animate-appear">
          <div className="bg-[var(--primary-soft)] px-10 py-10 text-center animate-slide-up">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-[1.75rem] bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)/20] mx-auto mb-6 animate-pop">
              <span className="text-3xl font-black">E</span>
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">EMBEGE</h1>
            <p className="mt-3 text-sm text-slate-500 font-medium">Eat More. Be Good Everyday.</p>
            <p className="mt-2 text-sm text-slate-400 italic">Good food. Good mood.</p>
          </div>

          <div className="px-10 py-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              ← Kembali ke Beranda
            </button>
            <div className="mb-8 text-center">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500 font-bold">Login Karyawan</p>
              <h2 className="mt-3 text-2xl font-black text-slate-900">Masuk untuk melanjutkan</h2>
            </div>

            <form action={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-600 px-4 py-3 rounded-2xl flex items-center gap-3 animate-shake">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-semibold">{error}</span>
                </div>
              )}

              <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.15s' }}>
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Password</label>
                  <a href="#" className="text-xs font-bold text-[var(--primary)] hover:text-slate-900 transition-colors">Lupa password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full pl-14 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-[var(--primary)] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] disabled:opacity-50 text-white font-black py-4 rounded-2xl shadow-lg shadow-[var(--primary)/20] flex items-center justify-center gap-2 transition-all active:scale-[0.98] animate-pop"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Masuk
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
              <p>Gunakan akun karyawan untuk mengakses dashboard.</p>
              <p className="mt-3 text-slate-400">Contoh: admin@embege.com / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
