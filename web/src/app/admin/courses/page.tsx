import { prisma } from "@/lib/prisma"
import CreateCourseForm from "./create-course-form"
import Link from "next/link"
import Image from "next/image"
import { BookOpen } from "@phosphor-icons/react/dist/ssr"
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold tracking-tight text-black">Cursos</h1>
        <CreateCourseForm />
      </div>
      
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {courses.map((course) => (
          <div 
            key={course.id} 
            className="group block rounded-lg border bg-white p-4 shadow-sm transition-all hover:border-black hover:shadow-md"
          >
            <Link href={`/admin/courses/${course.id}`} className="block relative aspect-video w-full overflow-hidden rounded-md bg-gray-100 mb-3">
              {course.imageUrl ? (
                <Image 
                  src={course.imageUrl} 
                  alt={course.title} 
                  fill 
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-gray-400">
                  <BookOpen size={48} weight="light" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium shadow-sm ${
                  course.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {course.isPublished ? "Publicado" : "Borrador"}
                </span>
              </div>
            </Link>

            <div className="space-y-1 mb-2">
              <Link href={`/admin/courses/${course.id}`} className="block">
                <h3 className="text-lg font-semibold leading-tight text-gray-900 line-clamp-2 min-h-[1.5em] hover:text-blue-600 transition-colors">
                  {course.title}
                </h3>
              </Link>
              <p className="text-sm text-gray-600">
                {course.category?.name || "Sin Categoría"}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t mt-auto">
              <div className="flex flex-col text-xs text-gray-600">
                <span className="flex items-center gap-1">
                   {course._count.lessons} Lecciones
                </span>
                <span className="font-medium text-black">
                  {course.price ? `$${course.price}` : "Gratis"}
                </span>
              </div>
              <CourseActions courseId={course.id} />
            </div>
          </div>
        ))}
        {courses.length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed p-12 text-center text-gray-600">
            No se encontraron cursos. Crea el primero arriba.
          </div>
        )}
      </div>
    </div>
  )
}
