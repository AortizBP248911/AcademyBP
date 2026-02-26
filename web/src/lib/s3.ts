import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  endpoint: process.env.C2_ENDPOINT,
  region: process.env.C2_REGION || "us-004",
  credentials: {
    accessKeyId: process.env.C2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.C2_SECRET_ACCESS_KEY || "",
  },
  forcePathStyle: true, 
});

export async function uploadToS3(file: File, folderPath: string): Promise<string | null> {
  const bucket = process.env.C2_BUCKET_NAME || "academy-attachments";
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Sanitize file name: remove special chars and replace spaces with hyphens
    const sanitizedFileName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "-")
      .replace(/-+/g, "-");
      
    const key = `${folderPath}/${sanitizedFileName}`;
    
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ACL: 'public-read' // Attempt to make it public readable
    });

    await s3Client.send(command);
    
    // Construct the public URL
    // Ensure no double slashes if endpoint has trailing slash
    const endpoint = process.env.C2_ENDPOINT?.replace(/\/$/, "");
    return `${endpoint}/${bucket}/${key}`;
  } catch (error) {
    console.error("S3 Upload Error:", error);
    return null;
  }
}

export async function deleteFromS3(fileUrl: string): Promise<boolean> {
    const bucket = process.env.C2_BUCKET_NAME || "academy-attachments";
    try {
        // Extract key from URL
        // URL format: https://endpoint/bucket/key
        // key starts after bucket/
        const endpoint = process.env.C2_ENDPOINT?.replace(/\/$/, "");
        const prefix = `${endpoint}/${bucket}/`;
        
        if (!fileUrl.startsWith(prefix)) {
            console.error("Invalid S3 URL for deletion:", fileUrl);
            return false;
        }

        const key = fileUrl.substring(prefix.length);

        const command = new DeleteObjectCommand({
            Bucket: bucket,
            Key: key,
        });

        await s3Client.send(command);
        return true;
    } catch (error) {
        console.error("S3 Delete Error:", error);
        return false;
    }
}