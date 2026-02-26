"use client"

import { deleteCategory } from "@/actions/categories"
import DeleteButtonWithConfirmation from "@/components/delete-button-with-confirmation"

export default function CategoryActions({ categoryId }: { categoryId: string }) {
  const handleDelete = async (password: string) => {
    return await deleteCategory(categoryId, password)
  }

  return (
    <div className="flex justify-end">
        <DeleteButtonWithConfirmation 
            onDelete={handleDelete} 
            description="Esta acción eliminará la categoría. No se puede deshacer."
        />
    </div>
  )
}
