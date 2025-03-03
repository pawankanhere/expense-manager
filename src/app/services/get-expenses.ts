"use server"
import { google } from "googleapis"
import { spreadsheetId } from "./shared"
import { getAuth } from "./auth"
import { isEmpty, lowerCase } from "lodash"

export const getExpenses = async (month: string) => {
  try {
    if (typeof month !== "string") {
      throw new Error("Invalid month parameter. It must be a string.")
    }

    const auth = await getAuth()
    const sheets = google.sheets({ version: "v4", auth })
    const range = "transactions!A:H"
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    })
    const rows = response.data.values
    if (!rows || rows.length < 2) {
      return { status: response.status, data: [] }
    }

    rows?.shift()
    const transformedData = rows.map((row) => {
      const amountNumber = parseInt(row[5].replace(/,/g, ""), 10)
      return {
        id: row[0] || "N/A",
        year: row[1] || "N/A",
        date: row[2] || "N/A",
        month: row[3] || "N/A",
        transaction: row[4] || "N/A",
        amount: amountNumber || 0,
        category: row[6] || "N/A",
        remarks: row[7] || "N/A",
      }
    })
    const filteredData = isEmpty(month)
      ? transformedData
      : transformedData?.filter((item) => lowerCase(item.month) === lowerCase(month))

    return {
      status: response.status,
      data: filteredData,
    }
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred."
    console.error("Error fetching expenses:", errorMessage)
    return {
      status: 500,
      error: errorMessage,
      data: [],
    }
  }
}
