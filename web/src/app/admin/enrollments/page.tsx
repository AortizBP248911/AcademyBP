import { prisma } from "@/lib/prisma"
import EnrollmentForm from "./enrollment-form"
import EnrollmentActions from "./enrollment-actions"
import { User, Book, ChartBar, Calendar, Gear } from "@phosphor-icons/react/dist/ssr"

export default async function EnrollmentsPage() {
  const enrollments = await prisma.enrollment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      course: true
    }
  })

  const users = await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { name: "asc" }
  })

  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    orderBy: { title: "asc" }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-black">Inscripciones</h1>
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
                            <span>Estudiante</span>
                        </div>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-black">
                        <div className="flex items-center gap-2">
                            <Book size={16} />
                            <span>Curso</span>
                        </div>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-black">
                        <div className="flex items-center gap-2">
                            <ChartBar size={16} />
                            <span>Progreso</span>
                        </div>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-black">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>Fecha</span>
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
                  {enrollments.map((enrollment) => (
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
                  {enrollments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-600">
                        No hay inscripciones. Asigna un curso para comenzar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <EnrollmentForm users={users} courses={courses} />
        </div>
      </div>
    </div>
  )
}
