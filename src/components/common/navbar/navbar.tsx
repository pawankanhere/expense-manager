"use client"

import React from "react"
import { MonthsDropdown } from "./months-dropdown"
import { Button } from "@/components/ui/button"
import { useParams, useRouter } from "next/navigation"

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
    <header className="py-4 border-b border-gray-200 flex justify-between items-center w-full">
      <nav className="w-full">
        <div className="flex justify-between items-center w-full">
          <MonthsDropdown />
          <div className="flex gap-2 items-center">
            <Button onClick={onHomeClick} size="sm">
              Home
            </Button>
            <Button onClick={onAddExpenseClick} size="sm">
              Add Expense
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
