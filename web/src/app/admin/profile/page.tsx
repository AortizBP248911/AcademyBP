import { auth } from "@/auth"
import { redirect } from "next/navigation"
import ProfileForm from "@/components/profile-form"

export default async function AdminProfilePage() {
  const session = await auth()
  
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-black">Mi Perfil</h1>
      <ProfileForm user={session.user} />
    </div>
  )
}