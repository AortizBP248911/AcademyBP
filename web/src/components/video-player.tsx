"use client"

export default function VideoPlayer({ url }: { url: string }) {
  if (!url) return <div className="w-full h-full flex items-center justify-center text-white bg-zinc-900">No se proporcionó URL de video</div>

  let videoId = "";
  try {
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      if (url.includes("v=")) {
        videoId = url.split("v=")[1].split("&")[0];
      } else if (url.includes("youtu.be/")) {
        videoId = url.split("youtu.be/")[1].split("?")[0];
      }
    }
  } catch (e) {
    console.error("Error parsing video URL", e);
  }

  if (!videoId) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-zinc-900 flex-col gap-2">
        <span>Video no disponible</span>
        <span className="text-xs text-gray-400">{url}</span>
      </div>
    )
  }

  return (
    <iframe
      className="w-full h-full"
      src={`https://www.youtube.com/embed/${videoId}?rel=0`}
      title="Reproductor de video"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}
