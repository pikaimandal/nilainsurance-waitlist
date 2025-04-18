'use client'

import { ReactNode, useEffect } from 'react'
import { MiniKit } from '@worldcoin/minikit-js'

export default function MiniKitProvider({ children, appId }: { children: ReactNode, appId?: string }) {
  useEffect(() => {
    // Install MiniKit with the appId
    MiniKit.install(appId)
  }, [appId])

  return <>{children}</>
} 