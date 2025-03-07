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
  const [month, setMonth] = React.useState(params.month as string)
  const changeMonthMutation = useChangeMonth()

  const onValueChange = async (value: string) => {
    try {
      setMonth(value)
      router.push(`/${value}`)
      await changeMonthMutation.mutateAsync(value)
    } catch (error) {
      toast.error("Failed to change month")
      console.error(error)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className="xl:text-base xl:h-12 xl:rounded-xl">
          <IconCalendarMonth className="text-gray-500 xl:text-base" />
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
