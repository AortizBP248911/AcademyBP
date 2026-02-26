"use client"

import { useState } from "react"
import { User, Book, ChartBar, Calendar, Gear, MagnifyingGlass, Funnel } from "@phosphor-icons/react"
import EnrollmentActions from "./enrollment-actions"
import { Enrollment, User as PrismaUser, Course } from "@/generated/client"

type EnrollmentWithRelations = Enrollment & {
  user: PrismaUser
  course: Course
}

interface EnrollmentListProps {
  initialEnrollments: EnrollmentWithRelations[]
}

export default function EnrollmentList({ initialEnrollments }: EnrollmentListProps) {
  const [filters, setFilters] = useState({
    user: "",
    course: "",
    progress: "",
    date: ""
  })

  const filteredEnrollments = initialEnrollments.filter((enrollment) => {
    const userMatch =
      enrollment.user.name?.toLowerCase().includes(filters.user.toLowerCase()) ||
      enrollment.user.email?.toLowerCase().includes(filters.user.toLowerCase()) ||
      false

    const courseMatch = enrollment.course.title.toLowerCase().includes(filters.course.toLowerCase())

    const progressMatch = filters.progress === "" || enrollment.progress.toString().includes(filters.progress)

    const dateMatch = filters.date === "" || new Date(enrollment.createdAt).toLocaleDateString().includes(filters.date)

    return userMatch && courseMatch && progressMatch && dateMatch
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
                    <span>Estudiante</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Filtrar..."
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all bg-white"
                      value={filters.user}
                      onChange={(e) => handleFilterChange("user", e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-gray-700">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Book size={16} className="text-gray-500" />
                    <span>Curso</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Filtrar..."
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all bg-white"
                      value={filters.course}
                      onChange={(e) => handleFilterChange("course", e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-gray-700 w-32">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <ChartBar size={16} className="text-gray-500" />
                    <span>Progreso</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="%"
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all bg-white"
                      value={filters.progress}
                      onChange={(e) => handleFilterChange("progress", e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-gray-700 w-40">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-500" />
                    <span>Fecha</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Fecha..."
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all bg-white"
                      value={filters.date}
                      onChange={(e) => handleFilterChange("date", e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-right align-top font-medium text-gray-700 w-24">
                <div className="flex items-center justify-end gap-2 h-8 mt-1">
                  <Gear size={16} className="text-gray-500" />
                  <span>Acciones</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredEnrollments.map((enrollment) => (
              <tr key={`${enrollment.userId}-${enrollment.courseId}`} className="transition-colors hover:bg-gray-50/80 group">
                <td className="p-4 align-middle font-medium">
                  <div className="flex flex-col">
                    <span className="text-gray-900 font-semibold group-hover:text-teal-700 transition-colors">{enrollment.user.name}</span>
                    <span className="text-xs text-gray-500">{enrollment.user.email}</span>
                  </div>
                </td>
                <td className="p-4 align-middle text-gray-700">{enrollment.course.title}</td>
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                      <div className="h-full bg-teal-500" style={{ width: `${enrollment.progress}%` }} />
                    </div>
                    <span className="text-xs text-gray-700 font-medium">{enrollment.progress}%</span>
                  </div>
                </td>
                <td className="p-4 align-middle text-gray-500 text-xs">{new Date(enrollment.createdAt).toLocaleDateString()}</td>
                <td className="p-4 align-middle text-right">
                  <EnrollmentActions userId={enrollment.userId} courseId={enrollment.courseId} />
                </td>
              </tr>
            ))}
            {filteredEnrollments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-gray-500 bg-gray-50/30">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Funnel size={36} className="text-gray-300" weight="light" />
                    <p className="font-medium text-gray-700">No se encontraron inscripciones</p>
                    <p className="text-sm">Ajusta los filtros o inscribe a un estudiante.</p>
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
