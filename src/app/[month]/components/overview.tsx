"use client"

import React from "react"
import { Expense } from "../page"
import { convertToCurrency, isFutureDate } from "@/lib/utils"
import { twJoin } from "tailwind-merge"

type OverviewProps = {
  dates: string[]
  expenses: Expense[]
}

const Overview = ({ dates, expenses }: OverviewProps) => {
  return (
    <>
      <h1 className="font-semibold 2xl:text-xl">Monthly Overview</h1>
      <div className="grid grid-cols-4 md:grid-cols-7 gap-1 mt-2 2xl:mt-4">
        {dates.map((date) => {
          const filteredExpenses = expenses.filter((expense) => {
            const shortDate = expense.date.split("-").slice(0, 2).join("-")
            return shortDate === date
          })
          const totalAmount = filteredExpenses.reduce((acc, expense) => acc + expense.amount, 0)
          const isFuture = isFutureDate(date)
          const colorClass = isFuture
            ? "bg-gray-100 text-gray-400"
            : totalAmount <= 200
            ? "bg-green-200 text-green-800"
            : "bg-red-200 text-red-700"

          return (
            <div
              key={date}
              className={twJoin(
                colorClass,
                "flex flex-col font-medium text-[10px] rounded-lg justify-between p-2 px-2 2xl:text-sm 2xl:font-regular"
              )}
            >
              <p className="">{date}</p>
              <p className="text-[12px] 2xl:text-base 2xl:font-medium">{convertToCurrency(totalAmount)}</p>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default Overview
