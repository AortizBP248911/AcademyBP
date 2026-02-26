import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          _count: { select: { lessons: true } },
          category: true
        }
      }
    }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Mi Aprendizaje</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {enrollments.map((enrollment) => (
          <Link
            key={enrollment.courseId}
            href={`/dashboard/courses/${enrollment.courseId}`}
            className="group block space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm hover:border-teal-200 hover:shadow-md transition-all overflow-hidden"
          >
            {enrollment.course.imageUrl && (
              <div className="relative aspect-video w-full rounded-md overflow-hidden border border-gray-100 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={enrollment.course.imageUrl} alt={enrollment.course.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
              </div>
            )}
            <div className="flex justify-between items-start">
              <h3 className="font-semibold leading-tight group-hover:text-teal-700 decoration-2 underline-offset-4 line-clamp-2 min-h-[2.5rem] text-gray-900 transition-colors">
                {enrollment.course.title}
              </h3>
              <span className="text-[10px] uppercase font-bold tracking-wider bg-teal-50 text-teal-700 px-2 py-1 rounded shrink-0 ml-2 border border-teal-100">
                {enrollment.course.category?.name || 'General'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-600 font-medium">
                <span className="text-gray-900 font-semibold">{enrollment.progress}% Completado</span>
                <span>{enrollment.course._count.lessons} Lecciones</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                <div
                  className="h-full rounded-full bg-teal-500 transition-all duration-500 ease-out"
                  style={{ width: `${enrollment.progress}%` }}
                />
              </div>
            </div>

            <div className="pt-2">
              <div className="w-full text-center text-sm font-medium bg-gray-900 text-white group-hover:bg-teal-600 py-2.5 rounded-lg transition-colors shadow-sm">
                Continuar Aprendiendo
              </div>
            </div>
          </Link>
        ))}
        {enrollments.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
            <h3 className="text-lg font-medium text-gray-900">Aún no hay cursos</h3>
            <p className="text-gray-500 mt-2 mb-6">No estás inscrito en ningún curso.</p>
            <Link href="/dashboard/browse" className="inline-flex text-sm font-medium bg-gray-900 text-white hover:bg-teal-600 px-6 py-2.5 rounded-lg transition-colors shadow-sm">
              Explorar cursos disponibles
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
