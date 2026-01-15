import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

// DigitalOcean Spaces configuration
const SPACES_ENDPOINT = process.env.SPACES_ENDPOINT || ''
const SPACES_KEY = process.env.SPACES_ACCESS_KEY_ID || ''
const SPACES_SECRET = process.env.SPACES_SECRET_ACCESS_KEY || ''
const SPACES_BUCKET = process.env.SPACES_BUCKET || ''
const SPACES_REGION = process.env.SPACES_REGION || 'nyc3'
const SPACES_CDN_URL = process.env.SPACES_CDN_URL || ''

// Initialize S3 client for DigitalOcean Spaces
const s3Client = new S3Client({
  endpoint: `https://${SPACES_ENDPOINT}`,
  region: SPACES_REGION,
  credentials: {
    accessKeyId: SPACES_KEY,
    secretAccessKey: SPACES_SECRET,
  },
})

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Upload API called')
    console.log('🔍 Checking Spaces configuration...')
    console.log('SPACES_ENDPOINT:', SPACES_ENDPOINT ? '✅ Set' : '❌ Missing')
    console.log('SPACES_KEY:', SPACES_KEY ? '✅ Set' : '❌ Missing')
    console.log('SPACES_SECRET:', SPACES_SECRET ? '✅ Set' : '❌ Missing')
    console.log('SPACES_BUCKET:', SPACES_BUCKET ? '✅ Set' : '❌ Missing')
    console.log('SPACES_REGION:', SPACES_REGION)
    
    // Check if Spaces is configured
    if (!SPACES_ENDPOINT || !SPACES_KEY || !SPACES_SECRET || !SPACES_BUCKET) {
      const missing = []
      if (!SPACES_ENDPOINT) missing.push('SPACES_ENDPOINT')
      if (!SPACES_KEY) missing.push('SPACES_ACCESS_KEY_ID')
      if (!SPACES_SECRET) missing.push('SPACES_SECRET_ACCESS_KEY')
      if (!SPACES_BUCKET) missing.push('SPACES_BUCKET')
      
      console.error('❌ Missing environment variables:', missing.join(', '))
      return NextResponse.json(
        { 
          error: `DigitalOcean Spaces not configured. Missing: ${missing.join(', ')}. Please set these environment variables in DigitalOcean App Platform settings.` 
        },
        { status: 500 }
      )
    }

    // Get the uploaded file
    const formData = await request.formData()
    const file = formData.get('image') as File
    const folder = (formData.get('folder') as string) || 'uploads'

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${folder}/${timestamp}-${randomString}.${fileExtension}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to DigitalOcean Spaces
    const command = new PutObjectCommand({
      Bucket: SPACES_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read', // Make file publicly accessible
    })

    await s3Client.send(command)

    // Generate public URL
    let publicURL: string
    if (SPACES_CDN_URL) {
      // Use CDN URL if configured
      publicURL = `${SPACES_CDN_URL}/${fileName}`
    } else {
      // Use Spaces endpoint
      publicURL = `https://${SPACES_BUCKET}.${SPACES_ENDPOINT}/${fileName}`
    }

    return NextResponse.json({
      success: true,
      url: publicURL,
      key: fileName,
    })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to upload image' },
      { status: 500 }
    )
  }
}

