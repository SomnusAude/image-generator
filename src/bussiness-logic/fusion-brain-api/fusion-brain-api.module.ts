import { Module } from '@nestjs/common'
import { FusionBrainApiService } from './fusion-brain-api.service'

@Module({
    imports: [],
    providers: [FusionBrainApiService],
    exports: [FusionBrainApiService],
})
export class FusionBrainModule {}
