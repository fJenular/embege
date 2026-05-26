"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { login } from "./actions";
import { Lock, Mail, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#f4f4f5] px-4 py-12 relative overflow-hidden font-sans">
      {/* Back to Home Button */}
      <button
        onClick={() => router.push('/')}
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-xs font-semibold text-zinc-500 hover:text-zinc-900 transition-colors bg-white px-3.5 py-2 rounded-full border border-zinc-200/50 shadow-[0_2px_8px_rgba(0,0,0,0.04)] cursor-pointer hover:shadow-[0_2px_12px_rgba(0,0,0,0.06)] active:scale-95 duration-200"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Home
      </button>

      {/* Decorative subtle background highlights to match high-end aesthetics */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-sky-200/20 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-blue-100/10 rounded-full blur-[80px] pointer-events-none -z-10" />

      {/* Main card */}
      <div className="w-full max-w-[420px] bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-zinc-200/50 overflow-hidden transition-all duration-300">
        
        {/* Main upper content */}
        <div className="p-8 sm:p-10 pb-6 flex flex-col">
          
          {/* Logo with dotted radial grid background */}
          <div className="relative flex justify-center mb-6 py-4">
            {/* Dotted Radial Grid */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="w-24 h-24 opacity-70" 
                style={{
                  backgroundImage: 'radial-gradient(#e4e4e7 1.5px, transparent 1.5px)',
                  backgroundSize: '10px 10px',
                  maskImage: 'radial-gradient(circle, black, transparent 65%)',
                  WebkitMaskImage: 'radial-gradient(circle, black, transparent 65%)'
                }}
              />
            </div>
            {/* Logo Container */}
            <div className="relative h-10 flex items-center justify-center transition-transform duration-300 hover:scale-105">
              <img src="/logo.svg" alt="EMBEGE Logo" className="h-14 w-auto object-contain" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Sign in to continue</h1>
            <p className="text-xs text-zinc-400 mt-1 font-medium leading-relaxed px-4">
              Please sign in to start your catering session
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-4 text-rose-600 flex items-start gap-3 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-xs font-semibold leading-relaxed">{error}</div>
              </div>
            )}

            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="w-full rounded-2xl border border-zinc-200/80 bg-zinc-50 pl-12 pr-4 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-[#1591dc]/5 font-medium"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 w-5 h-5" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                className="w-full rounded-2xl border border-zinc-200/80 bg-zinc-50 pl-12 pr-12 py-3.5 text-sm text-zinc-900 placeholder-zinc-400 outline-none transition-all focus:border-[#1591dc] focus:bg-white focus:ring-4 focus:ring-[#1591dc]/5 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 rounded-2xl bg-[#18181b] hover:bg-black py-3.5 text-sm font-semibold text-white transition-all shadow-[0_4px_12px_rgba(24,24,27,0.05)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-xs font-semibold text-[#1591dc] hover:text-blue-700 transition-colors cursor-pointer"
            >
              Forgot Password?
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-dashed border-zinc-200" />
            <span className="absolute bg-white px-3 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              Or continue with
            </span>
          </div>

          {/* Social Logins */}
          <div className="flex gap-3">
            {/* Google */}
            <button
              type="button"
              className="flex-1 flex items-center justify-center h-12 border border-zinc-200/80 rounded-2xl hover:bg-zinc-50/50 hover:border-zinc-300 transition-all active:scale-[0.98] cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.65 1.41 7.55l3.86 3c.96-2.87 3.66-4.51 6.73-4.51z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.27H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.9c2.18-2.01 3.7-4.99 3.7-8.72z"/>
                <path fill="#FBBC05" d="M5.27 10.55A7.17 7.17 0 0 1 5 12c0 .51.04 1.01.12 1.49l-3.86 3A11.96 11.96 0 0 1 1 12c0-1.79.39-3.48 1.1-5l4.17 3.55z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.73-2.9c-1.1.74-2.52 1.18-4.23 1.18-3.07 0-5.77-1.64-6.73-4.51l-3.86 3C3.37 20.35 7.35 23 12 23z"/>
              </svg>
              <a href="http://localhost:3000/" target="_blank" rel="noopener noreferrer" className="ml-2"  >Google</a>
            </button>
          </div>

        </div>

        {/* Footer split section inside card */}
        <div className="bg-zinc-50 border-t border-zinc-100 py-6 px-8 flex flex-col items-center gap-3">
          <div className="text-xs text-zinc-500 font-medium">
            Don't have an account?{' '}
            <a href="/daftar" className="text-zinc-900 font-semibold hover:underline">Sign Up</a>
          </div>
        </div>

      </div>
    </div>
  );
}
