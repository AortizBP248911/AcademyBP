"use client"

import { createLesson } from "@/actions/lessons"
import { Lesson } from "@prisma/client"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { CircleNotch, Plus, Video, DotsSixVertical } from "@phosphor-icons/react"
import Link from "next/link"

const initialState = {
  message: "",
  error: "",
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2"
    >
      {pending ? <CircleNotch className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
      {pending ? "Añadiendo..." : "Añadir Lección"}
    </button>
  )
}

interface LessonListProps {
  courseId: string
  initialLessons: Lesson[]
}

export default function LessonList({ courseId, initialLessons }: LessonListProps) {
  const [state, formAction] = useActionState(createLesson, initialState)

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {initialLessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
            className="flex items-center gap-3 rounded-md border bg-white p-3 hover:bg-gray-50 transition-colors"
          >
            <div className="cursor-move text-gray-600">
              <DotsSixVertical size={20} />
            </div>
            <div className="flex-1">
              <div className="font-medium text-sm flex items-center gap-2">
                {lesson.title}
                <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
                  lesson.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"
                }`}>
                  {lesson.isPublished ? "Publicado" : "Borrador"}
                </span>
              </div>
            </div>
            <div className="text-gray-600">
                <Video size={20} />
            </div>
          </Link>
        ))}
        {initialLessons.length === 0 && (
          <p className="text-sm text-gray-600 italic">No hay lecciones aún.</p>
        )}
      </div>

      <form action={formAction} className="flex flex-col gap-4 border-t pt-4">
        <input type="hidden" name="courseId" value={courseId} />
        <h3 className="font-semibold text-gray-900">Añadir Nueva Lección</h3>
        
        <div className="grid gap-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-900">Título de la Lección</label>
          <input
            id="title"
            name="title"
            required
            placeholder="ej. Introducción al curso"
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="videoUrl" className="text-sm font-medium text-gray-900">URL del Video (YouTube) - Opcional</label>
          <input
            id="videoUrl"
            name="videoUrl"
            placeholder="https://youtube.com/watch?v=..."
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-900">Descripción - Opcional</label>
          <textarea
            id="description"
            name="description"
            rows={3}
            className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
          />
        </div>

        <div className="flex items-center justify-between">
            <p className="text-xs text-gray-600">
                Puedes subir documentos y gestionar adjuntos después de crear la lección.
            </p>
            <SubmitButton />
        </div>
      </form>
      {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
    </div>
  )
}
