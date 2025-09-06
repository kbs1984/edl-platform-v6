import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    // Get user from session
    const { data: { user } } = await supabase.auth.getUser()
    
    // Extract telemetry data
    const {
      event_type,
      event_name,
      metadata = {},
      session_id,
      path,
      duration_ms
    } = body

    // Get client info
    const ip_address = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown'
    const user_agent = request.headers.get('user-agent') || 'unknown'

    // Insert telemetry event
    const { data, error } = await supabase
      .from('telemetry.events' as any)
      .insert({
        event_type,
        event_name,
        user_id: user?.id || null,
        session_id,
        metadata,
        ip_address,
        user_agent,
        path,
        duration_ms,
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Telemetry insert error:', error)
      return NextResponse.json(
        { error: 'Failed to record telemetry' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (error) {
    console.error('Telemetry API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}