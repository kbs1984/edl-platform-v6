"use client"

import * as React from "react"
import { Eye, Flame, Coins, Trophy } from "lucide-react"
import { useEffect, useState } from "react"

interface AddictionMetrics {
  todayVisitors: number
  currentStreak: number
  emcoinBalance: number
  divisionRank: string
}

export function AddictionMetricsSidebar() {
  const [metrics, setMetrics] = useState<AddictionMetrics>({
    todayVisitors: 0,
    currentStreak: 0,
    emcoinBalance: 0,
    divisionRank: '--'
  })

  useEffect(() => {
    // Listen for V5 engine updates
    const handleV5Update = () => {
      const v5Engine = window.v5Engine as any
      if (v5Engine?.data) {
        setMetrics({
          todayVisitors: v5Engine.data.todayVisitors || 0,
          currentStreak: v5Engine.data.currentStreak || 0,
          emcoinBalance: v5Engine.data.emcoinBalance || 0,
          divisionRank: v5Engine.data.divisionRank || '--'
        })
      }
    }

    // Check if V5 engine is already loaded
    handleV5Update()

    // Set up periodic checks for V5 data
    const interval = setInterval(handleV5Update, 1000)

    // Clean up
    return () => clearInterval(interval)
  }, [])

  const formatNumber = (num: number): string => {
    return num.toLocaleString()
  }

  const formatRank = (rank: string): string => {
    return rank !== '--' ? `#${rank}` : '#--'
  }

  return (
    <div className="px-3 py-2 space-y-3">
      {/* Section Header */}
      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Progress
      </div>
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        {/* Today Visitors */}
        <div className="flex items-center gap-2 p-2 rounded-md bg-background/50">
          <Eye className="w-4 h-4 text-blue-400" />
          <div>
            <div className="text-sm font-medium">{formatNumber(metrics.todayVisitors)}</div>
            <div className="text-xs text-muted-foreground">Today</div>
          </div>
        </div>

        {/* Day Streak */}
        <div className="flex items-center gap-2 p-2 rounded-md bg-background/50">
          <Flame className="w-4 h-4 text-orange-400" />
          <div>
            <div className="text-sm font-medium">{formatNumber(metrics.currentStreak)}</div>
            <div className="text-xs text-muted-foreground">Streak</div>
          </div>
        </div>

        {/* EmCoins */}
        <div className="flex items-center gap-2 p-2 rounded-md bg-background/50">
          <Coins className="w-4 h-4 text-yellow-400" />
          <div>
            <div className="text-sm font-medium">{formatNumber(metrics.emcoinBalance)}</div>
            <div className="text-xs text-muted-foreground">EmCoins</div>
          </div>
        </div>

        {/* Division Rank */}
        <div className="flex items-center gap-2 p-2 rounded-md bg-background/50">
          <Trophy className="w-4 h-4 text-purple-400" />
          <div>
            <div className="text-sm font-medium">{formatRank(metrics.divisionRank)}</div>
            <div className="text-xs text-muted-foreground">Rank</div>
          </div>
        </div>
      </div>
    </div>
  )
}

