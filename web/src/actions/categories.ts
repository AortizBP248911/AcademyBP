"use server"

import { prisma } from "@/lib/prisma"
import { verifyAdminPassword } from "@/lib/auth-utils"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { slugify } from "@/lib/utils"

const createCategorySchema = z.object({
  name: z.string().min(2),
})

export async function createCategory(prevState: any, formData: FormData) {
  const name = formData.get("name") as string
  
  const validated = createCategorySchema.safeParse({ name })
  
  if (!validated.success) {
    return { error: "Datos inválidos" }
  }

  try {
    const slug = slugify(validated.data.name)
    await prisma.category.create({
      data: {
        name: validated.data.name,
        slug,
      },
    })

    revalidatePath("/admin/categories")
    return { success: true, message: "Categoría creada!" }
  } catch (e) {
    console.error(e)
    return { error: "Error al crear la categoría. El nombre podría estar duplicado." }
  }
}

export async function deleteCategory(categoryId: string, password: string) {
  const verification = await verifyAdminPassword(password)
  if (!verification.authorized) return { error: verification.error }

  try {
    await prisma.category.delete({
      where: { id: categoryId }
    })
    
    revalidatePath("/admin/categories")
    return { success: true, message: "Categoría eliminada" }
  } catch (e) {
    return { error: "Error al eliminar categoría (puede tener cursos asociados)" }
  }
}
