"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { countryData } from "@/lib/country-data"

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  onCountryChange: (country: { code: string; flag: string } | null) => void
}

export function PhoneInput({ value, onChange, onCountryChange }: PhoneInputProps) {
  const [selectedCountry, setSelectedCountry] = useState<string>("US")

  // Auto-detect country on component mount
  useEffect(() => {
    const detectCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/")
        const data = await response.json()
        const countryCode = data.country_code

        if (countryCode && countryData[countryCode]) {
          setSelectedCountry(countryCode)
          onCountryChange({
            code: countryCode,
            flag: countryData[countryCode].flag,
          })
        }
      } catch (error) {
        console.error("Error detecting country:", error)
      }
    }

    detectCountry()
  }, [onCountryChange])

  const handleCountryChange = (code: string) => {
    setSelectedCountry(code)
    onCountryChange({
      code,
      flag: countryData[code].flag,
    })

    // Clear phone number when country changes
    onChange("")
  }

  const formatPhoneNumber = (input: string, countryCode: string) => {
    // Remove all non-digit characters
    const digitsOnly = input.replace(/\D/g, "")

    const country = countryData[countryCode]
    if (!country) return digitsOnly

    // Enforce maximum length based on country
    const maxLength = country.maxDigits
    const trimmedDigits = digitsOnly.slice(0, maxLength)

    // Apply country-specific formatting
    let formatted = ""
    let digitIndex = 0

    for (const char of country.format) {
      if (char === "#") {
        formatted += trimmedDigits[digitIndex] || ""
        digitIndex++
      } else {
        if (digitIndex > 0) {
          formatted += char
        }
      }

      if (digitIndex >= trimmedDigits.length) break
    }

    return formatted
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, selectedCountry)
    onChange(formatted)
  }

  // Sort countries alphabetically by name
  const sortedCountries = Object.entries(countryData)
    .sort((a, b) => a[1].name.localeCompare(b[1].name))
    .map(([code, data]) => ({ code, ...data }))

  return (
    <div className="flex w-full">
      <Select value={selectedCountry} onValueChange={handleCountryChange}>
        <SelectTrigger className="w-[120px] border-r-0 rounded-r-none bg-[#111827] border-[#1f2937]">
          <SelectValue>
            <span className="flex items-center">
              <span className="mr-2">{countryData[selectedCountry]?.flag}</span>
              <span>+{countryData[selectedCountry]?.code}</span>
            </span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {sortedCountries.map((data) => (
            <SelectItem key={data.code} value={data.code}>
              <span className="flex items-center">
                <span className="mr-2">{data.flag}</span>
                <span>
                  {data.name} (+{data.code})
                </span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="tel"
        value={value}
        onChange={handlePhoneChange}
        className="flex-1 rounded-l-none bg-[#111827] border-[#1f2937]"
        placeholder={countryData[selectedCountry]?.example || ""}
      />
    </div>
  )
}
