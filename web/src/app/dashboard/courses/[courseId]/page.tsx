import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { notFound, redirect } from "next/navigation"
import VideoPlayer from "@/components/video-player"
import Link from "next/link"
import { CheckCircle, Circle, File, ArrowLeft, FileText, PlayCircle } from "@phosphor-icons/react/dist/ssr"
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
        <div className="flex flex-col h-[calc(100vh-100px)] bg-gray-50/30">
            <div className="mb-6 flex items-center gap-2 bg-white p-4 rounded-xl shadow-sm border border-gray-100 mx-6 mt-6">
                <Link href="/dashboard" className="text-sm text-gray-600 hover:text-teal-600 hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded transition-colors">
                    <ArrowLeft size={16} /> Volver al Panel
                </Link>
                <span className="text-gray-300">|</span>
                <span className="font-semibold text-gray-900">{course.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0 px-6">
                <div className="lg:col-span-3 space-y-6 overflow-y-auto pr-2 pb-10 custom-scrollbar">
                    {activeLesson ? (
                        <>
                            {activeLesson.showImage && activeLesson.imageUrl && (
                                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-md border border-gray-200 mb-6 relative group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={activeLesson.imageUrl}
                                        alt={activeLesson.title}
                                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                            )}

                            {activeLesson.videoUrl && (
                                <div className="aspect-video bg-black rounded-xl overflow-hidden shadow-md border border-gray-200">
                                    <VideoPlayer url={activeLesson.videoUrl} />
                                </div>
                            )}
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="bg-teal-50 text-teal-700 text-xs font-bold px-3 py-1 rounded-full border border-teal-100">
                                                Lección {activeLesson.position}
                                            </span>
                                        </div>
                                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{activeLesson.title}</h1>
                                    </div>
                                    <form action={completeLesson.bind(null, activeLesson.id, course.id)} className="shrink-0">
                                        <button
                                            type="submit"
                                            disabled={activeLesson.progress[0]?.completed}
                                            className={`px-6 py-2.5 rounded-full font-medium transition-all focus:ring-2 focus:ring-offset-2 flex items-center gap-2 shadow-sm ${activeLesson.progress[0]?.completed
                                                    ? "bg-green-50 text-green-700 border border-green-200 cursor-default focus:ring-green-500"
                                                    : "bg-gray-900 text-white hover:bg-green-600 focus:ring-green-500 border border-transparent shadow-gray-900/20"
                                                }`}
                                        >
                                            {activeLesson.progress[0]?.completed ? (
                                                <>
                                                    <CheckCircle size={20} weight="fill" className="text-green-500" />
                                                    Lección Completada
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle size={20} />
                                                    Marcar como Completada
                                                </>
                                            )}
                                        </button>
                                    </form>
                                </div>

                                <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-4">
                                        <FileText size={22} className="text-teal-600" weight="fill" />
                                        Acerca de esta lección
                                    </h2>
                                    <div className="prose prose-gray max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                                        {activeLesson.description || <span className="text-gray-400 italic">No hay descripción disponible para esta lección.</span>}
                                    </div>
                                </div>

                                {attachmentsWithSignedUrls.length > 0 && (
                                    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-sm border border-gray-100">
                                        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b pb-4">
                                            <File size={22} className="text-blue-600" weight="fill" />
                                            Materiales Adjuntos
                                        </h2>
                                        <div className="grid gap-3 sm:grid-cols-2">
                                            {attachmentsWithSignedUrls.map(file => (
                                                <a
                                                    key={file.id}
                                                    href={file.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all group"
                                                >
                                                    <div className="p-2.5 bg-gray-50 text-gray-500 rounded-md group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                                        <File size={20} weight="fill" />
                                                    </div>
                                                    <div className="flex flex-col overflow-hidden">
                                                        <span className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 truncate">
                                                            {file.name}
                                                        </span>
                                                        <span className="text-xs text-gray-500 mt-0.5">Documento adjunto</span>
                                                    </div>
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500 bg-white rounded-xl border border-gray-100 shadow-sm p-12">
                            <PlayCircle size={48} className="text-gray-300 mb-4" weight="light" />
                            <p className="text-lg font-medium text-gray-900">Selecciona una lección</p>
                            <p className="text-sm text-gray-500 mt-1">Elige una lección del temario para comenzar a aprender.</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col min-h-0 mb-6">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                        <h3 className="font-bold text-gray-900 text-lg">Contenido del Curso</h3>
                        <p className="text-xs text-gray-500 mt-1">{course.lessons.length} lecciones en total</p>
                    </div>
                    <div className="overflow-y-auto p-3 space-y-1.5 pb-20 custom-scrollbar">
                        {course.lessons.map((lesson, index) => {
                            const isCompleted = lesson.progress[0]?.completed
                            const isActive = lesson.id === activeLessonId
                            return (
                                <Link
                                    key={lesson.id}
                                    href={`/dashboard/courses/${course.id}?lessonId=${lesson.id}`}
                                    className={`flex items-start gap-3 p-3 rounded-lg transition-all group ${isActive
                                            ? "bg-teal-50 border-teal-200 border shadow-sm backdrop-blur-sm"
                                            : isCompleted
                                                ? "bg-green-50/30 hover:bg-green-50/80 border border-transparent"
                                                : "hover:bg-gray-50 border border-transparent"
                                        }`}
                                >
                                    <div className="mt-0.5 shrink-0">
                                        {isCompleted ? (
                                            <CheckCircle size={20} className={isActive ? "text-teal-600" : "text-green-500"} weight="fill" />
                                        ) : (
                                            <Circle size={20} className={`transition-colors ${isActive ? "text-teal-600" : "text-gray-300 group-hover:text-gray-400"}`} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className={`text-sm font-medium block leading-tight mb-1 ${isActive
                                                ? "text-teal-900 font-semibold"
                                                : isCompleted
                                                    ? "text-gray-700"
                                                    : "text-gray-700 group-hover:text-gray-900"
                                            }`}>
                                            {index + 1}. {lesson.title}
                                        </span>
                                        <span className={`text-xs flex items-center gap-1 ${isActive ? "text-teal-600/80" : "text-gray-400"}`}>
                                            {lesson.videoUrl && <PlayCircle size={12} weight={isActive ? "fill" : "regular"} />}
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
