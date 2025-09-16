import { Module } from '@nestjs/common'
import { ImageModule } from 'src/bussiness-logic/images/images.module'
import { PrismaModule } from 'src/bussiness-logic/prisma/prisma.module'

@Module({
    imports: [ImageModule, PrismaModule],
    controllers: [],
    providers: [],
})
export class AppModule {}
