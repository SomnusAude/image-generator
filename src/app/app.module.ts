import { Module } from '@nestjs/common'
import { FusionBrainModule } from 'src/bussiness-logic/fusion-brain-api/fusion-brain-api.module'
import { ImageModule } from 'src/bussiness-logic/images/images.module'
import { MinioModule } from 'src/bussiness-logic/minio/minio.module'
import { PrismaModule } from 'src/bussiness-logic/prisma/prisma.module'
import { QueueModule } from 'src/bussiness-logic/queue/queue.module'
import { WorkerModule } from 'src/bussiness-logic/worker/worker.module'

@Module({
    imports: [ImageModule, PrismaModule, FusionBrainModule, QueueModule, WorkerModule, MinioModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
