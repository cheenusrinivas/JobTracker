"use client"

import { useState } from "react"
import { updateApplicationStatus } from "../actions/applications"

const STATUS_STYLES: Record<string, string> = {
  Applied: "bg-blue-100 text-blue-700",
  Interview: "bg-amber-100 text-amber-700",
  Offer: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
  Ghosted: "bg-gray-100 text-gray-700",
}

const STATUSES = ["Applied", "Interview", "Offer", "Rejected", "Ghosted"]

export default function StatusDropdown({
  id,
  currentStatus,
}: {
  id: string
  currentStatus: string
}) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)

  async function handleChange(newStatus: string) {
    setSaving(true)
    setStatus(newStatus)
    await updateApplicationStatus(id, newStatus)
    setSaving(false)
  }

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={saving}
      className={`text-xs font-medium px-2 py-1 rounded-full border-0 cursor-pointer ${
        STATUS_STYLES[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  )
}