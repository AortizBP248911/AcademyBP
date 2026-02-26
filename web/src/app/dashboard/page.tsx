import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) return null

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    include: {
      course: {
        include: {
          _count: { select: { lessons: true } },
          category: true
        }
      }
    }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Mi Aprendizaje</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {enrollments.map((enrollment) => (
          <Link 
            key={enrollment.courseId} 
            href={`/dashboard/courses/${enrollment.courseId}`}
            className="group block space-y-4 rounded-lg border bg-white p-6 shadow-sm hover:border-black transition-all overflow-hidden"
          >
            {enrollment.course.imageUrl && (
              <div className="relative aspect-video w-full rounded-md overflow-hidden border border-gray-100 mb-2">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                 <img src={enrollment.course.imageUrl} alt={enrollment.course.title} className="object-cover w-full h-full" />
              </div>
            )}
            <div className="flex justify-between items-start">
               <h3 className="font-semibold leading-tight group-hover:underline decoration-2 underline-offset-4 line-clamp-2 min-h-[2.5rem] text-gray-900">
                 {enrollment.course.title}
               </h3>
               <span className="text-[10px] uppercase font-bold tracking-wider bg-gray-100 px-2 py-1 rounded text-gray-800 shrink-0 ml-2 border border-gray-200">
                 {enrollment.course.category?.name || 'General'}
               </span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-700 font-medium">
                <span>{enrollment.progress}% Completado</span>
                <span>{enrollment.course._count.lessons} Lecciones</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200 overflow-hidden border border-gray-100">
                <div 
                  className="h-full rounded-full bg-black transition-all duration-500 ease-out" 
                  style={{ width: `${enrollment.progress}%` }} 
                />
              </div>
            </div>
            
            <div className="pt-2">
                <button className="w-full text-center text-sm font-medium bg-black text-white py-2 rounded-md hover:bg-gray-800 focus:ring-2 focus:ring-offset-2 focus:ring-black transition-all">
                    Continuar Aprendiendo
                </button>
            </div>
          </Link>
        ))}
        {enrollments.length === 0 && (
          <div className="col-span-full rounded-lg border border-dashed p-12 text-center">
            <h3 className="text-lg font-medium">Aún no hay cursos</h3>
            <p className="text-gray-600 mt-2 mb-4">No estás inscrito en ningún curso.</p>
            <Link href="/dashboard/browse" className="text-black underline font-medium hover:text-gray-700">
              Explorar cursos disponibles
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
