import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

class S3Service {
  private s3Client: S3Client;
  private bucketName: string =
    process.env.CLOUDFLARE_R2_BUCKET || 'tan-storage';
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.CLOUDFLARE_R2_REGION || 'apac',
      endpoint:
        process.env.CLOUDFLARE_R2_ENDPOINT ||
        `https://82a53163de4aac5437c3b17ce9baf6f5.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId:
          process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ||
          'ac58a8723eea844d3b6ed409a7091588',
        secretAccessKey:
          process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ||
          'd1cb52674a5776ead196d9696e41a776fffc4a9bc96130d20228658cb8d3376f'
      }
    });
    console.log({ bucketName: this.bucketName });
  }
  // Example: Get an object
  async getS3Object(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key
    });
    const response = await this.s3Client.send(command);
    return response.Body; // The object's content
  }

  // Example: Put an object
  async putS3Object(key: string, body: Uint8Array) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: body, // Content to upload
      ACL: 'public-read',
      ContentType: 'image/jpg' // Adjust as needed
    });
    await this.s3Client.send(command);
    console.log(`Object ${key} uploaded successfully to ${this.bucketName}`);
  }

  async getSignedUrl(name: string) {
    const url = await getSignedUrl(
      this.s3Client,
      new GetObjectCommand({ Bucket: this.bucketName, Key: name }),
      { expiresIn: 3600 }
    );
    return url;
  }

  async uploadFile(file: File, presignedUrl: string) {
    const uploadResponse = await fetch(presignedUrl, {
      method: 'PUT',
      body: file, // The actual file object
      headers: {
        'Content-Type': file.type // Crucial: Must match the ContentType used when generating the URL
      }
    });
    if (uploadResponse.ok) {
      console.log('File uploaded successfully!');
    } else {
      const uploadErrorText = await uploadResponse.text();
      throw new Error(
        `S3 upload failed: ${uploadResponse.status} - ${uploadErrorText}`
      );
    }
  }
}

const s3Service = new S3Service();
export default s3Service;
