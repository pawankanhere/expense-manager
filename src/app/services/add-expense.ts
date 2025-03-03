"use server"
import { google } from "googleapis"
import { spreadsheetId } from "./shared"
import { v4 as uuidv4 } from "uuid"
import { getAuth } from "./auth"
import { getExpenseList } from "./get-expense-list"
import { format, getYear, parse } from "date-fns"
import { FormSchema } from "../[month]/add-expense/add-expense-form"
import z from "zod"

export const addExpense = async (rowData: z.infer<typeof FormSchema>) => {
  const auth = await getAuth()
  const sheets = google.sheets({ version: "v4", auth })
  const range = "transactions!A:H"
  const expenseList = (await getExpenseList()).data
  const category = expenseList?.filter((item) => item.transaction === rowData.transaction)[0]?.category
  const getYearFromDate = getYear(parse(rowData.date, "dd-MMM-yyyy", new Date()))
  const getMonthFromDate = format(parse(rowData.date, "dd-MMM-yyyy", new Date()), "MMM")

  const payload = [
    [
      uuidv4(),
      getYearFromDate,
      rowData.date,
      getMonthFromDate,
      rowData.transaction,
      rowData.amount,
      category,
      rowData.remarks,
    ],
  ]
  const response = await sheets.spreadsheets.values.append({
    spreadsheetId,
    range,
    valueInputOption: "RAW",
    requestBody: { values: payload },
  })

  return {
    status: response.status,
  }
}
