import React from "react"
import { AddExpenseForm } from "./add-expense-form"

const AddExpense = async () => {
  return (
    <div className="w-full bg-white border  rounded-xl shadow shadow-slate-200 p-4">
      <div className="w-full 2xl:w-[520px] bg-white p-4">
        <h2 className="text-sm font-semibold text-gray-800 sm:text-base xl:text-lg xl:font-semibold">
          Add Transaction
        </h2>
        <AddExpenseForm />
      </div>
    </div>
  )
}

export default AddExpense
