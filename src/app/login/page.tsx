"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "./actions";
import { Lock, Mail, ChevronRight, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-12 overflow-hidden animate-fade-in">
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-[rgba(37,99,235,0.16)] to-transparent blur-3xl pointer-events-none" />
      <div className="absolute right-8 bottom-10 h-64 w-64 rounded-full bg-[rgba(14,165,233,0.14)] blur-3xl pointer-events-none" />

      <div className="w-full max-w-6xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="glass-card flex flex-col justify-between rounded-[2rem] border border-white/70 bg-white/85 p-10 shadow-2xl shadow-slate-900/10">
            <div>
              <span className="inline-flex rounded-full bg-[var(--primary-soft)] px-4 py-2 text-[0.7rem] font-black uppercase tracking-[0.35em] text-[var(--primary)]">
                Aplikasi Katering
              </span>
              <h1 className="mt-10 text-5xl font-black tracking-tight text-slate-900 md:text-6xl">
                Selamat datang di EMBEGE
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-600">
                Kelola pesanan, pelanggan, dan pengiriman dengan antarmuka yang cepat dan profesional. Login menggunakan akun karyawan Anda untuk buka dashboard admin, owner, atau kurir.
              </p>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">Brand</p>
                <p className="mt-3 font-black text-slate-900">Emang Beda Gizi & Enaknya</p>
              </div>
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
                <p className="text-[0.65rem] uppercase tracking-[0.3em] text-slate-400">Akses Cepat</p>
                <p className="mt-3 font-black text-slate-900">Total kontrol untuk pesanan catering, pembayaran, dan pelaporan staf.</p>
              </div>
            </div>
          </section>

          <section className="glass-card rounded-[2rem] border border-white/75 bg-white p-8 shadow-2xl shadow-slate-900/10">
            <div className="mb-8 flex flex-col gap-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500 font-semibold">Login Karyawan</p>
                  <h2 className="mt-3 text-3xl font-black text-slate-900">Masuk untuk melanjutkan</h2>
                </div>
                <div className="rounded-3xl bg-[var(--primary-soft)] px-4 py-3 text-[0.75rem] font-black uppercase tracking-[0.25em] text-[var(--primary)]">
                  Aman & Cepat
                </div>
              </div>
              <p className="text-sm text-slate-500">Masukkan email dan password yang sudah terdaftar sebagai akun karyawan EMEBGE.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-700 flex items-center gap-3 animate-shake">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <p className="text-sm font-semibold">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Email</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-14 py-4 text-sm text-slate-900 outline-none transition-all focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/20"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">Password</label>
                  <button
                    type="button"
                    onClick={() => router.push('/login')}
                    className="text-xs font-semibold text-[var(--primary)] hover:text-slate-900 transition-colors"
                  >
                    Lupa password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-14 py-4 text-sm text-slate-900 outline-none transition-all focus:border-[var(--primary)] focus:bg-white focus:ring-2 focus:ring-[var(--primary)]/20"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] px-6 py-4 text-sm font-black text-white shadow-lg shadow-[var(--primary)/20] transition-all duration-200 hover:bg-[var(--primary-hover)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                ) : (
                  <>
                    Masuk
                    <ChevronRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <p className="font-semibold text-slate-900">Contoh akun</p>
              <p className="mt-2">admin@embege.com / admin123</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
