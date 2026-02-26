
import { v2 as cloudinary } from 'cloudinary';

// Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadFile(file: File, folder: string = "uploads"): Promise<string | null> {
    if (!file || file.size === 0) return null;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: "auto",
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", error);
                    reject(error);
                } else {
                    // Only apply image optimizations if the uploaded file is an image
                    if (result?.resource_type === 'image') {
                        const optimizedUrl = cloudinary.url(result.public_id, {
                            fetch_format: 'auto',
                            quality: 'auto',
                            secure: true
                        });
                        resolve(optimizedUrl);
                    } else {
                        // For raw files (pdf, zip, etc) and videos, use the secure_url directly
                        resolve(result?.secure_url || null);
                    }
                }
            }
        );
        uploadStream.end(buffer);
    });
}
