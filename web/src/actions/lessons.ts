"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { slugify } from "@/lib/utils"
import { hash, compare } from "bcryptjs"
import { uploadFile } from "@/lib/upload"

const createLessonSchema = z.object({
  title: z.string().min(2),
  courseId: z.string(),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  showImage: z.coerce.boolean().optional(),
})

const updateLessonSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  isPublished: z.coerce.boolean().optional(),
  showImage: z.coerce.boolean().optional(),
})

export async function createLesson(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return { error: "No autorizado" }

  const title = formData.get("title") as string
  const courseId = formData.get("courseId") as string
  const description = formData.get("description") as string
  const videoUrl = formData.get("videoUrl") as string
  const showImage = formData.get("showImage") === "on"

  const validated = createLessonSchema.safeParse({ title, courseId, description, videoUrl, showImage })
  if (!validated.success) return { error: "Datos inválidos" }

  // Handle file upload
  const imageFile = formData.get("image") as File
  let imageUrl = undefined

  if (imageFile && imageFile.size > 0) {
    const uploadedPath = await uploadFile(imageFile, "lessons")
    if (uploadedPath) {
      imageUrl = uploadedPath
    }
  }

  const lastLesson = await prisma.lesson.findFirst({
    where: { courseId },
    orderBy: { position: "desc" },
  })

  const newPosition = lastLesson ? lastLesson.position + 1 : 1

  let lessonId;
  try {
    const slug = slugify(validated.data.title)
    const lesson = await prisma.lesson.create({
      data: {
        title: validated.data.title,
        slug,
        courseId: validated.data.courseId,
        description: validated.data.description,
        videoUrl: validated.data.videoUrl,
        position: newPosition,
        imageUrl,
        showImage: validated.data.showImage || false,
      },
    })
    lessonId = lesson.id
  } catch (e: any) {
    console.error("Lesson creation error:", e)
    return { error: `Error al crear la lección: ${e.message}` }
  }

  redirect(`/admin/courses/${courseId}/lessons/${lessonId}`)
}

export async function updateLesson(lessonId: string, prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return { error: "No autorizado" }

  const data = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    videoUrl: formData.get("videoUrl") as string,
    isPublished: formData.get("isPublished") === "on",
    showImage: formData.get("showImage") === "on",
  }

  const validated = updateLessonSchema.safeParse(data)
  if (!validated.success) return { error: "Datos inválidos" }

  // Handle file upload
  const imageFile = formData.get("image") as File
  let imageUrl = undefined

  if (imageFile && imageFile.size > 0) {
    const uploadedPath = await uploadFile(imageFile, "lessons")
    if (uploadedPath) {
      imageUrl = uploadedPath
    }
  }

  try {
    const updateData: any = { ...validated.data }
    if (validated.data.title) {
        updateData.slug = slugify(validated.data.title)
    }

    if (imageUrl) {
        updateData.imageUrl = imageUrl
    }

    await prisma.lesson.update({
      where: { id: lessonId },
      data: updateData,
    })
    
    // We need to revalidate the lesson page and the course page
    // Getting courseId would require a query or passing it. 
    // Revalidating the specific path is safer.
    revalidatePath(`/admin/courses/[courseId]/lessons/${lessonId}`) 
    return { success: true, message: "Lección actualizada" }
  } catch (e) {
    return { error: "Error al actualizar la lección" }
  }
}

export async function deleteLesson(lessonId: string, password: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN" || !session.user.email) return { error: "No autorizado" }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user || !user.password) return { error: "Usuario no encontrado" }

  const isValid = await compare(password, user.password)
  if (!isValid) return { error: "Contraseña incorrecta" }

  try {
    const lesson = await prisma.lesson.delete({
      where: { id: lessonId }
    })
    
    revalidatePath(`/admin/courses/${lesson.courseId}`)
    return { success: true }
  } catch (e) {
    return { error: "Error al eliminar la lección" }
  }
}

export async function reorderLessons(items: { id: string; position: number }[]) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return { error: "No autorizado" }

  try {
    const transaction = items.map((item) => 
      prisma.lesson.update({
        where: { id: item.id },
        data: { position: item.position }
      })
    )

    await prisma.$transaction(transaction)
    
    // We don't know the courseId here easily without querying, 
    // but we can assume the client will handle the UI update or we can query one lesson.
    // Ideally, we should receive courseId or query it.
    // For now, let's rely on client-side optimistic update or general revalidation if needed.
    
    // Attempt to revalidate the course page if we can get the courseId from one item
    if (items.length > 0) {
       const firstLesson = await prisma.lesson.findUnique({ where: { id: items[0].id }, select: { courseId: true } })
       if (firstLesson) {
         revalidatePath(`/admin/courses/${firstLesson.courseId}`)
       }
    }
    
    return { success: true }
  } catch (e) {
    console.error("Reorder error:", e)
    return { error: "Error al reordenar" }
  }
}
