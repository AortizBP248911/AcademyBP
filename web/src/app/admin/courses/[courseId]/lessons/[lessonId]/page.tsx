import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import LessonEditForm from "./lesson-edit-form"
import AttachmentList from "./attachment-list"
import Link from "next/link"
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr"

export default async function LessonPage({ params }: { params: Promise<{ courseId: string, lessonId: string }> }) {
  const { courseId, lessonId } = await params
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { attachments: true }
  })

  if (!lesson) notFound()

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link 
            href={`/admin/courses/${courseId}`}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
        >
            <ArrowLeft size={20} />
        </Link>
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Editar Lección</h1>
            <span className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded">ID: {lesson.id}</span>
        </div>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <LessonEditForm lesson={lesson} />
        </div>
        
        <div className="space-y-6">
          <AttachmentList lessonId={lesson.id} courseId={courseId} attachments={lesson.attachments} />
        </div>
      </div>
    </div>
  )
}
