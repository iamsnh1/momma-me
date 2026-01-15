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
    console.log('📤 Preparing to upload to Spaces:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`)
    
    // Create FormData to send to our API route
    const formData = new FormData()
    formData.append('image', file)
    formData.append('folder', 'uploads') // Optional: organize by folder

    console.log('📡 Sending request to /api/upload...')
    
    // Upload via Next.js API route (secure, server-side)
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })

    console.log('📥 Response status:', response.status, response.statusText)

    if (!response.ok) {
      let errorMessage = 'Upload failed'
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
        console.error('❌ API Error:', errorData)
      } catch (e) {
        const text = await response.text()
        console.error('❌ API Error (text):', text)
        errorMessage = text || errorMessage
      }
      
      // Provide helpful error messages
      if (response.status === 500) {
        if (errorMessage.includes('not configured')) {
          throw new Error('DigitalOcean Spaces not configured. Please add environment variables in DigitalOcean App Platform settings.')
        }
        throw new Error(`Server error: ${errorMessage}`)
      }
      
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('✅ Upload successful! URL:', data.url)
    
    if (!data.url) {
      throw new Error('Upload succeeded but no URL returned')
    }
    
    return data.url
  } catch (error: any) {
    console.error('❌ Upload error details:', error)
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

