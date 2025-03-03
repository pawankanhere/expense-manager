import { google } from "googleapis"

export const getAuth = async () => {
  return await google.auth.getClient({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
      private_key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, "\n"),
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly", "https://www.googleapis.com/auth/spreadsheets"],
  })
}
