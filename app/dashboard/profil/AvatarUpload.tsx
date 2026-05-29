"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"

export default function AvatarUpload({
  currentUrl,
  uploadAction,
}: {
  currentUrl: string | null
  uploadAction: (formData: FormData) => Promise<{ error?: string; url?: string }>
}) {
  const [preview, setPreview] = useState(currentUrl)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      // Client-side validation
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner une image.")
        return
      }
      if (file.size > 2 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 2 Mo.")
        return
      }

      setError("")
      setUploading(true)

      // Show local preview immediately
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)

      const formData = new FormData()
      formData.append("file", file)

      try {
        const result = await uploadAction(formData)
        if (result.error) {
          setError(result.error)
          setPreview(currentUrl) // revert
        } else if (result.url) {
          setPreview(result.url)
          router.refresh()
        }
      } catch {
        setError("Erreur lors de l'upload.")
        setPreview(currentUrl)
      } finally {
        setUploading(false)
        URL.revokeObjectURL(objectUrl)
      }
    },
    [currentUrl, uploadAction, router]
  )

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-border bg-secondary">
        {preview ? (
          <img
            src={preview}
            alt="Avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl text-muted-foreground">
            👤
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </div>

      <label className="cursor-pointer">
        <span className="rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors">
          {uploading ? "Upload..." : "Changer la photo"}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="sr-only"
        />
      </label>

      {error && <p className="text-xs text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">JPG, PNG — max 2 Mo</p>
    </div>
  )
}
