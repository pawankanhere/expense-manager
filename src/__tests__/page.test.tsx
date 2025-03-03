import { expect, test } from "vitest"
import { render, screen } from "@testing-library/react"
import Page from "../app/page"

test("renders page", async () => {
  render(<Page />)
  expect(screen.getByText(/hello world/i)).toBeDefined()
})
