"use client"

import { useState } from "react"
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react"

interface FloorPlanGalleryProps {
    images: string[]
    planName: string
}

export function FloorPlanGallery({ images, planName }: FloorPlanGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null)

    const openLightbox = (index: number) => {
        setSelectedImage(index)
        document.body.style.overflow = "hidden"
    }

    const closeLightbox = () => {
        setSelectedImage(null)
        document.body.style.overflow = "auto"
    }

    const nextImage = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage + 1) % images.length)
        }
    }

    const prevImage = () => {
        if (selectedImage !== null) {
            setSelectedImage((selectedImage - 1 + images.length) % images.length)
        }
    }

    return (
        <div className="mt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {images.map((img, index) => (
                    <div
                        key={index}
                        className="group relative cursor-zoom-in transition-all duration-300"
                        onClick={() => openLightbox(index)}
                    >
                        <div className="relative aspect-video flex items-center justify-center overflow-hidden rounded-lg">
                            <img
                                src={img || "/placeholder.svg"}
                                alt={`${planName} floor plan ${index + 1}`}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-transparent group-hover:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                <ZoomIn className="w-6 h-6 text-primary shadow-sm" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Lightbox Modal */}
            {selectedImage !== null && (
                <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300">
                    <button
                        onClick={closeLightbox}
                        className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors z-[110]"
                    >
                        <X className="w-10 h-10" />
                    </button>

                    {images.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all z-[110]"
                            >
                                <ChevronLeft className="w-8 h-8" />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/5 text-white hover:bg-white/10 transition-all z-[110]"
                            >
                                <ChevronRight className="w-8 h-8" />
                            </button>
                        </>
                    )}

                    <div className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={images[selectedImage]}
                            alt={`${planName} floor plan ${selectedImage + 1}`}
                            className="max-w-full max-h-full object-contain select-none"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}
