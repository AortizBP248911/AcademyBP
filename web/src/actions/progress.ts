"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function completeLesson(lessonId: string, courseId: string, formData?: FormData) {
  const session = await auth()
  if (!session) return

  const userId = session.user.id!

  try {
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId }
      },
      update: { completed: true },
      create: {
        userId,
        lessonId,
        completed: true
      }
    })

    const totalLessons = await prisma.lesson.count({ where: { courseId, isPublished: true } })
    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId,
        lesson: { courseId },
        completed: true
      }
    })

    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    const enrollment = await prisma.enrollment.upsert({
      where: {
        userId_courseId: { userId, courseId }
      },
      update: { 
        progress,
        completedAt: progress === 100 ? new Date() : undefined 
      },
      create: {
        userId,
        courseId,
        progress,
        completedAt: progress === 100 ? new Date() : undefined
      }
    })

    if (progress === 100) {
      const course = await prisma.course.findUnique({
        where: { id: courseId },
        select: { title: true }
      })

      if (course) {
        await prisma.userAchievement.upsert({
          where: {
            userId_courseId: { userId, courseId }
          },
          create: {
            userId,
            courseId,
            title: `Curso Completado: ${course.title}`,
            description: `Has completado exitosamente el curso ${course.title}`,
            awardedAt: new Date()
          },
          update: {}
        })
      }
    }

    revalidatePath(`/dashboard/courses/${courseId}`)
  } catch (e) {
    console.error(e)
  }
}
