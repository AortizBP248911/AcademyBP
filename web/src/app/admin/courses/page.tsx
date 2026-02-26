import { prisma } from "@/lib/prisma"
import CreateCourseForm from "./create-course-form"
import Link from "next/link"
import Image from "next/image"
import { BookOpen, ChalkboardTeacher } from "@phosphor-icons/react/dist/ssr"
import { CourseActions } from "./course-actions"

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      _count: {
        select: { lessons: true }
      }
    }
  })

  return (
    <div className="space-y-6 bg-gray-50/30 min-h-full p-6 -m-6 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-teal-50 text-teal-600 border border-teal-100 rounded-lg shadow-sm">
            <ChalkboardTeacher size={24} weight="fill" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Cursos</h1>
            <p className="text-sm text-gray-500 mt-0.5">Gestiona tus cursos y contenido.</p>
          </div>
        </div>
        <CreateCourseForm />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-teal-200 hover:shadow-md h-full overflow-hidden"
          >
            <Link href={`/admin/courses/${course.id}`} className="block relative aspect-video w-full overflow-hidden rounded-md border border-gray-100 bg-gray-50 mb-4 shrink-0">
              {course.imageUrl ? (
                <Image
                  src={course.imageUrl}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-300">
                  <BookOpen size={48} weight="light" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`inline-flex items-center rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm border ${course.isPublished ? "bg-green-50 text-green-700 border-green-100" : "bg-yellow-50 text-yellow-800 border-yellow-200"
                  }`}>
                  {course.isPublished ? "Publicado" : "Borrador"}
                </span>
              </div>
            </Link>

            <div className="flex flex-col flex-1">
              <Link href={`/admin/courses/${course.id}`} className="block mb-1">
                <h3 className="font-semibold leading-tight text-gray-900 line-clamp-2 min-h-[2.5rem] group-hover:text-teal-700 transition-colors">
                  {course.title}
                </h3>
              </Link>
              <div className="mb-4">
                <span className="inline-flex text-[10px] uppercase font-bold tracking-wider bg-gray-50 px-2 py-1 rounded text-gray-600 shrink-0 border border-gray-100">
                  {course.category?.name || "Sin Categoría"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                <div className="flex flex-col text-xs font-medium text-gray-500">
                  <span className="flex items-center gap-1">
                    {course._count.lessons} Lecciones
                  </span>
                </div>
                <CourseActions courseId={course.id} />
              </div>
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
            No se encontraron cursos. Crea el primero arriba.
          </div>
        )}
      </div>
    </div>
  )
}
