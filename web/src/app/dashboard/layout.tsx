import { auth } from "@/auth"
import { redirect } from "next/navigation"
import UserSidebar from "@/components/user-sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="flex min-h-screen">
      <UserSidebar user={session.user} />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
