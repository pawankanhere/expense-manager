"use server"
import { google } from "googleapis"
import { spreadsheetId } from "./shared"
import { getAuth } from "./auth"

export const getExpenseList = async () => {
  const auth = await getAuth()
  const sheets = google.sheets({ version: "v4", auth })
  const range = "expense_list!A:C"
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: range,
  })
  const val = response.data.values
  val?.shift()
  const processedData = val?.map((row) => {
    return {
      id: row[0],
      transaction: row[1],
      category: row[2],
    }
  })

  return {
    status: response.status,
    data: processedData,
  }
}
