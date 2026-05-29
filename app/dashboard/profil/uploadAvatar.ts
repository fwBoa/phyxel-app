"use server"

import { createClient } from "@/lib/supabase/server"

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Non authentifié." }
  }

  const file = formData.get("file") as File
  if (!file) {
    return { error: "Aucun fichier fourni." }
  }

  // Validate
  if (!file.type.startsWith("image/")) {
    return { error: "Le fichier doit être une image." }
  }
  if (file.size > 2 * 1024 * 1024) {
    return { error: "L'image ne doit pas dépasser 2 Mo." }
  }

  const ext = file.name.split(".").pop() || "jpg"
  const filePath = `${user.id}/avatar.${ext}`

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      upsert: true,
      contentType: file.type,
    })

  if (uploadError) {
    return { error: uploadError.message }
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("avatars")
    .getPublicUrl(filePath)

  const publicUrl = publicUrlData.publicUrl

  // Update profile
  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id)

  if (updateError) {
    return { error: updateError.message }
  }

  return { url: publicUrl }
}
