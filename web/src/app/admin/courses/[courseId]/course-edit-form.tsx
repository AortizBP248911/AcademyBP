"use client"

import { updateCourse } from "@/actions/courses"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { CircleNotch, FloppyDisk } from "@phosphor-icons/react"
import { Category, Course } from "@prisma/client"

const initialState = {
  message: "",
  error: "",
  success: false
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2 w-full mt-6"
    >
      {pending ? <CircleNotch className="mr-2 h-4 w-4 animate-spin" /> : <FloppyDisk className="mr-2 h-4 w-4" />}
      {pending ? "Guardando..." : "Guardar Cambios"}
    </button>
  )
}

interface CourseEditFormProps {
  course: Course
  categories: Category[]
}

export default function CourseEditForm({ course, categories }: CourseEditFormProps) {
  const updateCourseWithId = updateCourse.bind(null, course.id)
  // @ts-expect-error React 19
  const [state, formAction] = useActionState(updateCourseWithId, initialState)

  return (
    <div className="rounded-lg border bg-white shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 text-black">Detalles del Curso</h2>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="title" className="text-sm font-medium text-gray-900">Título</label>
          <input 
            id="title" 
            name="title" 
            defaultValue={course.title} 
            required 
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:ring-2 focus-visible:ring-black placeholder:text-gray-600" 
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium text-gray-900">Descripción</label>
          <textarea 
            id="description" 
            name="description" 
            defaultValue={course.description || ""} 
            className="flex min-h-[100px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:ring-2 focus-visible:ring-black placeholder:text-gray-600" 
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label htmlFor="categoryId" className="text-sm font-medium text-gray-900">Categoría</label>
            <select 
              id="categoryId" 
              name="categoryId" 
              defaultValue={course.categoryId || ""}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus-visible:ring-2 focus-visible:ring-black"
            >
              <option value="">Seleccionar Categoría...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium text-gray-900">Imagen del Curso</label>
            {course.imageUrl && (
              <div className="relative aspect-video w-full max-w-sm rounded-md overflow-hidden border border-gray-200 mb-2">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={course.imageUrl} alt={course.title} className="object-cover w-full h-full" />
              </div>
            )}
            <input 
              id="image" 
              name="image" 
              type="file"
              accept="image/*"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50" 
            />
            <p className="text-xs text-gray-600">Sube una nueva imagen para reemplazar la actual.</p>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input 
            type="checkbox" 
            id="isPublished" 
            name="isPublished" 
            defaultChecked={course.isPublished}
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
          />
          <label htmlFor="isPublished" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Publicar este curso
          </label>
        </div>

        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        {state?.success && <p className="text-green-500 text-sm">{state.message}</p>}
        
        <SubmitButton />
      </form>
    </div>
  )
}
