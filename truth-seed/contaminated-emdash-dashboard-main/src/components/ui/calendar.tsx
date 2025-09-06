"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

export function Calendar(props: CalendarProps) {
  const fromYear = 1900
  const toYear = new Date().getFullYear()
  const years = Array.from({ length: toYear - fromYear + 1 }, (_, i) => toYear - i)

  // 선택된 월을 상태로 관리 (DayPicker의 controlled 모드)
  const [selectedMonth, setSelectedMonth] = React.useState(new Date())
  // 캡션 클릭시 연도 선택 dropdown 토글
  const [yearDropdownOpen, setYearDropdownOpen] = React.useState(false)

  const handleYearSelect = (year: number) => {
    // 선택한 연도로 월 변경 (월은 기존 selectedMonth 유지)
    setSelectedMonth(new Date(year, selectedMonth.getMonth(), 1))
    setYearDropdownOpen(false)
  }

  // 커스텀 CaptionLabel 컴포넌트
  const CaptionLabel = ({ displayMonth }: { displayMonth: Date }) => {
    return (
      <div className="relative">
        {/* 클릭 시 연도 선택 dropdown 토글 */}
        <div
          className="cursor-pointer"
          onClick={() => setYearDropdownOpen((prev) => !prev)}
        >
          {format(displayMonth, "MMM yyyy")}
        </div>
        {yearDropdownOpen && (
          <div className="absolute top-full left-1/2 -translate-x-1/2 z-10 mt-1 max-h-64 w-32 overflow-auto rounded border bg-foreground shadow-md">
            {years.map((year) => (
              <div
                key={year}
                className="cursor-pointer p-2 hover:bg-background/10 text-background text-center relative"
                onClick={() => handleYearSelect(year)}
              >
                <div className="absolute border border-background/15 top-0 left-2 right-2"/>
                {year}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <DayPicker
      month={selectedMonth}
      onMonthChange={setSelectedMonth}
      showOutsideDays
      className={cn("p-3", props.className)}
      fromYear={fromYear}
      toYear={toYear}
      classNames={{
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell:
          "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-foreground text-foreground hover:bg-foreground hover:text-foreground focus:bg-foreground focus:text-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground aria-selected:bg-accent/50 aria-selected:text-muted-foreground",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...props.classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        CaptionLabel: CaptionLabel,
      }}
      {...props}
    />
  )
}
