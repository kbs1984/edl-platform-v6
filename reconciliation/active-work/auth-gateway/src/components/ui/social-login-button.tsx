"use client"

import { Button } from "@/components/ui/button"

type SocialLoginButtonProps = {
  provider: 'google' | 'github'
  children: React.ReactNode
}

export function SocialLoginButton({ provider, children }: SocialLoginButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full"
      onClick={() => {
        // TODO: Implement social login
        console.log(`Social login with ${provider}`)
      }}
    >
      {children}
    </Button>
  )
}