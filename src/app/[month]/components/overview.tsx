"use client"

import React from "react"
import { Expense } from "../page"
import { convertToCurrency, isFutureDate } from "@/lib/utils"
import { twJoin } from "tailwind-merge"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IconFilter } from "@tabler/icons-react"

type OverviewProps = {
  dates: string[]
  expenses: Expense[]
}

const Overview = ({ dates, expenses }: OverviewProps) => {
  const excludeCategories = ["monthly scheduled", "yearly recurring", "monthly reserved"]
  const dailyExpenses = expenses.filter((expense) => !excludeCategories.includes(expense.category))
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateDateFilter = (newDate: string) => {
    const params = new URLSearchParams(window.location.search)

    if (newDate) {
      params.set("date", newDate)
    } else {
      params.delete("date")
    }

    router.push(`?${params.toString()}`, { scroll: false })
  }
  const resetFilter = () => {
    router.push("?", { scroll: false })
  }
  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold sm:text-lg lg:text-xl">Monthly Overview</h1>
        <Button disabled={!searchParams.has("date")} variant="ghost" onClick={resetFilter}>
          <IconFilter />
          Reset Filters
        </Button>
      </div>
      <div className="grid grid-cols-4 md:grid-cols-7 gap-1 mt-2 2xl:mt-4">
        {dates.map((date) => {
          const filteredExpenses = dailyExpenses.filter((expense) => {
            const shortDate = expense.date.split("-").slice(0, 2).join("-")
            return shortDate === date
          })
          const filterDate = filteredExpenses.length > 0 ? filteredExpenses[0].date : ""
          const totalAmount = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0)
          const isFuture = isFutureDate(date)
          const colorClass = isFuture
            ? "bg-gray-100 text-gray-400"
            : totalAmount <= 200
            ? "bg-green-200 text-green-800 hover:bg-green-300"
            : "bg-red-200 text-red-700 hover:bg-red-300"

          return (
            <Button
              onClick={() => updateDateFilter(filterDate)}
              key={date}
              disabled={isFuture}
              className={twJoin(
                colorClass,
                "flex flex-col cursor-pointer font-medium text-[10px] rounded-lg justify-between p-1 px-2 sm:text-sm xl:text-sm xl:font-regular",
                isFuture && "cursor-none",
                "h-fit"
              )}
            >
              <p className="">{date}</p>
              <p className="text-[12px] sm:text-sm xl:text-base xl:font-medium">{convertToCurrency(totalAmount)}</p>
            </Button>
          )
        })}
      </div>
    </>
  )
}

export default Overview
