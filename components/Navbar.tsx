import { auth } from "@/lib/auth"
import Link from "next/link"
import { handleSignOut } from "@/app/dashboard/actions/auth-actions"

export default async function Navbar() {
  const session = await auth()

  return (
    <nav className="border-b">
      <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="font-semibold text-lg">
          JobTrack
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link href="/dashboard" className="text-sm text-gray-700 hover:text-black">
                Dashboard
              </Link>
              <form action={handleSignOut}>
                <button
                  type="submit"
                  className="text-sm border rounded px-3 py-1.5 hover:bg-gray-50"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/api/auth/signin"
              className="text-sm bg-black text-white rounded px-4 py-1.5 hover:bg-gray-800"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
