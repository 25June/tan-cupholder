'use server';

import {
  S3Client,
  GetObjectCommand,
  PutObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  DeleteObjectsCommand
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

class S3Service {
  private s3Client: S3Client;
  private bucketName: string = process.env.CLOUDFLARE_R2_BUCKET || '';
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.CLOUDFLARE_R2_REGION || '',
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || '',
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || ''
      }
    });
  }

  async getS3Object(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key
    });
    const response = await this.s3Client.send(command);
    return response.Body; // The object's content
  }

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

  async generateSignedUrl(productId: string, name: string, type: string) {
    const url = await getSignedUrl(
      this.s3Client,
      new PutObjectCommand({
        Bucket: this.bucketName,
        Key: `${productId}/${name}`,
        ContentType: type
      }),
      { expiresIn: 3600 }
    );
    return url;
  }

  async deleteFile(productId: string, name: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: `${productId}/${name}`
    });
    await this.s3Client.send(command);
    console.log(
      `Object ${productId}/${name} deleted successfully from ${this.bucketName}`
    );
    return {
      message: `Object ${productId}/${name} deleted successfully from ${this.bucketName}`,
      success: true
    };
  }

  async listFiles(folderPrefix: string) {
    const command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: folderPrefix
    });
    const response = await this.s3Client.send(command);
    return response.Contents;
  }

  async deleteFiles(contents: ListObjectsV2CommandOutput['Contents'] = []) {
    const deleteParams = {
      Bucket: this.bucketName,
      Delete: {
        Objects: contents.map((file) => ({
          Key: file.Key
        }))
      }
    };
    try {
      await this.s3Client.send(new DeleteObjectsCommand(deleteParams));
    } catch (error) {
      console.error('Error deleting files:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

const s3 = new S3Service();
export const deleteFile = s3.deleteFile.bind(s3);
export const generateSignedUrl = s3.generateSignedUrl.bind(s3);
export const listFiles = s3.listFiles.bind(s3);
export const deleteFiles = s3.deleteFiles.bind(s3);
