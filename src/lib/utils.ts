import { clsx, type ClassValue } from "clsx"
import { parse } from "date-fns"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const convertToCurrency = (amount: number | string) => {
  return Number(amount).toLocaleString("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 })
}

export const isFutureDate = (dateStr: string) => {
  const currentYear = new Date().getFullYear()
  const fullDateStr = `${dateStr}-${currentYear}`

  const parsedDate = parse(fullDateStr, "dd-MMM-yyyy", new Date())

  return parsedDate.getTime() > new Date().getTime()
}
