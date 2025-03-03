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

  if (expenseListQuery.isLoading) return <div>Loading...</div>

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col gap-3 mt-2">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="sr-only">Transaction Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-xs text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value ? new Date(field.value) : undefined}
                    onSelect={(date) => {
                      if (date) {
                        const fmtDate = format(date, "dd-MMM-yyyy")
                        field.onChange(fmtDate)
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
                          "w-full text-xs text-gray-700 justify-between",
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
                  <PopoverContent className="w-[240px] p-0">
                    <Command>
                      <CommandInput placeholder="Search framework..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                          {expenseList?.map((list) => (
                            <CommandItem
                              value={list.transaction}
                              key={list.id}
                              onSelect={() => {
                                form.setValue("transaction", list.transaction)
                                form.trigger("transaction")
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
                <Textarea placeholder="Remarks" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full px-3" disabled={addExpenseMutation.isPending} type="submit">
          {addExpenseMutation.isPending ? <IconLoader className="animate-spin" /> : <IconPlus />}
          <span className="ml-2 text-xs">Add Transaction</span>
        </Button>
      </form>
    </Form>
  )
}
