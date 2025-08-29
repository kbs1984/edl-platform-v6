// Session 00082: Login page for dashboard
// Redirects to auth server for actual login

'use client'

import { useEffect } from 'react'

export default function LoginPage() {
  useEffect(() => {
    // Redirect to auth server login page
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:3000'
    window.location.href = `${authUrl}/login`
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Redirecting to login...</h2>
        <p className="text-sm text-gray-600 mt-2">
          If you're not redirected, <a href="http://localhost:3000/login" className="text-blue-600 hover:underline">click here</a>
        </p>
      </div>
    </div>
  )
}