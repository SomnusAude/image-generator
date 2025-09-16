import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { Image } from 'src/entities/image/index'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class ImageRepository {
    constructor(private prisma: PrismaService) {}

    // CRUD methods

    async createImage(data: Prisma.ImageCreateInput): Promise<Image.BaseType> {
        return this.prisma.image.create({ data })
    }

    async updateImage(args: {
        where: Prisma.ImageWhereUniqueInput
        data: Prisma.ImageUpdateInput
    }): Promise<Image.BaseType> {
        const { where, data } = args
        return this.prisma.image.update({ data, where })
    }

    async getImage(data: Prisma.ImageWhereUniqueInput): Promise<Image.BaseType | null> {
        return this.prisma.image.findUnique({ where: data })
    }

    async deleteImage(where: Prisma.ImageWhereUniqueInput): Promise<Image.BaseType> {
        return this.prisma.image.delete({ where })
    }

    // Other methods

    async getImages(args: {
        skip?: number
        take?: number
        cursor?: Prisma.ImageWhereUniqueInput
        where?: Prisma.ImageWhereInput
        orderBy?: Prisma.ImageOrderByWithRelationInput
    }): Promise<Image.BaseType[]> {
        const { skip, take, cursor, where, orderBy } = args
        return this.prisma.image.findMany({
            skip,
            take,
            cursor,
            where,
            orderBy,
        })
    }
}
