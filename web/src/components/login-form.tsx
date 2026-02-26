"use client"

import * as React from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Envelope, LockKey, CircleNotch } from "@phosphor-icons/react"
import { clsx } from "clsx"

export default function LoginForm({ className }: { className?: string }) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const router = useRouter()

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault()
    setIsLoading(true)
    setError(null)

    const target = event.target as typeof event.target & {
      email: { value: string }
      password: { value: string }
    }

    const email = target.email.value
    const password = target.password.value

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Invalid credentials. Please try again.")
        setIsLoading(false)
        return
      }

      // Check session to determine redirect
      const session = await getSession()
      if (session?.user?.role === "ADMIN") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
      
      router.refresh()
    } catch (error) {
      setError("Something went wrong.")
      setIsLoading(false)
    }
  }

  return (
    <div className={clsx("grid gap-6")}>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4">
          <div className="grid gap-1">
            <label className="sr-only" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-600">
                <Envelope size={20} />
              </div>
              <input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>
          </div>
          <div className="grid gap-1">
            <label className="sr-only" htmlFor="password">
              Contraseña
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-600">
                <LockKey size={20} />
              </div>
              <input
                id="password"
                placeholder="Contraseña"
                type="password"
                autoCapitalize="none"
                autoComplete="current-password"
                autoCorrect="off"
                disabled={isLoading}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-600 dark:placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-10 dark:bg-zinc-800 dark:border-zinc-700 dark:text-white"
              />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            disabled={isLoading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2"
          >
            {isLoading && (
              <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
            )}
            Iniciar Sesión
          </button>
        </div>
      </form>
    </div>
  )
}
