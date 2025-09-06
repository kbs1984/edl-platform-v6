"use client"

import React, { useEffect, useState } from "react"

declare global {
  interface Window {
    v5Engine: any
  }
}

/**
 * Addiction Metrics Sidebar - Displays V5 engine data
 * Session 179: Connects to V5 engine for real metrics display
 * 
 * Reads data from the V5 engine which manages addiction mechanics
 */
export function AddictionMetricsSidebar() {
  const [metrics, setMetrics] = useState({
    emcoinBalance: 0,
    currentStreak: 0,
    todayVisitors: 0,
    divisionRank: '--'
  })
  
  useEffect(() => {
    // Poll V5 engine data every 2 seconds
    const interval = setInterval(() => {
      if (window.v5Engine?.data) {
        setMetrics({
          emcoinBalance: window.v5Engine.data.emcoinBalance || 0,
          currentStreak: window.v5Engine.data.currentStreak || 0,
          todayVisitors: window.v5Engine.data.todayVisitors || 0,
          divisionRank: window.v5Engine.data.divisionRank || '--'
        })
      }
    }, 2000)
    
    return () => clearInterval(interval)
  }, [])
  
  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="text-sm font-semibold mb-2">Addiction Metrics</h3>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">EmCoin Balance:</span>
          <span className="font-mono text-primary">{metrics.emcoinBalance.toLocaleString()}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Current Streak:</span>
          <span className="font-mono">{metrics.currentStreak} days</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Today's Visitors:</span>
          <span className="font-mono">{metrics.todayVisitors}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Division Rank:</span>
          <span className="font-mono">{metrics.divisionRank}</span>
        </div>
      </div>
    </div>
  )
}