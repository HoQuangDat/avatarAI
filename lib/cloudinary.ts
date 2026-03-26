import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(fileBuffer: Buffer, folder: string = 'avatars') {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `avatarai/${folder}`,
          resource_type: 'image',
          transformation: [{ width: 1024, height: 1024, crop: 'limit' }],
        },
        (error, result) => {
          if (error || !result) return reject(error || new Error('Upload failed'));
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      )
      .end(fileBuffer);
  });
}

export async function uploadAudio(fileBuffer: Buffer, folder: string = 'audio') {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `avatarai/${folder}`,
          resource_type: 'video', // Cloudinary uses 'video' for audio too
        },
        (error, result) => {
          if (error || !result) return reject(error || new Error('Upload failed'));
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      )
      .end(fileBuffer);
  });
}

export async function uploadVideo(fileBuffer: Buffer, folder: string = 'videos') {
  return new Promise<{ url: string; publicId: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: `avatarai/${folder}`,
          resource_type: 'video',
        },
        (error, result) => {
          if (error || !result) return reject(error || new Error('Upload failed'));
          resolve({ url: result.secure_url, publicId: result.public_id });
        }
      )
      .end(fileBuffer);
  });
}

export async function uploadFromUrl(url: string, folder: string = 'videos') {
  const result = await cloudinary.uploader.upload(url, {
    folder: `avatarai/${folder}`,
    resource_type: 'video',
  });
  return { url: result.secure_url, publicId: result.public_id };
}

export async function deleteResource(publicId: string, resourceType: 'image' | 'video' = 'image') {
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
}

export default cloudinary;
