"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AnimatedBackground } from "@/components/animated-background"
import { useWallet } from "@/lib/wallet-context"

export default function Home() {
  const { authenticate, isLoading } = useWallet()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-6 relative">
      <AnimatedBackground />

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <Card className="w-full bg-black/50 border-0 backdrop-blur-sm shadow-xl p-8 flex flex-col items-center">
          <div className="w-64 h-64 relative mb-8">
            <Image
              src="/nilalogotransparent.png"
              alt="Nila Insurance Logo"
              fill
              priority
              className="object-contain"
            />
          </div>
          <p className="text-xl text-center text-gray-300 mb-4">Insurance on the blockchain with Nila Insurance</p>
        </Card>
      </div>

      <div className="w-full max-w-md fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6">
        <Button
          className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
          onClick={authenticate}
          disabled={isLoading}
        >
          <div className="flex items-center justify-center">
            <div className="w-6 h-6 mr-2 rounded-full bg-white flex items-center justify-center overflow-hidden">
              <Image
                src="/worldcoinlogo.png"
                alt="Worldcoin Logo"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            {isLoading ? "Connecting..." : "Sign in with World Wallet"}
          </div>
        </Button>
      </div>
    </main>
  )
}
