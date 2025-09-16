import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { ImageRepository } from './image.repo'

@Module({
    imports: [PrismaModule],
    exports: [ImageRepository],
    providers: [ImageRepository],
})
export class ImageModule {}
