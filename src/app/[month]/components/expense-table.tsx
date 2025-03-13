"use client"

import React, { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Expense } from "../page"
import { format } from "date-fns"
import { convertToCurrency } from "@/lib/utils"
import { useSearchParams } from "next/navigation"

type ExpenseTableProps = {
  expenseData: Expense[]
}
const ExpenseTable = ({ expenseData }: ExpenseTableProps) => {
  const [expenses, setExpenses] = useState(expenseData)
  const [totalExpenses, setTotalExpenses] = useState(0)
  const searchParams = useSearchParams()
  const selectedDate = searchParams.get("date") || ""

  useEffect(() => {
    if (selectedDate) {
      setExpenses(expenseData.filter((expense) => expense.date === selectedDate))
    } else {
      setExpenses(expenseData)
    }
  }, [selectedDate, expenseData])

  useEffect(() => {
    const total = expenses.reduce((acc, expense) => acc + expense.amount, 0)
    setTotalExpenses(total)
  }, [expenses])

  return (
    <div className="my-4 sm:my-6">
      <div className="flex items-center gap-3">
        <h3 className="font-semibold sm:text-lg 2xl:text-xl">Transactions Records</h3>
        <p className="text-gray-600 text-xs sm:text-sm xl:text-base mt-0.5">
          Total: {convertToCurrency(totalExpenses)}
        </p>
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
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium text-[12px] px-0 sm:text-sm xl:text-base">
                {format(new Date(expense.date), "dd MMM")}
              </TableCell>
              <TableCell className="font-medium text-[12px] px-0 truncate sm:text-sm xl:text-base">
                {expense.transaction}
              </TableCell>
              <TableCell className="text-right text-[12px] sm:text-sm xl:text-base">
                {convertToCurrency(expense.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ExpenseTable
