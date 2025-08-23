"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Selecter } from "@/components/ui/select"
import { sendOtp, verifyOtp } from "@/lib/actions/otp-actions"
import { toast } from "@/hooks/use-toast"

import * as countryCodes from "country-codes-list"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { Textarea } from "@/components/ui/textarea"
import { checkUserEmail, judgeAction } from "@/lib/actions/judge-actions"
import { PolicyDialog } from "../policy-agreement"
import { Checkbox } from "@/components/ui/checkbox"
import { stringToBase64URL } from "@supabase/ssr"

export interface JudgeData {
  bio: string;
  phone: string
  jobTitle: string;
  referralId?: string;
  termsAgreed: boolean;
}

export const JudgeForm = () => {
  const router = useRouter();
  const supabase = createClient();

  const [formData, setFormData] = useState<JudgeData>({
    bio: "",
    phone: "",
    jobTitle: "",
    termsAgreed: false,
  })

  const [timer, setTimer] = useState(300);
  const [countryCode, setCountryCode] = useState("+82");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const [referralEmail, setReferralEmail] = useState("");
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null)
  const [referralValid, setReferralValid] = useState<"pending" | "valid" | "invalid" | null>(null);

  useEffect(() => {
    const getPhone = async () => {
      const { data: { user }} = await supabase.auth.getUser();
      if (user?.phone) {
        setPhoneNumber(user.phone);
        setFormData((props) => ({...props, phone: user.phone || ""}))
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
  }, [isCodeSent, isVerified]);

  // referral email 입력값이 변경될 때마다 (디바운스 적용) 체크 API 호출
  const handleReferralChange = (email: string) => {
    setReferralEmail(email);
    if (email == "") {
      setReferralValid(null);
      return;
    }
    setReferralValid("pending");

    if (debounceTimeout) {
      clearTimeout(debounceTimeout)
    }
    const timeout = setTimeout(async () => {
      const referralId = await checkUserEmail(email);
      setReferralValid(referralId ? "valid" : "invalid");
      if (referralId) setFormData((props) => ({...props, referralId: referralId}));
    }, 500)
    setDebounceTimeout(timeout)
  }

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
        title: "handleSendCode Error",
        description: res.error?.message,
      });
  }

  const handleVerifyCode = async () => {
    const res = await verifyOtp(countryCode + phoneNumber, verificationCode)
    if (res.data.user) setIsVerified(true)
    if (res.error)
      toast({
        variant: "destructive",
        title: "handleVerifyCode Error",
        description: res.error?.message,
      });
  }

  const handleSubmit = async () => {
    const res = await judgeAction(formData);

    if (res.status === "error") toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: res.message,
    })
    else router.push(`/completed?type=${stringToBase64URL("judge")}`);
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

      <div className="space-y-4 mt-4">
        <Input 
          name={"jobTitle"} 
          placeholder={"Job title & affiliation"} 
          value={formData.jobTitle}
          onChange={(e) => setFormData((props) => ({...props, jobTitle: e.target.value}))} 
        />
        <Textarea 
          name={"bio"} 
          placeholder={"Short bio (including educational background)"} 
          value={formData.bio} 
          onChange={(e) => setFormData((props) => ({...props, bio: e.target.value}))} 
          height={224}
        />
        <Input
          name={"referral"}
          placeholder={"Referral User Email"}
          value={referralEmail}
          onChange={(e) => handleReferralChange(e.target.value)}
        >
          {referralValid && referralValid === "pending" ? (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm">
              Checking...
            </div>
          ) : referralValid === "valid" ? (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-green-500">
              Valid
            </div>
          ) : referralValid === "invalid" ? (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-red-500">
              Invalid
            </div>
          ) : null}
        </Input>
      </div>

      <div className="mt-8 space-y-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="termsAgreed"
            checked={formData.termsAgreed}
            onCheckedChange={(checked) => {
              setFormData((prev) => ({ ...prev, termsAgreed: checked as boolean }))
            }}
            required
            className="mt-1"
          />
          <div className="text-foreground/80 text-sm pt-0.5">
            I read and agree to our{" "}<PolicyDialog type={"conditions"} /> {" "}and{" "}<PolicyDialog type={"privacy"} />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-12">
        <Button type="button" variant="ghost" className="text-white" onClick={() => {}}>
          ← Back
        </Button>
        <Button
          type="submit"
          variant={'primary'}
          disabled={!phoneNumber || !isVerified || !formData.termsAgreed || referralValid === "invalid" || referralValid === "pending" || !formData.jobTitle || !formData.bio}
          onClick={handleSubmit}
        >
          Complete
        </Button>
      </div>
    </div>
  )
}
