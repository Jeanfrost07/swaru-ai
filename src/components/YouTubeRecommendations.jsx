import { Play, Youtube } from 'lucide-react';
import Card from './Card.jsx';

export default function YouTubeRecommendations({ videos }) {
  // SAFETY 1: Agar videos array nahi hai ya undefined hai, toh empty array maan lo
  const safeVideos = Array.isArray(videos) ? videos : [];

  // Agar videos hain hi nahi, toh section chupchap hide kar do, crash mat karo
  if (safeVideos.length === 0) {
    return null;
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Youtube className="h-5 w-5 text-red-500" />
        <h2 className="text-lg font-semibold text-zinc-50">Recommended Tutorials</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {safeVideos.map((video, index) => {
          // SAFETY 2: Agar loop ke beech me koi video object missing hai, toh usko skip karo
          if (!video) return null;

          // SAFETY 3: Agar gradient property missing hai toh fallback default color do
          const safeGradient = video.gradient || 'from-zinc-600/20 to-zinc-600/0';

          return (
            <a
              key={video.id || `video-${index}`}
              href={video.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group block outline-none"
            >
              <Card className={`relative flex h-full flex-col overflow-hidden p-0 transition hover:border-zinc-500 hover:bg-zinc-800/50 bg-gradient-to-b ${safeGradient}`}>
                <div className="relative aspect-video w-full overflow-hidden bg-zinc-900">
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title || "Video"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-zinc-700">No Thumbnail</div>
                  )}
                  
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-xl transform transition-transform group-hover:scale-110">
                      <Play className="h-5 w-5 ml-1" fill="currentColor" />
                    </div>
                  </div>

                  {video.duration && (
                    <div className="absolute bottom-2 right-2 rounded bg-black/80 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                      {video.duration}
                    </div>
                  )}
                </div>
                
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="line-clamp-2 font-medium text-zinc-100 group-hover:text-blue-400 transition-colors">
                      {video.title || "Study Tutorial"}
                    </h3>
                    <p className="mt-1.5 text-sm text-zinc-400 flex items-center gap-2">
                      <Youtube className="h-3.5 w-3.5" />
                      {video.channel || "YouTube"}
                    </p>
                  </div>
                  
                  {video.views && (
                    <div className="mt-4 flex items-center gap-2">
                      <span className="inline-flex items-center rounded-md bg-zinc-800/50 px-2 py-1 text-xs font-medium text-zinc-400 ring-1 ring-inset ring-zinc-700/50">
                        {video.views}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            </a>
          )
        })}
      </div>
    </section>
  )
}