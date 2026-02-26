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
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-black">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    <span>Estudiante</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Filtrar..." 
                      className="w-full h-8 pl-8 pr-2 rounded-md border border-gray-200 text-xs focus:outline-none focus:border-black transition-colors"
                      value={filters.user}
                      onChange={(e) => handleFilterChange("user", e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-black">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Book size={16} />
                    <span>Curso</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Filtrar..." 
                      className="w-full h-8 pl-8 pr-2 rounded-md border border-gray-200 text-xs focus:outline-none focus:border-black transition-colors"
                      value={filters.course}
                      onChange={(e) => handleFilterChange("course", e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-black w-32">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <ChartBar size={16} />
                    <span>Progreso</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="%" 
                      className="w-full h-8 pl-8 pr-2 rounded-md border border-gray-200 text-xs focus:outline-none focus:border-black transition-colors"
                      value={filters.progress}
                      onChange={(e) => handleFilterChange("progress", e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-black w-40">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span>Fecha</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Fecha..." 
                      className="w-full h-8 pl-8 pr-2 rounded-md border border-gray-200 text-xs focus:outline-none focus:border-black transition-colors"
                      value={filters.date}
                      onChange={(e) => handleFilterChange("date", e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-right align-top font-medium text-black w-24">
                <div className="flex items-center justify-end gap-2 h-8">
                  <Gear size={16} />
                  <span>Acciones</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredEnrollments.map((enrollment) => (
              <tr key={`${enrollment.userId}-${enrollment.courseId}`} className="transition-colors hover:bg-gray-50/50">
                <td className="p-4 align-middle font-medium">
                  <div className="flex flex-col">
                    <span className="text-black">{enrollment.user.name}</span>
                    <span className="text-xs text-gray-600">{enrollment.user.email}</span>
                  </div>
                </td>
                <td className="p-4 align-middle text-black">{enrollment.course.title}</td>
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-12 rounded-full bg-gray-100 overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: `${enrollment.progress}%` }} />
                    </div>
                    <span className="text-xs text-black">{enrollment.progress}%</span>
                  </div>
                </td>
                <td className="p-4 align-middle text-black text-xs">{new Date(enrollment.createdAt).toLocaleDateString()}</td>
                <td className="p-4 align-middle text-right">
                  <EnrollmentActions userId={enrollment.userId} courseId={enrollment.courseId} />
                </td>
              </tr>
            ))}
            {filteredEnrollments.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-600">
                  <div className="flex flex-col items-center gap-2">
                    <Funnel size={32} className="text-gray-300" />
                    <p>No se encontraron inscripciones con los filtros actuales.</p>
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
