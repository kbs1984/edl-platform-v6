"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Selecter } from "@/components/ui/select"
import { sendOtp, verifyOtp } from "@/lib/actions/otp-actions"
import { toast } from "@/hooks/use-toast"
import { PolicyDialog, PolicyType } from "@/components/policy-agreement"
import { Checkbox } from "@/components/ui/checkbox"

import * as countryCodes from "country-codes-list"
import { guardianAction } from "@/lib/actions/guardian-actions"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { stringToBase64URL } from "@supabase/ssr"

export const GuardianForm = () => {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState({
    phone: "",
    termsAgreed: [false, false, false, false, false],
  })

  const [timer, setTimer] = useState(300);
  const [countryCode, setCountryCode] = useState("+82");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const getPhone = async () => {
      const { data: { user }} = await supabase.auth.getUser();
      if (user?.phone) {
        setPhoneNumber(user.phone);
        setFormData({phone: user.phone || "", termsAgreed: formData.termsAgreed})
        setIsVerified(true);
        setIsCodeSent(true);
      }
    }
    getPhone();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isCodeSent && !isVerified) {
      // 코드 전송시 타이머를 300초로 리셋
      setTimer(300)
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isCodeSent, isVerified])

  // 남은 시간을 MM:SS 포맷으로 변환하는 함수
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleSendCode = async () => {
    const res = await sendOtp(countryCode + phoneNumber)
    if (res.data.user) setIsCodeSent(true)
    if (res.error)
      toast({
        variant: "destructive",
        title: `Send Code Error`,
        description: res.error?.message,
      })
  }

  const handleVerifyCode = async () => {
    const res = await verifyOtp(countryCode + phoneNumber, verificationCode)
    if (res.data.user) setIsVerified(true)
    if (res.error)
      toast({
        variant: "destructive",
        title: `Verify Code Error`,
        description: res.error?.message,
      })
  }

  const handleSubmit = async () => {
    const res = await guardianAction({
      phone: formData.phone,
      termsAgreed: formData.termsAgreed.every(Boolean)
    });

    if (res.status === "error") toast({
      variant: "destructive",
      title: `Guardian Form Submit Error`,
      description: res.message,
    })
    else router.push(`/completed?type=${stringToBase64URL("guardian")}`);
  }

  return (
    <div className="max-w-lg m-auto min-w-[540px]">
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex gap-2 items-center w-full">
              <Selecter
                value={countryCode}
                name={"countryCode"}
                placeholder={"Country Code"}
                defaultValue={"+82"}
                onValueChange={setCountryCode}
                classname="max-w-32 min-w-32"
                items={countryCodes.all().map((v) => ({
                  value: `+${v.countryCallingCode}`,
                  name: `+${v.countryCallingCode} ${v.countryNameEn}`,
                }))}
              />
              <Input
                id="phone"
                type="tel"
                placeholder="Your phone number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                name="phone"
                className="w-full relative"
                disabled={isVerified}
              >
                {isVerified && (
                  <p className="text-sm text-green-500 absolute top-1/2 -translate-y-1/2 right-4">
                    verified
                  </p>
                )}
              </Input>
              {!isVerified && (
                <Button
                  onClick={handleSendCode}
                  disabled={!phoneNumber}
                  variant={"primary"}
                  className="h-12"
                >
                  {isCodeSent ? "Resend" : "Send Code"}
                </Button>
              )}
            </div>
          </div>

          {(isCodeSent && !isVerified) && (
            <div className="space-y-2">
              <div className="flex gap-2 items-center">
                <Input
                  id="code"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="w-full"
                  name="code"
                >
                  {/* 타이머 표시 */}
                  <div className="text-sm text-green-500 absolute right-3 top-1/2 -translate-y-1/2">
                    {formatTime(timer)}
                  </div>
                </Input>
                <Button
                  onClick={handleVerifyCode}
                  disabled={verificationCode.length !== 6 || isVerified}
                  className="h-12"
                  variant={"primary"}
                >
                  Verify
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-10 space-y-4 ml-2">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="termsAgreed"
            checked={formData.termsAgreed[0]}
            onCheckedChange={(checked) => {
              setFormData((prev) => ({
                ...prev,
                termsAgreed: prev.termsAgreed.map((v, j) => (j === 0 ? checked as boolean : v)),
              }))
            }}
            required
            className="mt-1"
          />
          <div className="text-foreground/80 text-sm pt-0.5">
            I read and agree to our{" "}<PolicyDialog type={"conditions"} /> and{" "}<PolicyDialog type={"privacy"} />.
          </div>
        </div>
        {["manage", "payment", "responsible", "personal"].map((v, i) => {
          return (
            <div className="flex items-center space-x-2" key={i + 1}>
              <Checkbox
                id={`term ${i}`}
                checked={formData.termsAgreed[i + 1]}
                onCheckedChange={(checked) => {
                  setFormData((prev) => ({
                    ...prev,
                    termsAgreed: prev.termsAgreed.map((v, j) =>
                      i + 1 === j ? (checked as boolean) : v
                    ),
                  }))
                }}
                required
              />
              <div className="text-foreground/80 text-sm pt-0.5">
                I read and agree to our{" "}<PolicyDialog type={v as PolicyType} />.
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex justify-between mt-12">
        <Button type="button" variant="ghost" className="text-white" onClick={() => {}}>
          ← Back
        </Button>
        <Button
          type="submit"
          variant={'primary'}
          disabled={!phoneNumber || !isVerified || !formData.termsAgreed.every(Boolean)}
          onClick={handleSubmit}
        >
          Complete
        </Button>
      </div>
    </div>
  )
}
