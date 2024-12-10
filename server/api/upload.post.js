import { readFiles } from 'h3-formidable'

export default defineEventHandler(async (event) => {
  try {
    const { files } = await readFiles(event)
    
    // Handle the uploaded file here
    // You might want to:
    // 1. Validate file type and size
    // 2. Store the file somewhere (e.g., cloud storage)
    // 3. Process the file content if needed
    
    return {
      success: true,
      filename: files[0].originalFilename
    }
  } catch (error) {
    console.error('File upload error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to upload file'
    })
  }
}) 