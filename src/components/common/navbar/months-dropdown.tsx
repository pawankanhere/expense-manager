"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useParams, useRouter } from "next/navigation"
import { capitalize } from "lodash"
import { toast } from "sonner"
import { useChangeMonth } from "@/app/hooks"
import { IconCalendarMonth } from "@tabler/icons-react"

export function MonthsDropdown() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [month, setMonth] = React.useState(params.month as string)
  const changeMonthMutation = useChangeMonth()

  const onValueChange = async (value: string) => {
    if (isLoading) return

    setIsLoading(true)
    try {
      setMonth(value)
      await changeMonthMutation.mutateAsync(value)
      router.push(`/${value}`, { scroll: false })
    } catch (error) {
      setMonth(params.month as string)
      toast.error("Failed to change month")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Button size="sm" variant="outline" className="xl:text-base sm:text-sm sm:h-9 xl:h-12 xl:rounded-xl">
          <IconCalendarMonth className="text-gray-500 sm:text-base" />
          {capitalize(month)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={month} onValueChange={onValueChange}>
          <DropdownMenuRadioItem value="jan">Jan</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="feb">Feb</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="mar">Mar</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="apr">Apr</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="may">May</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="jun">Jun</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="jul">Jul</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="aug">Aug</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="sep">Sep</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oct">Oct</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="nov">Nov</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dec">Dec</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
