"use client"

import { useState, useTransition } from "react"
import { Trash, Warning, X, Lock, CircleNotch } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"

interface DeleteButtonWithConfirmationProps {
  onDelete: (password: string) => Promise<{ error?: string; success?: boolean }>
  description?: string
  confirmationText?: string
}

export default function DeleteButtonWithConfirmation({ 
  onDelete, 
  description = "Esta acción no se puede deshacer.",
  confirmationText = "¿Estás seguro?"
}: DeleteButtonWithConfirmationProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    if (!password) {
      setError("Por favor ingresa tu contraseña")
      return
    }

    startTransition(async () => {
      const result = await onDelete(password)
      if (result?.error) {
        setError(result.error)
      } else {
        setIsOpen(false)
        setPassword("")
        router.refresh()
      }
    })
  }

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-500 hover:text-red-600 transition-colors rounded-full hover:bg-red-50"
        title="Eliminar"
      >
        <Trash size={20} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4 text-red-600">
                <div className="p-3 bg-red-100 rounded-full">
                  <Warning size={24} weight="fill" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">{confirmationText}</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                {description} Para confirmar, por favor ingresa tu contraseña de administrador.
              </p>

              <form onSubmit={handleDelete} className="space-y-4">
                <div>
                  <label htmlFor="password-confirm" className="block text-sm font-medium text-gray-700 mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <Lock size={16} />
                    </div>
                    <input
                      id="password-confirm"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-black focus:border-black sm:text-sm"
                      placeholder="Tu contraseña actual"
                      autoFocus
                    />
                  </div>
                  {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false)
                      setPassword("")
                      setError("")
                    }}
                    disabled={isPending}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px]"
                  >
                    {isPending ? (
                      <CircleNotch size={18} className="animate-spin" />
                    ) : (
                      "Eliminar"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
