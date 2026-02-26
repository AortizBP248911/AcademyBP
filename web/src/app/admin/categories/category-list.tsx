"use client"

import { useState } from "react"
import { Tag, BookOpen, Gear, MagnifyingGlass, Funnel } from "@phosphor-icons/react"
import CategoryActions from "./category-actions"
import { Category } from "@/generated/client"

type CategoryWithCount = Category & {
  _count: {
    courses: number
  }
}

interface CategoryListProps {
  initialCategories: CategoryWithCount[]
}

export default function CategoryList({ initialCategories }: CategoryListProps) {
  const [filterName, setFilterName] = useState("")

  const filteredCategories = initialCategories.filter((category) => 
    category.name.toLowerCase().includes(filterName.toLowerCase())
  )

  return (
    <div className="rounded-lg border bg-white shadow-sm overflow-hidden">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-black">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Tag size={16} />
                    <span>Nombre</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Filtrar..." 
                      className="w-full h-8 pl-8 pr-2 rounded-md border border-gray-200 text-xs focus:outline-none focus:border-black transition-colors"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-black">
                <div className="flex items-center gap-2 h-full pt-6">
                    <BookOpen size={16} />
                    <span>Cursos</span>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-right align-middle font-medium text-black">
                <div className="flex items-center justify-end gap-2 h-full pt-6">
                    <Gear size={16} />
                    <span>Acciones</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredCategories.map((category) => (
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
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan={3} className="p-8 text-center text-gray-600">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Funnel size={32} className="text-gray-300" />
                    <p>No se encontraron categorías que coincidan con el filtro.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
