"use client";

import { useState, useEffect } from "react";
import { X, Utensils, TrendingUp, Users, Zap } from "lucide-react";

interface WelcomeOnboardingProps {
  userName?: string;
  role?: string;
}

export default function WelcomeOnboarding({ userName = "User", role = "owner" }: WelcomeOnboardingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const onboardingKey = `onboarding_seen_${role}_${userName}`;
    const hasSeenOnboarding = localStorage.getItem(onboardingKey);
    
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, [role, userName]);

  const handleClose = () => {
    setIsOpen(false);
    const onboardingKey = `onboarding_seen_${role}_${userName}`;
    localStorage.setItem(onboardingKey, "true");
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const steps = role === "owner" ? [
    {
      title: "Selamat Datang di EMBEGE! 👋",
      description: "Platform manajemen catering modern untuk bisnis Anda. Mari kita mulai dengan panduan singkat.",
      icon: Utensils,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Kelola Pesanan dengan Mudah 📋",
      description: "Monitor semua pesanan catering Anda dalam satu dashboard. Lihat status pesanan, pelanggan, dan total pembayaran secara real-time.",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Pantau Pengiriman 🚚",
      description: "Lacak pengiriman pesanan Anda. Kelola rute kurir dan pastikan pelanggan menerima pesanan tepat waktu.",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Kembangkan Bisnis Anda 📈",
      description: "Lihat laporan penjualan, kelola paket menu, dan optimalkan strategi bisnis Anda dengan data yang akurat.",
      icon: Users,
      color: "from-green-500 to-emerald-500",
    },
  ] : [
    {
      title: "Selamat Datang Kurir! 🚗",
      description: "Aplikasi pengiriman catering Anda telah siap. Terima pesanan dan kelola pengiriman dengan efisien.",
      icon: Utensils,
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Terima Pesanan Baru 📱",
      description: "Lihat daftar pesanan yang tersedia. Terima pesanan dan lihat detail pengiriman lengkap.",
      icon: TrendingUp,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Kelola Rute Pengiriman 🗺️",
      description: "Optimalkan rute pengiriman Anda. Lihat lokasi pelanggan dan kelola jadwal pengiriman dengan smart routing.",
      icon: Zap,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Tingkatkan Rating Anda ⭐",
      description: "Berikan layanan terbaik dan kumpulkan ulasan positif. Dapatkan lebih banyak pesanan dengan rating tinggi.",
      icon: Users,
      color: "from-green-500 to-emerald-500",
    },
  ];

  const CurrentIcon = steps[currentStep].icon;
  const gradientClass = steps[currentStep].color;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>

        {/* Header with Gradient */}
        <div className={`bg-gradient-to-r ${gradientClass} p-8 flex flex-col items-center justify-center text-white relative overflow-hidden`}>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          
          <div className="relative z-10 bg-white/20 p-4 rounded-2xl mb-4">
            <CurrentIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-center relative z-10">{steps[currentStep].title}</h2>
        </div>

        {/* Content */}
        <div className="p-8">
          <p className="text-slate-600 text-center leading-relaxed mb-8">
            {steps[currentStep].description}
          </p>

          {/* Step Indicators */}
          <div className="flex justify-center gap-2 mb-8">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? `bg-gradient-to-r ${gradientClass} w-8`
                    : index < currentStep
                    ? "bg-slate-300 w-2"
                    : "bg-slate-200 w-2"
                }`}
              />
            ))}
          </div>

          {/* Step Counter */}
          <p className="text-center text-sm text-slate-400 mb-6">
            Langkah {currentStep + 1} dari {steps.length}
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
              >
                Kembali
              </button>
            )}
            <button
              onClick={handleNext}
              className={`flex-1 px-4 py-3 bg-gradient-to-r ${gradientClass} text-white font-semibold rounded-xl hover:shadow-lg transition-all`}
            >
              {currentStep === steps.length - 1 ? "Mulai Sekarang" : "Lanjutkan"}
            </button>
          </div>

          {/* Skip Button */}
          <button
            onClick={handleClose}
            className="w-full mt-3 px-4 py-2 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
          >
            Lewati Panduan
          </button>
        </div>
      </div>
    </div>
  );
}
