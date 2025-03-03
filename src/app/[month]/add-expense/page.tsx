import React from "react"
import { AddExpenseForm } from "./add-expense-form"

const AddExpense = async () => {
  return (
    <div className="w-full">
      <h2 className="text-sm font-semibold text-gray-600">Add Transaction</h2>
      <AddExpenseForm />
    </div>
  )
}

export default AddExpense
