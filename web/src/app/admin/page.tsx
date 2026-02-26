import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, BookOpen } from "@phosphor-icons/react/dist/ssr"
import Link from "next/link"

export default async function AdminDashboard() {
  const [totalStudents, totalCourses] = await Promise.all([
    prisma.user.count({
      where: {
        role: "STUDENT",
      },
    }),
    prisma.course.count(),
  ])

  return (
    <div className="space-y-6 bg-gray-50/30 min-h-full p-6 -m-6 rounded-xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Panel de Control</h1>
        <p className="text-gray-600 mt-2">Bienvenido al panel de administración. Aquí tienes un resumen de tu academia.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/enrollments" className="block group">
          <Card className="rounded-xl border-gray-100 shadow-sm h-full hover:border-blue-200 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-blue-700 transition-colors">Total Estudiantes</CardTitle>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-md group-hover:bg-blue-100 transition-colors">
                <Users className="h-4 w-4" weight="fill" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalStudents}</div>
              <p className="text-xs text-gray-500 mt-1">
                Administrar inscripciones y usuarios
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/admin/courses" className="block group">
          <Card className="rounded-xl border-gray-100 shadow-sm h-full hover:border-teal-200 hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700 group-hover:text-teal-700 transition-colors">Cursos Totales</CardTitle>
              <div className="p-2 bg-teal-50 text-teal-600 rounded-md group-hover:bg-teal-100 transition-colors">
                <BookOpen className="h-4 w-4" weight="fill" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">{totalCourses}</div>
              <p className="text-xs text-gray-500 mt-1">
                Gestionar contenido del catálogo
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
