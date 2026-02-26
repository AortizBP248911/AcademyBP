import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import VideoPlayer from "@/components/video-player"
import Link from "next/link"
import { CheckCircle, Circle, File, ArrowLeft } from "@phosphor-icons/react/dist/ssr"
import { completeLesson } from "@/actions/progress"
import { getSignedDownloadUrl } from "@/lib/s3"

export default async function CoursePlayerPage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ courseId: string }>, 
  searchParams: Promise<{ lessonId?: string }> 
}) {
  const session = await auth()
  if (!session) redirect("/login")
  
  const { courseId } = await params
  const { lessonId } = await searchParams

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      lessons: {
        where: { isPublished: true },
        orderBy: { position: "asc" },
        include: {
          progress: {
            where: { userId: session.user.id }
          }
        }
      }
    }
  })

  if (!course) notFound()

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id!,
        courseId: courseId
      }
    }
  })

  if (!enrollment) {
    redirect("/dashboard/browse")
  }

  const activeLessonId = lessonId || course.lessons[0]?.id
  const activeLesson = course.lessons.find(l => l.id === activeLessonId)

  if (!activeLesson && course.lessons.length > 0) {
     redirect(`/dashboard/courses/${courseId}?lessonId=${course.lessons[0].id}`)
  }

  const attachments = activeLesson ? await prisma.attachment.findMany({
    where: { lessonId: activeLesson.id }
  }) : []

  const attachmentsWithSignedUrls = await Promise.all(
    attachments.map(async (att) => ({
      ...att,
      url: await getSignedDownloadUrl(att.url)
    }))
  )

  return (
    <div className="flex flex-col h-[calc(100vh-100px)]">
        <div className="mb-4 flex items-center gap-2">
            <Link href="/dashboard" className="text-sm text-gray-600 hover:text-black hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-black rounded">
                <ArrowLeft size={16} /> Volver al Panel
            </Link>
            <span className="text-gray-600">|</span>
            <span className="font-semibold text-gray-900">{course.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2">
            {activeLesson ? (
            <>
                {activeLesson.showImage && activeLesson.imageUrl && (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-gray-800 mb-6 relative">
                         {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img 
                            src={activeLesson.imageUrl} 
                            alt={activeLesson.title} 
                            className="w-full h-full object-contain"
                        />
                    </div>
                )}

                {activeLesson.videoUrl && (
                    <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-gray-800">
                        <VideoPlayer url={activeLesson.videoUrl} />
                    </div>
                )}
                <div className="space-y-6 pb-10">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{activeLesson.title}</h1>
                            <p className="text-sm text-gray-600 mt-1 font-medium">Lección {activeLesson.position}</p>
                        </div>
                        <form action={completeLesson.bind(null, activeLesson.id, course.id)}>
                            <button 
                                type="submit"
                                disabled={activeLesson.progress[0]?.completed}
                                className={`px-6 py-2 rounded-full font-medium transition-all focus:ring-2 focus:ring-offset-2 focus:ring-black ${
                                    activeLesson.progress[0]?.completed 
                                    ? "bg-green-100 text-green-800 border border-green-200 cursor-default" 
                                    : "bg-black text-white hover:bg-gray-800"
                                }`}
                            >
                                {activeLesson.progress[0]?.completed ? "Completada" : "Marcar como Completada"}
                            </button>
                        </form>
                    </div>
                    
                    <div className="prose prose-gray max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">{activeLesson.description}</p>
                    </div>
                    
                    {attachmentsWithSignedUrls.length > 0 && (
                        <div className="border-t pt-6 mt-6">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <File size={20} />
                                Adjuntos
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {attachmentsWithSignedUrls.map(file => (
                                <a 
                                    key={file.id} 
                                    href={file.url} 
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors group"
                                >
                                    <div className="p-2 bg-blue-50 text-blue-600 rounded-md group-hover:bg-blue-100 transition-colors">
                                        <File size={20} />
                                    </div>
                                    <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700 truncate">
                                        {file.name}
                                    </span>
                                </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </>
            ) : (
            <div className="flex items-center justify-center h-full text-gray-500 bg-gray-50 rounded-lg">
                Selecciona una lección para comenzar.
            </div>
            )}
        </div>

        <div className="lg:col-span-1 border-l pl-6 overflow-y-auto flex flex-col min-h-0">
            <h3 className="font-semibold mb-4 text-lg sticky top-0 bg-gray-50 py-2 z-10">Contenido del Curso</h3>
            <div className="space-y-2 pb-10">
            {course.lessons.map((lesson, index) => {
                const isCompleted = lesson.progress[0]?.completed
                const isActive = lesson.id === activeLessonId
                return (
                <Link
                    key={lesson.id}
                    href={`/dashboard/courses/${course.id}?lessonId=${lesson.id}`}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-all group ${
                    isActive 
                        ? "bg-white border-black border shadow-sm" 
                        : "hover:bg-white hover:shadow-sm border border-transparent"
                    }`}
                >
                    <div className="mt-0.5">
                        {isCompleted ? (
                        <CheckCircle size={20} className="text-green-600" weight="fill" />
                        ) : (
                        <Circle size={20} className={`text-gray-300 ${isActive ? "text-black" : "group-hover:text-gray-400"}`} />
                        )}
                    </div>
                    <div>
                        <span className={`text-sm font-medium block ${isActive ? "text-black" : "text-gray-600"}`}>
                            {index + 1}. {lesson.title}
                        </span>
                        <span className="text-xs text-gray-500">
                            {lesson.description ? "Video + Lectura" : "Video"}
                        </span>
                    </div>
                </Link>
                )
            })}
            </div>
        </div>
        </div>
    </div>
  )
}
