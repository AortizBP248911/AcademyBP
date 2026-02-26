"use client"

import { deleteCourse } from "@/actions/courses"
import { PencilSimple } from "@phosphor-icons/react"
import Link from "next/link"
import DeleteButtonWithConfirmation from "@/components/delete-button-with-confirmation"
import { useState } from "react"

export function CourseActions({ courseId }: { courseId: string }) {
  const handleDelete = async (password: string) => {
    return await deleteCourse(courseId, password)
  }

  return (
    <div className="flex items-center gap-1 justify-end" onClick={(e) => e.preventDefault()}>
      <Link 
        href={`/admin/courses/${courseId}`}
        className="p-2 text-gray-500 hover:text-black transition-colors rounded-full hover:bg-gray-100"
        title="Editar curso"
      >
        <PencilSimple size={20} />
      </Link>
      
      <DeleteButtonWithConfirmation 
        onDelete={handleDelete}
        description="Esta acción eliminará el curso y todas sus lecciones asociadas."
      />
    </div>
  )
}
