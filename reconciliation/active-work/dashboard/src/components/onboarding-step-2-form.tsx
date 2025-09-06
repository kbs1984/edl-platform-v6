"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, User, CircleCheck, CircleX } from "lucide-react"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { checkUsernameAvailability } from "@/lib/actions/username-action"
import { UploadUserInfoAction } from "@/lib/actions/userinfo-actions"
import { Profile } from "@/types"
import { Selecter } from "./ui/select"
import { toast } from "@/hooks/use-toast"

export function Onboarding2InputForm({ profile }: { profile: Profile }) {
  const router = useRouter()

  const initialDateOfBirth = profile.date_of_birth ? new Date(profile.date_of_birth) : undefined
  const [formData, setFormData] = useState({
    name: profile.name || "",
    username: profile.username || "",
    dateOfBirth: initialDateOfBirth,
    gender: profile.gender || "",
    imageFile: null as File | null,
  });

  const [usernameStatus, setUsernameStatus] = useState<"checking" | "available" | "taken" | "unavailable" | null>(null)
  const [usernameDebounceTimeout, setUsernameDebounceTimeout] = useState<NodeJS.Timeout | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [usernameFocused, setUsernameFocused] = useState<boolean>(false)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  // username 제한 조건 상태
  const [usernameRestrictions, setUsernameRestrictions] = useState({
    isLongEnough: formData.username.length > 5,
    hasNoSpecialCharacters: /^[a-z0-9]+$/.test(formData.username),
    isOnlyLowercaseAndNumbers: /^[a-z0-9]+$/.test(formData.username),
  })

  // handle initial image setting
  useEffect(() => {
    if (!profile.image_path) return

    // Skip fetching existing image to avoid File constructor issues
    // Just set the preview URL directly
    setImagePreview(profile.image_path)
    
    // Note: We don't need to create a File object from existing image
    // The image_path is already stored and will be used unless user uploads new one
  }, [profile.image_path])

  // 처음에 input 들어왔을때 체크
  useEffect(() => {
    if (!profile.username) return
    checkUsernameAvailability(profile.username, profile.id).then(() => {
      setUsernameStatus("available") // 어차피 true return
    })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (name === "username") {
      // username 제한 조건 업데이트 (소문자와 숫자만 포함)
      const restrictions = {
        isLongEnough: value.length > 5,
        hasNoSpecialCharacters: /^[a-z0-9]+$/.test(value),
        isOnlyLowercaseAndNumbers: /^[a-z0-9]+$/.test(value),
      }
      setUsernameRestrictions(restrictions);

      // 형식에 맞지 않으면 바로 "unavailable"로 설정
      if (!restrictions.isLongEnough || !restrictions.isOnlyLowercaseAndNumbers) {
        setUsernameStatus("unavailable");
        return;
      }

      // 유효한 형식이면 debounce 후 availability 체크
      setUsernameStatus("checking")

      if (usernameDebounceTimeout) {
        clearTimeout(usernameDebounceTimeout)
      }

      const timeout = setTimeout(async () => {
        const isAvailable = await checkUsernameAvailability(value, profile.id)
        setUsernameStatus(isAvailable ? "available" : "taken")
      }, 500)
      setUsernameDebounceTimeout(timeout)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 허용된 파일 타입: jpg, jpeg, png
      const allowedTypes = ['image/jpeg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        alert('JPG, JPEG, PNG 파일만 업로드 가능합니다.')
        return
      }
      // 파일 크기가 100kb (100000 bytes) 이하인지 확인
      if (file.size > 100000) {
        alert('이미지 크기는 100kb 이하이어야 합니다.')
        return
      }

      // 미리보기용 FileReader 사용
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setImagePreview(event.target.result as string)
        }
      }
      reader.readAsDataURL(file)
      // 실제 파일 객체를 상태에 저장
      setFormData((prev) => ({ ...prev, imageFile: file }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.name === "" ||
      formData.username === "" ||
      formData.gender === "" ||
      !formData.dateOfBirth
    ) {
      return alert("missing form");
    }

    setIsSubmitting(true);
    const data = new FormData();
    data.append("name", formData.name);
    data.append("username", formData.username);
    data.append("gender", formData.gender);
    data.append("dateOfBirth", formData.dateOfBirth.toISOString());
    
    // Only append imageFile if user uploaded a new one
    if (formData.imageFile) {
      data.append("imageFile", formData.imageFile);
    } else if (profile.image_path) {
      // If there's an existing image, pass the URL
      data.append("existingImagePath", profile.image_path);
    }

    const result = await UploadUserInfoAction(data);

    if (result.success) return router.push("/onboarding/step-3");

    alert(result.message);
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-8">
        <label htmlFor="image-upload" className="flex flex-col items-center justify-center cursor-pointer">
          <div className="w-40 h-40 bg-foreground/5 rounded-lg flex flex-col items-center justify-center mb-4 overflow-hidden text-xs text-foreground/50">
            {imagePreview ? (
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-16 h-16 text-foreground/70" />
            )}
            <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>
          <div className="cursor-pointer text-sm text-foreground/70 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <Upload size={16} /> Upload photo or logo
            </div>
            <div className="text-xs mt-2">File supported jpg, jpeg, png</div>
            <div className="text-xs">Maximum size: 100kb</div>
          </div>
        </label>

        <div className="space-y-6">
          <Input
            id="name"
            name="name"
            placeholder="Name*"
            className="mt-4"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <div className="space-y-2 relative">
            <div className="relative">
              <Input
                id="username"
                name="username"
                placeholder="Username*"
                value={formData.username}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
                onChange={handleInputChange}
                onFocus={() => setUsernameFocused(true)}
                onBlur={() => setUsernameFocused(false)}
                required
                className={`mt-4 ${
                  usernameStatus === "taken"
                    ? "border-red-500"
                    : usernameStatus === "available"
                    ? "border-green-500"
                    : ""
                }`}
              />
              {usernameStatus && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm">
                  {usernameStatus === "checking" && <span className="text-[#636366]">Checking...</span>}
                  {usernameStatus === "available" && <span className="text-green-500">Available</span>}
                  {usernameStatus === "unavailable" && <span className="text-red-500">Wrong format</span>}
                  {usernameStatus === "taken" && <span className="text-red-500">Already taken</span>}
                </div>
              )}
            </div>
            <div
              className={`absolute top-full w-full z-50 rounded bg-popover border border-popover-foreground/90 shadow-lg px-4 py-3 flex flex-col gap-2 text-sm ${
                (!usernameFocused || Object.values(usernameRestrictions).every(value => value === true)) && "hidden"
              }`}
            >
              <div className="flex items-center gap-2">
                {usernameRestrictions.isLongEnough ? <CircleCheck className="text-green-500" /> : <CircleX className="text-red-500" />}
                <span>Username longer than 5</span>
              </div>
              <div className="flex items-center gap-2">
                {usernameRestrictions.hasNoSpecialCharacters ? <CircleCheck className="text-green-500" /> : <CircleX className="text-red-500" />}
                <span>No special characters allowed</span>
              </div>
              <div className="flex items-center gap-2">
                {usernameRestrictions.isOnlyLowercaseAndNumbers ? <CircleCheck className="text-green-500" /> : <CircleX className="text-red-500" />}
                <span>Only lowercase letters and numbers</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <Input
              name={"dateOfBirth"}
              placeholder={"Date of birth*"}
              value={formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : ""}
              className="mt-4"
              onChange={() => {}}
              required
            >
              <CalendarIcon
                type="button"
                className="absolute w-7 h-7 p-1 top-1/2 -translate-y-1/2 right-4 text-font opacity-50"
              />
            </Input>
            <Popover>
              <PopoverTrigger asChild>
                <div className="absolute w-full h-full border top-0 cursor-pointer border-none" />
              </PopoverTrigger>
              <PopoverContent side="top" className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dateOfBirth}
                  onSelect={(date) => setFormData((prev) => ({ ...prev, dateOfBirth: date || undefined }))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <Selecter 
            value={formData.gender} 
            name={"gender"} 
            placeholder={"Gender *"} 
            onValueChange={(value) => setFormData((prev) => ({ ...prev, gender: value }))} 
            items={[{value: "MALE", name: "Male"}, {value: "FEMALE", name: "Female"}, {value: "do not wish to specify", name: "Do not wish to specify"}]} />
        </div>
      </div>

      <div className="flex justify-between mt-12">
        <Button type="button" variant="ghost" className="text-white" onClick={() => router.push("/onboarding/step-1")}>
          ← Back
        </Button>
        <Button
          type="submit"
          disabled={
            !usernameStatus ||
            usernameStatus === "taken" ||
            usernameStatus === "checking" ||
            isSubmitting
          }
        >
          {isSubmitting ? "Submitting..." : "Next step"}
        </Button>
      </div>
    </form>
  )
}
