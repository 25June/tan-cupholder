import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

class S3Service {
  private s3Client: S3Client;
  public IMAGE_URL = 'https://pub-485637738840450490e408cee2acb72c.r2.dev/';
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

  getImageUrl(key: string) {
    return `${this.IMAGE_URL}${key}`;
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

  async getSignedUrl(name: string, type: string) {
    const url = await getSignedUrl(
      this.s3Client,
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: name,
        ContentType: type
      }),
      { expiresIn: 3600 }
    );
    return url;
  }

  async uploadFile(
    file: File,
    presignedUrl: string,
    onProgress: (percent: number) => void
  ) {
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          console.log(event.loaded, event.total);
          const percentComplete = (event.loaded / event.total) * 100;
          onProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          resolve(xhr.response);
        } else {
          reject(new Error(`Upload failed with status: ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Upload failed'));
      };

      xhr.open('PUT', presignedUrl);
      xhr.setRequestHeader('Content-Type', file.type);
      xhr.send(file);
    });
  }
}

const s3Service = new S3Service();
export default s3Service;
