"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { hash } from "bcryptjs"
import { sendWelcomeEmail } from "@/lib/email"
import { uploadFile } from "@/lib/upload"

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "STUDENT"]),
})

export async function createUser(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return { error: "No autorizado" }

  const validated = createUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  })
  
  if (!validated.success) return { error: "Campos inválidos" }

  const { name, email, password, role } = validated.data
  const hashedPassword = await hash(password, 12)

  // Handle image upload
  const imageFile = formData.get("image") as File
  let imageUrl = null
  
  if (imageFile && imageFile.size > 0) {
    imageUrl = await uploadFile(imageFile, "users")
  }

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        image: imageUrl
      }
    })
    
    // Send welcome email
    await sendWelcomeEmail(email, name, password)

    revalidatePath("/admin/users")
    return { success: true, message: "Usuario creado exitosamente" }
  } catch (e) {
    return { error: "El usuario ya existe o error al crear" }
  }
}

const updateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["ADMIN", "STUDENT"]),
  password: z.string().optional(),
})

export async function updateUser(userId: string, prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || session.user.role !== "ADMIN") return { error: "No autorizado" }

  const validated = updateUserSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    role: formData.get("role"),
    password: formData.get("password") || undefined,
  })

  if (!validated.success) return { error: "Campos inválidos" }

  const { name, email, role, password } = validated.data
  
  // Handle image upload
  const imageFile = formData.get("image") as File
  let imageUrl = undefined
  
  if (imageFile && imageFile.size > 0) {
    const uploadedPath = await uploadFile(imageFile, "users")
    if (uploadedPath) {
      imageUrl = uploadedPath
    }
  }

  const updateData: any = {
    name,
    email,
    role,
  }

  if (password && password.length >= 6) {
    updateData.password = await hash(password, 12)
  }

  if (imageUrl) {
    updateData.image = imageUrl
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: updateData
    })
    
    revalidatePath("/admin/users")
    revalidatePath(`/admin/users/${userId}`)
    return { success: true, message: "Usuario actualizado exitosamente" }
  } catch (e) {
    return { error: "Error al actualizar usuario" }
  }
}

import { verifyAdminPassword } from "@/lib/auth-utils"

export async function deleteUser(userId: string, password: string) {
  const verification = await verifyAdminPassword(password)
  if (!verification.authorized) return { error: verification.error }

  try {
    await prisma.user.delete({
      where: { id: userId }
    })
    
    revalidatePath("/admin/users")
    return { success: true, message: "Usuario eliminado exitosamente" }
  } catch (e) {
    return { error: "Error al eliminar usuario" }
  }
}

const updateProfileSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().optional(),
})

export async function updateProfile(prevState: any, formData: FormData) {
  const session = await auth()
  if (!session || !session.user?.id) return { error: "No autorizado" }

  const userId = session.user.id

  const validated = updateProfileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password") || undefined,
  })

  if (!validated.success) return { error: "Campos inválidos" }

  const { name, email, password } = validated.data
  
  // Handle image upload
  const imageFile = formData.get("image") as File
  let imageUrl = undefined
  
  if (imageFile && imageFile.size > 0) {
    const uploadedPath = await uploadFile(imageFile, "users")
    if (uploadedPath) {
      imageUrl = uploadedPath
    }
  }

  const updateData: any = {
    name,
    email,
  }

  if (password && password.length >= 6) {
    updateData.password = await hash(password, 12)
  }

  if (imageUrl) {
    updateData.image = imageUrl
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: updateData
    })
    
    revalidatePath("/dashboard")
    revalidatePath("/admin")
    return { success: true, message: "Perfil actualizado exitosamente" }
  } catch (e) {
    return { error: "Error al actualizar perfil" }
  }
}
