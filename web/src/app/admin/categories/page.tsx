import { prisma } from "@/lib/prisma"
import CreateCategoryForm from "./create-category-form"
import { Tag } from "@phosphor-icons/react/dist/ssr"
import CategoryList from "./category-list"

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { courses: true }
      }
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-black text-white rounded-lg">
            <Tag size={24} weight="fill" />
        </div>
        <div>
            <h1 className="text-2xl font-bold tracking-tight text-black">Gestión de Categorías</h1>
            <p className="text-sm text-gray-600">Organiza los cursos en diferentes categorías.</p>
        </div>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <CategoryList initialCategories={categories as any} />
        </div>
        
        <div className="lg:col-span-1">
          <CreateCategoryForm />
        </div>
      </div>
    </div>
  )
}
