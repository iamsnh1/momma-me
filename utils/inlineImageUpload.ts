/**
 * Inline Image Upload Utility
 * Stores images directly in product/banner data (in localStorage)
 * Images are accessible to all users because they're part of the shared data
 */

/**
 * Compress image to reduce size for localStorage storage
 */
function compressImage(file: File, maxWidth: number = 800, quality: number = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        // Calculate new dimensions
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      img.onerror = reject
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Upload image - stores as compressed base64 directly in data
 * This makes images part of the product/banner data, accessible to all users
 */
export async function uploadImage(file: File): Promise<string> {
  try {
    console.log('📤 Compressing and storing image:', file.name, `(${(file.size / 1024).toFixed(2)} KB)`)
    
    // Check file size (max 5MB before compression)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      throw new Error('File size must be less than 5MB')
    }

    // Compress image
    const compressedDataUrl = await compressImage(file, 800, 0.75)
    
    // Check compressed size (max 500KB after compression)
    const base64Size = compressedDataUrl.length
    const maxCompressedSize = 500 * 1024 // 500KB
    if (base64Size > maxCompressedSize) {
      // Try more aggressive compression
      const moreCompressed = await compressImage(file, 600, 0.6)
      console.log(`✅ Image compressed: ${(base64Size / 1024).toFixed(2)} KB → ${(moreCompressed.length / 1024).toFixed(2)} KB`)
      return moreCompressed
    }

    console.log(`✅ Image compressed: ${(file.size / 1024).toFixed(2)} KB → ${(base64Size / 1024).toFixed(2)} KB`)
    return compressedDataUrl
  } catch (error: any) {
    console.error('❌ Image compression error:', error)
    throw new Error(`Image processing failed: ${error.message}`)
  }
}

/**
 * Check if a string is a valid image URL or data URL
 */
export function isImageURL(str: string): boolean {
  if (!str) return false
  // Accept both URLs and data URLs (base64)
  if (str.startsWith('data:image/')) return true
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return str.startsWith('/') || str.startsWith('./')
  }
}

