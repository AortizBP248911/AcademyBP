"use client"

import { useState } from "react"
import { assignAchievement } from "@/actions/achievements"
import { Trophy, Plus } from "@phosphor-icons/react"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface Course {
  id: string
  title: string
}

interface User {
  id: string
  name: string | null
  email: string | null
}

export default function AssignAchievementButton({ users, courses }: { users: User[], courses: Course[] }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState("")
  const [courseId, setCourseId] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !courseId || !password) {
      toast.error("Todos los campos son obligatorios")
      return
    }

    setLoading(true)
    try {
      const result = await assignAchievement(userId, courseId, password)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(result.message)
        setOpen(false)
        setPassword("")
        setUserId("")
        setCourseId("")
      }
    } catch (error) {
      toast.error("Ocurrió un error inesperado")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gray-900 text-white hover:bg-teal-600 shadow-sm rounded-lg gap-2 transition-all">
          <Plus size={16} />
          Asignar Logro
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-white rounded-xl shadow-xl border-gray-100 p-0 overflow-hidden">
        <div className="p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl text-gray-900">Asignar Logro Manualmente</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="user" className="text-sm font-medium text-gray-700">Usuario</Label>
              <Select value={userId} onValueChange={setUserId}>
                <SelectTrigger className="h-11 rounded-lg border-gray-200 focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 w-full">
                  <SelectValue placeholder="Seleccionar usuario" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[100] border-gray-100 shadow-lg rounded-lg">
                  {users.map((user) => (
                    <SelectItem key={user.id} value={user.id} className="focus:bg-teal-50 focus:text-teal-700 rounded-md">
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="course" className="text-sm font-medium text-gray-700">Curso</Label>
              <Select value={courseId} onValueChange={setCourseId}>
                <SelectTrigger className="h-11 rounded-lg border-gray-200 focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 w-full">
                  <SelectValue placeholder="Seleccionar curso completado" />
                </SelectTrigger>
                <SelectContent className="bg-white z-[100] border-gray-100 shadow-lg rounded-lg">
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id} className="focus:bg-teal-50 focus:text-teal-700 rounded-md">
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Contraseña de Administrador</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Confirmar acción"
                className="h-11 rounded-lg border-gray-200 focus-visible:border-teal-500 focus-visible:ring-1 focus-visible:ring-teal-500 w-full"
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="rounded-lg hover:bg-gray-50 border-gray-200"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-gray-900 text-white hover:bg-teal-600 transition-all rounded-lg shadow-sm">
                {loading ? "Asignando..." : "Asignar Logro"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
