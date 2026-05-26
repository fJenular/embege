"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { register } from "./actions";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(event.currentTarget);
    const result = await register(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }
    // Registration successful, redirect to login or home
    router.push('/login');
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f4f4f5] px-4 py-12 relative overflow-hidden font-sans">
      {/* Back to Home Button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors bg-white px-3.5 py-2 rounded-full border border-zinc-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] active:scale-95 duration-200"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </button>

      {/* Decorative subtle background highlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-100/10 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Main card */}
      <div className="w-full max-w-[420px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-zinc-200/50 overflow-hidden transition-all duration-300">
        {/* Upper content */}
        <div className="p-8 sm:p-10 pb-6 flex flex-col">
          {/* Logo with dotted radial grid */}
          <div className="relative flex justify-center mb-6 py-4">
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className="w-24 h-24 opacity-70"
                style={{
                  backgroundImage: 'radial-gradient(#e4e4e7 1.5px, transparent 1.5px)',
                  backgroundSize: '10px 10px',
                  maskImage: 'radial-gradient(circle, black, transparent 65%)',
                  WebkitMaskImage: 'radial-gradient(circle, black, transparent 65%)',
                }}
              />
            </div>
            <div className="relative h-10 flex items-center justify-center transition-transform duration-300 hover:scale-105">
              <img src="/logo.svg" alt="EMBEGE Logo" className="h-14 w-auto object-contain" />
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Create Your Account</h1>
            <p className="text-xs text-zinc-400 mt-1 font-medium leading-relaxed px-4">
              Join EMBEGE and start ordering catering services.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-rose-600 flex items-start gap-3 animate-shake">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 9v2m0 4h.01"/><circle cx="12" cy="12" r="10"/></svg>
                <div className="text-xs font-semibold leading-relaxed">{error}</div>
              </div>
            )}

            {/* Name */}
            <div className="relative">
              <input
                name="nama"
                type="text"
                required
                placeholder="Nama Lengkap"
                className="w-full rounded-2xl border border-zinc-200/80 bg-zinc-50 pl-4 pr-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-[#1591dc]/5 font-medium"
              />
            </div>

            {/* Email */}
            <div className="relative">
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="w-full rounded-2xl border border-zinc-200/80 bg-zinc-50 pl-4 pr-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-[#1591dc]/5 font-medium"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                name="password"
                type="password"
                required
                placeholder="Password"
                className="w-full rounded-2xl border border-zinc-200/80 bg-zinc-50 pl-4 pr-12 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-[#1591dc]/5 font-medium"
              />
            </div>

            {/* Telepon */}
            <div className="relative">
              <input
                name="telepon"
                type="tel"
                placeholder="Telepon (opsional)"
                className="w-full rounded-2xl border border-zinc-200/80 bg-zinc-50 pl-4 pr-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-[#1591dc]/5 font-medium"
              />
            </div>

            {/* Alamat */}
            <div className="relative">
              <textarea
                name="alamat"
                rows={2}
                placeholder="Alamat (opsional)"
                className="w-full rounded-2xl border border-zinc-200/80 bg-zinc-50 pl-4 pr-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-[#1591dc]/5 font-medium"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-2xl bg-[#18181b] hover:bg-black py-3.5 text-sm font-semibold text-white transition-all shadow-[0_4px_12px_rgba(24,24,27,0.05)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                "Sign Up"
              )}
            </button>
          </form>
        </div>

        {/* Footer split section */}
        <div className="bg-zinc-50 border-t border-zinc-100 py-6 px-8 flex flex-col items-center gap-3">
          <div className="text-xs text-zinc-500 font-medium">
            Already have an account?{' '}
            <a href="/login" className="text-zinc-900 font-semibold hover:underline">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
