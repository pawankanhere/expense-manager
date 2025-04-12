import React, { useState, useEffect, KeyboardEvent } from "react"
import { Input } from "./input"
import { IconCurrencyRupee } from "@tabler/icons-react"
import { evaluate } from "mathjs"

type CurrencyInputProps = {
  placeholder: string
  field: {
    name: string
    value: string | number
    onChange: (value: string | number) => void
    onBlur: () => void
  }
}
const formatINR = (value: number): string => {
  return value.toLocaleString("en-IN")
}

const CurrencyInput = ({ placeholder, field }: CurrencyInputProps) => {
  const [inputValue, setInputValue] = useState(field.value.toString())
  const [livePreview, setLivePreview] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isMathError, setIsMathError] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  useEffect(() => {
    setInputValue(field.value.toString())
  }, [field.value])

  useEffect(() => {
    if (!hasInteracted || inputValue.trim() === "") {
      setLivePreview(null)
      setError(null)
      return
    }

    if (inputValue.trim().startsWith("=")) {
      const expr = inputValue.trim().slice(1)
      if (/^[\d+\-()\s]+$/.test(expr)) {
        try {
          const result = evaluate(expr)
          if (typeof result === "number" && Number.isInteger(result)) {
            setLivePreview(result)
            setError(null)
            setIsMathError(false)
          } else {
            setLivePreview(null)
            setError("Only whole number results allowed")
            setIsMathError(true)
          }
        } catch {
          setLivePreview(null)
          setError("Invalid expression")
          setIsMathError(true)
        }
      } else {
        setLivePreview(null)
        setError("Only + and - operations allowed")
        setIsMathError(true)
      }
    } else {
      setLivePreview(null)
      setError(null)
      setIsMathError(false)
    }
  }, [inputValue])

  const finalizeValue = () => {
    if (inputValue.trim().startsWith("=")) {
      const expr = inputValue.trim().slice(1)
      if (/^[\d+\-()\s]+$/.test(expr)) {
        try {
          const result = evaluate(expr)
          if (typeof result === "number" && Number.isInteger(result)) {
            field.onChange(result.toString())
            setInputValue(formatINR(result))
            setError(null)
            setIsMathError(false)
            return
          }
        } catch {
          setError("Invalid expression")
          setIsMathError(true)
        }
      } else {
        setError("Only + and - operations allowed")
        setIsMathError(true)
      }
    } else {
      const parsed = parseInt(inputValue, 10)
      if (!isNaN(parsed)) {
        field.onChange(parsed.toString())
        setInputValue(formatINR(parsed))
      } else {
        setError("Only whole numbers allowed")
        setIsMathError(false)
      }
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      finalizeValue()
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div
        className={`flex items-center gap-1 border px-2 rounded-md h-9 ${
          !isMathError ? "focus-within:ring-2 focus-within:ring-primary" : ""
        } xl:text-base xl:h-12 ${isMathError ? "border-red-500" : "border-gray-300"}`}
      >
        <IconCurrencyRupee className="h-4 w-4 text-gray-500 xl:h-5 xl:w-5" />
        <Input
          value={inputValue}
          onChange={(e) => {
            const allowedChars = /^[\d=+\-()\s]*$/
            if (allowedChars.test(e.target.value)) {
              setInputValue(e.target.value)
            }
          }}
          onBlur={() => {
            finalizeValue()
            field.onBlur()
          }}
          onFocus={() => setHasInteracted(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          inputMode="numeric"
          className="border-0 -ml-2 mb-[2px] focus-visible:ring-0 sm-text-sm font-medium xl:text-base"
        />
      </div>
      {inputValue.trim().startsWith("=") && livePreview !== null && (
        <div className="text-xs text-gray-500 px-2">Result: {formatINR(livePreview)}</div>
      )}
      {error && <div className="text-xs text-red-500 px-2">{error}</div>}
    </div>
  )
}

export default CurrencyInput
