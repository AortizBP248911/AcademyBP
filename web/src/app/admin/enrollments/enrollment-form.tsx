"use client"

import { createEnrollment, deleteEnrollment } from "@/actions/enrollments"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { CircleNotch, Plus, Trash, UserPlus } from "@phosphor-icons/react"
import { User, Course } from "@/generated/client"

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
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2 w-full mt-4"
    >
      {pending ? <CircleNotch className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
      {pending ? "Inscribiendo..." : "Inscribir Estudiante"}
    </button>
  )
}

interface EnrollmentFormProps {
  users: User[]
  courses: Course[]
}

export default function EnrollmentForm({ users, courses }: EnrollmentFormProps) {
  // @ts-expect-error React 19
  const [state, formAction] = useActionState(createEnrollment, initialState)

  return (
    <div className="rounded-lg border bg-white shadow-sm sticky top-6">
      <div className="flex flex-col space-y-1.5 p-6 border-b bg-gray-50/50">
        <div className="flex items-center gap-2">
            <UserPlus size={20} className="text-black" />
            <h3 className="text-lg font-semibold leading-none tracking-tight text-black">Nueva Inscripción</h3>
        </div>
        <p className="text-sm text-gray-600 pl-7">Asignar un curso a un estudiante.</p>
      </div>
      <div className="p-6">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="userId" className="text-sm font-medium">Estudiante</label>
            <select 
              id="userId" 
              name="userId" 
              required
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-black text-black"
            >
              <option value="">Seleccionar Estudiante...</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="courseId" className="text-sm font-medium">Curso</label>
            <select 
              id="courseId" 
              name="courseId" 
              required
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-black text-black"
            >
              <option value="">Seleccionar Curso...</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
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
