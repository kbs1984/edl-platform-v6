"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

/**
 * Temporary stub context to restore dashboard functionality
 * Session 179: Created to fix import error after parallel batch issues
 * TODO: Implement proper team context with Supabase integration
 */

interface TeamContextType {
  currentTeam: any | null
  setCurrentTeam: (team: any) => void
  loading: boolean
}

const TeamContext = createContext<TeamContextType | undefined>(undefined)

export function TeamProvider({ children }: { children: ReactNode }) {
  const [currentTeam, setCurrentTeam] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)

  return (
    <TeamContext.Provider value={{ currentTeam, setCurrentTeam, loading }}>
      {children}
    </TeamContext.Provider>
  )
}

export function useTeam() {
  const context = useContext(TeamContext)
  if (context === undefined) {
    throw new Error("useTeam must be used within a TeamProvider")
  }
  return context
}