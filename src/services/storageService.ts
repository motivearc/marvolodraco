import { requireSupabase } from '../lib/supabase'

const MAX_FILE_BYTES = 5 * 1024 * 1024
const MEDIA_BUCKET = 'media'

export type MediaFile = {
  name: string
  path: string
  publicUrl: string
  updatedAt: string | null
}

export function validateImageFile(file: File): void {
  if (!file.type.startsWith('image/')) {
    throw new Error('Please choose an image file.')
  }
  if (file.size > MAX_FILE_BYTES) {
    throw new Error('Image must be under 5MB.')
  }
}

async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer()
  const digest = await crypto.subtle.digest('SHA-256', buffer)
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
    .slice(0, 16)
}

export async function listMediaFiles(folder = 'uploads'): Promise<MediaFile[]> {
  const client = requireSupabase()

  const { data, error } = await client.storage.from(MEDIA_BUCKET).list(folder, {
    limit: 200,
    sortBy: { column: 'updated_at', order: 'desc' },
  })

  if (error) throw error

  return (data ?? [])
    .filter((item) => Boolean(item.name) && !item.name.endsWith('/'))
    .filter((item) => /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(item.name))
    .map((item) => {
      const path = `${folder}/${item.name}`
      const { data: urlData } = client.storage
        .from(MEDIA_BUCKET)
        .getPublicUrl(path)

      return {
        name: item.name,
        path,
        publicUrl: urlData.publicUrl,
        updatedAt: item.updated_at ?? null,
      }
    })
}

export async function uploadMediaFile(
  file: File,
  folder = 'uploads',
): Promise<string> {
  validateImageFile(file)

  const client = requireSupabase()

  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const contentHash = await hashFile(file)
  const path = `${folder}/${contentHash}.${extension}`

  // Path is derived from content hash, so re-uploading the same image
  // reuses the existing object instead of creating a duplicate.
  const { error } = await client.storage.from(MEDIA_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: file.type,
  })

  if (error) throw error

  const { data } = client.storage.from(MEDIA_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
