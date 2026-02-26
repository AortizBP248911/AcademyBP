"use client"

import { updateUser } from "@/actions/users"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { CircleNotch, FloppyDisk } from "@phosphor-icons/react"
import { User } from "@/generated/client"

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

export default function UserEditForm({ user }: { user: User }) {
  const updateUserWithId = updateUser.bind(null, user.id)
  // @ts-expect-error React 19 useActionState
  const [state, formAction] = useActionState(updateUserWithId, initialState)

  return (
    <div className="rounded-lg border bg-white shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4 text-black">Editar Usuario</h2>
      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-900">Nombre</label>
          <input 
            id="name" 
            name="name" 
            defaultValue={user.name || ""} 
            required 
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:ring-2 focus-visible:ring-black placeholder:text-gray-600" 
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-gray-900">Correo Electrónico</label>
          <input 
            id="email" 
            name="email" 
            type="email"
            defaultValue={user.email || ""} 
            required 
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:ring-2 focus-visible:ring-black placeholder:text-gray-600" 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium text-gray-900">Nueva Contraseña (Opcional)</label>
          <input 
            id="password" 
            name="password" 
            type="password"
            minLength={6}
            placeholder="Dejar en blanco para mantener la actual"
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:ring-2 focus-visible:ring-black placeholder:text-gray-600" 
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="role" className="text-sm font-medium text-gray-900">Rol</label>
          <select 
            id="role" 
            name="role" 
            defaultValue={user.role}
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-black focus-visible:ring-2 focus-visible:ring-black"
          >
            <option value="STUDENT">Estudiante</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium text-gray-900">Imagen de Perfil</label>
            {user.image && (
              <div className="flex items-center gap-4 mb-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={user.image} alt={user.name || ""} className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                <span className="text-xs text-gray-600">Imagen actual</span>
              </div>
            )}
            <input 
              id="image" 
              name="image" 
              type="file" 
              accept="image/*"
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50" 
            />
        </div>

        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
        {state?.success && <p className="text-green-500 text-sm">{state.message}</p>}
        
        <SubmitButton />
      </form>
    </div>
  )
}