'use client'

import { useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

// Session ID persists for the browser session
const SESSION_ID = typeof window !== 'undefined' 
  ? sessionStorage.getItem('telemetry_session_id') || uuidv4()
  : 'server'

if (typeof window !== 'undefined' && !sessionStorage.getItem('telemetry_session_id')) {
  sessionStorage.setItem('telemetry_session_id', SESSION_ID)
}

interface TelemetryEvent {
  event_type: 'page_view' | 'user_action' | 'api_call' | 'error' | 'performance'
  event_name: string
  metadata?: Record<string, any>
  path?: string
  duration_ms?: number
}

export function useTelemetry() {
  const trackEvent = useCallback(async (event: TelemetryEvent) => {
    try {
      await fetch('/api/telemetry/event', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          session_id: SESSION_ID,
          path: event.path || window.location.pathname,
        }),
      })
    } catch (error) {
      console.error('Failed to send telemetry:', error)
    }
  }, [])

  const trackPageView = useCallback((path?: string) => {
    trackEvent({
      event_type: 'page_view',
      event_name: 'page_viewed',
      path: path || window.location.pathname,
      metadata: {
        referrer: document.referrer,
        screen_width: window.screen.width,
        screen_height: window.screen.height,
      }
    })
  }, [trackEvent])

  const trackAction = useCallback((action: string, metadata?: Record<string, any>) => {
    trackEvent({
      event_type: 'user_action',
      event_name: action,
      metadata
    })
  }, [trackEvent])

  const trackError = useCallback((error: Error | string, context?: Record<string, any>) => {
    trackEvent({
      event_type: 'error',
      event_name: typeof error === 'string' ? error : error.message,
      metadata: {
        ...context,
        stack: typeof error === 'object' ? error.stack : undefined,
      }
    })
  }, [trackEvent])

  const trackPerformance = useCallback((metric: string, value: number, unit: string = 'ms') => {
    trackEvent({
      event_type: 'performance',
      event_name: metric,
      duration_ms: unit === 'ms' ? value : undefined,
      metadata: {
        value,
        unit
      }
    })
  }, [trackEvent])

  // Track page views automatically
  useEffect(() => {
    trackPageView()
  }, [trackPageView])

  return {
    trackEvent,
    trackPageView,
    trackAction,
    trackError,
    trackPerformance,
    sessionId: SESSION_ID
  }
}