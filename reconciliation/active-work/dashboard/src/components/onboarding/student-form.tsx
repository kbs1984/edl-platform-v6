"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Selecter } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SchoolSearch } from "./school-search"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { PolicyDialog } from "@/components/policy-agreement"
import { studentAction } from "@/lib/actions/student-actions"
import { StudentData } from "@/types/form"
import { toast } from "@/hooks/use-toast"
import { stringToBase64URL } from "@supabase/ssr"

export const StudentForm = () => {
  const router = useRouter()
  const [formData, setFormData] = useState<StudentData>({
    graduationYear: new Date().getFullYear(),
    guardianEmail: "" as string,
    location: "",
    schoolId: null as string | null,
    schoolName: "" as string,
    addGuardianLater: false,
    termsAgreed: false,
  });
  const [yearType, setYearType] = useState<"graduationYear"|"currentGrade">("graduationYear");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await studentAction(formData)
    if (res.status === "error") toast({
      variant: "destructive",
      title: "Student Form Handle Submit Error",
      description: res.message,
    });
    else router.push(`/completed?type=${stringToBase64URL("student")}${formData.addGuardianLater ? `&query=${stringToBase64URL("true")}` : ""}`);
  }

  const now = new Date();
  const currentYear = now.getFullYear();
  // 7월 1일 이후면 학년도는 다음 해부터 시작하도록 조정
  const adjustedYear = now >= new Date(currentYear, 7, 1) ? currentYear + 1 : currentYear;
  const graduationYears = Array.from({ length: 9 }, (_, i) => adjustedYear + i);


  return (
    <form onSubmit={handleSubmit} className="max-w-lg w-dvw">
      <div className="space-y-6 mt-4">
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          required
          placeholder="Your Location (country)"
        />

        <div className="grid grid-cols-5 gap-2">
          {yearType === "currentGrade" ? (
            <Selecter 
              value={formData.graduationYear === "Graduated" ? "Graduated" : `${adjustedYear - formData.graduationYear + 12}th Grade`} 
              name={"graduationYear"} 
              placeholder={"Current Grade"} 
              onValueChange={(value) => setFormData((prev) => ({ ...prev, graduationYear: value === "Graduated" ? "Graduated" :Number.parseInt(value.split('th')[0]) }))}
              items={graduationYears.map((v) => ({value: v.toString(), name: `${adjustedYear - v + 12}th Grade`})).reverse().concat({name: "Graduated", value: "Graduated"})}
              classname="col-span-2"
            />
          ) : (
            <Selecter 
              value={formData.graduationYear === "Graduated" ? "Graduated" : formData.graduationYear.toString()} 
              name={"graduationYear"} 
              placeholder={"Graduation Year"} 
              onValueChange={(value) => setFormData((prev) => ({ ...prev, graduationYear: value === "Graduated" ? "Graduated" : Number.parseInt(value) }))}
              items={graduationYears.map((v) => {return { value: v.toString(), name: v.toString() }}).concat({name: "Graduated", value: "Graduated"})}
              classname="col-span-2"
            />
          )}
          <RadioGroup value={yearType} onValueChange={(value) => setYearType(value as "graduationYear"|"currentGrade")} className="relative col-span-3 self-center justify-self-center h-14 w-full bg-background/50">
            <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-secondary h-12 rounded transition-transform translate-x-0 duration-300 ${yearType === "currentGrade" && "translate-x-full"}`} />
            <RadioGroupItem value="graduationYear" className="w-1/2">Graduation Year</RadioGroupItem>
            <RadioGroupItem value="currentGrade" className="w-1/2">Current Grade</RadioGroupItem>
          </RadioGroup>
        </div>

        <div className="grid center grid-cols-4">
          {formData.addGuardianLater ? (
            <p className="text-[#636366] text-sm italic max-w-72 h-14 max-h-14 pt-2 self-center justify-self-start col-span-3">
              You can add a guardian email later, but it's required to participate in debates.
            </p>
          ) : (
            <Input
              id="guardianEmail"
              name="guardianEmail"
              type="email"
              value={formData.guardianEmail}
              onChange={handleInputChange}
              placeholder="Enter guardian email"
              className="col-span-3 mr-2"
              disabled={formData.addGuardianLater}
            />
          )}
          <div className="flex items-center space-x-2 self-center justify-self-center">
            <Checkbox
              id="addGuardianLater"
              checked={formData.addGuardianLater}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({
                  ...prev,
                  addGuardianLater: checked as boolean,
                  guardianEmail: checked ? "" : prev.guardianEmail,
                }))
              }}
            />
            <div className="text-[#bfbfbf] text-sm">
              Add later
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-foreground cursor-help ml-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="w-[200px] text-xs text-background">Guardian email is required to participate in debates</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        {console.log("🔧🔧🔧 About to render SchoolSearch, disabled:", formData.graduationYear === "Graduated")}
        <SchoolSearch formData={formData} setFormData={setFormData} disabled={formData.graduationYear === "Graduated"} />
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
        <Button type="button" variant="ghost" className="text-white" onClick={() => router.push("/onboarding/step-2")}>
          ← Back
        </Button>
        <Button
          type="submit"
          variant={'primary'}
          disabled={!formData.termsAgreed}
        >
          Complete
        </Button>
      </div>
    </form>
  )
}

