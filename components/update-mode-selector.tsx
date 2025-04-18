"use client"

import { MessageCircle, Send, MessageSquareText } from "lucide-react"

interface UpdateModeSelectorProps {
  selected: string[]
  onChange: (modes: string[]) => void
}

export function UpdateModeSelector({ selected, onChange }: UpdateModeSelectorProps) {
  const updateModes = [
    { id: "sms", label: "SMS", icon: MessageSquareText },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { id: "telegram", label: "Telegram", icon: Send },
  ]

  const handleToggle = (mode: string) => {
    if (selected.includes(mode)) {
      onChange(selected.filter((m) => m !== mode))
    } else {
      onChange([...selected, mode])
    }
  }

  return (
    <div className="space-y-2">
      <p className="mb-2">Preferred update method (select at least one)</p>

      <div className="space-y-3">
        {updateModes.map((mode) => (
          <div
            key={mode.id}
            className={`flex items-center p-4 rounded-md cursor-pointer bg-[#111827] border border-[#1f2937] ${
              selected.includes(mode.id) ? "border-blue-500" : ""
            }`}
            onClick={() => handleToggle(mode.id)}
          >
            <div
              className={`w-5 h-5 border ${
                selected.includes(mode.id) ? "border-blue-500 bg-blue-500" : "border-gray-500"
              } mr-3 flex items-center justify-center`}
            >
              {selected.includes(mode.id) && (
                <svg width="12" height="10" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 5L4 8L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <mode.icon className="mr-2 h-5 w-5" />
            <span>{mode.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
