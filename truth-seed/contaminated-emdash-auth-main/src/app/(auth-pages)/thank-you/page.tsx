import Link from "next/link"
import { Mail, CheckCircle } from "lucide-react"

import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ThankYouPage() {
  return (
    <div className="relative">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Thank You for Signing Up!</CardTitle>
        <CardDescription className="text-lg">Please check your email to verify your account</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg p-4 border bg-background/50">
          <div className="flex items-start space-x-3">
            <Mail className="h-6 w-12" />
            <div>
              <p className="font-medium">Verification Email Sent</p>
              <p className="text-sm-600">
                We've sent a verification link to your email address. Please click the link to activate your account.
              </p>
            </div>
          </div>
        </div>
        <div className="text-sm">
          <p>Once verified, you'll be able to:</p>
          <ul className="ml-5 mt-2 list-disc space-y-1">
            <li>Participate in debates</li>
            <li>Create your own debate topics</li>
            <li>View ongoing discussions</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-3">
        <p className="text-center text-xs">
          Didn't receive an email? <br /> 
          Check your spam folder or{" "}
          <Link href="/resend-verification" className="text-text underline underline-offset-2">
            click here to resend
          </Link>
        </p>
      </CardFooter>
      <p className="absolute mt-8 text-center text-sm top-full -translate-y-1 left-1/2 -translate-x-1/2 w-full">
        Need help? Contact our{" "}
        <Link href="/support" className="text-text underline underline-offset-2">
          support team
        </Link>
      </p>
    </div>
  )
}

