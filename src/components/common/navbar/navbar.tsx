"use client"

import React from "react"
import { MonthsDropdown } from "./months-dropdown"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"
import { IconCalendarDollar, IconHome } from "@tabler/icons-react"

const Navbar = () => {
  const params = useParams()
  const month = params.month as string
  const router = useRouter()
  const onAddExpenseClick = () => {
    router.push(`/${month}/add-expense`)
  }
  const onHomeClick = () => {
    router.push(`/${month}`)
  }
  return (
    <header className="flex justify-between items-center w-full">
      <nav className="w-full mt-4 p-4 border rounded-xl bg-white shadow shadow-slate-200">
        <div className="flex justify-between items-center w-full">
          <MonthsDropdown />
          <div className="flex gap-2 items-center">
            <Button
              variant="secondary"
              onClick={onHomeClick}
              size="sm"
              className="xl:h-12 sm:rounded-lg sm:h-9 xl:px-4 sm:text-sm xl:text-sm xl:rounded-xl"
            >
              <IconHome />
              Home
            </Button>
            <Button
              onClick={onAddExpenseClick}
              size="sm"
              className="xl:h-12 sm:rounded-lg sm:h-9 xl:px-4 sm:text-sm xl:text-sm xl:rounded-xl"
            >
              <IconCalendarDollar />
              Add Expense
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
