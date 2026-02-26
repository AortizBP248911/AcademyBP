"use client"

import { createCourse } from "@/actions/courses"
import { useFormStatus } from "react-dom"
import { useActionState, useState } from "react"
import { CircleNotch, Plus, X } from "@phosphor-icons/react"

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
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2 w-full sm:w-auto"
    >
      {pending ? <CircleNotch className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? "Creando..." : "Crear Curso"}
    </button>
  )
}

export default function CreateCourseForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [state, formAction] = useActionState(createCourse, initialState)

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2"
      >
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Curso
      </button>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold leading-none tracking-tight text-black">Crear Nuevo Curso</h3>
            <button 
                onClick={() => setIsOpen(false)}
                className="rounded-full p-1 hover:bg-gray-100 transition-colors"
            >
                <X size={20} className="text-gray-600" />
            </button>
          </div>
          <p className="text-sm text-gray-600">
            Ingresa un título para el nuevo curso. Puedes añadir más detalles después.
          </p>
        </div>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900">Título del Curso</label>
            <input
              id="title"
              name="title"
              required
              placeholder="ej. Desarrollo Web Avanzado"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0">
            <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-100 h-10 px-4 py-2 text-gray-900"
            >
                Cancelar
            </button>
            <SubmitButton />
          </div>
          {state?.error && <p className="text-red-500 text-sm text-center">{state.error}</p>}
        </form>
      </div>
    </>
  )
}
