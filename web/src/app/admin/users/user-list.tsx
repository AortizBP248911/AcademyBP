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
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-gray-700">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gray-500" />
                    <span>Nombre</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Filtrar..."
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all bg-white"
                      value={filters.name}
                      onChange={(e) => handleFilterChange("name", e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-gray-700">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <EnvelopeSimple size={16} className="text-gray-500" />
                    <span>Correo</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Filtrar..."
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all bg-white"
                      value={filters.email}
                      onChange={(e) => handleFilterChange("email", e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-gray-700">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Shield size={16} className="text-gray-500" />
                    <span>Rol</span>
                  </div>
                  <div className="relative">
                    <select
                      className="w-full h-9 pl-3 pr-8 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all bg-white cursor-pointer appearance-none"
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
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-gray-700">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span>Registro</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="DD/MM/YYYY"
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all bg-white"
                      value={filters.date}
                      onChange={(e) => handleFilterChange("date", e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-right align-middle font-medium text-gray-700">
                <div className="flex items-center justify-end gap-2 h-full pt-7">
                  <Gear size={16} className="text-gray-500" />
                  <span>Acciones</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-gray-50/80 group">
                <td className="p-4 align-middle font-medium">
                  <div className="flex items-center gap-3">
                    {user.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.image} alt={user.name || ""} className="w-9 h-9 rounded-full object-cover border border-gray-200 shadow-sm" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 text-sm font-bold shadow-sm">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-gray-900 font-semibold group-hover:text-teal-700 transition-colors">{user.name}</span>
                  </div>
                </td>
                <td className="p-4 align-middle text-gray-600">{user.email}</td>
                <td className="p-4 align-middle">
                  <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${user.role === 'ADMIN'
                      ? 'bg-purple-50 text-purple-700 border border-purple-100'
                      : 'bg-blue-50 text-blue-700 border border-blue-100'
                    }`}>
                    {user.role === 'ADMIN' ? 'Administrador' : 'Estudiante'}
                  </span>
                </td>
                <td className="p-4 align-middle text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-4 align-middle text-right">
                  <UserActions userId={user.id} />
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500 bg-gray-50/30">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Funnel size={36} className="text-gray-300" weight="light" />
                    <p className="font-medium text-gray-700">No se encontraron usuarios</p>
                    <p className="text-sm">Intenta ajustar los filtros de búsqueda.</p>
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
