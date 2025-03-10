import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { AddExpenseForm } from "./add-expense-form"
import userEvent from "@testing-library/user-event"
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest"
import { useAddExpense, useGetExpenseList } from "@/app/hooks"
import { format } from "date-fns"
import { QueryClient, QueryClientProvider, UseMutationResult } from "@tanstack/react-query"

// Define the types of our data and hooks
type ExpenseData = {
  date: string
  transaction: string
  amount: string
  remarks: string
}

// Mock the hooks
vi.mock("@/app/hooks", () => ({
  useGetExpenseList: vi.fn(),
  useAddExpense: vi.fn(),
}))

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}))

export function renderWithClient(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>)
}

describe("AddExpenseForm", () => {
  const mockExpenseList = [
    { id: "1", transaction: "Groceries", category: "Food" },
    { id: "2", transaction: "Rent", category: "Housing" },
    { id: "3", transaction: "Internet", category: "Utilities" },
  ]

  const mockMutate = vi.fn()

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useGetExpenseList).mockImplementation(
      () =>
        ({
          data: { status: 200, data: mockExpenseList },
          isLoading: false,
          isError: false,
        } as ReturnType<typeof useGetExpenseList>)
    )

    vi.mocked(useAddExpense).mockReturnValue({
      mutate: mockMutate,
      isPending: false,
    } as unknown as UseMutationResult<{ status: number }, Error, ExpenseData, unknown>)
  })

  it("renders the form correctly", () => {
    renderWithClient(<AddExpenseForm />)

    expect(screen.getByText(format(new Date(), "PPP"))).toBeDefined()
    expect(screen.getByRole("combobox").textContent).toContain("Select transaction")
    expect(screen.getByPlaceholderText("Amount")).toBeDefined()
    expect(screen.getByPlaceholderText("Remarks")).toBeDefined()
    expect(screen.getByRole("button", { name: /Add Transaction/i })).toBeDefined()
  })

  it("shows loading state when expense list is loading", () => {
    vi.mocked(useGetExpenseList).mockImplementation(
      () =>
        ({
          data: undefined,
          isLoading: true,
          refetch: vi.fn(),
        } as unknown as ReturnType<typeof useGetExpenseList>)
    )

    renderWithClient(<AddExpenseForm />)
    expect(screen.getByText("Loading...")).toBeDefined()
  })

  it("shows validation errors when form is submitted without transaction and amount", async () => {
    const user = userEvent.setup()
    const { getByTestId } = renderWithClient(<AddExpenseForm />)

    const submitButton = getByTestId("add-expense-form-submit-button")
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText("Please enter transaction")).toBeDefined()
      expect(screen.getByText("Please enter amount")).toBeDefined()
    })

    expect(mockMutate).not.toHaveBeenCalled()
  })

  it("opens the calendar when date field is clicked", async () => {
    const user = userEvent.setup()
    renderWithClient(<AddExpenseForm />)

    await user.click(screen.getByText(format(new Date(), "PPP")))

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeDefined()
    })
  })

  it("opens the transaction dropdown and selects an item", async () => {
    const user = userEvent.setup()
    renderWithClient(<AddExpenseForm />)

    await user.click(screen.getByRole("combobox"))

    await waitFor(() => {
      expect(screen.getByText("Groceries")).toBeDefined()
      expect(screen.getByText("Rent")).toBeDefined()
      expect(screen.getByText("Internet")).toBeDefined()
    })

    await user.click(screen.getByText("Groceries"))

    expect(screen.getByRole("combobox").textContent).toContain("Groceries")
  })

  // it("submits the form with valid data", async () => {
  //   const user = userEvent.setup()
  //   renderWithClient(<AddExpenseForm />)

  //   await user.click(screen.getByRole("combobox"))
  //   await waitFor(() => {
  //     expect(screen.getByText("Groceries")).toBeDefined()
  //   })
  //   await user.click(screen.getByText("Groceries"))
  //   await user.type(screen.getByPlaceholderText("Amount"), "100")
  //   await user.type(screen.getByPlaceholderText("Remarks"), "Weekly groceries")
  //   await user.click(screen.getByRole("button", { name: /Add Transaction/i }))

  //   await waitFor(() => {
  //     expect(mockMutate).toHaveBeenCalledWith(
  //       {
  //         date: format(new Date(), "dd-MMM-yyyy"),
  //         transaction: "Groceries",
  //         amount: "100",
  //         remarks: "Weekly groceries",
  //       },
  //       expect.any(Object)
  //     )
  //   })
  // })

  // it("displays loading state while submitting the form", () => {
  //   vi.mocked(useAddExpense).mockReturnValue({
  //     mutate: mockMutate,
  //     isPending: true,
  //   } as unknown as UseMutationResult<{ status: number }, Error, ExpenseData, unknown>)

  //   renderWithClient(<AddExpenseForm />)

  //   const submitButton = screen.getByRole("button", { name: /Add Transaction/i })
  //   expect((submitButton as HTMLButtonElement).disabled).toBe(true)
  //   expect(submitButton.querySelector(".animate-spin")).toBeDefined()
  // })

  // it("shows success toast and resets form on successful submission", async () => {
  //   vi.mocked(useAddExpense).mockImplementation(() => ({
  //     mutate: (data, options) => {
  //       if (options?.onSuccess) {
  //         options.onSuccess()
  //       }
  //       return mockMutate(data, options)
  //     },
  //     isPending: false,
  //   }))

  //   renderWithClient(<AddExpenseForm />)

  //   fireEvent.click(screen.getByRole("combobox"))
  //   await waitFor(() => fireEvent.click(screen.getByText("Groceries")))
  //   fireEvent.change(screen.getByPlaceholderText("Amount"), { target: { value: "100" } })
  //   fireEvent.click(screen.getByRole("button", { name: /Add Transaction/i }))

  //   await waitFor(() => {
  //     expect(toast.success).toHaveBeenCalledWith("Transaction added successfully.")
  //     expect(screen.getByRole("combobox").textContent).toContain("Select transaction")
  //   })
  // })

  it("selects a date from the calendar", async () => {
    const user = userEvent.setup()
    renderWithClient(<AddExpenseForm />)

    await user.click(screen.getByText(format(new Date(), "PPP")))

    const dateElements = screen.getAllByRole("gridcell")
    const selectableDate = Array.from(dateElements).find((el) => !el.getAttribute("aria-disabled"))

    if (selectableDate) {
      await user.click(selectableDate)

      await waitFor(() => {
        expect(screen.queryByRole("dialog")).toBeNull()
      })
    }
  })
})
