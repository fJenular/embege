"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { adminLogin } from "./actions";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const result = await adminLogin(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 px-4 py-12 relative overflow-hidden font-sans">

      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-900/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-0 w-[300px] h-[300px] bg-zinc-800/50 rounded-full blur-[80px]" />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] -z-10"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="w-full max-w-[420px]">

        {/* Admin badge */}
        <div className="flex items-center justify-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 px-4 py-2 rounded-full text-xs font-bold tracking-widest uppercase">
            <ShieldCheck className="w-3.5 h-3.5" />
            Admin Portal
          </div>
        </div>

        {/* Main card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] overflow-hidden shadow-2xl shadow-black/50">
          <div className="p-8 sm:p-10">

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="h-12 flex items-center justify-center mb-4">
                <img src="/logo.svg" alt="EMBEGE Logo" className="h-10 w-auto object-contain brightness-0 invert opacity-90" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">Selamat datang kembali</h1>
              <p className="text-sm text-zinc-500 mt-1.5 font-medium">Masuk untuk mengakses panel admin</p>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-400 flex items-start gap-3 mb-6 animate-[shake_0.2s_ease-in-out_0s_2]">
                <AlertCircle className="w-4.5 h-4.5 shrink-0 mt-0.5" />
                <div className="text-xs font-semibold leading-relaxed">{error}</div>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4.5 h-4.5" />
                <input
                  id="admin-email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email admin"
                  autoComplete="email"
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-800/80 pl-12 pr-4 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-blue-500/60 focus:bg-zinc-800 focus:ring-4 focus:ring-blue-500/10 font-medium"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 w-4.5 h-4.5" />
                <input
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-zinc-700/80 bg-zinc-800/80 pl-12 pr-12 py-3.5 text-sm text-white placeholder-zinc-600 outline-none transition-all focus:border-blue-500/60 focus:bg-zinc-800 focus:ring-4 focus:ring-blue-500/10 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              </div>

              {/* Submit */}
              <button
                id="admin-login-submit"
                type="submit"
                disabled={loading}
                className="w-full mt-2 rounded-xl bg-blue-600 hover:bg-blue-500 py-3.5 text-sm font-bold text-white transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    Masuk ke Admin Panel
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="border-t border-zinc-800 bg-zinc-950/50 py-5 px-8">
            <div className="text-center text-xs text-zinc-600 font-medium">
              Bukan Admin?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-blue-500 hover:text-blue-400 font-semibold transition-colors cursor-pointer"
              >
                Login sebagai Staff
              </button>
            </div>
          </div>
        </div>

        {/* Security notice */}
        <p className="text-center text-[11px] text-zinc-700 font-medium mt-6">
          🔒 Halaman ini dilindungi dan hanya dapat diakses oleh Administrator
        </p>
      </div>
    </div>
  );
}
