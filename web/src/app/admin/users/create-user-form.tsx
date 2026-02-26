"use client"

import { createUser } from "@/actions/users"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { CircleNotch, UserPlus } from "@phosphor-icons/react"

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
      {pending && <CircleNotch className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? "Creando..." : "Crear Usuario"}
    </button>
  )
}

export default function CreateUserForm() {
  // @ts-expect-error React 19 useActionState
  const [state, formAction] = useActionState(createUser, initialState)

  return (
    <div className="rounded-lg border bg-white shadow-sm sticky top-6">
      <div className="flex flex-col space-y-1.5 p-6 border-b bg-gray-50/50">
        <div className="flex items-center gap-2">
            <UserPlus size={20} className="text-black" />
            <h3 className="text-lg font-semibold leading-none tracking-tight text-black">Agregar Nuevo Usuario</h3>
        </div>
        <p className="text-sm text-gray-600 pl-7">Crear un nuevo usuario y enviarle un correo.</p>
      </div>
      <div className="p-6">
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900">Nombre</label>
            <input id="name" name="name" required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="Juan Pérez" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900">Correo Electrónico</label>
            <input id="email" name="email" type="email" required className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="juan@ejemplo.com" />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900">Contraseña</label>
            <input id="password" name="password" type="password" required minLength={6} className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" placeholder="******" />
          </div>
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900">Rol</label>
            <select id="role" name="role" className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              <option value="STUDENT">Estudiante</option>
              <option value="ADMIN">Administrador</option>
            </select>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-900">Imagen de Perfil</label>
            <input 
              id="image" 
              name="image" 
              type="file" 
              accept="image/*"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50" 
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
