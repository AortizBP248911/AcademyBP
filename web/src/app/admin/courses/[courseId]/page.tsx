import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import CourseEditForm from "./course-edit-form"
import LessonList from "./lesson-list"

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        orderBy: { position: "asc" }
      },
      category: true
    }
  })

  if (!course) notFound()

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" }
  })

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-black">Editar Curso</h1>
        <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">ID: {course.id}</span>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <CourseEditForm course={course} categories={categories} />
        </div>
        
        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4 text-black">Lecciones</h2>
            <LessonList courseId={course.id} initialLessons={course.lessons} />
          </div>
        </div>
      </div>
    </div>
  )
}
