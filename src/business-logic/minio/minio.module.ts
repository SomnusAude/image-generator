import { Module } from '@nestjs/common'
import { MinioRepository } from './minio.repo'

@Module({
    imports: [],
    providers: [MinioRepository],
    exports: [MinioRepository],
})
export class MinioModule {}
