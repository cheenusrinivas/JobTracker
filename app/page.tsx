import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function Home() {
  const session = await auth()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-32 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold mb-6">
        Track your job search.
        <br />
        Stay on top of every application.
      </h1>
      <p className="text-gray-600 text-lg mb-10 max-w-xl mx-auto">
        JobTrack helps you log applications, track interviews and offers,
        and see your progress at a glance — all in one simple dashboard.
      </p>
      <Link
        href="/api/auth/signin"
        className="inline-block bg-black text-white rounded px-6 py-3 text-base font-medium hover:bg-gray-800"
      >
        Sign in to get started
      </Link>
    </div>
  )
}
