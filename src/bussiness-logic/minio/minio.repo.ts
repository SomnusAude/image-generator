import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Client } from 'minio'

@Injectable()
export class MinioRepository implements OnModuleInit {
    constructor() {}
    private readonly logger = new Logger(MinioRepository.name)
    private readonly bucket = process.env.MINIO_BUCKET ?? 'images'

    private readonly client = new Client({
        endPoint: process.env.MINIO_ENDPOINT!,
        port: parseInt(process.env.MINIO_PORT!, 10),
        useSSL: false,
        accessKey: process.env.MINIO_ACCESS_KEY,
        secretKey: process.env.MINIO_SECRET_KEY,
    })

    async onModuleInit() {
        const exists = await this.client.bucketExists(this.bucket).catch(() => false)

        if (!exists) {
            await this.client.makeBucket(this.bucket, '')
            this.logger.log(`Bucket "${this.bucket}" created`)
        } else {
            this.logger.log(`Bucket "${this.bucket}" already exists`)
        }
    }

    async uploadObject(key: string, data: Buffer, mimeType = 'image/webp') {
        await this.client.putObject(this.bucket, key, data, data.length, {
            'Content-Type': mimeType,
        })
        return key
    }

    async getObject(key: string) {
        return this.client.getObject(this.bucket, key)
    }

    async getPresignedUrl(key: string, expirySeconds = 3600) {
        return this.client.presignedGetObject(this.bucket, key, expirySeconds)
    }

    async deleteObject(key: string) {
        await this.client.removeObject(this.bucket, key)
    }
}
