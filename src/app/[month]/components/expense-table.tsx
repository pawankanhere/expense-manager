"use client"

import React, { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Expense } from "../page"
import Fuse from "fuse.js"
import { format } from "date-fns"
import { convertToCurrency } from "@/lib/utils"
import { useSearchParams } from "next/navigation"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

import { IconFileDescription } from "@tabler/icons-react"
import { sortBy } from "lodash"
import { Input } from "@/components/ui/input"

type ExpenseTableProps = {
  expenseData?: Expense[]
}

const ExpenseTable = ({ expenseData = [] }: ExpenseTableProps) => {
  const [expenses, setExpenses] = useState<Expense[]>(expenseData)
  const [totalExpenses, setTotalExpenses] = useState<number>(0)
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const selectedDate = searchParams.get("date") || ""

  const fuse = new Fuse(expenseData, {
    keys: ["transaction", "category", "remarks"],
    threshold: 0.3, // Adjust for stricter or looser matches
  })

  useEffect(() => {
    let filteredExpenses = expenseData
    try {
      if (selectedDate) {
        filteredExpenses = expenseData.filter((expense) => expense.date === selectedDate)
      } else {
        filteredExpenses = sortBy(expenseData, "date")
      }
      if (searchQuery.trim()) {
        const results = fuse.search(searchQuery)
        filteredExpenses = results.map((result) => result.item)
      }
      setExpenses(filteredExpenses)
    } catch (error) {
      console.error("Error filtering expenses:", error)
      setExpenses([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, expenseData, searchQuery])

  useEffect(() => {
    try {
      const total = expenses.reduce((acc, expense) => acc + (expense.amount || 0), 0)
      setTotalExpenses(total)
    } catch (error) {
      console.error("Error calculating total expenses:", error)
      setTotalExpenses(0)
    }
  }, [expenses])

  return (
    <div className="my-4 sm:my-6">
      <div className="flex flex-col sm:hidden items-start gap-1">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold w-fit sm:text-lg 2xl:text-xl">Transactions Records</h3>
          <p className="text-gray-600 w-fit text-xs sm:text-sm xl:text-base mt-0.5">
            Total: {convertToCurrency(totalExpenses)}
          </p>
        </div>
        <Input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded-md text-sm"
        />
      </div>
      <div className="hidden sm:grid sm:[grid-template-columns:max-content_130px_1fr] items-center gap-3">
        <h3 className="font-semibold w-fit sm:text-lg 2xl:text-xl">Transactions Records</h3>
        <p className="text-gray-600 w-fit text-xs sm:text-sm xl:text-base mt-0.5">
          Total: {convertToCurrency(totalExpenses)}
        </p>
        <Input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded-md text-sm"
        />
      </div>
      <Table className="xl:mt-2">
        <TableHeader>
          <TableRow>
            <TableHead className="w-fit px-0 text-xs sm:text-sm xl:text-base">Date</TableHead>
            <TableHead className="w-[200px] px-0 text-xs sm:text-sm xl:text-base">Transactions</TableHead>
            <TableHead className="text-right text-xs sm:text-sm xl:text-base">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <TableRow key={expense.id || Math.random()}>
                <TableCell className="font-medium text-[12px] px-0 sm:text-sm xl:text-base">
                  {expense.date ? format(new Date(expense.date), "dd MMM") : "N/A"}
                </TableCell>
                <TableCell className="font-medium text-[12px] px-0 truncate sm:text-sm xl:text-base flex items-center gap-1">
                  {expense.transaction || "Unknown"}{" "}
                  <span className="hidden font-normal sm:inline-block sm:text-xs sm:text-gray-400 xl:text-sm xl:ml-2">
                    {expense.category || "Uncategorized"}
                  </span>
                  {expense.remarks && (
                    <HoverCard>
                      <HoverCardTrigger>
                        <IconFileDescription size={16} className="text-gray-400 hover:text-gray-500" />
                      </HoverCardTrigger>
                      <HoverCardContent className="text-sm text-gray-800">Remarks: {expense.remarks}</HoverCardContent>
                    </HoverCard>
                  )}
                </TableCell>
                <TableCell className="text-right text-[12px] sm:text-sm xl:text-base">
                  {convertToCurrency(expense.amount || 0)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-500">
                No transactions found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default ExpenseTable
