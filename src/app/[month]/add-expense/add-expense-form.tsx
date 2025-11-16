"use client"

import { IconLoader, IconPlus } from "@tabler/icons-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useAddExpense, useGetExpenseList } from "@/app/hooks"
import CurrencyInput from "@/components/ui/currency-input"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useState } from "react"
import Spinner from "@/components/common/spinner/spinner"

export const FormSchema = z.object({
  date: z.string().min(2, {
    message: "date cannot be empty.",
  }),
  transaction: z.string().min(2, {
    message: "Please enter transaction",
  }),
  amount: z.string().min(1, {
    message: "Please enter amount",
  }),
  remarks: z.string(),
})

export function AddExpenseForm() {
  const expenseListQuery = useGetExpenseList()
  const expenseList = expenseListQuery.data?.data
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  console.log("expenseList", expenseList)

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      date: format(new Date(), "dd-MMM-yyyy"),
      transaction: "",
      amount: "",
      remarks: "",
    },
  })
  const addExpenseMutation = useAddExpense()

  function onSubmit(data: z.infer<typeof FormSchema>) {
    addExpenseMutation.mutate(data, {
      onSuccess: () => {
        form.reset()
        toast.success("Transaction added successfully.")
      },
    })
  }

  if (expenseListQuery.isLoading)
    return (
      <div className="h-[96]">
        <Spinner />
      </div>
    )

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-3 mt-2 xl:mt-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="sr-only">Transaction Date</FormLabel>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-xs text-left font-normal sm:text-sm sm:h-10 md:h-11 xl:text-base xl:h-12",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50 2xl:h-6 2xl:w-6" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const fmtDate = format(date, "dd-MMM-yyyy")
                        field.onChange(fmtDate)
                        setIsCalendarOpen(false)
                      }
                    }}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="transaction"
          render={({ field }) => (
            <div className="w-full">
              <FormItem className="flex flex-col w-full">
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full text-xs text-gray-700 justify-between sm:text-sm sm:h-10 md:h-11 xl:text-base xl:font-normal xl:h-12",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          <span className="flex gap-1">
                            <p>{expenseList?.find((list) => list.transaction === field.value)?.transaction}</p>
                            <span className="text-gray-400">
                              -{" "}
                              {
                                expenseList?.filter((item) => item.transaction === form.watch("transaction"))[0]
                                  ?.category
                              }
                            </span>
                          </span>
                        ) : (
                          "Select transaction"
                        )}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command className="w-[520px]">
                      <CommandInput placeholder="Search framework..." className="h-9" />
                      <CommandList className="w-full">
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup className="w-full">
                          {expenseList?.map((list) => (
                            <CommandItem
                              className="w-full"
                              value={list.transaction}
                              key={list.id}
                              onSelect={() => {
                                form.setValue("transaction", list.transaction)
                                form.trigger("transaction")
                                ;(document.querySelector('[role="combobox"]') as HTMLElement)?.click()
                              }}
                            >
                              {list.transaction}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  list.transaction === field.value ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem className="grow-0 w-full">
              <FormLabel className="sr-only">Amount</FormLabel>
              <FormControl>
                <CurrencyInput placeholder="Amount" field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem className="grow-0 w-full">
              <FormLabel className="sr-only">Remark</FormLabel>
              <FormControl>
                <Textarea className="text-xs sm:text-sm md:text-sm xl:text-base" placeholder="Remarks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          role="button"
          data-testid="add-expense-form-submit-button"
          className="w-full px-3 sm:h-10 md:h-11 xl:h-12"
          disabled={addExpenseMutation.isPending}
          type="submit"
        >
          {addExpenseMutation.isPending ? <IconLoader className="animate-spin" /> : <IconPlus />}
          <span className="ml-2 text-xs sm:text-sm md:text-sm xl:text-base">Add Transaction</span>
        </Button>
      </form>
    </Form>
  )
}
