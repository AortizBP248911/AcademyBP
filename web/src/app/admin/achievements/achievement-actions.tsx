"use client"

import { deleteAchievement } from "@/actions/achievements"
import DeleteButtonWithConfirmation from "@/components/delete-button-with-confirmation"
import { X } from "@phosphor-icons/react"

export default function AchievementActions({ achievementId }: { achievementId: string }) {
  const handleDelete = async (password: string) => {
    return await deleteAchievement(achievementId, password)
  }

  return (
    <div className="flex justify-end">
        <DeleteButtonWithConfirmation 
            onDelete={handleDelete} 
            description="Esta acción eliminará el logro del usuario. Esto no afecta el progreso del curso."
        />
    </div>
  )
}
