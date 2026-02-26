import { prisma } from "@/lib/prisma"
import { Trophy, Medal, Calendar } from "@phosphor-icons/react/dist/ssr"
import AchievementActions from "./achievement-actions"
import AssignAchievementButton from "./assign-achievement-button"

export default async function AchievementsPage() {
  const users = await prisma.user.findMany({
    include: {
      achievements: {
        include: {
          course: true
        },
        orderBy: {
          awardedAt: 'desc'
        }
      },
      _count: {
        select: { achievements: true }
      }
    },
    orderBy: {
      achievements: {
        _count: 'desc'
      }
    }
  })

  // Filter users who have achievements for the main view, but keep all for the assignment dropdown
  const usersWithAchievements = users.filter(user => user.achievements.length > 0)

  const courses = await prisma.course.findMany({
    select: {
      id: true,
      title: true
    },
    orderBy: {
      title: 'asc'
    }
  })

  return (
    <div className="space-y-6 bg-gray-50/30 min-h-full p-6 -m-6 rounded-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
          <Trophy size={28} className="text-yellow-500" weight="fill" />
          Logros de Usuarios
        </h1>
        <AssignAchievementButton users={users} courses={courses} />
      </div>

      <div className="grid gap-6">
        {usersWithAchievements.map((user) => (
          <div key={user.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.image} alt={user.name || ""} className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 border border-gray-200 flex items-center justify-center text-gray-600 text-sm font-semibold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <div className="text-gray-900 font-bold text-lg">{user.name}</div>
                  <div className="text-gray-500 text-sm">{user.email}</div>
                </div>
              </div>
              <span className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                <Trophy size={16} weight="fill" className="mr-1.5" />
                {user._count.achievements} Logros
              </span>
            </div>

            <div className="p-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {user.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex flex-col p-3 rounded-md border border-gray-200 bg-gray-50/50 hover:bg-white hover:shadow-sm transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-yellow-100 rounded-full text-yellow-600">
                          <Medal size={20} weight="fill" />
                        </div>
                        <span className="font-semibold text-sm line-clamp-1" title={achievement.title}>
                          {achievement.course?.title || achievement.title}
                        </span>
                      </div>
                      <AchievementActions achievementId={achievement.id} />
                    </div>
                    <div className="mt-auto pt-2 border-t border-gray-100 flex items-center text-xs text-gray-500 gap-1.5">
                      <Calendar size={14} />
                      {new Date(achievement.awardedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {usersWithAchievements.length === 0 && (
          <div className="rounded-xl border border-dashed border-gray-200 bg-white p-12 text-center text-gray-500 shadow-sm">
            <div className="flex flex-col items-center justify-center gap-2">
              <Trophy size={32} className="text-gray-300" weight="light" />
              <p className="font-medium text-gray-700">No hay logros registrados aún.</p>
              <p className="text-xs text-gray-500">Usa el botón "Asignar Logro" para otorgar insignias manualmente.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
