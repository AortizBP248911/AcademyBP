import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { auth } from "@/auth"

export default async function BrowsePage() {
  const session = await auth()
  const courses = await prisma.course.findMany({
    where: { isPublished: true },
    include: {
      category: true,
      _count: { select: { lessons: true } },
      enrollments: {
        where: { userId: session?.user?.id },
      }
    }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Explorar Cursos</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((course) => {
          const isEnrolled = course.enrollments.length > 0
          return (
            <div
              key={course.id}
              className="flex flex-col space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-sm overflow-hidden group hover:shadow-md hover:border-teal-200 transition-all"
            >
              {course.imageUrl && (
                <div className="relative aspect-video w-full rounded-md overflow-hidden border border-gray-100 mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={course.imageUrl} alt={course.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="flex justify-between items-start">
                <h3 className="font-semibold leading-tight line-clamp-2 min-h-[2.5rem] text-gray-900 group-hover:text-teal-700 transition-colors">
                  {course.title}
                </h3>
                <span className="text-[10px] uppercase font-bold tracking-wider bg-teal-50 px-2 py-1 rounded text-teal-700 shrink-0 ml-2 border border-teal-100">
                  {course.category?.name || 'General'}
                </span>
              </div>

              <p className="text-sm text-gray-600 line-clamp-3 flex-1 leading-relaxed">
                {course.description || "Sin descripción disponible."}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-500 font-medium pt-3 border-t border-gray-100 mt-auto">
                <span>{course._count.lessons} Lecciones</span>
              </div>

              <div className="pt-2">
                {isEnrolled ? (
                  <Link href={`/dashboard/courses/${course.id}`} className="block w-full text-center text-sm font-medium border border-gray-200 text-gray-700 py-2.5 rounded-lg hover:bg-teal-50 hover:text-teal-700 hover:border-teal-200 focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all shadow-sm">
                    Continuar
                  </Link>
                ) : (
                  <button disabled className="w-full text-center text-sm font-medium bg-gray-50 text-gray-400 border border-gray-200 py-2.5 rounded-lg cursor-not-allowed">
                    Contactar Admin para Inscribirse
                  </button>
                )}
              </div>
            </div>
          )
        })}
        {courses.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
            No hay cursos disponibles en este momento.
          </div>
        )}
      </div>
    </div>
  )
}
