"use client";

import { useState } from "react";
import { submitDeliveryProof } from "../../actions";
import { Upload, CheckCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function CourierDeliveryForm({ pengirimanId, pemesananId }: { pengirimanId: string, pemesananId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      await submitDeliveryProof(pengirimanId, data.url);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Gagal mengupload bukti pengiriman.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-4">
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
        <input 
          type="file" 
          id={`proof-${pengirimanId}`} 
          accept="image/*" 
          className="hidden" 
          capture="environment"
          onChange={handleFileChange}
        />
        <label htmlFor={`proof-${pengirimanId}`} className="cursor-pointer flex flex-col items-center">
          {preview ? (
            <div className="relative w-full aspect-video rounded-lg overflow-hidden">
              <Image src={preview} alt="Preview" fill className="object-cover" />
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 text-slate-400 mb-2" />
              <span className="text-sm font-semibold text-blue-950">Upload Bukti Foto</span>
              <span className="text-xs text-slate-500 mt-1">Klik untuk memilih dari galeri atau ambil foto</span>
            </>
          )}
        </label>
      </div>

      <button 
        type="submit" 
        disabled={!file || isUploading}
        className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
        {isUploading ? "Mengirim..." : "Selesaikan Pengiriman"}
      </button>
    </form>
  );
}
