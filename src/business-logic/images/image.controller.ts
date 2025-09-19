import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
    Query,
} from '@nestjs/common'
import { ApiBody, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { z } from 'zod'
import { MinioRepository } from '../minio/minio.repo'
import { QueueService } from '../queue/queue.service'
import { ImageRepository } from './image.repo'

@ApiTags('Image')
@Controller('image')
export class ImageController {
    constructor(
        private readonly repo: ImageRepository,
        private readonly queue: QueueService,
        private readonly minioRepo: MinioRepository
    ) {}

    @Post('create')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Создать изображение' })
    @ApiBody({
        schema: {
            properties: {
                prompt: { type: 'string' },
                style: { type: 'string', enum: ['real', 'cartoon'] },
            },
            required: ['prompt', 'style'],
        },
    })
    @ApiResponse({
        status: 200,
        description: 'ID созданного изображения',
        schema: { type: 'string' },
    })
    async createImage(@Body() body: any) {
        const schema = z.object({
            prompt: z.string().min(1, 'prompt is required'),
            style: z.enum(['real', 'cartoon']),
        })
        const parseResult = schema.safeParse(body)
        if (!parseResult.success) {
            throw new BadRequestException(parseResult.error.issues.map((e) => e.message).join(', '))
        }
        const { prompt, style } = parseResult.data
        const image = await this.repo.createImage({ prompt, style, status: 'created' })
        await this.queue.enqueue(image)
        return image.id
    }

    @Get('get')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Получить ссылку на изображение' })
    @ApiQuery({ name: 'id', type: 'string', required: true })
    @ApiQuery({ name: 'type', type: 'string', enum: ['original', 'thumbnail'], required: false })
    @ApiResponse({
        status: 200,
        description: 'Ссылка на изображение',
        schema: { properties: { url: { type: 'string' } } },
    })
    async getImage(@Query() query: any) {
        const schema = z.object({
            id: z.string().min(1, 'id is required'),
            type: z.enum(['original', 'thumbnail']).default('original'),
        })
        const parseResult = schema.safeParse(query)
        if (!parseResult.success) {
            throw new BadRequestException(parseResult.error.issues.map((e) => e.message).join(', '))
        }
        const { id, type } = parseResult.data
        const image = await this.repo.getImage({ id: id })
        if (!image) {
            throw new BadRequestException('Image not found')
        }
        if (!image.originalId || !image.thumbnailId) {
            throw new HttpException('Image is still being generated', HttpStatus.ACCEPTED)
        }
        switch (type) {
            case 'original':
                return await this.minioRepo.getPresignedUrl(image.originalId)

            case 'thumbnail':
                return await this.minioRepo.getPresignedUrl(image.thumbnailId)
        }
    }

    @Get('get-all')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Получить список изображений с пагинацией' })
    @ApiQuery({ name: 'page', type: 'number', required: false, default: 1 })
    @ApiQuery({ name: 'pageSize', type: 'number', required: false, default: 10 })
    @ApiResponse({
        status: 200,
        description: 'Список изображений',
        schema: {
            type: 'array',
            items: { properties: { id: { type: 'string' }, thumbnailUrl: { type: 'string' } } },
        },
    })
    async getAllImages(@Query() body: any) {
        const schema = z.object({
            page: z.number().int().min(1).default(1),
            pageSize: z.number().int().min(1).max(100).default(10),
        })
        const input = {
            page: body?.page ? Number(body.page) : 1,
            pageSize: body?.pageSize ? Number(body.pageSize) : 10,
        }
        const parseResult = schema.safeParse(input)
        if (!parseResult.success) {
            throw new BadRequestException(
                parseResult.error.issues.map((e: any) => e.message).join(', ')
            )
        }
        const { page, pageSize } = parseResult.data
        const images = await this.repo.getAllImages({ page, pageSize })
        const result: { id: string; thumbnailUrl: string | null }[] = []
        images.forEach(async (img) => {
            const thumbnailUrl = img.thumbnailId
                ? await this.minioRepo.getPresignedUrl(img.thumbnailId)
                : null
            result.push({
                id: img.id,
                thumbnailUrl: thumbnailUrl,
            })
        })
        return result
    }
}
