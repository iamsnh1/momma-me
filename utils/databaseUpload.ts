/**
 * Database Image Upload Utility
 * Stores images in a database (JSON file) - accessible to all users
 * No external services required!
 */

/**
 * Upload image to database
 * @param file - Image file to upload
 * @returns Promise with image URL
 */
export async function uploadToDatabase(file: File): Promise<string> {
  try {
    console.log('📤 Uploading image to database:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`)
    
    // Create FormData
    const formData = new FormData()
    formData.append('image', file)

    console.log('📡 Sending request to /api/images/store...')
    
    // Upload via Next.js API route
    const response = await fetch('/api/images/store', {
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
      throw new Error(errorMessage)
    }

    const data = await response.json()
    console.log('✅ Upload successful! URL:', data.url)
    
    if (!data.url) {
      throw new Error('Upload succeeded but no URL returned')
    }
    
    // Return API URL (images are served via /api/images/[id])
    return data.url
  } catch (error: any) {
    console.error('❌ Upload error details:', error)
    throw new Error(`Image upload failed: ${error.message}`)
  }
}

/**
 * Upload image (primary method)
 */
export async function uploadImage(file: File): Promise<string> {
  return await uploadToDatabase(file)
}

/**
 * Check if a string is a valid image URL
 */
export function isImageURL(str: string): boolean {
  if (!str) return false
  // Check if it's a URL (http/https) or an API route (/api/images/...)
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    // If it's not a full URL, check if it's an API route or local path
    return str.startsWith('/api/images/') || str.startsWith('/') || str.startsWith('./')
  }
}

