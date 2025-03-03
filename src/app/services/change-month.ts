"use server"

import { google } from "googleapis"
import { spreadsheetId } from "./shared"
import { getAuth } from "./auth"
import { revalidatePath } from "next/cache"

export const changeMonth = async (month: string) => {
  const auth = await getAuth()
  const sheets = google.sheets({ version: "v4", auth })
  const settingsRange = "settings!A:B"
  const response = await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: settingsRange,
    valueInputOption: "RAW",
    requestBody: {
      majorDimension: "ROWS",
      values: [["current_month", month]],
    },
  })
  if (response.status === 200) {
    revalidatePath(`/${month}`)
  }
  return {
    status: response.status,
  }
}
