"use client"

import React, { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Fuse from "fuse.js"
import { format } from "date-fns"
import { convertToCurrency } from "@/lib/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"

import { IconEdit, IconFileDescription } from "@tabler/icons-react"
import { sortBy } from "lodash"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Expense } from "../types"

type ExpenseTableProps = {
  expenseData?: Expense[]
  onEditExpense: (params: { uuid: string; amount: number }) => Promise<{
    status: number
    message: string
  }>
}

const ExpenseTable = ({ expenseData = [], onEditExpense }: ExpenseTableProps) => {
  const [displayedExpenses, setDisplayedExpenses] = useState<Expense[]>(expenseData)
  const [totalExpenses, setTotalExpenses] = useState<number>(0)
  const [editingExpenseId, setEditingExpenseId] = useState<string | null>(null)
  const [currentEditValue, setCurrentEditValue] = useState<string>("") // Store as string for input control

  const searchParams = useSearchParams()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const selectedDate = searchParams.get("date") || ""

  const fuse = new Fuse(expenseData, {
    keys: ["transaction", "category", "remarks", "date"],
    threshold: 0.3,
  })

  useEffect(() => {
    let filteredExpenses = expenseData
    try {
      if (selectedDate) {
        filteredExpenses = expenseData.filter((expense) => expense.date === selectedDate)
      } else {
        filteredExpenses = sortBy(expenseData, "date").reverse()
      }
      if (searchQuery.trim()) {
        const results = fuse.search(searchQuery)
        const searchResultIds = new Set(results.map((result) => result.item.id))
        filteredExpenses = filteredExpenses.filter((exp) => exp.id && searchResultIds.has(exp.id))
      }
      setDisplayedExpenses(filteredExpenses)
    } catch (error) {
      console.error("Error filtering expenses:", error)
      setDisplayedExpenses([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, expenseData, searchQuery])

  useEffect(() => {
    try {
      const total = displayedExpenses.reduce((acc, expense) => acc + (expense.amount || 0), 0)
      setTotalExpenses(total)
    } catch (error) {
      console.error("Error calculating total expenses:", error)
      setTotalExpenses(0)
    }
  }, [displayedExpenses])
  const handleEditClick = (expense: Expense) => {
    if (!expense.id) return
    setEditingExpenseId(expense.id)
    setCurrentEditValue((expense.amount ?? 0).toString())
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and a single decimal point for input
    const value = e.target.value
    if (/^\d*\.?\d*$/.test(value)) {
      setCurrentEditValue(value)
    }
  }

  const handleSaveEdit = async (expense: Expense) => {
    if (editingExpenseId === null || !expense.id) return

    const originalAmount = expense.amount ?? 0
    const newAmount = parseFloat(currentEditValue)

    if (isNaN(newAmount) || newAmount < 0) {
      toast.error("Invalid amount entered.") // Use a toast notification
      // Optionally reset input to original value or keep editing
      // setCurrentEditValue(originalAmount.toString());
      return // Stop if not a valid positive number
    }

    if (newAmount === originalAmount) {
      // No change, just exit edit mode
      setEditingExpenseId(null)
      setCurrentEditValue("")
      return
    }

    // --- Optimistic UI Update ---
    const updatedDisplayedExpenses = displayedExpenses.map((e) =>
      e.id === editingExpenseId ? { ...e, amount: newAmount } : e
    )
    setDisplayedExpenses(updatedDisplayedExpenses)

    setEditingExpenseId(null)
    setCurrentEditValue("")

    try {
      await onEditExpense({ uuid: expense.id, amount: newAmount })
      router.refresh()
      toast.success("Expense updated successfully!") // Success feedback

      // Note: If onEditExpense modifies the source `expenseData` in the parent,
      // the `useEffect` listening to `expenseData` will automatically handle
      // refreshing the table based on the *actual* new data from the parent.
      // No need to manually set `expenseData` here.
    } catch (error) {
      console.error("Failed to update expense in backend:", error)
      toast.error("Failed to save changes. Reverting.") // Error feedback

      // --- Rollback Optimistic Update ---
      // 4. If backend fails, revert the local displayedExpenses state
      const revertedDisplayedExpenses = displayedExpenses.map((e) =>
        e.id === expense.id ? { ...e, amount: originalAmount } : e
      )
      setDisplayedExpenses(revertedDisplayedExpenses)
    }
  }

  const handleCancelEdit = () => {
    setEditingExpenseId(null)
    setCurrentEditValue("")
  }

  return (
    <div className="my-0 sm:my-4 border-0 sm:border p-0 sm:p-4 rounded-none sm:rounded-xl bg-white shadow-none sm:shadow sm:shadow-slate-200 overflow-hidden">
      <div className="flex flex-col sm:hidden items-start gap-1 p-4 pb-2">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-base w-fit sm:text-lg 2xl:text-xl">Transactions Records</h3>
          <p className="text-gray-600 w-fit text-sm sm:text-sm xl:text-base mt-0.5">
            Total: {convertToCurrency(totalExpenses)}
          </p>
        </div>
        <Input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded-lg text-sm h-12"
        />
      </div>
      <div className="hidden sm:grid sm:[grid-template-columns:max-content_130px_1fr] items-center gap-3 p-4 pb-2">
        <h3 className="font-semibold w-fit sm:text-lg 2xl:text-xl">Transactions Records</h3>
        <p className="text-gray-600 w-fit text-xs sm:text-sm xl:text-base mt-0.5">
          Total: {convertToCurrency(totalExpenses)}
        </p>
        <Input
          type="text"
          placeholder="Search transactions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded-md text-sm lg:h-12 lg:rounded-xl"
        />
      </div>
      <div className="overflow-hidden">
        <Table className="xl:mt-4 w-full table-fixed">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4 py-2 text-sm xl:text-base font-medium text-left w-20">Date</TableHead>
              <TableHead className="px-4 py-2 text-sm xl:text-base font-medium text-left flex-1">
                Transactions
              </TableHead>
              <TableHead className="text-right px-4 py-2 text-sm xl:text-base font-medium w-20">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedExpenses.length > 0 ? (
              displayedExpenses.map((expense) => (
                <TableRow key={expense.id || Math.random()} className="hover:bg-gray-50">
                  <TableCell className="font-medium text-sm xl:text-base px-4 py-3 w-20">
                    {expense.date ? format(new Date(expense.date), "dd MMM") : "N/A"}
                  </TableCell>
                  <TableCell className="sm:font-medium text-sm xl:text-base px-4 py-3 min-w-0">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="truncate">{expense.transaction || "Unknown"}</span>
                      <span className="hidden font-normal sm:inline-block sm:text-xs sm:text-gray-400 xl:text-sm flex-shrink-0">
                        {expense.category || "Uncategorized"}
                      </span>
                      {expense.remarks && (
                        <HoverCard>
                          <HoverCardTrigger>
                            <IconFileDescription
                              size={16}
                              className="text-gray-400 hover:text-gray-500 flex-shrink-0"
                            />
                          </HoverCardTrigger>
                          <HoverCardContent className="text-sm text-gray-800">
                            Remarks: {expense.remarks}
                          </HoverCardContent>
                        </HoverCard>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm xl:text-base px-4 py-3 w-20">
                    <div className="flex items-center justify-end gap-1">
                      {editingExpenseId === expense.id ? (
                        <div className="flex items-center justify-end">
                          <Input
                            type="text"
                            inputMode="decimal"
                            value={currentEditValue}
                            onChange={handleEditChange}
                            onBlur={() => handleSaveEdit(expense)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit(expense)
                              if (e.key === "Escape") handleCancelEdit()
                            }}
                            className="w-20 text-right py-0.5 text-sm sm:text-sm h-8"
                            autoFocus
                          />
                        </div>
                      ) : (
                        <>
                          <span>{convertToCurrency(expense.amount || 0)}</span>
                          {editingExpenseId !== expense.id && (
                            <Button
                              className="h-6 w-6 cursor-pointer hover:bg-gray-200 p-0.5 ml-1"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(expense)}
                              title="Edit amount"
                            >
                              <IconEdit size={14} className="text-gray-500" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={3} className="text-center text-gray-500 py-6">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default ExpenseTable
