"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { uploadFile } from "@/lib/upload"

export async function uploadAttachment(lessonId: string, courseId: string, prevState: unknown, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" }

  const file = formData.get("file") as File
  if (!file || file.size === 0) return { error: "No file provided" }

  try {
    const uploadedUrl = await uploadFile(file, "attachments")
    
    if (!uploadedUrl) {
      return { error: "Upload to Cloudinary failed" }
    }
    
    await prisma.attachment.create({
      data: {
        name: file.name,
        url: uploadedUrl,
        lessonId: lessonId
      }
    })

    revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`)
    return { success: true, message: "File uploaded" }
  } catch (e) {
    console.error(e)
    return { error: "Upload failed" }
  }
}

export async function deleteAttachment(attachmentId: string, courseId: string, lessonId: string) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return { error: "Unauthorized" }

  try {
    await prisma.attachment.delete({ where: { id: attachmentId } })
    
    revalidatePath(`/admin/courses/${courseId}/lessons/${lessonId}`)
    return { success: true }
  } catch (_) {
    return { error: "Failed to delete" }
  }
}
