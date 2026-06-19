"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, Trash2, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
    value: string[]
    onChange: (value: string[]) => void
    disabled?: boolean
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setIsUploading(true)
        const formData = new FormData()
        formData.append("file", file)

        try {
            const response = await fetch("/api/upload", {
                method: "POST",
                body: formData,
            })

            if (!response.ok) {
                throw new Error("Upload failed")
            }

            const data = await response.json()
            onChange([...value, data.url])
        } catch (error) {
            console.error("Error uploading image:", error)
            alert("Failed to upload image")
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    const handleRemove = async (urlToRemove: string) => {
        try {
            const response = await fetch("/api/upload", {
                method: "DELETE",
                body: JSON.stringify({ url: urlToRemove }),
                headers: {
                    "Content-Type": "application/json",
                },
            })

            if (!response.ok) {
                throw new Error("Deletion failed")
            }

            onChange(value.filter((url) => url !== urlToRemove))
        } catch (error) {
            console.error("Error deleting image:", error)
            alert("Failed to delete image")
        }
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                {value.map((url) => (
                    <div key={url} className="relative aspect-video overflow-hidden rounded-md border text-center">
                        <Image
                            src={url}
                            alt="Uploaded image"
                            fill
                            className="object-cover"
                        />
                        <button
                            onClick={() => handleRemove(url)}
                            className="absolute right-1 top-1 rounded-full bg-destructive/90 p-1 text-white hover:bg-destructive"
                            type="button"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleUpload}
                    disabled={disabled || isUploading}
                />
                <Button
                    type="button"
                    variant="outline"
                    disabled={disabled || isUploading}
                    onClick={() => fileInputRef.current?.click()}
                >
                    {isUploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <ImagePlus className="mr-2 h-4 w-4" />
                    )}
                    อัปโหลดรูปภาพ
                </Button>
            </div>
        </div>
    )
}
