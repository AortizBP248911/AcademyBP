"use client"

import { useState } from "react"
import { User, EnvelopeSimple, Shield, Calendar, Gear, MagnifyingGlass, Funnel } from "@phosphor-icons/react"
import { UserActions } from "./user-actions"
import { User as PrismaUser } from "@/generated/client"

interface UserListProps {
  initialUsers: PrismaUser[]
}

export default function UserList({ initialUsers }: UserListProps) {
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    date: "",
    role: ""
  })

  const filteredUsers = initialUsers.filter((user) => {
    const nameMatch = user.name?.toLowerCase().includes(filters.name.toLowerCase()) || false
    const emailMatch = user.email?.toLowerCase().includes(filters.email.toLowerCase()) || false
    const dateMatch = filters.date === "" || new Date(user.createdAt).toLocaleDateString().includes(filters.date)
    const roleMatch = filters.role === "" || user.role === filters.role

    return nameMatch && emailMatch && dateMatch && roleMatch
  })

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-black">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>Nombre</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Filtrar..." 
                      className="w-full h-8 pl-8 pr-2 rounded-md border border-gray-200 text-xs focus:outline-none focus:border-black transition-colors"
                      value={filters.name}
                      onChange={(e) => handleFilterChange("name", e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-black">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <EnvelopeSimple size={16} />
                    <span>Correo</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Filtrar..." 
                      className="w-full h-8 pl-8 pr-2 rounded-md border border-gray-200 text-xs focus:outline-none focus:border-black transition-colors"
                      value={filters.email}
                      onChange={(e) => handleFilterChange("email", e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-black">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <Shield size={16} />
                        <span>Rol</span>
                    </div>
                    <div className="relative">
                        <select
                        className="w-full h-8 pl-2 pr-2 rounded-md border border-gray-200 text-xs focus:outline-none focus:border-black transition-colors bg-white cursor-pointer"
                        value={filters.role}
                        onChange={(e) => handleFilterChange("role", e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="ADMIN">Administrador</option>
                            <option value="STUDENT">Estudiante</option>
                        </select>
                    </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-black">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Registro</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="DD/MM/YYYY" 
                      className="w-full h-8 pl-8 pr-2 rounded-md border border-gray-200 text-xs focus:outline-none focus:border-black transition-colors"
                      value={filters.date}
                      onChange={(e) => handleFilterChange("date", e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-right align-middle font-medium text-black">
                <div className="flex items-center justify-end gap-2 h-full pt-6">
                    <Gear size={16} />
                    <span>Acciones</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredUsers.map((user) => (
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
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-600">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Funnel size={32} className="text-gray-300" />
                    <p>No se encontraron usuarios que coincidan con los filtros.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
