import { prisma } from "@/lib/prisma"
import CreateCategoryForm from "./create-category-form"
import CategoryActions from "./category-actions"
import { Tag, BookOpen, Gear } from "@phosphor-icons/react/dist/ssr"

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-black">Gestión de Categorías</h1>
      </div>
      
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
            <div className="relative w-full overflow-auto">
              <table className="w-full caption-bottom text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="h-12 px-4 text-left align-middle font-medium text-black">
                        <div className="flex items-center gap-2">
                            <Tag size={16} />
                            <span>Nombre</span>
                        </div>
                    </th>
                    <th className="h-12 px-4 text-left align-middle font-medium text-black">
                        <div className="flex items-center gap-2">
                            <BookOpen size={16} />
                            <span>Cursos</span>
                        </div>
                    </th>
                    <th className="h-12 px-4 text-right align-middle font-medium text-black">
                        <div className="flex items-center justify-end gap-2">
                            <Gear size={16} />
                            <span>Acciones</span>
                        </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {categories.map((category) => (
                    <tr key={category.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="p-4 align-middle font-medium text-black">{category.name}</td>
                      <td className="p-4 align-middle">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          {category._count.courses}
                        </span>
                      </td>
                      <td className="p-4 align-middle text-right">
                        <CategoryActions categoryId={category.id} />
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-600">
                        No se encontraron categorías. Crea una para comenzar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <CreateCategoryForm />
        </div>
      </div>
    </div>
  )
}
