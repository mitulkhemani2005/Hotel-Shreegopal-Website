import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono, Poppins, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _poppins = Poppins({ weight: ["400", "500", "600", "700"], subsets: ["latin"] })
const _playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "Hotel Shreegopal - Ujjain",
  description:
    "Hotel Shreegopal: Comfort & Convenience in the Heart of Ujjain. 900m from Mahakal Temple. Book your spiritual retreat today.",
  generator: "v0.app",
  openGraph: {
    title: "Hotel Shreegopal - Ujjain",
    description: "Your gateway to spiritual bliss - 900m from Mahakal Temple",
    url: "https://hotelshreegopal.com",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
          :root {
            --font-serif: '${_playfair.style.fontFamily}';
          }
        `}</style>
      </head>
      <body className={`${_poppins.className} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
