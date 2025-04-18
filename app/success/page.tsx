"use client"

import { useSearchParams } from "next/navigation"
import { AnimatedBackground } from "@/components/animated-background"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import { useWallet } from "@/lib/wallet-context"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const modes = searchParams.get("modes")?.split(",") || []
  const { isAuthenticated, hasCompletedRegistration, walletAddress, disconnect } = useWallet()
  const router = useRouter()
  
  // Protect the success page
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  // If not registered, redirect to waitlist
  useEffect(() => {
    if (isAuthenticated && !hasCompletedRegistration) {
      router.push('/waitlist')
    }
  }, [isAuthenticated, hasCompletedRegistration, router])

  const handleBackToHome = () => {
    router.push("/")
  }

  const handleLogout = () => {
    disconnect()
  }

  if (!isAuthenticated || !hasCompletedRegistration) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 relative">
        <AnimatedBackground />
        <div>Redirecting...</div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 relative">
      <AnimatedBackground />

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <Card className="w-full bg-black/50 border-0 backdrop-blur-sm shadow-xl p-8 flex flex-col items-center">
          <div className="w-20 h-20 flex items-center justify-center mb-6">
            <CheckCircle className="w-full h-full text-green-500" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-4">Success!</h1>

          <p className="text-center text-gray-300 mb-4">
            You have joined our waitlist. You will be notified via{" "}
            {modes.length === 1 ? modes[0] : `${modes.slice(0, -1).join(", ")} and ${modes[modes.length - 1]}`}.
          </p>

          {walletAddress && (
            <p className="text-center text-blue-400 text-sm mb-4">
              Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </p>
          )}

          <p className="text-center text-gray-400 text-sm">Thank you for your interest in Nila Insurance.</p>
        </Card>
      </div>

      <div className="w-full max-w-md fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6 space-y-3">
        <Button
          className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700"
          onClick={handleBackToHome}
        >
          Back to Home
        </Button>
        
        <Button
          className="w-full py-3 text-sm bg-transparent border border-red-500 hover:bg-red-950"
          onClick={handleLogout}
        >
          Disconnect Wallet
        </Button>
      </div>
    </main>
  )
}
