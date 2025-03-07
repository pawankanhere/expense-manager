import React from "react"
import { AddExpenseForm } from "./add-expense-form"

const AddExpense = async () => {
  return (
    <div className="w-full 2xl:w-[520px]">
      <h2 className="text-sm font-semibold text-gray-800 xl:text-lg xl:font-semibold">Add Transaction</h2>
      <AddExpenseForm />
    </div>
  )
}

export default AddExpense
