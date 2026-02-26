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
      className="inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white hover:bg-teal-600 h-10 px-4 py-2 w-full sm:w-auto shadow-sm"
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
        className="inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white hover:bg-teal-600 h-10 px-4 py-2 shadow-sm"
      >
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Curso
      </button>
    )
  }

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-100 bg-white p-6 shadow-xl duration-200 sm:rounded-xl overflow-hidden">
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold leading-none tracking-tight text-gray-900">Crear Nuevo Curso</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-full p-1.5 hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
            >
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-gray-500">
            Ingresa un título para el nuevo curso. Puedes añadir más detalles después.
          </p>
        </div>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium leading-none text-gray-700">Título del Curso</label>
            <input
              id="title"
              name="title"
              required
              placeholder="ej. Desarrollo Web Avanzado"
              className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 transition-all disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2 sm:gap-0 pt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 h-10 px-4 py-2 text-gray-700 shadow-sm"
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
