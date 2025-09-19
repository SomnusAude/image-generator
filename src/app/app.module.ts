import { Module } from '@nestjs/common'
import { FusionBrainModule } from 'src/business-logic/fusion-brain-api/fusion-brain-api.module'
import { ImageModule } from 'src/business-logic/images/images.module'
import { MinioModule } from 'src/business-logic/minio/minio.module'
import { PrismaModule } from 'src/business-logic/prisma/prisma.module'
import { QueueModule } from 'src/business-logic/queue/queue.module'
import { WorkerModule } from 'src/business-logic/worker/worker.module'

@Module({
    imports: [ImageModule, PrismaModule, FusionBrainModule, QueueModule, WorkerModule, MinioModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
