/**
 * ImgBB Upload Utility
 * Simple, free image hosting that works client-side
 * Get free API key at: https://api.imgbb.com/
 */

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY || ''

/**
 * Upload image to ImgBB
 * @param file - Image file to upload
 * @returns Promise with image URL
 */
export async function uploadToImgBB(file: File): Promise<string> {
  try {
    console.log('📤 Uploading to ImgBB:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`)
    
    // Check if API key is configured
    if (!IMGBB_API_KEY) {
      throw new Error(
        'ImgBB API key not configured.\n\n' +
        'To fix this:\n' +
        '1. Get a free API key at: https://api.imgbb.com/\n' +
        '2. Add NEXT_PUBLIC_IMGBB_API_KEY to your environment variables\n' +
        '3. Redeploy your app\n\n' +
        'Or use an image URL instead of uploading files.'
      )
    }

    // Convert file to base64 for ImgBB API
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        // Remove data:image/...;base64, prefix
        const base64Data = result.split(',')[1]
        resolve(base64Data)
      }
      reader.onerror = reject
      reader.readAsDataURL(file)
    })

    // Upload to ImgBB
    const formData = new FormData()
    formData.append('key', IMGBB_API_KEY)
    formData.append('image', base64)

    console.log('📡 Sending request to ImgBB...')
    
    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ ImgBB API Error:', errorText)
      throw new Error(`ImgBB upload failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    if (!data.success || !data.data || !data.data.url) {
      throw new Error('ImgBB upload failed: Invalid response')
    }

    const imageUrl = data.data.url
    console.log('✅ Upload successful! URL:', imageUrl)
    
    return imageUrl
  } catch (error: any) {
    console.error('❌ ImgBB upload error:', error)
    throw new Error(`Image upload failed: ${error.message}`)
  }
}

/**
 * Upload image with ImgBB (primary method)
 */
export async function uploadImage(file: File): Promise<string> {
  return await uploadToImgBB(file)
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

