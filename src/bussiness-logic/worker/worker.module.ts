import { Module } from '@nestjs/common'
import { FusionBrainModule } from '../fusion-brain-api/fusion-brain-api.module'
import { ImageModule } from '../images/images.module'
import { MinioModule } from '../minio/minio.module'
import { QueueModule } from '../queue/queue.module'
import { WorkerService } from './worker.service'

@Module({
    imports: [QueueModule, FusionBrainModule, ImageModule, MinioModule],
    providers: [WorkerService],
    exports: [],
})
export class WorkerModule {}
