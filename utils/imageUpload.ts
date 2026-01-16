/**
 * Image Upload Utility
 * Uploads images to cloud hosting services for universal access
 */

// ImgBB API (Free tier - requires API key)
// Get your free API key at: https://api.imgbb.com/
const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || ''

/**
 * Upload image to ImgBB (free image hosting)
 * @param file - Image file to upload
 * @returns Promise with image URL
 */
export async function uploadToImgBB(file: File): Promise<string> {
  if (!IMGBB_API_KEY) {
    throw new Error('ImgBB API key not configured. Please add NEXT_PUBLIC_IMGBB_API_KEY to your environment variables, or use an image URL instead.')
  }

  const formData = new FormData()
  formData.append('image', file)
  formData.append('key', IMGBB_API_KEY)

  try {
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to upload image')
    }

    const data = await response.json()
    return data.data.url
  } catch (error: any) {
    throw new Error(`Image upload failed: ${error.message}`)
  }
}

/**
 * Upload image to a free hosting service
 * Falls back to base64 if upload fails
 */
export async function uploadImage(file: File): Promise<string> {
  try {
    // Try ImgBB first if API key is available
    if (IMGBB_API_KEY) {
      return await uploadToImgBB(file)
    }
    
    // If no API key, convert to base64 (browser-specific, not universal)
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  } catch (error: any) {
    // Fallback to base64 if upload fails
    console.warn('Cloud upload failed, using base64:', error.message)
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        resolve(reader.result as string)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
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


