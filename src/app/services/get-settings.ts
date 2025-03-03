"use server"
import { google } from "googleapis"
import { spreadsheetId } from "./shared"
import { getAuth } from "./auth"

export const getSettings = async () => {
  const auth = await getAuth()
  const sheets = google.sheets({ version: "v4", auth })
  const settingsRange = "settings!A1:B4"
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range: settingsRange,
  })
  const val = response.data.values
  const currentMonth = val?.[0][1]
  const currentYear = val?.[1][1]

  return {
    status: response.status,
    data: {
      currentMonth,
      currentYear,
    },
  }
}
