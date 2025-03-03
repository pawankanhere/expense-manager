export const spreadsheetId =
  process.env.NODE_ENV === "development" ? process.env.GOOGLE_SHEET_ID_DEV : process.env.GOOGLE_SHEET_ID_PROD
