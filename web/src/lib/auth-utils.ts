import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { compare } from "bcryptjs"

export async function verifyAdminPassword(password: string) {
  const session = await auth()
  if (!session || !session.user?.email || session.user.role !== "ADMIN") {
    return { authorized: false, error: "No autorizado" }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user || !user.password) {
    return { authorized: false, error: "Usuario no encontrado" }
  }

  const isValid = await compare(password, user.password)
  if (!isValid) {
    return { authorized: false, error: "Contraseña incorrecta" }
  }

  return { authorized: true }
}
