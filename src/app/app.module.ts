import { Module } from '@nestjs/common'
import { FusionBrainModule } from 'src/bussiness-logic/fusion-brain-api/fusion-brain-api.module'
import { ImageModule } from 'src/bussiness-logic/images/images.module'
import { PrismaModule } from 'src/bussiness-logic/prisma/prisma.module'
import { QueueModule } from 'src/bussiness-logic/queue/queue.module'

@Module({
    imports: [ImageModule, PrismaModule, FusionBrainModule, QueueModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
