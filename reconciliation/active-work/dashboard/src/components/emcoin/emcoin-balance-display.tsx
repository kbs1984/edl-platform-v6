"use client"

import React from "react"

/**
 * Temporary stub component to restore dashboard functionality
 * Session 179: Created to fix import error after parallel batch issues
 * TODO: Implement proper EmCoin balance display with Supabase integration
 */

export function EmCoinBalanceCompact() {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-yellow-500">🪙</span>
      <span>0 EmCoins</span>
    </div>
  )
}

export function EmCoinBalanceDisplay() {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <h3 className="text-sm font-semibold mb-2">EmCoin Balance</h3>
      <div className="text-2xl font-bold text-yellow-500">
        🪙 0
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Complete activities to earn EmCoins
      </p>
    </div>
  )
}