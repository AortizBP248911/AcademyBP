"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { verifyAdminPassword } from "@/lib/auth-utils"

export async function deleteAchievement(achievementId: string, password: string) {
  const verification = await verifyAdminPassword(password)
  if (!verification.authorized) return { error: verification.error }

  try {
    await prisma.userAchievement.delete({
      where: { id: achievementId }
    })
    
    revalidatePath("/admin/achievements")
    return { success: true, message: "Logro eliminado correctamente" }
  } catch (e) {
    return { error: "Error al eliminar logro" }
  }
}

export async function assignAchievement(userId: string, courseId: string, password: string) {
  const verification = await verifyAdminPassword(password)
  if (!verification.authorized) return { error: verification.error }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    })

    if (!course) return { error: "Curso no encontrado" }

    await prisma.userAchievement.create({
      data: {
        userId,
        courseId,
        title: `Curso Completado: ${course.title}`,
        description: `Has completado exitosamente el curso ${course.title}`,
        awardedAt: new Date()
      }
    })

    revalidatePath("/admin/achievements")
    return { success: true, message: "Logro asignado correctamente" }
  } catch (e: any) {
    if (e.code === 'P2002') {
        return { error: "El usuario ya tiene este logro" }
    }
    return { error: "Error al asignar logro" }
  }
}
