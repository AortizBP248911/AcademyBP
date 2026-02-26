import { PrismaClient } from '../src/generated/client'
import { hash } from "bcryptjs"

const prisma = new PrismaClient()

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

async function main() {
  const password = await hash("admin123", 12)
  const admin = await prisma.user.upsert({
    where: { email: "admin@videoadmin.com" },
    update: {},
    create: {
      email: "admin@videoadmin.com",
      name: "Admin User",
      password,
      role: "ADMIN",
    },
  })
  
  const categoryName = "Web Development"
  const categorySlug = slugify(categoryName)
  
  let category = await prisma.category.findUnique({ where: { slug: categorySlug } })
  if (!category) {
    category = await prisma.category.create({
      data: { 
        name: categoryName,
        slug: categorySlug
      }
    })
  }

  const courseTitle = "Next.js 15 Crash Course"
  const courseSlug = slugify(courseTitle)

  let course = await prisma.course.findUnique({ where: { slug: courseSlug } })
  if (!course) {
    course = await prisma.course.create({
        data: {
            title: courseTitle,
            description: "Learn Next.js 15 from scratch with this comprehensive guide.",
            slug: courseSlug,
            categoryId: category.id,
            isPublished: true,
            lessons: {
                create: [
                    {
                        title: "Introduction to Next.js",
                        slug: slugify("Introduction to Next.js"),
                        description: "What is Next.js and why use it?",
                        position: 1,
                        isPublished: true,
                        videoUrl: "https://www.youtube.com/watch?v=843nec-IvW0"
                    },
                    {
                        title: "Server Components",
                        slug: slugify("Server Components"),
                        description: "Understanding React Server Components",
                        position: 2,
                        isPublished: true,
                        videoUrl: "https://www.youtube.com/watch?v=843nec-IvW0"
                    }
                ]
            }
        }
    })
  }

  console.log({ admin, course })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
