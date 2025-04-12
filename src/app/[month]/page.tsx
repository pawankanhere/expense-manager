import React from "react"
import { generateMonthDates } from "./utils/generateMonthDates"
import Overview from "./components/overview"
import { getSettings } from "../services/get-settings"
import { getExpenses } from "../services/get-expenses"
import ExpenseTable from "./components/expense-table"
import { editExpense } from "../services/edit-expense"

export type Expense = {
  id: string
  year: number
  date: string
  month: string
  transaction: string
  amount: number
  category: string
  remarks: string
}
const HomePage = async () => {
  const settings = (await getSettings()).data
  const dates = generateMonthDates(settings.currentMonth, settings.currentYear)
  const expensesResponse = await getExpenses(settings.currentMonth)
  const expenses: Expense[] = expensesResponse.data

  return (
    <div>
      <Overview expenses={expenses} dates={dates} />
      <ExpenseTable onEditExpense={editExpense} expenseData={expenses} />
    </div>
  )
}

export default HomePage
