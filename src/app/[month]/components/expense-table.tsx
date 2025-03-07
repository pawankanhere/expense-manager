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
    <div className="my-4 xl:my-6">
      <h3 className="font-semibold 2xl:text-xl">Transactions Records</h3>
      <Table className="xl:mt-2">
        <TableHeader>
          <TableRow>
            <TableHead className="w-fit px-0 text-xs xl:text-base">Date</TableHead>
            <TableHead className="w-[200px] px-0 text-xs xl:text-base">Transactions</TableHead>
            <TableHead className="text-right text-xs xl:text-base">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="font-medium text-[12px] px-0 xl:text-base">
                {format(new Date(expense.date), "dd MMM")}
              </TableCell>
              <TableCell className="font-medium text-[12px] px-0 truncate xl:text-base">
                {expense.transaction}
              </TableCell>
              <TableCell className="text-right text-[12px] xl:text-base">{convertToCurrency(expense.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export default ExpenseTable
