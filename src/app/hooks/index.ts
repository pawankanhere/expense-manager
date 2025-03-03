"use client"

import { useMutation, useQuery } from "@tanstack/react-query"
import { getExpenseList } from "../services/get-expense-list"
import { addExpense } from "../services/add-expense"
import { changeMonth } from "../services/change-month"
import { getSettings } from "../services/get-settings"

interface ExpenseData {
  date: string
  transaction: string
  amount: string
  remarks: string
}

export const useGetExpenseList = () => {
  return useQuery({
    queryKey: ["expenseList"],
    queryFn: () => {
      return getExpenseList()
    },
  })
}
export const useGetSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => {
      return getSettings()
    },
  })
}

export const useAddExpense = () => {
  return useMutation({
    mutationFn: (data: ExpenseData) => {
      return addExpense(data)
    },
  })
}

export const useChangeMonth = () => {
  return useMutation({
    mutationFn: (month: string) => {
      return changeMonth(month)
    },
  })
}
