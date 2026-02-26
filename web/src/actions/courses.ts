"use server"

import { auth } from "@/auth"
import { verifyAdminPassword } from "@/lib/auth-utils"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { slugify } from "@/lib/utils"
import { uploadFile } from "@/lib/upload"

const createCourseSchema = z.object({
  title: z.string().min(2),
})

export async function createCourse(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "No autorizado" }
  }

  const title = formData.get("title") as string
  const validated = createCourseSchema.safeParse({ title })
  
  if (!validated.success) {
    return { error: "Título inválido" }
  }

  let courseId;
  try {
    let slug = slugify(validated.data.title)
    
    // Check if slug exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug }
    })

    if (existingCourse) {
      // Append a random string or timestamp to make it unique
      slug = `${slug}-${Math.floor(Math.random() * 10000)}`
    }

    const course = await prisma.course.create({
      data: {
        title: validated.data.title,
        slug,
      },
    })
    courseId = course.id
  } catch (e: any) {
    console.error("Course creation error:", e)
    if (e.code === 'P2002') {
        return { error: "Ya existe un curso con este título." }
    }
    return { error: `Error al crear el curso: ${e.message || "Error desconocido"}` }
  }

  redirect(`/admin/courses/${courseId}`)
}

export async function updateCourse(courseId: string, prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") {
    return { error: "No autorizado" }
  }
  
  const categoryIdRaw = formData.get("categoryId") as string
  const categoryId = categoryIdRaw && categoryIdRaw.trim() !== "" ? categoryIdRaw : undefined

  // Handle file upload
  const imageFile = formData.get("image") as File
  let imageUrl = undefined

  if (imageFile && imageFile.size > 0) {
    const uploadedPath = await uploadFile(imageFile, "courses")
    if (uploadedPath) {
      imageUrl = uploadedPath
    }
  }

  const data: any = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    categoryId,
    isPublished: formData.get("isPublished") === "on",
  }

  if (imageUrl) {
    data.imageUrl = imageUrl
  }

  try {
    await prisma.course.update({
      where: { id: courseId },
      data
    })
    
    revalidatePath("/admin/courses")
    revalidatePath(`/admin/courses/${courseId}`)
    return { success: true, message: "Curso actualizado" }
  } catch (e) {
    console.error(e)
    return { error: "Error al actualizar curso" }
  }
}

export async function deleteCourse(courseId: string, password: string) {
  const verification = await verifyAdminPassword(password)
  if (!verification.authorized) return { error: verification.error }

  try {
    await prisma.course.delete({
      where: { id: courseId }
    })
    
    revalidatePath("/admin/courses")
    return { success: true, message: "Curso eliminado" }
  } catch (e) {
    console.error("Error deleting course:", e)
    return { error: "Error al eliminar curso" }
  }
}
