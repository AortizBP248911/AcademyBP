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
    <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="bg-gray-50/80 border-b border-gray-100">
            <tr>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-gray-700">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-gray-500" />
                    <span>Nombre</span>
                  </div>
                  <div className="relative">
                    <MagnifyingGlass className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input
                      type="text"
                      placeholder="Filtrar..."
                      className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-xs focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all bg-white"
                      value={filterName}
                      onChange={(e) => setFilterName(e.target.value)}
                    />
                  </div>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-left align-middle font-medium text-gray-700">
                <div className="flex items-center gap-2 h-full pt-7">
                  <BookOpen size={16} className="text-gray-500" />
                  <span>Cursos</span>
                </div>
              </th>
              <th className="h-auto px-4 py-3 text-right align-middle font-medium text-gray-700">
                <div className="flex items-center justify-end gap-2 h-full pt-7">
                  <Gear size={16} className="text-gray-500" />
                  <span>Acciones</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCategories.map((category) => (
              <tr key={category.id} className="transition-colors hover:bg-gray-50/80 group">
                <td className="p-4 align-middle font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">{category.name}</td>
                <td className="p-4 align-middle">
                  <span className="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200 shadow-sm">
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
                <td colSpan={3} className="p-12 text-center text-gray-500 bg-gray-50/30">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <Funnel size={36} className="text-gray-300" weight="light" />
                    <p className="font-medium text-gray-700">No se encontraron categorías</p>
                    <p className="text-sm">Agrega una categoría nueva o cambia el filtro.</p>
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
