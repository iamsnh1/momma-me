/**
 * DigitalOcean Spaces Upload Utility
 * Uploads images to DigitalOcean Spaces for universal access
 */

const SPACES_ENDPOINT = process.env.NEXT_PUBLIC_SPACES_ENDPOINT || ''
const SPACES_BUCKET = process.env.NEXT_PUBLIC_SPACES_BUCKET || ''
const SPACES_CDN_URL = process.env.NEXT_PUBLIC_SPACES_CDN_URL || ''

/**
 * Upload image to DigitalOcean Spaces via API route
 * @param file - Image file to upload
 * @returns Promise with image URL
 */
export async function uploadToSpaces(file: File): Promise<string> {
  try {
    // Create FormData to send to our API route
    const formData = new FormData()
    formData.append('image', file)
    formData.append('folder', 'uploads') // Optional: organize by folder

    // Upload via Next.js API route (secure, server-side)
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Upload failed' }))
      throw new Error(error.error || 'Failed to upload image')
    }

    const data = await response.json()
    return data.url
  } catch (error: any) {
    throw new Error(`Image upload failed: ${error.message}`)
  }
}

/**
 * Upload image with fallback options
 * NOTE: Base64 fallback is disabled to prevent localStorage quota issues
 */
export async function uploadImage(file: File): Promise<string> {
  try {
    // Try DigitalOcean Spaces first
    return await uploadToSpaces(file)
  } catch (error: any) {
    // Don't fallback to base64 - it causes localStorage quota issues
    throw new Error(`Spaces upload failed: ${error.message}. Please ensure DigitalOcean Spaces environment variables are configured, or use an image URL instead.`)
  }
}

/**
 * Check if a string is a valid image URL
 */
export function isImageURL(str: string): boolean {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Get the public URL for a Spaces object
 */
export function getSpacesURL(key: string): string {
  if (SPACES_CDN_URL) {
    return `${SPACES_CDN_URL}/${key}`
  }
  if (SPACES_ENDPOINT && SPACES_BUCKET) {
    return `https://${SPACES_BUCKET}.${SPACES_ENDPOINT}/${key}`
  }
  return key
}

