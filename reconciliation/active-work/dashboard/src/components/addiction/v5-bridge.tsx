"use client"

import React, { useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

declare global {
  interface Window {
    v5Engine: any
    V5_CONFIG: any
  }
}

/**
 * V5 Addiction Bridge - Connects V5 vanilla JS engine to React
 * Session 179: Properly implemented to initialize V5 engine
 * 
 * This bridges the V5 addiction mechanics (EmCoin, visitors, etc.) to V6
 * The V5 engine runs in vanilla JS and updates the DOM directly
 */
export function V5AddictionBridge() {
  useEffect(() => {
    // Initialize V5 engine after mount
    if (typeof window !== 'undefined' && window.v5Engine) {
      const supabase = createClient()
      
      // Initialize with Supabase client for data fetching
      window.v5Engine.init({
        mountPoint: 'v5-addiction-bar',
        supabaseClient: supabase
      })
    }
  }, [])
  
  // This component bridges V5 vanilla JS with React
  // The actual V5 engine loads from public/v5-engine/
  return null // Data-only mount point, no visual rendering
}