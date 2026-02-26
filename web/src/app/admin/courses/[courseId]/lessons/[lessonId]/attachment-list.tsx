"use client"

import { uploadAttachment, deleteAttachment } from "@/actions/attachments"
import { Attachment } from "@prisma/client"
import { useFormStatus } from "react-dom"
import { useActionState } from "react"
import { CircleNotch, UploadSimple, File, Trash } from "@phosphor-icons/react"

const initialState = {
  message: "",
  error: "",
  success: false
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-black text-white hover:bg-black/90 h-10 px-4 py-2"
    >
      {pending ? <CircleNotch className="mr-2 h-4 w-4 animate-spin" /> : <UploadSimple className="mr-2 h-4 w-4" />}
      {pending ? "Subiendo..." : "Subir"}
    </button>
  )
}

interface AttachmentListProps {
  lessonId: string
  courseId: string
  attachments: Attachment[]
}

export default function AttachmentList({ lessonId, courseId, attachments }: AttachmentListProps) {
  const uploadWithIds = uploadAttachment.bind(null, lessonId, courseId)
  // @ts-expect-error React 19
  const [state, formAction] = useActionState(uploadWithIds, initialState)

  return (
    <div className="rounded-lg border bg-white shadow-sm p-6">
      <h2 className="text-lg font-semibold mb-4">Adjuntos</h2>
      
      <div className="space-y-4 mb-6">
        {attachments.map((file) => (
          <div key={file.id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
            <div className="flex items-center gap-3">
              <File size={20} className="text-blue-500" />
              <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline text-blue-600">
                {file.name}
              </a>
            </div>
            <button
              onClick={() => deleteAttachment(file.id, courseId, lessonId)}
              className="text-gray-600 hover:text-red-500 transition-colors"
              aria-label="Eliminar adjunto"
              title="Eliminar adjunto"
            >
              <Trash size={18} />
            </button>
          </div>
        ))}
        {attachments.length === 0 && (
          <p className="text-sm text-gray-600 italic">No hay adjuntos aún.</p>
        )}
      </div>

      <form action={formAction} className="flex gap-4 items-end border-t pt-4">
        <div className="grid gap-2 w-full">
          <label htmlFor="file" className="text-sm font-medium text-gray-900">Subir Documento</label>
          <input
            id="file"
            name="file"
            type="file"
            required
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <SubmitButton />
      </form>
      {state?.error && <p className="text-red-500 text-sm mt-2">{state.error}</p>}
      {state?.success && <p className="text-green-500 text-sm mt-2">{state.message}</p>}
    </div>
  )
}
