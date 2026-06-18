"use client"

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts"

const COLORS: Record<string, string> = {
  Applied: "#3b82f6",
  Interview: "#f59e0b",
  Offer: "#10b981",
  Rejected: "#ef4444",
  Ghosted: "#6b7280",
}

export default function StatusChart({
  data,
}: {
  data: { status: string; count: number }[]
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry) => (
            <Cell key={entry.status} fill={COLORS[entry.status] || "#999"} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}