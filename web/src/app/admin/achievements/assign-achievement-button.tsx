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
        <Button className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2">
          <Plus size={16} />
          Asignar Logro
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Asignar Logro Manualmente</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="user">Usuario</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar usuario" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Curso</Label>
            <Select value={courseId} onValueChange={setCourseId}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar curso completado" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña de Administrador</Label>
            <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="Confirmar acción"
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" disabled={loading} className="bg-zinc-900 text-white hover:bg-zinc-800">
              {loading ? "Asignando..." : "Asignar Logro"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
