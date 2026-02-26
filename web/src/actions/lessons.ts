"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { slugify } from "@/lib/utils"

const createLessonSchema = z.object({
  title: z.string().min(2),
  courseId: z.string(),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
})

const updateLessonSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  videoUrl: z.string().optional(),
  isPublished: z.coerce.boolean().optional(),
})

export async function createLesson(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return { error: "No autorizado" }

  const title = formData.get("title") as string
  const courseId = formData.get("courseId") as string
  const description = formData.get("description") as string
  const videoUrl = formData.get("videoUrl") as string

  const validated = createLessonSchema.safeParse({ title, courseId, description, videoUrl })
  if (!validated.success) return { error: "Datos inválidos" }

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
  }

  const validated = updateLessonSchema.safeParse(data)
  if (!validated.success) return { error: "Datos inválidos" }

  try {
    const updateData: any = { ...validated.data }
    if (validated.data.title) {
        updateData.slug = slugify(validated.data.title)
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
