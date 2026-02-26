import { prisma } from "@/lib/prisma"
import CreateUserForm from "./create-user-form"
import { User } from "@phosphor-icons/react/dist/ssr"
import UserList from "./user-list"

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6 bg-gray-50/30 min-h-full p-6 -m-6 rounded-xl">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-teal-50 text-teal-600 border border-teal-100 rounded-lg shadow-sm">
          <User size={24} weight="fill" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Gestión de Usuarios</h1>
          <p className="text-sm text-gray-500 mt-0.5">Administra los usuarios y sus roles.</p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <UserList initialUsers={users} />
        </div>

        <div className="lg:col-span-1">
          <CreateUserForm />
        </div>
      </div>
    </div>
  )
}
