import { prisma } from "@/lib/prisma"
import CreateUserForm from "./create-user-form"
import { UserActions } from "./user-actions"
import { User, EnvelopeSimple, Shield, Calendar, Gear } from "@phosphor-icons/react/dist/ssr"

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-black">Gestión de Usuarios</h1>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="h-12 px-4 text-left align-middle font-medium text-black">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span>Nombre</span>
                      </div>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-black">
                      <div className="flex items-center gap-2">
                        <EnvelopeSimple size={16} />
                        <span>Correo</span>
                      </div>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-black">
                      <div className="flex items-center gap-2">
                        <Shield size={16} />
                        <span>Rol</span>
                      </div>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-black">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>Registro</span>
                      </div>
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-black">
                      <div className="flex items-center justify-end gap-2">
                        <Gear size={16} />
                        <span>Acciones</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {users.map((user) => (
                    <tr key={user.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="p-4 align-middle font-medium">
                        <div className="flex items-center gap-3">
                          {user.image ? (
                             // eslint-disable-next-line @next/next/no-img-element
                             <img src={user.image} alt={user.name || ""} className="w-8 h-8 rounded-full object-cover border border-gray-200" />
                          ) : (
                             <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 text-xs font-semibold">
                                {user.name?.charAt(0).toUpperCase()}
                             </div>
                          )}
                          <span className="text-black">{user.name}</span>
                        </div>
                      </td>
                      <td className="p-4 align-middle text-black">{user.email}</td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          user.role === 'ADMIN' 
                            ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {user.role === 'ADMIN' ? 'Administrador' : 'Estudiante'}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-black">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="p-4 align-middle text-right">
                        <UserActions userId={user.id} />
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-600">
                        No se encontraron usuarios. Crea uno para comenzar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <CreateUserForm />
        </div>
      </div>
    </div>
  )
}
