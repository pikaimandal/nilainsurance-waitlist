import { NextRequest, NextResponse } from 'next/server'
import { MiniAppWalletAuthSuccessPayload, verifySiweMessage } from '@worldcoin/minikit-js'
import { createServerClient } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

interface RequestPayload {
  payload: MiniAppWalletAuthSuccessPayload
  nonce: string
}

export async function POST(req: NextRequest) {
  try {
    const { payload, nonce } = await req.json() as RequestPayload
    const supabase = createServerClient()
    
    // First verify the nonce exists in our database
    const { data: nonceData, error: nonceError } = await supabase
      .from('nonces')
      .select('*')
      .eq('nonce', nonce)
      .single()
    
    if (nonceError || !nonceData) {
      return NextResponse.json({
        status: 'error',
        isValid: false,
        message: 'Invalid or expired nonce'
      }, { status: 400 })
    }
    
    // Delete the used nonce
    await supabase
      .from('nonces')
      .delete()
      .eq('nonce', nonce)
    
    // Verify the SIWE message
    const validationResult = await verifySiweMessage(payload, nonce)
    
    if (!validationResult.isValid) {
      return NextResponse.json({
        status: 'error',
        isValid: false,
        message: 'Invalid signature'
      }, { status: 400 })
    }
    
    // Check if the wallet already exists in our waitlist
    const { data: walletCheck } = await supabase
      .rpc('check_wallet_registration', {
        wallet: payload.address
      })
    
    let userId: string
    
    if (walletCheck && walletCheck.exists) {
      // User already exists - return their registration status
      return NextResponse.json({
        status: 'success',
        isValid: true,
        walletAddress: payload.address,
        hasCompletedRegistration: walletCheck.has_completed_registration,
        userId: walletCheck.entry_id
      })
    } else {
      // New user - create a new entry in the waitlist with just the wallet address
      const { data: newUser, error: createError } = await supabase
        .from('waitlist_entries')
        .insert({
          wallet_address: payload.address
        })
        .select('id')
        .single()
      
      if (createError) {
        console.error('Error creating user:', createError)
        return NextResponse.json({
          status: 'error',
          message: 'Failed to create user record'
        }, { status: 500 })
      }
      
      userId = newUser.id
    }
    
    return NextResponse.json({
      status: 'success',
      isValid: true,
      walletAddress: payload.address,
      hasCompletedRegistration: false,
      userId
    })
  } catch (error: any) {
    console.error('Error verifying SIWE message:', error)
    return NextResponse.json({
      status: 'error',
      isValid: false,
      message: error.message || 'Error verifying authentication'
    }, { status: 500 })
  }
} 