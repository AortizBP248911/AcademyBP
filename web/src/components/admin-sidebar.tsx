"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  ChalkboardTeacher, 
  Users, 
  Files, 
  SignOut, 
  SquaresFour,
  Gear,
  Trophy
} from "@phosphor-icons/react"
import { signOut } from "next-auth/react"
import { clsx } from "clsx"
import Image from "next/image"

const navItems = [
  { name: "Panel", href: "/admin", icon: SquaresFour },
  { name: "Cursos", href: "/admin/courses", icon: ChalkboardTeacher },
  { name: "Inscripciones", href: "/admin/enrollments", icon: Users },
  { name: "Categorías", href: "/admin/categories", icon: Files },
  { name: "Usuarios", href: "/admin/users", icon: Users },
  { name: "Logros", href: "/admin/achievements", icon: Trophy },
]

export default function AdminSidebar({ user }: { user: any }) {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col border-r bg-white sticky top-0">
      <div className="flex h-14 items-center border-b px-6 font-bold text-lg text-gray-900 gap-2">
        <Image src="/BPAcademy.ico" alt="BP Academy" width={32} height={32} className="object-contain" />
        BP Academy
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-zinc-900 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          )
        })}
      </nav>
      <div className="border-t p-4 bg-gray-50">
        <div className="flex items-center gap-3 mb-4 px-2">
          {user?.image ? (
            <Image 
              src={user.image} 
              alt={user.name || "Admin"} 
              width={40} 
              height={40} 
              className="rounded-full object-cover w-10 h-10 border border-gray-200" 
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold border border-gray-300">
              {user?.name?.[0]?.toUpperCase() || "A"}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name || "Administrador"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <Link
            href="/admin/profile"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Gear size={20} />
            Configuración
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <SignOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  )
}
