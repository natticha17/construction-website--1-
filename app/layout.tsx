import type React from "react"
import type { Metadata } from "next"
import { Sarabun } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "บริการรับเหมาก่อสร้างและแบบบ้านครบวงจร",
  description: "บริการออกแบบบ้าน ก่อสร้าง ต่อเติม รีโนเวท ครบวงจร มืออาชีพ ราคายุติธรรม",
    generator: ''
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="th">
      <body className={`${sarabun.className} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
