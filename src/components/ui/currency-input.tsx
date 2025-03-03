import { NumericFormat } from "react-number-format"
import { Input } from "./input"
import { IconCurrencyRupee } from "@tabler/icons-react"

type CurrencyInputProps = {
  placeholder: string
  field: {
    name: string
    value: string | number
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    onBlur: () => void
  }
}
const CurrencyInput = ({ placeholder, field }: CurrencyInputProps) => {
  return (
    <div className="flex items-center gap-1 border px-2 rounded-md h-9 focus-within:ring-2 focus-within:ring-primary">
      <IconCurrencyRupee className="h-4 w-4 text-gray-500" />
      <NumericFormat
        {...field}
        placeholder={placeholder}
        customInput={Input}
        className="border-0 -ml-2 mb-[2px] focus-visible:ring-0"
        thousandsGroupStyle="lakh"
        thousandSeparator=","
        type="text"
      />
    </div>
  )
}

export default CurrencyInput
