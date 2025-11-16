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
      <nav className="w-full mt-0 sm:mt-4 p-0 sm:p-4 border-0 sm:border rounded-none sm:rounded-xl bg-white shadow-none sm:shadow sm:shadow-slate-200">
        <div className="flex justify-between items-center w-full p-4 sm:p-0">
          <MonthsDropdown />
          <div className="flex gap-2 items-center">
            <Button
              variant="secondary"
              onClick={onHomeClick}
              size="sm"
              className="xl:h-12 sm:rounded-lg sm:h-9 xl:px-4 sm:text-sm xl:text-sm xl:rounded-xl sm:p-2 xl:p-4"
              title="Home"
            >
              <IconHome className="sm:block xl:hidden" />
              <span className="hidden xl:inline">Home</span>
            </Button>
            <Button
              onClick={onAddExpenseClick}
              size="sm"
              className="xl:h-12 sm:rounded-lg sm:h-9 xl:px-4 sm:text-sm xl:text-sm xl:rounded-xl sm:p-2 xl:p-4"
              title="Add Expense"
            >
              <IconCalendarDollar className="sm:block xl:hidden" />
              <span className="hidden xl:inline">Add Expense</span>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
