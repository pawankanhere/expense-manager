import React from "react"
import { generateMonthDates } from "./utils/generateMonthDates"
import { getSettings } from "../services/get-settings"
import { getExpenses } from "../services/get-expenses"
import ExpenseTable from "./components/expense-table"
import { editExpense } from "../services/edit-expense"
import { Expense } from "./types"
import OverviewWrapper from "./components/overview-wrapper"

const HomePage = async () => {
  const settings = (await getSettings()).data
  const dates = generateMonthDates(settings.currentMonth, settings.currentYear)
  const expensesResponse = await getExpenses(settings.currentMonth)
  const expenses: Expense[] = expensesResponse.data

  return (
    <div>
      <OverviewWrapper expenses={expenses} dates={dates} />
      <ExpenseTable onEditExpense={editExpense} expenseData={expenses} />
    </div>
  )
}

export default HomePage
