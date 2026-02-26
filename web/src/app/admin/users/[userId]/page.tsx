import { prisma } from "@/lib/prisma"
import UserEditForm from "./user-edit-form"
import { notFound } from "next/navigation"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

interface UserPageProps {
  params: Promise<{
    userId: string
  }>
}

export default async function UserPage({ params }: UserPageProps) {
  const { userId } = await params
  const user = await prisma.user.findUnique({
    where: { id: userId }
  })

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link 
          href="/admin/users" 
          className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600"
        >
          <ArrowLeft size={24} />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-black">Editar Usuario</h1>
      </div>
      
      <div className="max-w-2xl">
        <UserEditForm user={user} />
      </div>
    </div>
  )
}