"use client"

import { deleteUser } from "@/actions/users"
import { PencilSimple } from "@phosphor-icons/react"
import Link from "next/link"
import DeleteButtonWithConfirmation from "@/components/delete-button-with-confirmation"

export function UserActions({ userId }: { userId: string }) {
  const handleDelete = async (password: string) => {
    return await deleteUser(userId, password)
  }

  return (
    <div className="flex items-center gap-2 justify-end">
      <Link 
        href={`/admin/users/${userId}`}
        className="p-2 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100"
        title="Editar usuario"
      >
        <PencilSimple size={20} />
      </Link>
      
      <DeleteButtonWithConfirmation 
        onDelete={handleDelete}
        description="Esta acción eliminará al usuario y todos sus datos asociados."
      />
    </div>
  )
}
