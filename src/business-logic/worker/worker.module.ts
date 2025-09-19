import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'
import { FusionBrainModule } from '../fusion-brain-api/fusion-brain-api.module'
import { ImageModule } from '../images/images.module'
import { MinioModule } from '../minio/minio.module'
import { QueueModule } from '../queue/queue.module'
import { WorkerService } from './worker.service'

@Module({
    imports: [ScheduleModule.forRoot(), QueueModule, FusionBrainModule, ImageModule, MinioModule],
    providers: [WorkerService],
    exports: [WorkerService],
})
export class WorkerModule {}
