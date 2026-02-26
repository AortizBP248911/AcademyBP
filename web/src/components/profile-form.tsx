"use client"

import { updateProfile } from "@/actions/users"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { CircleNotch, FloppyDisk } from "@phosphor-icons/react"

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

export default function ProfileForm({ user }: { user: any }) {
  // @ts-expect-error React 19 useActionState
  const [state, formAction] = useActionState(updateProfile, initialState)

  return (
    <div className="rounded-lg border bg-white shadow-sm p-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-6 text-black">Configuración de Perfil</h2>
      
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm mb-4">
          {state.error}
        </div>
      )}
      
      {state?.success && (
        <div className="bg-green-50 text-green-600 p-3 rounded-md text-sm mb-4">
          {state.message || "Perfil actualizado exitosamente"}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div className="space-y-2">
            <label htmlFor="image" className="text-sm font-medium text-gray-900">Imagen de Perfil</label>
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-2 p-4 border rounded-md bg-gray-50">
              {user.image ? (
                <div className="relative">
                   {/* eslint-disable-next-line @next/next/no-img-element */}
                   <img src={user.image} alt={user.name || ""} className="w-24 h-24 rounded-full object-cover border-2 border-white shadow-sm" />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl font-bold border-2 border-white shadow-sm">
                  {user.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div className="flex-1 w-full">
                <input 
                  id="image" 
                  name="image" 
                  type="file" 
                  accept="image/*"
                  className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black disabled:cursor-not-allowed disabled:opacity-50" 
                />
                <p className="text-xs text-gray-500 mt-2">Sube una imagen JPG, PNG o GIF. Máximo 5MB.</p>
              </div>
            </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium text-gray-900">Nombre Completo</label>
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
          <label htmlFor="password" className="text-sm font-medium text-gray-900">Nueva Contraseña</label>
          <input 
            id="password" 
            name="password" 
            type="password"
            minLength={6}
            placeholder="Dejar en blanco para mantener la actual"
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus-visible:ring-2 focus-visible:ring-black placeholder:text-gray-600" 
          />
          <p className="text-xs text-gray-500">Mínimo 6 caracteres.</p>
        </div>

        <SubmitButton />
      </form>
    </div>
  )
}