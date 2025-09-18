import { Module } from '@nestjs/common'
import { MinioModule } from '../minio/minio.module'
import { PrismaModule } from '../prisma/prisma.module'
import { QueueModule } from '../queue/queue.module'
import { ImageController } from './image.controller'
import { ImageRepository } from './image.repo'

@Module({
    imports: [PrismaModule, QueueModule, MinioModule],
    exports: [ImageRepository],
    providers: [ImageRepository],
    controllers: [ImageController],
})
export class ImageModule {}
