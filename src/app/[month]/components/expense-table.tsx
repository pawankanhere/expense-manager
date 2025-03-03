import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Expense } from "../page"
import { format } from "date-fns"
import { convertToCurrency } from "@/lib/utils"

type ExpenseTableProps = {
  expenses: Expense[]
}
const ExpenseTable = ({ expenses }: ExpenseTableProps) => {
  return (
    <div className="my-4">
      <h3 className="font-semibold 2xl:text-xl">Transactions Records</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-fit px-0 text-xs">Date</TableHead>
            <TableHead className="w-[200px] px-0 text-xs">Transactions</TableHead>
            <TableHead className="text-right text-xs">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium text-[12px] px-0">{format(new Date(expense.date), "dd MMM")}</TableCell>
              <TableCell className="font-medium text-[12px] px-0 truncate">{expense.transaction}</TableCell>
              <TableCell className="text-right text-[12px]">{convertToCurrency(expense.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ExpenseTable
