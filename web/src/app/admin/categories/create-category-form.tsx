"use client"

import { createCategory } from "@/actions/categories"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { CircleNotch, PlusCircle } from "@phosphor-icons/react"

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
      className="inline-flex items-center justify-center rounded-lg text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-gray-900 text-white hover:bg-teal-600 h-10 px-4 py-2 w-full mt-4 shadow-sm"
    >
      {pending && <CircleNotch className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Creando..." : "Crear Categoría"}
    </button>
  )
}

export default function CreateCategoryForm() {
  // @ts-expect-error React 19 useActionState
  const [state, formAction] = useActionState(createCategory, initialState)

  return (
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm sticky top-6 overflow-hidden">
      <div className="flex flex-col space-y-1.5 p-6 border-b border-gray-100 bg-gray-50/80">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-teal-50 text-teal-600 rounded-md border border-teal-100 mr-1">
            <PlusCircle size={18} weight="fill" />
          </div>
          <h3 className="text-lg font-semibold leading-none tracking-tight text-gray-900">Añadir Nueva Categoría</h3>
        </div>
        <p className="text-sm text-gray-500 pt-1">Crea una categoría para organizar los cursos.</p>
      </div>
      <div className="p-6">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none text-gray-700">Nombre</label>
            <input
              id="name"
              name="name"
              required
              className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 transition-all disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Desarrollo"
            />
          </div>

          {state?.error && (
            <div className="p-3 rounded-md bg-red-50 text-red-500 text-sm border border-red-100">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="p-3 rounded-md bg-green-50 text-green-600 text-sm border border-green-100">
              {state.message}
            </div>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  )
}
