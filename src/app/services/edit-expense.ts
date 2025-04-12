"use server"
import { google } from "googleapis"
import { spreadsheetId } from "./shared"
import { getAuth } from "./auth"
import z from "zod"

// Move the schema to a separate file
// filepath: /Users/pawankanhere/Projects/expense-manager/src/app/services/schemas/edit-expense-schema.ts
const EditExpenseSchema = z.object({
  uuid: z.string(),
  amount: z.number(),
})
type EditExpenseInput = z.infer<typeof EditExpenseSchema>

export const editExpense = async (data: EditExpenseInput) => {
  // Validate the input
  const validatedData = EditExpenseSchema.parse(data)

  const auth = await getAuth()
  const sheets = google.sheets({ version: "v4", auth })
  const range = "transactions!A:H"

  // First, find the row with matching UUID
  const result = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  })

  const rows = result.data.values
  if (!rows) {
    throw new Error("No data found in spreadsheet")
  }

  // Find the row index where UUID matches
  const rowIndex = rows.findIndex((row) => row[0] === validatedData.uuid)
  if (rowIndex === -1) {
    throw new Error("Transaction not found")
  }

  // Update amount in the found row (column F)
  const updateRange = `transactions!F${rowIndex + 1}`
  const response = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: updateRange,
    valueInputOption: "RAW",
    requestBody: {
      values: [[validatedData.amount]],
    },
  })

  return {
    status: response.status,
    message: "Amount updated successfully",
  }
}
