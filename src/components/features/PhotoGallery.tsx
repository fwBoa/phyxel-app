'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'

type Photo = { id: string; url: string; is_cover: boolean }

type Props = {
  photos: Photo[]
}

export default function PhotoGallery({ photos }: Props) {
  const cover = photos.find((p) => p.is_cover) ?? photos[0]
  const thumbnails = photos.filter((p) => p !== cover)

  const [activeUrl, setActiveUrl] = useState(cover?.url ?? null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const isCarousel = thumbnails.length > 3

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 260 : -260, behavior: 'smooth' })
  }

  if (!cover) {
    return (
      <div className="flex h-80 sm:h-[420px] w-full items-center justify-center rounded-2xl bg-bg-secondary text-text-muted">
        <Maximize2 size={48} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Photo principale */}
      <div className="relative h-80 sm:h-[420px] w-full overflow-hidden rounded-2xl bg-bg-secondary">
        <Image
          src={activeUrl ?? cover.url}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 66vw"
          priority
        />
      </div>

      {/* Miniatures */}
      {thumbnails.length > 0 && (
        <div className="relative">
          {isCarousel && (
            <>
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 z-10 -translate-x-3 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-border-custom hover:shadow-lg transition-shadow"
                aria-label="Photo précédente"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 z-10 translate-x-3 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md border border-border-custom hover:shadow-lg transition-shadow"
                aria-label="Photo suivante"
              >
                <ChevronRight size={16} />
              </button>
            </>
          )}

          <div
            ref={scrollRef}
            className={`flex gap-3 ${isCarousel ? 'overflow-x-auto scrollbar-hide scroll-smooth' : 'grid grid-cols-3'}`}
          >
            {thumbnails.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setActiveUrl(photo.url)}
                className={`relative shrink-0 overflow-hidden rounded-xl bg-bg-secondary transition-all ${
                  isCarousel ? 'h-24 w-[calc(33.333%-8px)] sm:h-28' : 'h-24 sm:h-28 w-full'
                } ${activeUrl === photo.url ? 'ring-2 ring-primary ring-offset-1' : 'opacity-80 hover:opacity-100'}`}
              >
                <Image src={photo.url} alt="" fill className="object-cover" sizes="22vw" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
