'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'
import { useRouter } from 'next/navigation'

interface WalletContextType {
  walletAddress: string | null
  userId: string | null
  isAuthenticated: boolean
  hasCompletedRegistration: boolean
  isLoading: boolean
  authenticate: () => Promise<void>
  disconnect: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasCompletedRegistration, setHasCompletedRegistration] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Check if there's a stored wallet session in localStorage
  useEffect(() => {
    const storedWallet = localStorage.getItem('walletAddress')
    const storedUserId = localStorage.getItem('userId')
    const storedRegistrationStatus = localStorage.getItem('hasCompletedRegistration')
    
    if (storedWallet && storedUserId) {
      setWalletAddress(storedWallet)
      setUserId(storedUserId)
      setIsAuthenticated(true)
      setHasCompletedRegistration(storedRegistrationStatus === 'true')
    }
  }, [])

  const authenticate = async () => {
    if (!MiniKit.isInstalled()) {
      console.error("MiniKit is not installed")
      return
    }

    setIsLoading(true)
    try {
      // Get nonce from the API
      const res = await fetch("/api/nonce")
      const { nonce } = await res.json()

      const { finalPayload } = await MiniKit.commandsAsync.walletAuth({
        nonce: nonce,
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        statement: "Sign in to Nila Insurance Waitlist"
      })

      if (finalPayload.status === "success") {
        // Verify the signature on the server
        const verificationResponse = await fetch("/api/complete-siwe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: finalPayload, nonce })
        })
        
        const verificationResult = await verificationResponse.json()
        
        if (verificationResult.isValid) {
          // Save the wallet info in context and localStorage
          setWalletAddress(verificationResult.walletAddress)
          setUserId(verificationResult.userId)
          setIsAuthenticated(true)
          setHasCompletedRegistration(verificationResult.hasCompletedRegistration)
          
          localStorage.setItem('walletAddress', verificationResult.walletAddress)
          localStorage.setItem('userId', verificationResult.userId)
          localStorage.setItem('hasCompletedRegistration', verificationResult.hasCompletedRegistration.toString())
          
          // Navigate based on registration status
          if (verificationResult.hasCompletedRegistration) {
            router.push('/success')
          } else {
            router.push('/waitlist')
          }
        } else {
          console.error("Signature verification failed:", verificationResult)
        }
      } else {
        console.error("Authentication failed:", finalPayload)
      }
    } catch (error) {
      console.error("Authentication error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setWalletAddress(null)
    setUserId(null)
    setIsAuthenticated(false)
    setHasCompletedRegistration(false)
    localStorage.removeItem('walletAddress')
    localStorage.removeItem('userId')
    localStorage.removeItem('hasCompletedRegistration')
    router.push('/')
  }

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        userId,
        isAuthenticated,
        hasCompletedRegistration,
        isLoading,
        authenticate,
        disconnect
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
} 