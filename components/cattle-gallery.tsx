"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, ChevronLeft, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { getYouTubeEmbedUrl, getYouTubeThumbnail } from "@/lib/youtube"

interface CattleGalleryProps {
  images: string[]
  videos?: string[]
  name: string
}

export function CattleGallery({ images, videos = [], name }: CattleGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)

  const allMedia = [
    ...images.map((img) => ({ type: "image" as const, url: img })),
    ...videos.map((vid) => ({ type: "video" as const, url: vid })),
  ]

  const currentMedia = allMedia[selectedImage]

  return (
    <div className="space-y-4">
      {/* Main Display */}
      <Card className="overflow-hidden">
        <div className="relative aspect-[4/3]">
          {currentMedia?.type === "image" ? (
            <Image
              src={currentMedia.url || "/placeholder.svg"}
              alt={`${name} - Image ${selectedImage + 1}`}
              fill
              className="object-cover"
              priority
            />
          ) : currentMedia?.type === "video" ? (
            <>
              <Image
                src={getYouTubeThumbnail(currentMedia.url) || "/placeholder.svg"}
                alt={`${name} - Video ${selectedImage + 1}`}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Dialog
                  open={selectedVideo === currentMedia.url}
                  onOpenChange={(open) => !open && setSelectedVideo(null)}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="lg"
                      className="h-20 w-20 rounded-full"
                      onClick={() => setSelectedVideo(currentMedia.url)}
                    >
                      <Play className="h-10 w-10" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <div className="relative aspect-video bg-black">
                      <iframe
                        src={getYouTubeEmbedUrl(currentMedia.url)}
                        title={`${name} ভিডিও`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          ) : null}

          {/* Navigation Arrows */}
          {allMedia.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
                onClick={() => setSelectedImage((prev) => (prev === 0 ? allMedia.length - 1 : prev - 1))}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full"
                onClick={() => setSelectedImage((prev) => (prev === allMedia.length - 1 ? 0 : prev + 1))}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Thumbnail Grid */}
      <div className="grid grid-cols-4 gap-3">
        {allMedia.map((media, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative aspect-[4/3] overflow-hidden rounded-lg border-2 transition-all ${
              selectedImage === index
                ? "border-primary ring-2 ring-primary/20"
                : "border-border hover:border-primary/50"
            }`}
          >
            <Image
              src={media.type === "image" ? media.url : getYouTubeThumbnail(media.url)}
              alt={`Thumbnail ${index + 1}`}
              fill
              className="object-cover"
            />
            {media.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="h-6 w-6 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
