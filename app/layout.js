"use client";

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <title>🎁 Promo Kuota Gratis 10GB - Dapatkan Sekarang!</title>
        <meta
          name="description"
          content="Dapatkan kuota gratis 10GB dengan verifikasi lokasi"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {children}
      </body>
    </html>
  );
}
