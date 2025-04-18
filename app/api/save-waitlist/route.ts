import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

interface WaitlistData {
  userId: string
  phoneNumber: string
  countryCode: string
  updateModes: string[]
}

export async function POST(req: NextRequest) {
  try {
    const { userId, phoneNumber, countryCode, updateModes }: WaitlistData = await req.json()
    
    if (!userId || !phoneNumber || !countryCode || !updateModes || updateModes.length === 0) {
      return NextResponse.json({
        status: 'error',
        message: 'Missing required fields'
      }, { status: 400 })
    }
    
    const supabase = createServerClient()
    
    // Update the existing waitlist entry with the provided information
    const { data, error } = await supabase
      .from('waitlist_entries')
      .update({
        phone_number: phoneNumber,
        country_code: countryCode,
        update_modes: updateModes
      })
      .eq('id', userId)
      .select()
      .single()
    
    if (error) {
      console.error('Error saving waitlist data:', error)
      return NextResponse.json({
        status: 'error',
        message: 'Failed to save waitlist information'
      }, { status: 500 })
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Waitlist entry saved successfully',
      data
    })
  } catch (error: any) {
    console.error('Error in save-waitlist endpoint:', error)
    return NextResponse.json({
      status: 'error',
      message: error.message || 'An unexpected error occurred'
    }, { status: 500 })
  }
} 