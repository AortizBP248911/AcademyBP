"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { sendCourseAssignedEmail } from "@/lib/email"

const createEnrollmentSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
})

export async function createEnrollment(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return { error: "No autorizado" }

  const userId = formData.get("userId") as string
  const courseId = formData.get("courseId") as string
  
  const validated = createEnrollmentSchema.safeParse({ userId, courseId })
  if (!validated.success) return { error: "Datos inválidos" }

  try {
    const enrollment = await prisma.enrollment.create({
      data: {
        userId: validated.data.userId,
        courseId: validated.data.courseId,
      }
    })
    
    // Send email notification
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const course = await prisma.course.findUnique({ where: { id: courseId } })
    
    if (user && user.email && course) {
       await sendCourseAssignedEmail(user.email, user.name || "Estudiante", course.title)
    }

    revalidatePath("/admin/enrollments")
    return { success: true, message: "Inscripción creada y correo enviado" }
  } catch (e) {
    console.error(e)
    return { error: "Error al inscribir (El usuario ya podría estar inscrito)" }
  }
}

import { verifyAdminPassword } from "@/lib/auth-utils"

export async function deleteEnrollment(userId: string, courseId: string, password: string) {
    const verification = await verifyAdminPassword(password)
    if (!verification.authorized) return { error: verification.error }

    try {
        await prisma.enrollment.delete({
            where: { userId_courseId: { userId, courseId } }
        })
        revalidatePath("/admin/enrollments")
        return { success: true }
    } catch (e) {
        return { error: "Error al eliminar" }
    }
}
