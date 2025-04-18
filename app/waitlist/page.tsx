"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AnimatedBackground } from "@/components/animated-background"
import { PhoneInput } from "@/components/phone-input"
import { UpdateModeSelector } from "@/components/update-mode-selector"
import { Button } from "@/components/ui/button"
import { countryData } from "@/lib/country-data"
import { useWallet } from "@/lib/wallet-context"

export default function WaitlistPage() {
  const router = useRouter()
  const { userId, isAuthenticated, hasCompletedRegistration, walletAddress } = useWallet()
  
  const [phoneNumber, setPhoneNumber] = useState("")
  const [country, setCountry] = useState<{ code: string; flag: string } | null>(null)
  const [updateModes, setUpdateModes] = useState<string[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
      return
    }

    if (hasCompletedRegistration) {
      router.push('/success')
      return
    }

    // Set default country on mount
    if (!country) {
      setCountry({
        code: "US",
        flag: countryData["US"].flag,
      })
    }
  }, [isAuthenticated, hasCompletedRegistration, router, country])

  const handleSubmit = async () => {
    if (!userId) {
      setError("Authentication error. Please sign in again.")
      return
    }

    if (!phoneNumber) {
      setError("Please enter your phone number")
      return
    }

    if (updateModes.length === 0) {
      setError("Please select at least one update mode")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Save the waitlist information to Supabase
      const response = await fetch('/api/save-waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          phoneNumber,
          countryCode: country?.code || 'US',
          updateModes,
        }),
      })

      const result = await response.json()

      if (result.status === 'success') {
        // Update local storage to indicate completed registration
        localStorage.setItem('hasCompletedRegistration', 'true')
        
        // Navigate to success page
        router.push(`/success?modes=${updateModes.join(",")}`)
      } else {
        setError(result.message || 'Failed to save your information. Please try again.')
      }
    } catch (error) {
      console.error('Error saving waitlist data:', error)
      setError('An error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // If not authenticated, show a loading state (redirect will happen via useEffect)
  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 relative">
        <AnimatedBackground />
        <div>Redirecting to login...</div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 relative">
      <AnimatedBackground />

      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto">
        <div className="w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold">Join Waitlist</h1>
            <p className="text-gray-400">&amp; get upto 50% off on your 1st premium</p>
            {walletAddress && (
              <p className="text-sm text-blue-400 mt-2">Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <p className="mb-2">Phone Number</p>
              <PhoneInput value={phoneNumber} onChange={setPhoneNumber} onCountryChange={setCountry} />
            </div>

            <UpdateModeSelector selected={updateModes} onChange={setUpdateModes} />

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
        </div>
      </div>

      <div className="w-full max-w-md fixed bottom-8 left-1/2 transform -translate-x-1/2 px-6">
        <Button 
          className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700" 
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Join Waitlist"}
        </Button>
      </div>
    </main>
  )
}
