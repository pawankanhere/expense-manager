import { format, getDaysInMonth, parse } from "date-fns"

export const generateMonthDates = (monthAbbr: string, year: number = new Date().getFullYear()): string[] => {
  // Parse the month abbreviation to get a valid date
  const parsedDate = parse(`1-${monthAbbr}-${year}`, "d-MMM-yyyy", new Date())

  // Get the total number of days in the month
  const totalDays = getDaysInMonth(parsedDate)

  // Generate all dates in "D-MMM" format
  return Array.from({ length: totalDays }, (_, i) => format(new Date(year, parsedDate.getMonth(), i + 1), "dd-MMM"))
}
