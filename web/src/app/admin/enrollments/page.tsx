import { prisma } from "@/lib/prisma"
import EnrollmentForm from "./enrollment-form"
import EnrollmentList from "./enrollment-list"
import { UsersThree } from "@phosphor-icons/react/dist/ssr"

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
      <div className="flex items-center gap-3">
        <div className="p-2 bg-black text-white rounded-lg">
            <UsersThree size={24} weight="fill" />
        </div>
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-black">Inscripciones</h1>
            <p className="text-sm text-gray-600">Gestiona el acceso de los estudiantes a los cursos.</p>
        </div>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <EnrollmentList initialEnrollments={enrollments} />
        </div>
        
        <div className="lg:col-span-1">
          <EnrollmentForm users={users} courses={courses} />
        </div>
      </div>
    </div>
  )
}
