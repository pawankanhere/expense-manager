"use client"

import React from "react"
import Overview from "./overview"
import { Expense } from "../types"

type OverviewWrapperProps = {
  expenses: Expense[]
  dates: string[]
}

const OverviewWrapper = ({ expenses, dates }: OverviewWrapperProps) => {
  return <Overview expenses={expenses} dates={dates} />
}

export default OverviewWrapper
