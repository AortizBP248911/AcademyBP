"use client"

import { deleteEnrollment } from "@/actions/enrollments"
import DeleteButtonWithConfirmation from "@/components/delete-button-with-confirmation"

export default function EnrollmentActions({ userId, courseId }: { userId: string, courseId: string }) {
  const handleDelete = async (password: string) => {
    return await deleteEnrollment(userId, courseId, password)
  }

  return (
    <div className="flex justify-end">
        <DeleteButtonWithConfirmation 
            onDelete={handleDelete} 
            description="Esta acción eliminará la inscripción del usuario al curso."
        />
    </div>
  )
}
