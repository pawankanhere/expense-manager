import { redirect } from "next/navigation"
import { getSettings } from "./services/get-settings"

export default async function Home() {
  const settings = await getSettings()
  const currentMonth = settings.data.currentMonth
  if (currentMonth) {
    redirect(`/${currentMonth}`)
  }

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      {currentMonth && <p>Redirecting to current month.</p>}
      {!currentMonth && <p className="text-red-400 text-sm">No current month found in database.</p>}
    </div>
  )
}
