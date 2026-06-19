"use client"

import { useState } from "react"
import { syncGmailApplications } from "../actions/gmail-sync"

export default function GmailSyncButton() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  async function handleSync() {
    setLoading(true)
    setMessage("")
    try {
      const result = await syncGmailApplications()
      setMessage(result.message)
    } catch (err: unknown) {
      if (err instanceof Error) {
        setMessage(err.message)
      } else {
        setMessage("Something went wrong.")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={handleSync}
        disabled={loading}
        className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
      >
        {loading ? "Syncing..." : "Sync Gmail"}
      </button>
      {message && (
        <p className="text-sm text-gray-600">{message}</p>
      )}
    </div>
  )
}