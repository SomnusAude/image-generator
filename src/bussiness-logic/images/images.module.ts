import { Module } from '@nestjs/common'
import { PrismaModule } from '../prisma/prisma.module'
import { ImageController } from './image.controller'
import { ImageRepository } from './image.repo'

@Module({
    imports: [PrismaModule],
    exports: [ImageRepository],
    providers: [ImageRepository],
    controllers: [ImageController],
})
export class ImageModule {}
