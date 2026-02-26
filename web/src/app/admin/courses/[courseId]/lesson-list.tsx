"use client"

import { createLesson, reorderLessons, deleteLesson } from "@/actions/lessons"
import { Lesson } from "@/generated/client"
import { useFormStatus } from "react-dom"
import { useActionState, useState, useEffect, useRef } from "react"
import { CircleNotch, Plus, Video, DotsSixVertical } from "@phosphor-icons/react"
import Link from "next/link"
import { Reorder } from "framer-motion"
import { toast } from "sonner"
import DeleteButtonWithConfirmation from "@/components/delete-button-with-confirmation"

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
  const [lessons, setLessons] = useState(initialLessons)
  const lessonsRef = useRef(initialLessons)

  useEffect(() => {
    setLessons(initialLessons)
    lessonsRef.current = initialLessons
  }, [initialLessons])

  useEffect(() => {
    lessonsRef.current = lessons
  }, [lessons])

  const [isCreating, setIsCreating] = useState(false)

  const handleReorder = (newOrder: Lesson[]) => {
    setLessons(newOrder)
  }

  const handleDragEnd = async () => {
    const items = lessonsRef.current.map((lesson, index) => ({
      id: lesson.id,
      position: index + 1
    }))
    
    try {
        await reorderLessons(items)
    } catch (error) {
        toast.error("Error al reordenar las lecciones")
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Reorder.Group axis="y" values={lessons} onReorder={handleReorder} className="space-y-2">
          {lessons.map((lesson) => (
            <Reorder.Item key={lesson.id} value={lesson} onDragEnd={handleDragEnd}>
              <div className="flex items-center gap-3 rounded-md border bg-white p-3 hover:bg-gray-50 transition-colors">
                <div className="cursor-move text-gray-600 flex-shrink-0">
                  <DotsSixVertical size={20} />
                </div>
                <Link
                  href={`/admin/courses/${courseId}/lessons/${lesson.id}`}
                  className="flex-1 flex items-center gap-2 min-w-0"
                >
                  <div className="font-medium text-sm flex items-center gap-2 truncate">
                    {lesson.title}
                    <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium flex-shrink-0 ${
                      lesson.isPublished ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {lesson.isPublished ? "Publicado" : "Borrador"}
                    </span>
                  </div>
                </Link>
                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="text-gray-600">
                        <Video size={20} />
                    </div>
                    <DeleteButtonWithConfirmation 
                      onDelete={(password) => deleteLesson(lesson.id, password)}
                      description="Esta acción eliminará la lección permanentemente y no se puede deshacer."
                      confirmationText="¿Eliminar lección?"
                    />
                </div>
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
        
        {lessons.length === 0 && (
          <p className="text-sm text-gray-600 italic">No hay lecciones aún.</p>
        )}
      </div>

      <div className="flex justify-end">
        <button
            onClick={() => setIsCreating(!isCreating)}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2"
        >
            <Plus className="mr-2 h-4 w-4" />
            {isCreating ? "Cancelar" : "Añadir Lección"}
        </button>
      </div>

      {isCreating && (
      <form action={formAction} className="flex flex-col gap-4 border p-4 rounded-lg bg-gray-50">
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
            <label htmlFor="image" className="text-sm font-medium text-gray-900">Imagen de la Lección</label>
            <input 
              id="image" 
              name="image" 
              type="file"
              accept="image/*"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50" 
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

        <div className="flex items-center space-x-2">
            <input 
              type="checkbox" 
              id="showImage" 
              name="showImage" 
              className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
            />
            <label htmlFor="showImage" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900">
              Mostrar Imagen
            </label>
        </div>

        <SubmitButton />
        {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      </form>
      )}
    </div>
  )
}