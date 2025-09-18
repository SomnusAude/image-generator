import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { Jimp } from 'jimp'
import { Image } from 'src/entities/image'
import { FusionBrainApiService } from '../fusion-brain-api/fusion-brain-api.service'
import { ImageRepository } from '../images/image.repo'
import { MinioRepository } from '../minio/minio.repo'
import { QueueService } from '../queue/queue.service'

@Injectable()
export class WorkerService {
    private readonly logger = new Logger(WorkerService.name)
    private isProcessing = false //Something like mutex

    constructor(
        private readonly queueService: QueueService,
        private readonly fusionBrainApiService: FusionBrainApiService,
        private readonly imageRepo: ImageRepository,
        private readonly minioRepo: MinioRepository
    ) {}

    @Cron(CronExpression.EVERY_10_SECONDS)
    async handleCron() {
        if (this.isProcessing) {
            this.logger.warn('Previous batch still processing, skipping this tick')
            return
        }
        this.isProcessing = true
        try {
            while (true) {
                const task = await this.queueService.dequeue(1)
                if (!task) break
                this.logger.log(`Processing task: ${JSON.stringify(task)}`)
                await this.executeTask(task)
            }
        } catch (error) {
            this.logger.error('Error processing batch', error)
        } finally {
            this.isProcessing = false
        }
    }

    private async executeTask(task: Image.BaseType) {
        switch (task.status) {
            case 'created': {
                const uuid = await this.fusionBrainApiService.generate(task.prompt, task.style)
                const updatedImage = await this.imageRepo.updateImage({
                    where: { id: task.id },
                    data: {
                        status: 'pending',
                        uuid: uuid,
                    },
                })
                this.queueService.enqueue(updatedImage)
                return
            }
            case 'pending': {
                const imageRaw = await this.fusionBrainApiService.checkStatus(task.uuid)
                if (!imageRaw) {
                    await this.queueService.enqueue(task)
                    return
                }
                const buffer = Buffer.from(imageRaw, 'base64')
                const originalId = await this.minioRepo.uploadObject(`${task.id}_original`, buffer)
                const thumbnailBuffer = await this.createThumbnail(buffer)
                const thumbnailId = await this.minioRepo.uploadObject(
                    `${task.id}_thumbnail`,
                    thumbnailBuffer
                )
                await this.imageRepo.updateImage({
                    where: { id: task.id },
                    data: { status: 'done', originalUrl: originalId, thumbnailUrl: thumbnailId },
                })
                return
            }
            case 'done':
                return
            case 'error':
                return
        }
    }

    private async createThumbnail(buffer: Buffer): Promise<Buffer> {
        const image = await Jimp.read(buffer)
        image.resize({ w: 128, h: 128 })
        return await image.getBuffer('image/png')
    }
}
