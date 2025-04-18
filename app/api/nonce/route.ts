import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { createServerClient } from '@/lib/supabase'

export async function GET() {
  try {
    // Generate a random nonce
    const nonce = uuidv4()
    
    // Store the nonce in Supabase temporarily
    const supabase = createServerClient()
    
    // We'll store nonces with a TTL (10 minutes) in a separate table
    await supabase
      .from('nonces')
      .insert({
        nonce,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      })
    
    return NextResponse.json({ nonce })
  } catch (error) {
    console.error('Error generating nonce:', error)
    return NextResponse.json(
      { error: 'Failed to generate nonce' },
      { status: 500 }
    )
  }
} 