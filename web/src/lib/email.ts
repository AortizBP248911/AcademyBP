import nodemailer from "nodemailer"
import fs from "fs/promises"
import path from "path"

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: Number(process.env.EMAIL_SERVER_PORT),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

async function getTemplate(templateName: string) {
  try {
    const templatePath = path.join(process.cwd(), 'src/lib/templates', `${templateName}.html`)
    return await fs.readFile(templatePath, 'utf8')
  } catch (error) {
    console.error(`Error loading template ${templateName}:`, error)
    return null
  }
}

export async function sendWelcomeEmail(email: string, name: string, password?: string) {
  let html = await getTemplate('welcome')
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const logoUrl = `${baseUrl}/BP_Academy.png`

  if (html) {
    html = html
      .replace(/{{ page.name }}/g, () => name)
      .replace(/{{ page.email }}/g, () => email)
      .replace(/{{ page.password }}/g, () => password || "La que definiste o contacta al administrador")
      .replace(/{{ page.loginUrl }}/g, () => `${baseUrl}/login`)
      .replace(/{{ page.logoUrl }}/g, () => logoUrl)
  } else {
    html = `<p>¡Bienvenido ${name}!</p>`
  }

  try {
    await transporter.sendMail({
      from: '"BP Academy" <notificadorbp2@gmail.com>',
      to: email,
      subject: "Bienvenido a BP Academy - Tus credenciales",
      html,
    })
    console.log(`Welcome email sent to ${email}`)
  } catch (error) {
    console.error("Error sending email:", error)
  }
}

export async function sendCourseAssignedEmail(email: string, name: string, courseTitle: string) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const logoUrl = `${baseUrl}/BP_Academy.png`
  let html = await getTemplate('course-assigned')

  if (html) {
     html = html
        .replace(/{{ page.name }}/g, () => name)
        .replace(/{{ page.courseTitle }}/g, () => courseTitle)
        .replace(/{{ page.courseUrl }}/g, () => `${baseUrl}/dashboard`)
        .replace(/{{ page.logoUrl }}/g, () => logoUrl)
  } else {
     // Fallback
     html = `<p>Te has inscrito en ${courseTitle}</p>`
  }
  
  try {
    await transporter.sendMail({
      from: '"BP Academy" <notificadorbp2@gmail.com>',
      to: email,
      subject: `Nuevo Curso Asignado: ${courseTitle}`,
      html,
    })
    console.log(`Course assigned email sent to ${email}`)
  } catch (error) {
    console.error("Error sending email:", error)
  }
}
