"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { uploadToS3, deleteFromS3 } from "@/lib/s3"

export async function uploadAttachment(lessonId: string, courseId: string, prevState: unknown, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" }

  const file = formData.get("file") as File
  if (!file || file.size === 0) return { error: "No file provided" }

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { slug: true }
    })

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { slug: true }
    })

    if (!course || !lesson) {
      return { error: "Course or Lesson not found" }
    }

    const folderPath = `${course.slug}/${lesson.slug}`
    const uploadedUrl = await uploadToS3(file, folderPath)
    
    if (!uploadedUrl) {
      return { error: "Upload to S3 failed" }
    }
    
    await prisma.attachment.create({
      data: {
        name: file.name,
        url: uploadedUrl,
        lessonId: lessonId
      }
    })

    revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`)
    return { success: true, message: "File uploaded successfully" }
  } catch (e) {
    console.error(e)
    return { error: "Upload failed" }
  }
}

export async function deleteAttachment(attachmentId: string, courseId: string, lessonId: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" }

  try {
    const attachment = await prisma.attachment.findUnique({
      where: { id: attachmentId },
      select: { url: true }
    })

    if (attachment && attachment.url) {
      await deleteFromS3(attachment.url)
    }

    await prisma.attachment.delete({ where: { id: attachmentId } })
    
    revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`)
    return { success: true }
  } catch (_) {
    return { error: "Failed to delete" }
  }
}
