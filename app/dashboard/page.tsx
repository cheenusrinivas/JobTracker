import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { addApplication } from "./actions/applications"
import GmailSyncButton from "./components/GmailSyncButton"
import { PrismaClient } from "@prisma/client"
import StatusChart from "./components/StatusChart"
import StatusDropdown from "./components/StatusDropdown"

const prisma = new PrismaClient()


export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/api/auth/signin")
  }

  const applications = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { dateApplied: "desc" },
  })

  const total = applications.length
  const interviews = applications.filter((a) => a.status === "Interview").length
  const offers = applications.filter((a) => a.status === "Offer").length
  const responseRate =
    total > 0 ? Math.round(((interviews + offers) / total) * 100) : 0

  const statusCounts: Record<string, number> = {}
  applications.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1
  })
  const chartData = Object.entries(statusCounts).map(([status, count]) => ({
    status,
    count,
  }))

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-8">
  <div>
    <h1 className="text-2xl font-bold mb-1">Welcome, {session.user?.name}!</h1>
    <p className="text-gray-600">{session.user?.email}</p>
  </div>
  <GmailSyncButton />
</div>

<div className="grid grid-cols-3 gap-4 mb-12">
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
  <div className="text-3xl font-bold text-gray-900 tracking-tight">{total}</div>
    <div className="text-sm text-gray-500 mt-1">Total Applications</div>
  </div>
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
  <div className="text-3xl font-bold text-gray-900 tracking-tight">{responseRate}%</div>    <div className="text-sm text-gray-500 mt-1">Response Rate</div>
  </div>
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
<div className="text-3xl font-bold text-gray-900 tracking-tight">{offers}</div>  </div>
</div>

      {total > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-semibold mb-4">Status Breakdown</h2>
          <StatusChart data={chartData} />
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Add a Job Application</h2>

      <form action={addApplication} className="flex flex-col gap-4 mb-12">
        <input
          name="companyName"
          placeholder="Company name"
          required
          className="border rounded px-3 py-2"
        />
        <input
          name="roleTitle"
          placeholder="Role title"
          required
          className="border rounded px-3 py-2"
        />
        <input
          name="dateApplied"
          type="date"
          required
          className="border rounded px-3 py-2"
        />
        <select name="source" required className="border rounded px-3 py-2">
          <option value="">Select source</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Company Site">Company Site</option>
          <option value="Referral">Referral</option>
          <option value="Other">Other</option>
        </select>
        <select name="status" required className="border rounded px-3 py-2">
          <option value="Applied">Applied</option>
          <option value="Interview">Interview</option>
          <option value="Offer">Offer</option>
          <option value="Rejected">Rejected</option>
          <option value="Ghosted">Ghosted</option>
        </select>
        <button
          type="submit"
          className="bg-black text-white rounded px-4 py-2 mt-2"
        >
          Add Application
        </button>
      </form>

      <h2 className="text-xl font-semibold mb-4">Your Applications</h2>

      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Company</th>
            <th className="py-2">Role</th>
            <th className="py-2">Date</th>
            <th className="py-2">Source</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map((app) => (
            <tr key={app.id} className="border-b">
              <td className="py-2">{app.companyName}</td>
              <td className="py-2">{app.roleTitle}</td>
              <td className="py-2">
                {new Date(app.dateApplied).toLocaleDateString()}
              </td>
              <td className="py-2">{app.source}</td>
              <td className="py-2">
  <StatusDropdown id={app.id} currentStatus={app.status} />
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
