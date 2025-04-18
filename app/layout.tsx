import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import MiniKitProvider from "@/components/minikit-provider"
import { WalletProvider } from "@/lib/wallet-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nila Insurance - Waitlist",
  description: "Join the waitlist for Nila Insurance - Insure with Nila",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <MiniKitProvider appId={process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID}>
            <WalletProvider>
              {children}
            </WalletProvider>
          </MiniKitProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
