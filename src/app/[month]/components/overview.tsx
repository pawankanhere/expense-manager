"use client"

import React from "react"
import { Expense } from "../page"
import { convertToCurrency, isFutureDate } from "@/lib/utils"
import { twJoin } from "tailwind-merge"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { IconFilter } from "@tabler/icons-react"
import { format, parse } from "date-fns"

type OverviewProps = {
  dates?: string[]
  expenses?: Expense[]
}

const Overview = ({ dates = [], expenses = [] }: OverviewProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  try {
    const excludeCategories = ["monthly scheduled", "yearly recurring", "monthly reserved", "ignore"]
    const dailyExpenses = expenses.filter(
      (expense) => expense?.category && !excludeCategories.includes(expense.category)
    )
    const dailyExpenseTotal = dailyExpenses.reduce((acc, expense) => acc + (expense?.amount || 0), 0)

    const updateDateFilter = (newDate: string) => {
      try {
        const params = new URLSearchParams(window.location.search)

        if (newDate) {
          params.set("date", newDate)
        } else {
          params.delete("date")
        }

        router.push(`?${params.toString()}`, { scroll: false })
      } catch (error) {
        console.error("Error updating date filter:", error)
      }
    }

    const resetFilter = () => {
      try {
        router.push("?", { scroll: false })
      } catch (error) {
        console.error("Error resetting filter:", error)
      }
    }

    return (
      <div className="border p-4 rounded-xl bg-white shadow shadow-slate-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-sm sm:text-lg lg:text-xl">Daily Expenses</h1>
            <p className="text-gray-600 text-xs mt-0.5 sm:text-sm lg:text-base">
              Total: {convertToCurrency(dailyExpenseTotal)}
            </p>
          </div>
          <Button
            className="text-xs sm:text-sm lg:text-base"
            disabled={!searchParams || !searchParams.has("date")}
            variant="ghost"
            onClick={resetFilter}
          >
            <IconFilter />
            Reset Filters
          </Button>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-7 gap-1 mt-2 2xl:mt-4">
          {dates.map((date) => {
            try {
              const filteredExpenses = dailyExpenses.filter((expense) => {
                const shortDate = expense?.date?.split("-").slice(0, 2).join("-") || ""
                return shortDate === date
              })

              const filterDate = format(
                parse(`${date}-${new Date().getFullYear()}`, "dd-MMM-yyyy", new Date()),
                "dd-MMM-yyyy"
              )

              const totalAmount = filteredExpenses.reduce((acc, expense) => acc + (expense?.amount || 0), 0)

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
            } catch (error) {
              console.error("Error rendering date button:", error)
              return null
            }
          })}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in Overview component:", error)
    return <p className="text-red-500 text-center">Something went wrong. Please try again.</p>
  }
}

export default Overview
