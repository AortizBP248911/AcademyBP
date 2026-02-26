import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { Trophy, Medal, CalendarCheck } from "@phosphor-icons/react/dist/ssr"
import { redirect } from "next/navigation"

export default async function UserAchievementsPage() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const achievements = await prisma.userAchievement.findMany({
    where: {
      userId: session.user.id
    },
    include: {
      course: true
    },
    orderBy: {
      awardedAt: 'desc'
    }
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <Trophy size={28} className="text-yellow-500" weight="fill" />
          Mis Logros
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex flex-col items-center text-center space-y-4 hover:shadow-md hover:border-teal-200 transition-all group">
            <div className="p-4 bg-yellow-50 rounded-full group-hover:bg-yellow-100 transition-colors">
              <Medal size={48} className="text-yellow-600" weight="fill" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-gray-900">{achievement.title}</h3>
              <p className="text-sm text-gray-600">{achievement.description}</p>
            </div>

            <div className="pt-4 border-t w-full flex items-center justify-center gap-2 text-xs text-gray-500">
              <CalendarCheck size={16} />
              <span>Conseguido el {new Date(achievement.awardedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}

        {achievements.length === 0 && (
          <div className="col-span-full rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
            <div className="flex flex-col items-center justify-center gap-4">
              <Trophy size={48} className="text-gray-300" weight="light" />
              <div>
                <h3 className="text-lg font-medium text-gray-900">Aún no tienes logros</h3>
                <p className="text-gray-500 mt-1">Completa tus cursos al 100% para ganar insignias y reconocimientos.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
